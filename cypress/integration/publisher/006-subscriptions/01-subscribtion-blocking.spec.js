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

describe("publisher-006-01 : Subscription blocking", () => {


    const { publisher, password, developer, superTenant } = Utils.getUserInfo();
    let apiName;
    const apiVersion = '2.0.0';
    let appName;
    const appDescription = 'app description';
    const apiContext = apiName;
    let testApiId;

    const subscribeBlocking = (tenant) => {
        apiName = Utils.generateName();
        appName = Utils.generateName()
        cy.loginToPublisher(publisher, password, tenant);
        Utils.addAPIWithEndpoints({ name: apiName, version: apiVersion, context: apiContext }).then((apiId) => {
            testApiId = apiId;
            Utils.publishAPI(apiId).then((serverResponse) => {
                console.log(serverResponse);
                cy.logoutFromPublisher();
                cy.loginToDevportal(developer, password, tenant);
                cy.createApp(appName, appDescription, tenant);
                cy.visit(`/devportal/apis?tenant=${tenant}`);
                cy.url().should('contain', `/apis?tenant=${tenant}`);
                cy.visit(`/devportal/apis/${apiId}/credentials?tenant=${tenant}`);
                // Click and select the new application
                cy.get('#application-subscribe', { timeout: Cypress.config().largeTimeout }).should('be.visible');

                cy.get('#application-subscribe').click();
                cy.get(`.MuiAutocomplete-popper li`).contains(appName).click();
                cy.get(`#subscribe-to-api-btn`).click();
                cy.get(`#subscription-table td`).contains(appName).should('exist');

                // Subscription blocking port in the publisher side.
                cy.logoutFromDevportal();
                cy.loginToPublisher(publisher, password, tenant);
                cy.visit(`/publisher/apis/${apiId}/overview`);


                // click the left menu to go to subscriptions page.
                cy.get('#itest-api-details-portal-config-acc', { timeout: Cypress.config().largeTimeout }).should('be.visible');
                cy.get('#itest-api-details-portal-config-acc').click();
                cy.get('#left-menu-itemsubscriptions').click();
                cy.get('table tr button span').contains('Block Production Only').click();
                cy.get('table tr td').contains('PROD_ONLY_BLOCKED').should('exist');
                cy.get('table tr button span').contains('Block All').click();
                cy.get('table tr td').contains('BLOCKED').should('exist');
                cy.logoutFromPublisher();
                cy.loginToDevportal(developer, password, tenant);
                cy.visit(`/devportal/applications?tenant=${tenant}`);
                cy.get(`#delete-${appName}-btn`, { timeout: Cypress.config().largeTimeout });
                cy.get(`#delete-${appName}-btn`).click();
                cy.get(`#itest-confirm-application-delete`).click();
                cy.logoutFromDevportal();
                cy.loginToPublisher(publisher, password, tenant);
            })
        });
    }

    it.only("Subscription blocking - super admin", {
        retries: {
          runMode: 3,
          openMode: 0,
        },
      }, () => {
        subscribeBlocking(superTenant);
    })

    afterEach(() => {
        Utils.deleteAPI(testApiId);
    })
})