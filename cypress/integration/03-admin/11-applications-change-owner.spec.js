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
import DeveloperMenu from "../../support/functions/DeveloperMenu";
import AdminMenu from "../../support/functions/AdminMenu";
import AdminSettings from "../../support/functions/AdminSettings";
import Applications from "../../support/functions/Applications";
import AdminRateLimitingPolicies from "../../support/functions/AdminRateLimitingPolicies";


describe("admin-11 : Verify that Admin is able to change the Application owner", () => {
    const apiName = 'DenyPolicyTest' + Math.floor(Date.now() / 1000);
    const apiVersion = '1.0.5';
    const random_number = Math.floor(Date.now() / 1000);
    const appName = 'ChangeOwnerTestApp' + random_number;
    const apiContext = `/api_${random_number}`
    const appDescription = 'change tier app description';
    const developer = 'developer';
    const publisher = 'publisher';
    const password = 'test123';
    const carbonUsername = 'admin';
    const carbonPassword = 'admin';
    const swaggerFileName = "petstore_swagger_2.0_without-scopes.json";
    const tenant = "carbon.super";
    const nonAdminUser = developer
    const adminUser = "admin";
    const adminUserPassword = "admin"

    before("Create an application from devportal",function () {
        cy.loginToDevportal(developer, password);
        DevportalComonPage.waitUntillLoadingComponentsExit();

        // Create an application
        cy.createApp(appName, appDescription);

        cy.logoutFromDevportal()
        cy.wait(10000)
    });

    
    /*---------------------------------------------------------------------
    | 
    |  Test Scenario: Verify changin application owner from non admin to non admin"
    |  - Application is created by "developer" user from devportal
    |  - Go to Admin and chagne owner of the application to "admin" user
    |  - Log in to devportal by "developer" user and verify user cannot see the application
    |  - Log in to devportal by "admin" user and verify user can see the application
    |  Assertions:
    |        - developer user should not see the application
    |        - admin user should see the application 
    *-------------------------------------------------------------------*/
    it("Verify changing application owner from non admin to admin",function () {

        //Go to Admin and chagne owner of the application to "admin" user
        cy.loginToAdmin(carbonUsername, carbonPassword);
        AdminComonPage.waitUntillLoadingComponentsExit()
        AdminSettings.changeApplicationOwner(appName,nonAdminUser,adminUser)
        AdminMenu.goToLogoutURL();
        cy.wait(5000)

        //Log in to devportal by "developer" user and verify user cannot see the application
        cy.loginToDevportal(developer, password);
        DevportalComonPage.waitUntillLoadingComponentsExit();
        Applications.searchAndListApplicationFromDevportal(appName,tenant);

        // search result should be unique and should come to the first row to do below assertions
        cy.contains("No Matching Applications")
        cy.logoutFromDevportal();
        cy.wait(5000)

        cy.loginToDevportal(adminUser,adminUserPassword);
        DevportalComonPage.waitUntillLoadingComponentsExit();
        Applications.searchAndListApplicationFromDevportal(appName,tenant);
        // search result should be unique and should come to the first row to do below assertions
        cy.get('table[data-testid="application-listing-table"] > tbody > tr > td:nth-child(1)').contains(appName)
        cy.get('table[data-testid="application-listing-table"] > tbody > tr > td:nth-child(2)').contains(adminUser)
        cy.logoutFromDevportal();
        cy.wait(5000)

    });


    it("After Block : clen created test data", () => {
        cy.log("Cleaning data")
    });

    after(function () {

        // Delete the application from devportal
        cy.loginToDevportal(adminUser,adminUserPassword);
        DevportalComonPage.waitUntillLoadingComponentsExit();
        cy.visit('/devportal/applications?tenant=carbon.super');
        DevportalComonPage.waitUntillLoadingComponentsExit();
        cy.wait(3000)

        cy.get(`[data-testid="delete-${appName}-btn"]`, { timeout: 30000 });
        cy.get(`[data-testid="delete-${appName}-btn"]`).click();
        cy.get(`[data-testid="application-delete-confirm-btn"]`).click();
        cy.logoutFromDevportal();
        cy.wait(1000)
    })

});