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

describe("admin-06 - Verify authorized user can add and delete deny policiess", () => {
    
    const { carbonUsername, carbonPassword, testTenant, superTenant } = Utils.getUserInfo();

    const addDenyPolicy = (usernameLocal, passwordLocal, tenant) => {
        cy.loginToAdmin(usernameLocal, passwordLocal, tenant);
        const ipAddress = '127.0.0.1';
        cy.get('[data-testid="Deny Policies-child-link"]').click();
        cy.get('.MuiButton-label').contains('Add Policy').click();
        cy.get('input[value="IP"]').click();
        cy.get('input[name="fixedIp"]').type(ipAddress);
        cy.get('button.MuiButton-containedPrimary > span').contains('Deny').click();
        cy.get('[data-testid="MuiDataTableBodyCell-1-0"] div').contains(ipAddress).should('exist');

        // delete
        cy.get(`[data-testid="IP-actions"] svg`).click();
        cy.get('button > span').contains('Delete').click();
        cy.get('#client-snackbar').should('have.text','Deny Policy successfully deleted.');
    }

    it.only("Verify admin user can add and delete deny policiess", () => {
        addDenyPolicy(carbonUsername, carbonPassword, superTenant);
    });

    it.only("Verify tenant user can add and delete deny policiess", () => {
        addDenyPolicy(carbonUsername, carbonPassword, testTenant);
    });

})
