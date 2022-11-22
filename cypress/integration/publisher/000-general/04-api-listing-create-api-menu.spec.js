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

describe("publisher-000-04 : Landing page API List", () => {
    const { publisher, password, superTenant, testTenant } = Utils.getUserInfo();
    let testApiId;

    const apiListingCreateApiMenu = (tenant) => {
        cy.loginToPublisher(publisher, password, tenant);
        Utils.addAPI({}).then((apiId) => {
            cy.visit(`/publisher/apis`);
            testApiId = apiId;
            cy.get('#itest-create-api-menu-button', { timeout: 30000 }).should('be.visible').click();

            // Checking links under rest apis
            cy.get('a').contains('Start From Scratch')
                .invoke('attr', 'href')
                .should('eq', '/publisher/apis/create/rest');
            cy.get('a').contains('Import Open API')
                .invoke('attr', 'href')
                .should('eq', '/publisher/apis/create/openapi');

            // Checking links under SOAP apis
            cy.get('a').contains('Import WSDL')
                .invoke('attr', 'href')
                .should('eq', '/publisher/apis/create/wsdl');

            // Checking links under GraphQL apis
            cy.get('a').contains('Import GraphQL SDL')
                .invoke('attr', 'href')
                .should('eq', '/publisher/apis/create/graphQL');

            // Checking links under Streaming API apis
            cy.get('a').contains('Web Socket API')
                .invoke('attr', 'href')
                .should('eq', '/publisher/apis/create/streamingapi/ws');
            cy.get('a').contains('Webhook API')
                .invoke('attr', 'href')
                .should('eq', '/publisher/apis/create/streamingapi/websub');
            cy.get('a').contains('SSE API')
                .invoke('attr', 'href')
                .should('eq', '/publisher/apis/create/streamingapi/sse');

            cy.get('a').contains('Import an AsyncAPI')
                .invoke('attr', 'href')
                .should('eq', '/publisher/apis/create/asyncapi');

            // Checking links under Streaming API apis
            cy.get('a').contains('Import From Service Catalog')
                .invoke('attr', 'href')
                .should('eq', '/publisher/service-catalog');
        });
    }

    it.only("Click and check all cards - super admin", () => {
        apiListingCreateApiMenu(superTenant);
    });
    it.only("Click and check all cards - tenant user", () => {
        apiListingCreateApiMenu(testTenant);
    });

    afterEach(function () {
        if (testApiId) {
            Utils.deleteAPI(testApiId);
        }
    })
});