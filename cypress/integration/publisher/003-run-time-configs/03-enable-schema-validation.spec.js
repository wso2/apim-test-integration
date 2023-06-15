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

describe("publisher-003-04 : Verify authirzed user can enable schema validation under runtime configuration", () => {
    const { publisher, password, superTenant, testTenant} = Utils.getUserInfo();
    let apiName;
    const apiVersion = '1.0.0';

    const enableSchemaValidation = (tenant) => {
        cy.loginToPublisher(publisher, password, tenant);
        apiName = Utils.generateName();
        Utils.addAPI({ name: apiName, version: apiVersion }).then((apiId) => {
            cy.visit({url:`/publisher/apis/${apiId}/overview`, retryOnStatusCodeFailure: true});
            cy.get('#itest-api-details-api-config-acc').click();
            cy.get('#left-menu-itemRuntimeConfigurations').click();
            cy.get('#schema-validation-switch').click();
            cy.get('#schema-validation-yes-btn').click();
            cy.get('#save-runtime-configurations').click();
            cy.get('#schema-validation-switch').should('be.checked');
            // Test is done. Now delete the api
            Utils.deleteAPI(apiId);
        });
    }

    it.only("Verify admin user can enable schema validation", () => {
        enableSchemaValidation(superTenant);
    });
    it.only("Verify tenant user can enable schema validation", () => {
        enableSchemaValidation(testTenant);
    });
});
