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

describe("admin-04 : Add Edit Delete api categories", () => {
    
    const { carbonUsername, carbonPassword, testTenant, superTenant } = Utils.getUserInfo();

    const addEditDeleteApiCategories = (usernameLocal, passwordLocal, tenant) => {
        cy.loginToAdmin(usernameLocal, passwordLocal, tenant);
        const categoryName = 'Finance';
        cy.get('[data-testid="API Categories"]', {timeout: Cypress.config().largeTimeout}).click();
        cy.get('.MuiButton-label').contains('Add API Category').click();
        cy.get('input[name="name"]').type(categoryName);
        cy.get('textarea[name="description"]').type('finance related apis');
        cy.get('button.MuiButton-containedPrimary > span').contains('Save').click();
        cy.get('[data-testid="MuiDataTableBodyCell-2-0"]').contains('finance related apis').should('exist');

        // editing
        cy.get(`[data-testid="MuiDataTableBodyCell-4-0"] > div > div > span:first-child`).click();
        cy.get('textarea[name="description"]').clear().type('finance apis');

        cy.intercept('GET', '**/api-categories').as('getCategories');
        cy.get('button.MuiButton-containedPrimary > span').contains('Save').click();
        cy.wait('@getCategories', {timeout: 3000}).then(() => {
            cy.get('[data-testid="MuiDataTableBodyCell-2-0"]').contains('finance apis').should('exist');
        });

        // delete
        cy.get(`[data-testid="MuiDataTableBodyCell-4-0"] > div > div > span:nth-child(2)`).click();
        cy.get('button > span').contains('Delete').click();
        cy.get('div[role="status"]').should('have.text','API Category deleted successfully');
    }
    it.only("Add Edit Delete api categories - super admin", () => {
        addEditDeleteApiCategories(carbonUsername, carbonPassword, superTenant);
    });
    it.only("Add Edit Delete api categories - tenant user", () => {
        addEditDeleteApiCategories(carbonUsername, carbonPassword, testTenant);
    });

})