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

describe("publisher-004-00 : Verify authorized user can add prodcution and sandbox endpoints for an rest API", () => {
    const { publisher, password, superTenant, testTenant} = Utils.getUserInfo();
    const endpoint = 'https://petstore.swagger.io/v2/store/inventory';

    const addRestEndpointsProductionSandbox = (tenant) => {
        cy.loginToPublisher(publisher, password, tenant);
        Utils.addAPI({}).then((apiId) => {
            cy.visit({url:`/publisher/apis/${apiId}/overview`, retryOnStatusCodeFailure: true});
            cy.get('#itest-api-details-api-config-acc').click();
            cy.get('#left-menu-itemendpoints').click();
            cy.get('[data-testid="http/restendpoint-add-btn"]').click({force:true});

            // Add the prod and sandbox endpoints
            cy.get('#production-endpoint-checkbox').click();
            cy.get('#sandbox-endpoint-checkbox').click();
            cy.get('#production_endpoints').focus().type(endpoint);
            cy.get('#sandbox_endpoints').focus().type(endpoint);

            // Save
            cy.get('body').click();
            cy.get('#endpoint-save-btn').scrollIntoView();
            cy.get('#endpoint-save-btn').click();

            // Check the values
            cy.get('#production_endpoints').should('have.value', endpoint);
            cy.get('#sandbox_endpoints').should('have.value', endpoint);
            // Test is done. Now delete the api
            Utils.deleteAPI(apiId);
        });
    }
    it.only("Verify admin user can add production and sandbox endpoints for an API", () => {
        addRestEndpointsProductionSandbox(superTenant);
    });
    it.only("Verify tenant user can add production and sandbox endpoints for an API", () => {
        addRestEndpointsProductionSandbox(testTenant);
    });
});
