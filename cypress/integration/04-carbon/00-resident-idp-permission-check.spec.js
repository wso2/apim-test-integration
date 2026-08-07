/*
 * Copyright (c) 2026, WSO2 LLC. (http://www.wso2.org) All Rights Reserved.
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
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// Provisions a role/user with /permission/admin/manage/identity/idpmgt/view but NOT the broader
// /permission/admin/manage, logs in as that user, opens the Resident IdP edit page, and asserts it
// renders normally with no server error.
describe("admin-12 : Resident IdP edit page access without admin/manage permission", () => {
    const role = 'idpViewOnlyRole';
    const username = 'idpViewOnlyUser';
    const password = 'Console@123';
    const permissions = [
        '/permission/admin/login',
        '/permission/admin/manage/identity/idpmgt/view',
    ];

    before(function () {
        cy.soapLoginAsAdmin();

        // Start clean in case a previous run left the fixtures behind.
        cy.soapDeleteUser(username);
        cy.soapDeleteRole(role);

        cy.soapCreateRole(role, permissions);
        cy.soapCreateUser(username, password, [role]);

        cy.clearCookies();
        cy.carbonLogin(username, password);
    });

    after(function () {
        cy.soapLoginAsAdmin();
        cy.soapDeleteUser(username);
        cy.soapDeleteRole(role);
    });

    it.only("carbon-00 : User with idpmgt/view permission (but not admin/manage) can open the Resident IdP edit page", () => {
        // idp-mgt-edit-load-local.jsp fetches the Resident IdP into the session then client-side redirects
        // to idp-mgt-edit-local.jsp - a real browser follows that redirect, so visiting the loader once
        // lands us on the actual edit page.
        cy.visit('/carbon/idpmgt/idp-mgt-edit-load-local.jsp');
        cy.url().should('include', 'idp-mgt-edit-local.jsp');

        cy.contains('Resident Identity Provider').should('exist');
        cy.get('body').should('not.contain', 'AxisFault');
        cy.get('body').should('not.contain', 'JSPException while including page');
    });
});
