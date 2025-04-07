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
import DeveloperMenu from "../../../support/functions/DeveloperMenu";
import Portals from "../../../support/functions/Portals";


describe("publisher-001-06 : Verify SOAP API creation", () => {
    const apiVersion = '1.0.0';
    const random_number = Math.floor(Date.now() / 1000);
    const apiName = 'SoapAPI' + random_number;
    const apiContext = `/soapcontext_${random_number}`
    const appDescription = 'change tier app description';
    const developer = 'developer';
    const publisher = 'publisher';
    const password = 'test123';
    const carbonUsername = 'admin';
    const carbonPassword = 'admin';
    const tenant = "carbon.super";
    const appName = "DefaultApplication";

    Cypress.on('uncaught:exception', (err, runnable) => {
        return false;
    });
    
   /*---------------------------------------------------------------------
    | 
    |  Test Scenario:  Verify Deny policy at API Context level 
    |  - Go to publisher and create a SOPA API
    |  - Publish API
    |  Assertions:
    |        Assert "API created successfully"
    |        Assert "API published successfully"
    |
    *-------------------------------------------------------------------*/
    it("Verify Super Tenant user can create and publish SOAP API from WSDL URL", () => {
        Portals.logInToPublisher(publisher, password);
        Apis.createSoapAPIFromPhoneverifyEndpoint(apiName,apiContext,apiVersion);
        //publish API
        cy.intercept('**/lifecycle-state').as('lifeCycleStatus');
        cy.get('button[data-testid="publish-btn"]').click()
        cy.contains('Lifecycle state updated successfully')
        cy.wait('@lifeCycleStatus', { requestTimeout: 30000 });
        cy.get('div[data-testid="published-status"]').contains("Published")

        cy.logoutFromPublisher();
        cy.wait(5000)

    });

    /*---------------------------------------------------------------------
    | 
    |  Test Scenario:  Verify Invocation of a SOAP service as a REST API
    |  - Go to developer portal
    |  - Subscribe created SOAP api to the Default applicaiton
    |  - Go to try-out and execute with  SOAP body and SOPA action 
    |  Assertions:
    |        Assert "Response should return 200"
    |        Assert "Should return expected response body"
    |
    *-------------------------------------------------------------------*/
    it("Verify Invocation of a SOAP service as a REST API", () => {
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

        // Try out
        DeveloperMenu.goToTryOut()

         // Generate token and wait for response
        cy.intercept('**/generate-token').as('genToken');
        cy.get('[data-testid="gen-test-key"]').click();
        DevportalComonPage.waitUntillLoadingComponentsExit();
        cy.wait('@genToken');

        // Test the console
        cy.get('#operations-default-post__').find('.opblock-summary-control').click();
        cy.get('#operations-default-post__').find('.try-out__btn').click();
        const soapRequestBody = `<?xml version="1.0" encoding="utf-8"?>
        <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        <soap:Body>
            <CheckPhoneNumber xmlns="http://ws.cdyne.com/PhoneVerify/query">
            <PhoneNumber>18006785432</PhoneNumber>
            <LicenseKey>18006785432</LicenseKey>
            </CheckPhoneNumber>
        </soap:Body>
        </soap:Envelope>`

        const sopaAction = 'http://ws.cdyne.com/PhoneVerify/query/CheckPhoneNumber'
        
        cy.get('div[data-param-name="SOAP Request"] .body-param__text').clear().type(soapRequestBody);
        cy.get('tr[data-param-name="SOAPAction"] .parameters-col_description > input').type(sopaAction)
        cy.wait(1000);

        cy.get('#operations-default-post__').find('.execute').click();
        cy.wait(3000);
        cy.get('#operations-default-post__').find('.response-col_status').contains('200').should('exist');
        cy.contains('Toll Free') // response body contains : <Company>Toll Free</Company>
    });

    /*
      this should go to a after hook , due to an issue in cypress if test failed in above it block then after block is not execute properly
    */
      it("After block : Cleanup created test data",function () {
        cy.log("Clean created data")
    });

    after(function () {

        // go to Subscriptions and "UNSUBSCRIBE" (this is to delte the API after test)
        cy.loginToDevportal(developer, password);
        DevportalComonPage.waitUntillLoadingComponentsExit();
        Apis.searchAndGetAPIFromDevportal(apiName,tenant)
        DeveloperMenu.goToSubscriptions()
        Apis.clickUnsubscribOnApplcation(appName)
        
        cy.logoutFromDevportal()
        DevportalComonPage.waitUntillLoadingComponentsExit()
        cy.wait(5000)

        cy.loginToPublisher(publisher, password);
        PublisherComonPage.waitUntillLoadingComponentsExit()
        Apis.searchAndDeleteAPIFromPublisher(apiName,apiVersion)
    });



});