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

describe("publisher-002-01 : Verify authorized user can add API level rate limiting policy", () => {
    const { publisher, password, superTenant, testTenant} = Utils.getUserInfo();

    let apiName
    const apiVersion = '1.0.0';

    const addAuthorizationHeaderForApi = (tenant) => {
        cy.loginToPublisher(publisher, password, tenant);
        apiName = Utils.generateName();
        Utils.addAPI({ name: apiName, version: apiVersion }).then((apiId) => {
            cy.visit({url:`/publisher/apis/${apiId}/resources`, retryOnStatusCodeFailure: true});

            cy.get('#api-rate-limiting-api-level').click();
            cy.get('#operation_throttling_policy').click();
            cy.get('#api-rate-limiting-api-level-10KPerMin').then(() => {
                cy.get('#api-rate-limiting-api-level-10KPerMin').click();
            })
            cy.get('#resources-save-operations').click();

            cy.get('#operation_throttling_policy').scrollIntoView();
            cy.get('#operation_throttling_policy').contains('10KPerMin').should('be.visible');
            // Test is done. Now delete the api
            Utils.deleteAPI(apiId);
        });
    }

    it.only("Verify admin user can add Authorization Header for the api", () => {
        addAuthorizationHeaderForApi(superTenant);
    });
    it.only("Verify tenant user can add Authorization Header for the api", () => {
        addAuthorizationHeaderForApi(testTenant);
    });
});
