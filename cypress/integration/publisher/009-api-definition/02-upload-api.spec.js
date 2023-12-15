/*
 * Copyright (c) 2022, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

describe("publisher-009-02 : Upload api spec from the api definition page", () => {
    const { publisher, password, superTenant, testTenant} = Utils.getUserInfo();
    const apiName = Utils.generateName();
    const apiVersion = '1.0.0';

    const uploadApi = (tenant) => {
        cy.loginToPublisher(publisher, password, tenant);
        Utils.addAPI({ name: apiName, version: apiVersion }).then((apiId) => {
            cy.visit({url:`/publisher/apis/${apiId}/overview`, retryOnStatusCodeFailure: true});
            cy.get('#itest-api-details-api-config-acc').click();
            cy.get('#left-menu-itemAPIdefinition').click();
            cy.get('#import-definition-btn').click();
            cy.get('#open-api-file-select-radio').click();

            // upload the swagger
            cy.get('#browse-to-upload-btn').then(function () {
                const filepath = 'api_artifacts/petstore_open_api_3.json'
                cy.get('input[type="file"]').attachFile(filepath);
            });

            // provide the swagger url
            cy.intercept('PUT', '**/apis/**').as('apiGet');
            cy.get('#import-open-api-btn').click();

            // Wait until the api is saved
            cy.wait('@apiGet', { timeout: 3000 }).then((res) => {
                cy.visit(`/publisher/apis/${apiId}/resources`, { timeout: 30000 });
                cy.get('#\\/pets\\/\\{petId\\}', { timeout: 30000 }).scrollIntoView();
                cy.get('#\\/pets\\/\\{petId\\}').should('be.visible');
            });
            // Test is done. Now delete the api
            Utils.deleteAPI(apiId);
        });
    }
    it.only("Upload api spec from the api definition page - super admin", () => {
        uploadApi(superTenant);
    });
    it.only("Upload api spec from the api definition page - tenant user", () => {
        uploadApi(testTenant);
    });
});