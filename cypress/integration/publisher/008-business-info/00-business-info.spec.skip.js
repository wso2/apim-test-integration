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

describe("publisher-008-00 : Verify authorized user can add business information for an API", () => {
    const { publisher, password, superTenant, testTenant } = Utils.getUserInfo();
    const businessInfo = (tenant) => {
        const ownerName = 'Raccoon Panda';
        const ownerEmail = 'raccoon@wso2.com';
        const techOwnerName = 'Big Cat';
        const techOwnerEmail = 'bigcat@wso2.com';

        cy.loginToPublisher(publisher, password, tenant);
        Utils.addAPI({}).then((apiId) => {
            cy.visit({url:`/publisher/apis/${apiId}/overview`, retryOnStatusCodeFailure: true});
            cy.get('#itest-api-details-portal-config-acc', {timeout: Cypress.config().largeTimeout}).click();
            cy.get('#left-menu-itembusinessinfo').click();
            cy.get('#name').click().type(ownerName);
            cy.get('#Email').click().type(ownerEmail);
            cy.get('#TOname').click().type(techOwnerName);
            cy.get('#TOemail').click().type(techOwnerEmail);

            cy.get('#business-info-save').click();

            cy.get('#business-info-save').then(function () {
                cy.get('#name').should('have.value', ownerName);
                cy.get('#Email').should('have.value', ownerEmail);
                cy.get('#TOname').should('have.value', techOwnerName);
                cy.get('#TOemail').should('have.value', techOwnerEmail);
            });
            // Test is done. Now delete the api
            Utils.deleteAPI(apiId);
        });
    }
    it.only("Admin user can add business information for an API", () => {
        businessInfo(superTenant);
    });
    it.only("Tenant user can add business information for an API", () => {
        businessInfo(testTenant);
    });
});
