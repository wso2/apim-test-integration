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

describe("devportal-001-02 : Generate keys", () => {
    const { developer, password, superTenant, testTenant } = Utils.getUserInfo();

    let appName;
    const appDescription = 'Key gen application description';
    let activeTenant;

    const generateKeys = (tenant) => {
        cy.loginToDevportal(developer, password, tenant);
        appName = Utils.generateName();
        cy.createApp(appName, appDescription, tenant);

        // Generating keys production
        cy.get('#production-keys-oauth').click();
        cy.get('#generate-keys', {timeout: 30000}).click();
        cy.get('#consumer-key', {timeout: 30000}).should('exist');

        /*
        Updating keys we need to skip for now. Cypress is not checking the checkboxes but the actual one is not
        */
        // Updating the keys
        // Enabling authorization code grant type and updating keys

        // cy.get('#authorization_code').check();
        // cy.get('#callbackURL').click();
        // cy.get('#callbackURL').type('https://localhost');

        // cy.get('#generate-keys').click();
        // Checking if the code grant is still selected.
        // cy.get('#authorization_code').should('be.checked');


        // Generating keys sandbox
        cy.get('#sandbox-keys-oauth').click();
        cy.get('#generate-keys').click();
        cy.get('#consumer-key', {timeout: 30000});
        cy.get('#consumer-key').should('exist');

         /*
        Updating keys we need to skip for now. Cypress is not checking the checkboxes but the actual one is not
        */

        // Updating the keys
        // Enabling authorization code grant type and updating keys
        // cy.get('#authorization_code').check();
        // cy.get('#callbackURL').click();
        // cy.get('#callbackURL').type('https://localhost');
        // cy.get('#generate-keys').click();
        // Checking if the code grant is still selected.
        // cy.get('#authorization_code').should('be.checked');

        // Show hide keys
        cy.get('#visibility-toggle-btn').click();
        cy.get('#consumer-secret').should('have.attr', 'type', 'text');
        cy.contains('visibility_off').should('be.visible');
    }
    it.only("Generate and update application production and sandbox keys, show hide keys - super admin", () => {
        activeTenant = superTenant;
        generateKeys(superTenant);
    })
    it.only("Generate and update application production and sandbox keys, show hide keys - tenant user", () => {
        activeTenant = testTenant;
        generateKeys(testTenant);
    })

    afterEach(() => {
        cy.intercept('DELETE','**/applications/**').as('appDelete');
        cy.deleteApp(appName, activeTenant);
        cy.wait('@appDelete',{timeout: 15000}).its('response.statusCode').should('equal', 200)
        cy.contains(`Application ${appName} deleted successfully!`)
        cy.wait(5000)
    })
})