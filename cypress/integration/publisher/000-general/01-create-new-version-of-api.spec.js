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
import PublisherComonPage from "../../../support/pages/publisher/PublisherComonPage";

describe("publisher-000-01 : Create a new version of API", () => {
    Cypress.on('uncaught:exception', (err, runnable) => {
        return false;
      });
    let apiName;
    const apiVersion = '1.0.0';
    const newVersion = '2.0.0';
    const { publisher, password, superTenant, testTenant} = Utils.getUserInfo();
    let testApiId;

    const createNewVersionOfApi = (tenant) => {
        cy.loginToPublisher(publisher, password, tenant);
        apiName = Utils.generateName();
        Utils.addAPI({name: apiName, version: apiVersion}).then((apiId) => {
            cy.wait(5000)
            testApiId = apiId;
            cy.visit(`/publisher/apis/${apiId}/overview`);
            PublisherComonPage.waitUntillLoadingComponentsExit()
            cy.get('#create-new-version-btn').click();
            cy.wait(3000)
            cy.get('#newVersion').type(newVersion);
            cy.intercept('**/apis/**').as('apiGet');
            cy.get('#createBtn').click();
            cy.wait('@apiGet', { timeout: 30000 }).then(() => {
                // Validate
                cy.get('#itest-api-name-version', { timeout: 30000 }).should('be.visible');
                cy.get('#itest-api-name-version').contains(`${apiName} :${newVersion}`);
            })
        });
    }

    it.only("Create a new version of API - super admin", () => {
        createNewVersionOfApi(superTenant);
    });
    it.only("Create a new version of API - tenant user", () => {
        createNewVersionOfApi(testTenant);
    });

    after(function () {
        // Test is done. Now delete the api
        if (testApiId) {
            Utils.deleteAPI(testApiId);
        }
    })
});