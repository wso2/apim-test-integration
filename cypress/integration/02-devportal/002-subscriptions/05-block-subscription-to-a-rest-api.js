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


describe("devportal-002-05  : Verify functionalities of subscription block of rest apis", () => {
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
    |  - Generate token and veirfy it invocation (if manual testing try postman or curl)
    |  - Go to Publisher > subscription of api and click on Unblock all
    |  - Invoke api with same token and vieryf it denined 
    |  Assertions:
    |        should get 401 with response body
    |       Body should contain message code "900907" and message "The requested API is temporarily blocked"
    *-------------------------------------------------------------------*/
    it("Verify If rest API is blocked from subscription in publisher portal and user should not able to access it ",function () {
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
                cy.get('#access-token').invoke('val').then((token) => {
                    const accessToken=token;
                    cy.log("Captured access token")
                    cy.log(accessToken)
                    const formData = new FormData();
                    const requestURL = `https://localhost:8243${apiContext}/${apiVersion}/store/inventory`;
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
              
                      cy.loginToPublisher(publisher, password);
                      PublisherComonPage.waitUntillLoadingComponentsExit();
                      Apis.searchAndGetAPIFromPublisher(apiName);
                      PublisherMenu.goToSubscriptions();

                      cy.intercept('**/subscriptions/block-subscription?**').as('blockSubscription');
                      cy.get('#MUIDataTableBodyRow-0 > td:nth-child(10) > dev > button:nth-child(2)').click() // click block all
                      cy.wait('@blockSubscription', { requestTimeout: 30000 });
                      cy.wait(10000)

                      // invoke api externally after sbuscription is blocked
                      cy.request({
                        method: 'GET', 
                        url: requestURL,
                        failOnStatusCode: false,
                        headers: {
                          'authorization': 'Bearer ' + accessToken
                        }
                      }).then( ({ status }) => {
                        expect(status).to.eq(401)
                      }).then( ({ body }) => {
                        cy.log(body.toString());
                        expect(body.includes("900907")).to.be.true;
                        expect(body.includes("The requested API is temporarily blocked")).to.be.true;
                      })

                      // unblock Sbuscription
                      cy.get(' #MUIDataTableBodyRow-0 > td:nth-child(10) > dev > button:nth-child(3)').click() // click unblock
                     
                      cy.logoutFromPublisher();
                      cy.wait(7000)
                });

 
    })
    
    after(function () {

        // Unsubscribe from devportal 
        cy.loginToDevportal(developer, password);
        DevportalComonPage.waitUntillLoadingComponentsExit();
        Apis.searchAndGetAPIFromDevportal(apiName,tenant)
        DeveloperMenu.goToSubscriptions()
        cy.get('#DefaultApplication-UN').click()

        cy.logoutFromDevportal()
        DevportalComonPage.waitUntillLoadingComponentsExit()
        cy.wait(5000)

        // Delte created API
        cy.loginToPublisher(publisher, password);
        PublisherComonPage.waitUntillLoadingComponentsExit()
        Apis.searchAndDeleteAPIFromPublisher(apiName,apiVersion)
    });
 
});