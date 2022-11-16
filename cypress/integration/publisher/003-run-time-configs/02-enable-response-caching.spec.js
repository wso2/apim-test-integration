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

describe("publisher-003-02 : Runtime configuration-response caching", () => {
    const { publisher, password, superTenant, testTenant} = Utils.getUserInfo();
    let apiName;
    const apiVersion = '1.0.0';
    
    const enableResponseCaching = (tenant) => {
        cy.loginToPublisher(publisher, password, tenant);
        apiName = Utils.generateName();
        Utils.addAPI({ name: apiName, version: apiVersion }).then((apiId) => {
            cy.visit(`/publisher/apis/${apiId}/overview`);
            cy.get('#itest-api-details-api-config-acc').click();
            cy.get('#left-menu-itemRuntimeConfigurations').click();
            cy.get('#response-caching-switch').click();
            cy.get('#save-runtime-configurations').click();
            cy.get('#response-caching-switch').should('be.checked');
            // Test is done. Now delete the api
            Utils.deleteAPI(apiId);
        });
    }
    it.only("Enable response caching - super admin", () => {
        enableResponseCaching(superTenant);
    });
    it.only("Enable response caching - tenant user", () => {
        enableResponseCaching(testTenant);
    });
});