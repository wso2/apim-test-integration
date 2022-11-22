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

describe("publisher-003-00 : Runtime configuration-Authorization Header ", () => {
    const { publisher, password, superTenant, testTenant} = Utils.getUserInfo();

    let apiName;
    const apiVersion = '1.0.0';

    const addAuthorizationHeaderForTheApi = (tenant) => {
        cy.loginToPublisher(publisher, password, tenant);
        apiName = Utils.generateName();;
        Utils.addAPI({ name: apiName, version: apiVersion }).then((apiId) => {
            const customAuthHeader = '-custom';
            cy.visit(`/publisher/apis/${apiId}/runtime-configuration`);
            cy.get('#applicationLevel').children('[role="button"]').click({force:true});
            cy.wait(1000);
            cy.get('#itest-id-headerName-input').click({force:true}).type(customAuthHeader, {force:true});
            cy.get('#save-runtime-configurations').click();
            cy.get('#itest-id-headerName-input').should('have.value', 'Authorization' + customAuthHeader);
            // Test is done. Now delete the api
            Utils.deleteAPI(apiId);
        });
    }

    it.only("Add Authorization Header for the api - super admin", () => {
        addAuthorizationHeaderForTheApi(superTenant);
    });
    it.only("Add Authorization Header for the api - tenant user", () => {
        addAuthorizationHeaderForTheApi(testTenant);
    });
});