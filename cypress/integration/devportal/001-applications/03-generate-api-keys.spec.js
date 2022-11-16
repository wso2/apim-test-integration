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

describe("devportal-001-03 : Generate API Keys", () => {
    const { developer, password, superTenant, testTenant } = Utils.getUserInfo();
    let appName;
    let activeTenant;
    const appDescription = 'Key gen application description';
    const checkIfKeyExists = () => {
        // Check if the key exists
        cy.get('#access-token', { timeout: 30000 });
        cy.get('#access-token').should('not.be.empty');
        cy.get('#generate-api-keys-close-btn').click();
    }
    const generateApiKeys = (tenant) => {
        cy.loginToDevportal(developer, password, tenant);
        appName = Utils.generateName();
        cy.createApp(appName, appDescription);

        // Generating keys production
        cy.get('#production-keys-apikey').click();
        // Generate with none option
        cy.get('#generate-key-btn').then(() => {
            cy.get('#generate-key-btn').click();
            cy.get('#generate-api-keys-btn').click();
        })

        checkIfKeyExists();

        // Generate with ip option
        cy.get('#api-key-restriction-ip').click();
        cy.get('#ip-address-txt').type('192.168.1.2');
        cy.get('#ip-address-add-btn').click();
        cy.get('#generate-key-btn').click();
        cy.get('#generate-api-keys-btn').click();

        checkIfKeyExists();

        cy.get('#api-key-restriction-referer').click();
        cy.get('#referer-txt').type('www.example.com/path');
        cy.get('#referer-add-btn').click();
        cy.get('#generate-key-btn').click();
        cy.get('#generate-api-keys-btn').click();

        checkIfKeyExists();
    }
    it.only("Generate API Keys - super admin", () => {
        activeTenant = superTenant;
        generateApiKeys(superTenant)
    })
    it.only("Generate API Keys - tenant user", () => {
        activeTenant = testTenant;
        generateApiKeys(testTenant)
    })

    afterEach(() => {
        cy.deleteApp(appName, activeTenant);
    })
})