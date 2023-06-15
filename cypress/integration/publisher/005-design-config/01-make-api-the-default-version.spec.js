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

describe("publisher-005-01 : Verify authorized user can make the api the default version", () => {
    const { publisher, password, superTenant, testTenant } = Utils.getUserInfo();
    const apiName = Utils.generateName();
    const apiVersion = '1.0.0';

    const makeApiTheDefaultVersion = (tenant) => {
        cy.loginToPublisher(publisher, password, tenant);
        Utils.addAPI({ name: apiName, version: apiVersion }).then((apiId) => {
            cy.visit({url:`/publisher/apis/${apiId}/overview`, retryOnStatusCodeFailure: true});
            cy.get('#itest-api-details-portal-config-acc').click();
            cy.get('#left-menu-itemDesignConfigurations').click();
            cy.get('#default-version-yes').scrollIntoView().click();
            cy.get('#design-config-save-btn').click();
            cy.get('#default-version-yes')
                .parent()
                .find('input')
                .should('be.checked');
            // Test is done. Now delete the api
            Utils.deleteAPI(apiId);
        });
    }
    it.only("Admin user can make the api the default version", () => {
        makeApiTheDefaultVersion(superTenant);
    });
    it.only("Tenant user can make the api the default version", () => {
        makeApiTheDefaultVersion(testTenant);
    });
});
