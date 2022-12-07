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


describe("devportal-002-06  : Verify functionalities of unsubscription", () => {
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
    |  Test Scenario:  create an API from "petstore_swagger_2.0_store-only.json""
    |  - Generate token and veirfy it invocation is sucessfull (if manual testing try postman or curl)
    |  - Unsubscribe the application to the API
    |  - Invoke api with same token and vieryf it denined 
    |  Assertions:
    |        should get 401 with response body
    *-------------------------------------------------------------------*/
    it("Verify If user unsubscribe to the REST API, it should not be accessible anymore",function () {
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
                cy.get('div[aria-labelledby="responsive-dialog-title"] > div:nth-child(3) > button:nth-child(1)').contains("Generate").click()
                cy.wait(8000)
                cy.get('#access-token').should('exist');

                // invoke api externally before unsbuscription and verify sucessfull invocation
                cy.get('#access-token').invoke('val').then((token) => {
                    const accessToken=token;
                    cy.log("Captured access token")
                    cy.log(accessToken)
                    const formData = new FormData();
                    const requestURL = `${Apis.getAPIRequestBaseURL()}${apiContext}/${apiVersion}/store/inventory`;
                    cy.request({
                        method: 'GET', 
                        url: requestURL,
                        headers: {
                          'authorization': 'Bearer ' + accessToken
                        }
                      }).then( ({ status }) => {
                        expect(200).to.eq(status)
                      }).then( ({ body }) => {
                        cy.log(body.toString())
                      })

                      // invoke api externally after unsbuscription
                      //DeveloperMenu.goToSubscriptions()
                      cy.get('div[aria-labelledby="responsive-dialog-title"] > div:nth-child(3) > button:nth-child(1)').contains("Close").click()
                      Apis.clickUnsubscribOnApplcation(appName)
                      cy.wait(15000)

                      cy.request({
                        method: 'GET', 
                        url: requestURL,
                        headers: {
                          'authorization': 'Bearer ' + accessToken
                        }
                      }).then( ({ status }) => {
                        expect(403).to.eq(status)
                      }).then( ({ body }) => {
                        cy.log(body.toString())
                      })
                      
                });

 
    })
    
    /*
      this should go to a after hook , due to an issue in cypress if test failed in above it block then after block is not execute properly
    */
    it("After block : Cleanup created test data",function () {
        cy.log("Clean created data")
    });

    after("",function () {
        // Delte created API
        cy.loginToPublisher(publisher, password);
        PublisherComonPage.waitUntillLoadingComponentsExit()
        Apis.searchAndDeleteAPIFromPublisher(apiName,apiVersion)
    });
 
});