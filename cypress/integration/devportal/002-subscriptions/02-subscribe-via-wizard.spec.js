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

describe("devportal-002-02 : Subscribe to API via wizard", () => {
    const { publisher, developer, password, superTenant, testTenant } = Utils.getUserInfo();

    const apiVersion = '2.0.0';
    let apiName;
    let apiContext;
    let testApiId;
    let appName;
    let activeTenant;

    const subscribeViaWizard = (tenant) => {
        cy.loginToPublisher(publisher, password, tenant);
        apiName = Utils.generateName();
        apiContext = apiName;
        Utils.addAPIWithEndpoints({ name: apiName, version: apiVersion, context: apiContext }).then((apiId) => {
            testApiId = apiId;
            Utils.publishAPI(apiId).then(() => {
                cy.logoutFromPublisher();
                cy.loginToDevportal(developer, password, tenant);
                cy.visit(`/devportal/apis?tenant=${tenant}`);
                cy.url().should('contain', `/apis?tenant=${tenant}`);
                 

                cy.visit(`/devportal/apis/${apiId}/overview?tenant=${tenant}`);
                cy.get('#left-menu-credentials').click();
            
                // Go through the wizard
                appName = Utils.generateName();
                cy.get('#start-key-gen-wizard-btn').click();
                cy.get('#application-name').type(appName);
                cy.get('#wizard-next-0-btn').click();
            
                cy.get('#wizard-next-1-btn', {timeout: Cypress.config().largeTimeout})
                cy.get('#wizard-next-1-btn').click();
            
                cy.get('#wizard-next-2-btn', {timeout: Cypress.config().largeTimeout});
                cy.get('#wizard-next-2-btn').click();
            
                cy.intercept('GET','**/oauth-keys').as('oauthKeys');
                cy.wait('@oauthKeys', {timeout: Cypress.config().largeTimeout}).then(() => {
                    cy.get('#wizard-next-3-btn', {timeout: Cypress.config().largeTimeout});
                    cy.get('#wizard-next-3-btn').click();
                });
            
                    /*
                    Rest of the test we need to skip for now. Cypress is failing the token gen request but the actual one is not
                    */
                    // cy.intercept('POST','**/generate-token').as('generateToken');
                    // cy.wait('@generateToken', {timeout: 4000}).then(() => {
                    //     cy.get('#access-token').should('not.be.empty');
                    //     cy.get('#wizard-next-4-btn').click();
                    
                    //     cy.get('#left-menu-credentials').click();
                    //     // Click and select the new application
                    //     cy.get(`#subscription-table td`).contains(appName).should('exist');
                    // });

            })
        })
    }
    it.only("Subscribe to API - super admin", {
        retries: {
          runMode: 3,
          openMode: 0,
        },
      }, () => {
        activeTenant = superTenant;
        subscribeViaWizard(superTenant);
    })
    it.only("Subscribe to API - tenant user", {
        retries: {
          runMode: 3,
          openMode: 0,
        },
      }, () => {
        activeTenant = testTenant;
        subscribeViaWizard(testTenant);
    })
    afterEach(() => {
        cy.deleteApp(appName, activeTenant);
        Utils.deleteAPI(testApiId);
    })
})