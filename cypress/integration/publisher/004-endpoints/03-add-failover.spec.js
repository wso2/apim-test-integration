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

describe("publisher-004-03 : Verify authorized user can add failover configurations for REST API endpoints", () => {
    const { publisher, password, superTenant, testTenant} = Utils.getUserInfo();
    const endpoint = 'https://petstore.swagger.io/v2/store/inventory';

    const addFailOver = (tenant) => {
        // todo need to remove this check after `console.err(err)` -> `console.err(err)` in Endpoints.jsx
        Cypress.on('uncaught:exception', (err, runnable) => {
            // returning false here prevents Cypress from
            // failing the test
            return false
        });
        cy.loginToPublisher(publisher, password, tenant);
        Utils.addAPI({}).then((apiId) => {
            cy.visit({url:`/publisher/apis/${apiId}/overview`, retryOnStatusCodeFailure: true});
            cy.get('#itest-api-details-api-config-acc', {timeout: Cypress.config().largeTimeout}).click();
            cy.get('#left-menu-itemendpoints').click();
            cy.get('[data-testid="http/restendpoint-add-btn"]').click();

            // Add the prod and sandbox endpoints
            cy.get('#production-endpoint-checkbox', {timeout: Cypress.config().largeTimeout}).click({force:true});
            cy.get('#sandbox-endpoint-checkbox').click({force:true});
            cy.get('#production_endpoints').focus().type(endpoint);
            cy.get('#sandbox_endpoints').focus().type(endpoint);

            // failover
            cy.get('#panel1bh-header').click();
            cy.get('#certificateEndpoint').click({force: true});
            cy.get('#config-type-failover').click({force: true});

            // add prod endpoints for failover
            cy.get('#production_endpoints-failover').focus().type(endpoint);
            cy.get('#production_endpoints-failover-add-btn').click();

            // add sandbox endpoints for failover
            cy.get('#sandbox_endpoints-failover').focus().type(endpoint);
            cy.get('#sandbox_endpoints-failover-add-btn').click();
            // Save
            cy.get('#endpoint-save-btn').click();

            // Check the values
            cy.get('#production_endpoints').should('have.value', endpoint);
            cy.get('#sandbox_endpoints').should('have.value', endpoint);

            // Test is done. Now delete the api
            Utils.deleteAPI(apiId);
        });
    }

    it.only("Admin user adds REST endpoints for production and sandbox endpoints with failover", {
        retries: {
          runMode: 3,
          openMode: 0,
        },
      }, () => {
        addFailOver(superTenant);
    });
    it.only("Tenant user adds REST endpoints for production and sandbox endpoints with failover", {
        retries: {
          runMode: 3,
          openMode: 0,
        },
      }, () => {
        addFailOver(testTenant);
    });
});
