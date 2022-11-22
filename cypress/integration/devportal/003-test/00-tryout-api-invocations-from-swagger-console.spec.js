/*
 * Copyright (c) 2022, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

describe("devportal-003-00 : Tryout API invocations from swagger console", () => {
    const { publisher, developer, password, superTenant, testTenant } = Utils.getUserInfo();

    const apiVersion = '2.0.0';
    let apiName;
    let apiContext;
    let testApiId;
    let appName;
    let activeTenant;
    const tryoutApiInvocationFromSwaggerConsole = (tenant) => {
        cy.loginToPublisher(publisher, password, tenant);
        apiName = Utils.generateName();
        apiContext = apiName;
        Utils.addAPIWithEndpoints({ name: apiName, version: apiVersion, context: apiContext, endpoint: 'https://petstore.swagger.io/v2/swagger.json' }).then((apiId) => {
            testApiId = apiId;
            Utils.publishAPI(apiId).then(() => {
                cy.visit(`publisher/apis/${apiId}/deployments`);
                cy.get('#deploy-btn').should('not.have.class', 'Mui-disabled').click({force:true});
                cy.wait(3000);
                cy.contains('Deployments');
                cy.logoutFromPublisher();
                cy.loginToDevportal(developer, password, tenant);

                Cypress.on('uncaught:exception', () => false);

                // Create an app and subscribe
                appName = Utils.generateName();
                cy.createApp(appName, 'application description', tenant);
                cy.visit(`/devportal/apis/${apiId}/credentials?tenant=${tenant}`);

                // Click and select the new application
                cy.get('#application-subscribe', {timeout: 30000});
                cy.get('#application-subscribe').click();
                cy.get(`.MuiAutocomplete-popper li`).contains(appName).click();
                cy.get(`#subscribe-to-api-btn`).click();
                cy.get(`#subscription-table td`).contains(appName).should('exist');

                // Generate prod keys
                cy.get(`#${appName}-PK`).click();
                cy.get('#generate-keys').click();
                cy.get('#consumer-key', { timeout: 30000 });
                cy.get('#consumer-key').should('exist');

                // Go to test console
                cy.get('#left-menu-test').click();

                // cy.intercept('**/oauth-keys').as('oauthKeys');
                // cy.wait('@oauthKeys');
                cy.intercept('**/generate-token').as('genToken');
                cy.get('#gen-test-key').should('not.have.attr', 'disabled', { timeout: 30000 });
                // Generate token and wait for response
                cy.wait(2000);
                cy.get('#gen-test-key').click({force:true});

                cy.wait('@genToken', {timeout: Cypress.config().largeTimeout}).then(()=> {
                    cy.get('#accessTokenInput').invoke('val').should('not.be.empty');;
                    // Test the console
                    cy.get('#operations-default-get__').find('.opblock-summary-control').click();
                    cy.get('#operations-default-get__').find('.try-out__btn').click();
                    cy.get('#operations-default-get__').find('.execute').click();
                    cy.get('#operations-default-get__').find('.response-col_status').contains('200').should('exist');
                });
            })
        });
    }
    it.only("Tryout API invocations from swagger console - super admin", () => {
        activeTenant = superTenant; 
        tryoutApiInvocationFromSwaggerConsole(superTenant);
    });
    it.only("Tryout API invocations from swagger console - tenant user", () => {
        activeTenant = testTenant;
        tryoutApiInvocationFromSwaggerConsole(testTenant);
    });

    after(() => {
        cy.deleteApp(appName, activeTenant);
        Utils.deleteAPI(testApiId);
    })
});