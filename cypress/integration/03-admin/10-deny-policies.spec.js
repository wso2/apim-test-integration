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

import PublisherComonPage from "../../support/pages/publisher/PublisherComonPage";
import DevportalComonPage from "../../support/pages/devportal/DevportalComonPage";
import AdminComonPage from "../../support/pages/admin/AdminComonPage";
import Apis from "../../support/functions/Apis";
import AdminMenu from "../../support/functions/AdminMenu";
import AdminRateLimitingPolicies from "../../support/functions/AdminRateLimitingPolicies";


describe("admin-10 : Verify functionalities of deny policies", () => {
    const apiName = 'changeTierApi' + Math.floor(Date.now() / 1000);
    const apiVersion = '1.0.5';
    const random_number = Math.floor(Date.now() / 1000);
    const appName = 'testapp' + random_number;
    const apiContext = `/api_${random_number}`
    const appDescription = 'change tier app description';
    const developer = 'developer';
    const publisher = 'publisher';
    const password = 'test123';
    const carbonUsername = 'admin';
    const carbonPassword = 'admin';

     /*---------------------------------------------------------------------
    | 
    |  Test Scenario:  create an API to use to try-out and verify Deny policy 
    |  - Go to publisher and create an API by importing petstore swagger_2.0 and publish
    |  - Go to devportal , create an app and subscribe the API
    |  - Go to Try-out and Verify API cannot Invocation
    |  Assertions:
    |        should get 200 with response body
    |
    *-------------------------------------------------------------------*/
    before("Create API, publish and verify portal invocation(try-out)",function () {
        cy.loginToPublisher(publisher, password);
        PublisherComonPage.waitUntillLoadingComponentsExit();
        Apis.createAPIFromPetstoreSwagger2AndPublish(apiName,apiContext,apiVersion,"")

        cy.logoutFromPublisher();
        cy.loginToDevportal(developer, password);
        DevportalComonPage.waitUntillLoadingComponentsExit();


        // Create an app and subscribe
        cy.createApp(appName, appDescription);
        DevportalComonPage.waitUntillLoadingComponentsExit();

        searchAndGetAPIFromDevportal();

        cy.get('[data-testid="left-menu-credentials"]').click();

        // Click and select the new application
        cy.get('#application-subscribe').click();
        cy.get(`.MuiAutocomplete-popper li`).contains(appName).click();
        cy.get(`[data-testid="subscribe-to-api-btn"]`).click();
        cy.get(`[data-testid="subscription-table"] td`).contains(appName).should('exist');

        // Generate prod keys
        cy.get(`#${appName}-PK`).click();
        DevportalComonPage.waitUntillLoadingComponentsExit();
        cy.get('input#client_credentials').check();
        cy.get('input#password').check();
        cy.get('[data-testid="generate-application-keys"]').click();
        cy.get('#consumer-key', { timeout: 30000 });
        cy.get('#consumer-key').should('exist');

        // Go to Try out and verify API invocation
        goToTryOutAndInvokeStoreInventoryResource()

        cy.get('tr[class="response"] > td.response-col_status').contains('200').should('exist');
        cy.contains("totvs1")

        cy.logoutFromDevportal()
        cy.wait(10000)
        
    })

 /*---------------------------------------------------------------------
    | 
    |  Test Scenario:  Verify Deny policy at API Context level 
    |  - Go to Admin and add Deny policy at context level for above created API 
    |  - Go to devportal and Try-out the API
    |  - Verify API cannot Invoke due to Deny Policy and getting expected error code 
    |  Assertions:
    |        should get 403 status code with
    |        "code": 900805,
    |        "message": "Message blocked",
    |        "description": "You have been blocked from accessing the resource"
    |
    *-------------------------------------------------------------------*/
    it("Verify Deny policy at API Context level ", () => {
        var apiContextDenyValue = `${apiContext}/${apiVersion}`;

        // Log in to Admin and create Deny Policy at API Context
        cy.loginToAdmin(carbonUsername, carbonPassword);
        AdminComonPage.waitUntillLoadingComponentsExit()
        AdminMenu.goToDenyPoliciesByURL();
        AdminRateLimitingPolicies.deleteAllDenyPoliocies()
        AdminRateLimitingPolicies.Denypolicies_AddAPIContextPolicy(apiContextDenyValue)
        AdminMenu.goToLogoutURL()

        goToDevpoertalAndVerifyIncoationIsBlocked();

        cy.logoutFromDevportal()
        cy.wait(10000)
    });

     /*---------------------------------------------------------------------
    |  
    |  Test Scenario:  Verify Deny policy at application level 
    |  - Go to Admin and add Deny policy at context level for above created API 
    |  - Go to devportal and Try-out the API
    |  - Verify API cannot Invoke due to Deny Policy and getting expected error code 
    |  Assertions:
    |        should get 403 status code with
    |        "code": 900805,
    |        "message": "Message blocked",
    |        "description": "You have been blocked from accessing the resource"
    |
    *-------------------------------------------------------------------*/
    it("Verify Deny policy at Application level ", () => {
        var applicationDenyValue = `${developer}:${appName}`
        cy.loginToAdmin(carbonUsername, carbonPassword);
        AdminComonPage.waitUntillLoadingComponentsExit()
        AdminMenu.goToDenyPoliciesByURL();
        AdminRateLimitingPolicies.deleteAllDenyPoliocies()
        AdminRateLimitingPolicies.Denypolicies_AddApplicationPolicy(applicationDenyValue)
        AdminMenu.goToLogoutURL()

        goToDevpoertalAndVerifyIncoationIsBlocked();


        cy.logoutFromDevportal()
        cy.wait(10000)
    });

     /*---------------------------------------------------------------------
    |  
    |  Test Scenario:  Verify Deny policy at User level 
    |  - Go to Admin and add Deny policy at context level for above created API 
    |  - Go to devportal and Try-out the API
    |  - Verify API cannot Invoke due to Deny Policy and getting expected error code 
    |  Assertions:
    |        should get 403 status code with
    |        "code": 900805,
    |        "message": "Message blocked",
    |        "description": "You have been blocked from accessing the resource"
    |
    *-------------------------------------------------------------------*/
    it("Verify Deny policy at User level ", () => {
        cy.loginToAdmin(carbonUsername, carbonPassword);
        AdminComonPage.waitUntillLoadingComponentsExit()
        AdminMenu.goToDenyPoliciesByURL();
        AdminRateLimitingPolicies.deleteAllDenyPoliocies()
        AdminRateLimitingPolicies.Denypolicies_AddUserPolicy(developer)
        AdminMenu.goToLogoutURL()

        goToDevpoertalAndVerifyIncoationIsBlocked();   

        cy.logoutFromDevportal()
        cy.wait(10000)
    });

    after(function () {
        // Delete any deny Policy from Admin
        cy.loginToAdmin(carbonUsername, carbonPassword);
        AdminComonPage.waitUntillLoadingComponentsExit()
        AdminMenu.goToDenyPoliciesByURL();
        AdminRateLimitingPolicies.deleteAllDenyPoliocies()
        AdminMenu.goToLogoutURL()
        cy.wait(5000)

        // Delete the application from devportal
        cy.loginToDevportal(developer, password);
        DevportalComonPage.waitUntillLoadingComponentsExit();
        cy.visit('/devportal/applications?tenant=carbon.super');
        DevportalComonPage.waitUntillLoadingComponentsExit();
        cy.wait(3000)

        cy.get(`[data-testid="delete-${appName}-btn"]`, { timeout: 30000 });
        cy.get(`[data-testid="delete-${appName}-btn"]`).click();
        cy.get(`[data-testid="application-delete-confirm-btn"]`).click();
        cy.logoutFromDevportal();
        cy.wait(5000)

        // Delete the API from publisher
        cy.loginToPublisher(publisher, password);
        PublisherComonPage.waitUntillLoadingComponentsExit()
        cy.deleteApi(apiName, apiVersion);
    })

   function goToDevpoertalAndVerifyIncoationIsBlocked(){
        // go to devportal and verify that deny policy apply
        cy.loginToDevportal(developer, password);
        DevportalComonPage.waitUntillLoadingComponentsExit();
        searchAndGetAPIFromDevportal()
        goToTryOutAndInvokeStoreInventoryResource()
        /*
            If Deny policy appllied 
            should get 403 status code with
            "code": 900805,
            "message": "Message blocked",
            "description": "You have been blocked from accessing the resource"
        */
        cy.get('tr[class="response"] > td.response-col_status').contains('403').should('exist');
        cy.contains('900805')
        cy.contains("Message blocked")
        cy.contains("You have been blocked from accessing the resource")
   }

    function goToTryOutAndInvokeStoreInventoryResource(){
        cy.intercept('**/oauth-keys').as('oauthKeys');
        cy.get('[data-testid="left-menu-test"]').click();
        cy.wait('@oauthKeys');
        DevportalComonPage.waitUntillLoadingComponentsExit();

        cy.get('[data-testid="gen-test-key"]').should('not.have.attr', 'disabled', { timeout: 30000 });

        // Generate token and wait for response
        cy.intercept('**/generate-token').as('genToken');
        cy.get('[data-testid="gen-test-key"]').click();
        DevportalComonPage.waitUntillLoadingComponentsExit();
        cy.wait('@genToken');

        // Test the console
        cy.get('#operations-store-getInventory').click();
        cy.get('#operations-store-getInventory .try-out__btn').click();
        cy.get('#operations-store-getInventory button.execute').click();
        cy.get('.loading-container',{timeout:25000}).should('not.exist');
    }
    function searchAndGetAPIFromDevportal(){
        cy.visit('/devportal/apis?tenant=carbon.super');
        DevportalComonPage.waitUntillLoadingComponentsExit();
        cy.url().should('contain', '/apis?tenant=carbon.super');
        cy.get('#searchQuery').clear().type(apiName)
        cy.wait(3000)
        cy.get(`[title="${apiName}"]`, { timeout: 30000 });
        cy.get(`[title="${apiName}"]`).click();
        DevportalComonPage.waitUntillLoadingComponentsExit();
    }
});