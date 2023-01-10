
/*
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

describe("publisher-001-01 : Verify an authorized user can perform login and logout successfully in publisher", () => {
    const tenantUser = `tenant${Math.floor(Date.now() / 1000)}`
    const carbonUsername = 'admin'
    const carbonPassword = 'admin'

    it.only("Verify super user can login and logout successfully from publisher", () => {
        cy.loginToPublisher(carbonUsername, carbonPassword);
        cy.get('[data-testid="api-table-view"]').then(() => {
            cy.get('[data-testid="logout-menu-dropdown"]').click();
            cy.get('[data-testid="logout-menu-item"]').click();
            cy.wait(5000)

            // somtimes without redirect to login page it endedup in logged out screen
            cy.get("body").then($body => {
                if ($body.find('#usernameUserInput').length > 0) {  
                    cy.get('#usernameUserInput').should('exist');
                } else {
                    cy.contains("You have successfully logged")
                }
            });
        })
    })

    it.only("Verify tenant user can login and logout successfully from publisher", () => {
        const tenant = 'wso2.com';
        const tenantAdminUsername = 'admin';
        const tenantAdminPassword = 'admin';

        cy.carbonLogin(carbonUsername, carbonPassword);
        cy.addNewTenant(tenant, tenantAdminUsername, tenantAdminPassword);
        cy.visit('/carbon/tenant-mgt/add_tenant.jsp?region=region1&item=govern_add_tenants_menu');
        cy.carbonLogout();
        cy.carbonLogin(`${tenantAdminUsername}@${tenant}`, tenantAdminPassword);
        cy.addNewUser(tenantUser, ['Internal/publisher', 'Internal/creator', 'Internal/everyone'], 'test123');
        cy.loginToPublisher(`${tenantUser}@${tenant}`, 'test123');
        cy.get('[data-testid="api-table-view"]').then(() => {
            cy.get('[data-testid="logout-menu-dropdown"]').click();
            cy.get('[data-testid="logout-menu-item"]').click();
            //cy.get('#usernameUserInput').should('exist');
            cy.wait(3000)
            // somtimes without redirect to login page it endedup in logged out screen
            cy.get("body").then($body => {
                if ($body.find('#usernameUserInput').length > 0) {  
                    cy.get('#usernameUserInput').should('exist');
                } else {
                    cy.contains("You have successfully logged")
                }
            });
        })
    })
    after(() => {
        //cy.visit('carbon/user/user-mgt.jsp');
        //cy.deleteUser(tenantUser);
    })
})
