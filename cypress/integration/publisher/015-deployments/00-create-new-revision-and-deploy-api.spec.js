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

describe("publisher-015-00 : Create new revision and deploy", () => {
    const { publisher, password, superTenant, testTenant} = Utils.getUserInfo();

    const createNewRevisionAndDeployApi = (tenant) => {
        cy.loginToPublisher(publisher, password, tenant);
        Utils.addAPIWithEndpoints({}).then((apiId) => {
            cy.visit(`/publisher/apis/${apiId}/overview`);
            // Going to deployments page
            cy.get('#left-menu-itemdeployments').click();

            // Deploying
            cy.get('#add-description-btn')
                .scrollIntoView().click({ "force": true });
            cy.get('#add-description').click({ "force": true });
            cy.get('#add-description').type('test');
            cy.get('#deploy-btn').should('not.have.class', 'Mui-disabled').click();
            cy.get('#undeploy-btn').should('not.have.class', 'Mui-disabled').should('exist');

            // Going to lifecycle page
            cy.get('#left-menu-itemlifecycle').click();

            // Publishing
            cy.wait(2000);
            cy.get('[data-testid="Publish-btn"]').click();

            cy.get('button[data-testid="Demote to Created-btn"]').should('exist');
            Utils.deleteAPI(apiId);
        });
    }

    it.only("Create new revision and deploy - super admin", () => {
        createNewRevisionAndDeployApi(superTenant);
    });
    it.only("Create new revision and deploy - tenant user", () => {
        createNewRevisionAndDeployApi(testTenant);
    });
});