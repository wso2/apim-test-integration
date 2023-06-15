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

describe("admin-01 : Verify authorized user can perform CRUD operations in advance throttle policies", () => {

    const { carbonUsername, carbonPassword, testTenant, superTenant } = Utils.getUserInfo();

    const addEditDeleteAdvancedThrottlePolicies = (usernameLocal, passwordLocal, tenant) => {
        cy.loginToAdmin(usernameLocal, passwordLocal, tenant);
        const policyName = '030PerMin';
        cy.get('[data-testid="Advanced Policies-child-link"]', {timeout: Cypress.config().largeTimeout}).click();
        cy.get('[data-testid="Add New Policy-btn"]').click();
        cy.get('input[name="policyName"]').type(policyName);
        cy.get('textarea[name="description"]').type('allow 30 requests per minute');
        cy.get('input[name="requestCount"]').type('30');
        cy.get('input[name="unitTime"]').type('1');
        cy.get('button.MuiButton-containedPrimary > span').contains('Add').click();
        cy.get('table tr td a').contains(policyName).should('exist');

        // editing
        cy.intercept('**/throttling/policies/advanced/*').as('getPolicy');
        cy.get('table tr td a').contains(policyName).click();
        cy.wait('@getPolicy', {timeout: 3000}).then(() => {
            cy.get('input[name="requestCount"]').clear().type('31');
            cy.get('button.MuiButton-containedPrimary > span').contains('Update').click();
            cy.get('table tr td').contains('31').should('exist');
        });

        // delete
        cy.get(`[data-testid="${policyName}-actions"] > span svg`).click();
        cy.get('button > span').contains('Delete').click();
        cy.get('table tr td a').contains(policyName).should('not.exist');
    }
    it.only("Verify admin user can perform CRUD operations in advance throttle policies", () => {
        addEditDeleteAdvancedThrottlePolicies(carbonUsername, carbonPassword, superTenant);
    });
    it.only("Verify tenant user can perform CRUD operations in advance throttle policies", () => {
        addEditDeleteAdvancedThrottlePolicies(carbonUsername, carbonPassword, testTenant);
    });
})
