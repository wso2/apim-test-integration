/*
 * Copyright (c) 2022, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

import Utils from "@support/utils";

describe("devportal-002-01 : Subscribe unsubscribe to app from application view ", () => {
    const { publisher, developer, password, superTenant, testTenant } = Utils.getUserInfo();

    const apiVersion = '2.0.0';
    let apiName;
    const apiContext = apiName;
    let testApiId;
    let appName;
    const appDescription = 'app description';
    let activeTenant;

    const subscribeUnsubscribeToAppFromApp = (tenant) => {
        cy.loginToPublisher(publisher, password, tenant);
        apiName = Utils.generateName();
        Utils.addAPIWithEndpoints({ name: apiName, version: apiVersion, context: apiContext }).then((apiId) => {
            cy.log("API ID", apiId);
            cy.log("API Name", apiName);
            testApiId = apiId;
            Utils.publishAPI(apiId).then(() => {
                cy.logoutFromPublisher();
                cy.loginToDevportal(developer, password, tenant);
                appName = Utils.generateName();
                cy.createApp(appName, appDescription, tenant);
                cy.visit(`/devportal/applications?${tenant}`);
                cy.get(`#itest-application-list-table td a`, {timeout: Cypress.config().largeTimeout}).contains(appName).click();

                // Go to application subscription page
                cy.get('#left-menu-subscriptions').click();
                cy.intercept('**/apis**').as('apiGetFirst');
                cy.contains('Subscribe APIs', {timeout: Cypress.config().largeTimeout}).click();
                cy.wait('@apiGetFirst', { timeout: 30000 }).then(() => {
                    cy.wait(2000)
                    cy.get('[aria-labelledby="simple-dialog-title"]').find('input[placeholder="Search APIs"]').click().type(apiName+"{enter}");
                    cy.contains('1-1 of 1'); 
                    cy.get(`#policy-subscribe-btn-${apiId}`).contains('Subscribe').click();
                        cy.get('button[aria-label="close"]').click();

                        // check if the subscription exists
                        cy.contains(`${apiName} - ${apiVersion}`).should('exist');

                        // Unsubscribe
                        cy.get(`#delete-api-subscription-${apiId}`).click();
                        cy.get('#delete-api-subscription-confirm-btn').click();

                        // Check if unsubscribed successfully
                        cy.get(`#delete-api-subscription-${apiId}`).should('not.exist');

                        // Editing application
                        cy.get('#edit-application').click();
                        cy.get('#application-name').click();
                        cy.get('#application-name').type(2);

                        cy.get('#itest-application-create-save').click();

                        // Checking the app name exists in the overview page.
                        cy.url().should('contain', '/overview');
                        cy.get('#itest-info-bar-application-name').contains(appName + '2').should('exist');
                    })

            });
        })
    }
    it.only("Subscribe unsubscribe to app from application view - super admin", () => {
        activeTenant = superTenant;
        subscribeUnsubscribeToAppFromApp(superTenant);
    })
    it.only("Subscribe unsubscribe to app from application view - tenant user", () => {
        activeTenant = testTenant;
        subscribeUnsubscribeToAppFromApp(testTenant);
    })

    after(() => {
        cy.deleteApp(appName + '2', activeTenant);
        Utils.deleteAPI(testApiId);
    })
})