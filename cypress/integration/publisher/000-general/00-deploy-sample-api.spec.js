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

describe("publisher-000-00 : Deploy sample api", () => {
    const { publisher, password, superTenant, testTenant} = Utils.getUserInfo();

    const deploySampleApi = (tenant) => {
        cy.loginToPublisher(publisher, password, tenant);
        cy.visit(`/publisher/apis`);
        cy.contains('WSO2 API-M v4.1.0');
        cy.wait(5000);
        cy.get("body").then($body => {
            if ($body.find("#itest-apis-welcome-msg").length > 0) {
                cy.log("Init page");
                cy.get('#itest-rest-api-create-menu').click();
            } else {
                cy.log("API availble");
                cy.get('#itest-create-api-menu-button').click();
            }
        });
        cy.get('#itest-id-deploy-sample').click();
        cy.get('#itest-api-name-version').should('be.visible');
        cy.url().should('contains', '/overview');
        cy.get("#itest-api-name-version").contains('PizzaShackAPI');
        cy.get('#itest-id-deleteapi-icon-button').click();
        cy.get('#itest-id-deleteconf').click();
    }

    it.only("Deploy sample api - super admin", {
        retries: {
            runMode: 3,
            openMode: 0,
        },
    }, () => {
        deploySampleApi(superTenant);
    });
    it.only("Deploy sample api - tenant user", {
        retries: {
            runMode: 3,
            openMode: 0,
        },
    }, () => {
        deploySampleApi(testTenant);
    });
});