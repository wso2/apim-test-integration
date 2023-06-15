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


describe("publisher-006-00 : Verify authorized user can select subscription tiers for the API", () => {
    const { publisher, password, superTenant, testTenant } = Utils.getUserInfo();
    const apiName = Utils.generateName();
    const apiVersion = '1.0.0';

    const selectSubscriptionTiers = (tenant) => {
        cy.loginToPublisher(publisher, password, tenant);
        Utils.addAPI({ name: apiName, version: apiVersion }).then((apiId) => {
            cy.visit({url:`/publisher/apis/${apiId}/overview`, retryOnStatusCodeFailure: true});
            cy.get('#itest-api-details-portal-config-acc').click();
            cy.get('#left-menu-itemsubscriptions').click();
            cy.get('[data-testid="policy-checkbox-silver"]').click();
            cy.get('#subscriptions-save-btn').click();

            cy.get('#subscriptions-save-btn').then(function () {
                cy.get('[data-testid="policy-checkbox-unlimited"] input').should('be.checked');
                cy.get('[data-testid="policy-checkbox-silver"] input').should('be.checked');
            });
            // Test is done. Now delete the api
            Utils.deleteAPI(apiId);
        });
    }

    it.only("Super admin user selects subscription tiers for the API", () => {
        selectSubscriptionTiers(superTenant);
    });
    it.only("Tenant user selects subscription tiers for the API", () => {
        selectSubscriptionTiers(testTenant);
    });
});
