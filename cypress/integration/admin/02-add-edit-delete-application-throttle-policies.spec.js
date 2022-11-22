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

describe("admin-02 : Add Edit Delete application throttle policies", () => {
    
    const { carbonUsername, carbonPassword, testTenant, superTenant } = Utils.getUserInfo();

    const addEditDeleteApplicationThrottlePolicies = (usernameLocal, passwordLocal, tenant) => {
        cy.loginToAdmin(usernameLocal, passwordLocal, tenant);
        const policyName = '80PerMin';
        cy.get('[data-testid="Application Policies-child-link"]').click();
        cy.get('.MuiButton-label').contains('Add Policy').click();
        cy.get('input[name="policyName"]').type(policyName);
        cy.get('input[name="description"]').type('allow 30 requests per minute');
        cy.get('input[name="requestCount"]').type('80');
        cy.get('input[name="unitTime"]').type('1');
        cy.get('button.MuiButton-containedPrimary > span').contains('Save').click();
        cy.get(`[data-testid="${policyName}-actions"]`).should('exist');

        // editing
        cy.intercept('**/throttling/policies/application/*').as('getPolicy');
        cy.get(`[data-testid="${policyName}-actions"] > span:first-child`).click();
        cy.wait('@getPolicy', {timeout: 3000}).then(() => {
            cy.get('input[name="requestCount"]').clear().type('81');
        });
        cy.intercept('GET', '**/throttling/policies/application').as('getPolicies');
        cy.get('button.MuiButton-containedPrimary > span').contains('Save').click();
        cy.wait('@getPolicies', {timeout: 3000});

        // delete
        cy.get(`[data-testid="${policyName}-actions"] > span:nth-child(2)`).click();
        cy.get('button > span').contains('Delete').click();
        cy.get(`[data-testid="${policyName}-actions"]`).should('not.exist');
    }

    it.only("Add Edit Delete application throttle policies - super admin", () => {
        addEditDeleteApplicationThrottlePolicies(carbonUsername, carbonPassword, superTenant);
    });
    it.only("Add Edit Delete application throttle policies - tenant user", () => {
        addEditDeleteApplicationThrottlePolicies(carbonUsername, carbonPassword, testTenant);
    });
})