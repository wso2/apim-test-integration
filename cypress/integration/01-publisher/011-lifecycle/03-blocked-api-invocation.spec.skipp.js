/*
 * Copyright (c) 2022, WSO2 LLC. (http://www.wso2.org) All Rights Reserved.
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *  
 * http://www.apache.org/licenses/LICENSE-2.0
 *  
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import PublisherComonPage from "../../../support/pages/publisher/PublisherComonPage";
import DevportalComonPage from "../../../support/pages/devportal/DevportalComonPage";
import Apis from "../../../support/functions/Apis";
import PublisherMenu from "../../../support/functions/PublisherMenu";
import DeveloperMenu from "../../../support/functions/DeveloperMenu";


describe("publisher-011-03 : Invocation on blocked rest apis", () => {
    const apiName = 'SubBlockTest' + Math.floor(Date.now() / 1000);
    const apiVersion = '1.0.5';
    const random_number = Math.floor(Date.now() / 1000);
    const apiContext = `/api_${random_number}`
    const appDescription = 'change tier app description';
    const developer = 'developer';
    const publisher = 'publisher';
    const password = 'test123';
    const carbonUsername = 'admin';
    const carbonPassword = 'admin';
    const swaggerFileName = "petstore_swagger_2.0_store-only.json";
    const tenant = "carbon.super";
    const appName = "DefaultApplication";

    Cypress.on('uncaught:exception', (err, runnable) => {
        return false;
    });

     /*---------------------------------------------------------------------
    | 
    |  Test Scenario:  create an API (with GET resource ) from "petstore_swagger_2.0_store-only.json""
    |  - Generate token and veirfy it invocation with GET method (if manual testing try postman or curl)
    |  - Go to Publisher > Lifecycle of api and click on Block
    |  - Invoke api with same token with GET method and vieryf it denined 
    |  - Invoke api with same token with POST method and vieryf it denined 
    |  In both cases Assertions should be:
    |       should get 503 status code with response body
    |       <am:code>700700</am:code>
    |       <am:message>API blocked</am:message>
    *-------------------------------------------------------------------*/
    it("Verify Invoking a blocked API using a HTTP method other than the  methods present in the API",function () {
        cy.loginToPublisher(publisher, password);
        PublisherComonPage.waitUntillLoadingComponentsExit();
        Apis.createAPIFromPetstoreSwagger2AndPublish(swaggerFileName,apiName,apiContext,apiVersion,"")

        cy.logoutFromPublisher();
        cy.wait(5000)

        cy.loginToDevportal(developer, password);
        DevportalComonPage.waitUntillLoadingComponentsExit();
        Apis.searchAndGetAPIFromDevportal(apiName,tenant)
        DeveloperMenu.goToSubscriptions()
        Apis.subscribeToapplication(appName)

                // Generate prod keys
                cy.get(`#${appName}-PK`).click();
                DevportalComonPage.waitUntillLoadingComponentsExit();
                cy.get('input#client_credentials').check();
                cy.get('input#password').check();
                cy.get('[data-testid="generate-application-keys"]').click();
                cy.get('#consumer-key', { timeout: 30000 });
                cy.get('#consumer-key').should('exist');

                cy.get('span[class="MuiButton-label"]').contains("Generate Access Token").click()
                cy.get('div[aria-labelledby="responsive-dialog-title"] > div:nth-child(3) > button:nth-child(1)').contains("Generate").click()  //({force: true})
                cy.wait(8000)
                cy.get('#access-token').should('exist');

                 // invoke api externally before blocking and verify sucessfull invocation
                cy.get('#access-token').invoke('val').then((token) => {
                    const accessToken=token;
                    cy.log("Captured access token")
                    cy.log(accessToken)
                    const formData = new FormData();
                    const requestURL = `${Apis.getAPIRequestBaseURL()}${apiContext}/${apiVersion}/store/inventory`;
                    cy.log("Request URL : " + requestURL);
                    cy.request({
                        method: 'GET', 
                        url: requestURL,
                        headers: {
                          'authorization': 'Bearer ' + accessToken
                        }
                      }).then( ({ status }) => {
                        expect(status).to.eq(200)
                      }).then( ({ body }) => {
                        cy.log(body.toString())
                      })

                      cy.logoutFromDevportal()
                      cy.wait(10000)
              
                      // go to publisher and block api
                      cy.loginToPublisher(publisher, password);
                      PublisherComonPage.waitUntillLoadingComponentsExit();
                      Apis.searchAndGetAPIFromPublisher(apiName);
                      PublisherMenu.goToLifecycle();
                      Apis.clickBlockAPIOnLIfecycleInPublisher();
                      cy.log("Api is blocked")

                      cy.wait(15000)
                      // invoke api externally after sbuscription is blocked
                      cy.request({
                        method: 'GET', 
                        url: requestURL,
                        failOnStatusCode: false,
                        headers: {
                          'authorization': 'Bearer ' + accessToken
                        }
                      }).then( ({ status }) => {
                        expect(status).to.eq(503)
                      }).then( ({ body }) => {
                        cy.log(body.toString());
                        expect(body.includes("700700")).to.be.true; // <am:code>700700</am:code>
                        expect(body.includes("API blocked")).to.be.true; //<am:message>API blocked</am:message>
                      })
                      cy.wait(3000)
                      
                      // invoke api with POST externally after sbuscription is blocked
                      cy.request({
                        method: 'POST', 
                        url: requestURL,
                        failOnStatusCode: false,
                        headers: {
                          'authorization': 'Bearer ' + accessToken
                        }
                      }).then( ({ status }) => {
                        expect(status).to.eq(503)
                      }).then( ({ body }) => {
                        cy.log(body.toString());
                        expect(body.includes("700700")).to.be.true; // <am:code>700700</am:code>
                        expect(body.includes("API blocked")).to.be.true; //<am:message>API blocked</am:message>
                      })
                });
    });
    
    /*
      this should go to a after hook , due to an issue in cypress if test failed in above it block then after block is not execute properly
    */
    it("After block : Cleanup created test data",function () {
        cy.log("Clean created data")
    });

    after("",function () {

      // re-bublished the clocked API
      cy.loginToPublisher(publisher, password);
      PublisherComonPage.waitUntillLoadingComponentsExit();
      Apis.searchAndGetAPIFromPublisher(apiName);
      PublisherMenu.goToLifecycle();
      Apis.clickRePublishAPIOnLIfecycleInPublisher();
      cy.logoutFromPublisher();
      cy.wait(10000)
      cy.log("Republish")

      // Unsubscribe from devportal 
      cy.loginToDevportal(developer, password);
      DevportalComonPage.waitUntillLoadingComponentsExit();
      Apis.searchAndGetAPIFromDevportal(apiName,tenant)
      DeveloperMenu.goToSubscriptions()
      Apis.clickUnsubscribOnApplcation(appName)
      cy.log("Unsubscribe")

      cy.logoutFromDevportal()
      DevportalComonPage.waitUntillLoadingComponentsExit()
      cy.wait(10000)

      // Delte created API
      cy.loginToPublisher(publisher, password);
      PublisherComonPage.waitUntillLoadingComponentsExit()
      Apis.searchAndDeleteAPIFromPublisher(apiName,apiVersion)
      cy.log("API Delted")
    });
 
});