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

describe("publisher-002-00 : Verify an authorized user can perform CRUD operations in resources", () => {

    const { publisher, password, superTenant, testTenant } = Utils.getUserInfo();
    const target = '/test';
    let testApiId;

    const addApiAndResource = (verb, apiId) => {
        // Typing the resource name
        cy.visit({url:`/publisher/apis/${apiId}/resources`, retryOnStatusCodeFailure: true});
        cy.get('#operation-target').type(target);
        cy.get('body').click();
        cy.get('#add-operation-selection-dropdown').click();

        // Checking all the operations
        cy.get(`#add-operation-${verb}`).click();

        cy.get('body').click();
        cy.get('#add-operation-button').click();
        cy.get('#resources-save-operations').click();

        // Validating if the resource exists after saving
        cy.get('#resources-save-operations', { timeout: 30000 });

        cy.get(`#${verb}\\${target}`).should('be.visible');
    }
    const addNewResource = (tenant) => {
        const apiName = Utils.generateName();
        const apiVersion = '1.0.0';
        cy.loginToPublisher(publisher, password, tenant);
        Utils.addAPI({ name: apiName, version: apiVersion }).then((apiId) => {
            testApiId = apiId;
            cy.visit({url:`/publisher/apis/${apiId}/resources`, retryOnStatusCodeFailure: true});

            // Typing the resource name
            cy.get('#itest-api-details-api-config-acc').click();
            cy.get('#left-menu-itemresources').click();
            cy.get('#operation-target').type(target);
            cy.get('body').click();
            cy.get('#add-operation-selection-dropdown').click();

            // Checking all the operations
            cy.get('#add-operation-get').click();
            cy.get('#add-operation-post').click();
            cy.get('#add-operation-put').click();
            cy.get('#add-operation-patch').click();
            cy.get('#add-operation-delete').click();
            cy.get('#add-operation-head').click();

            cy.get('body').click();
            cy.get('#add-operation-button').click();
            cy.get('#resources-save-operations').click();

            // Validating if the resource exists after saving
            cy.get('#resources-save-operations', { timeout: 30000 });

            cy.get(`#get\\${target}`).should('be.visible');
            cy.get(`#post\\${target}`).should('be.visible');
            cy.get(`#put\\${target}`).should('be.visible');
            cy.get(`#patch\\${target}`).should('be.visible');
            cy.get(`#delete\\${target}`).should('be.visible');
            cy.get(`#head\\${target}`).should('be.visible');
        });
    }
    const addDeleteQueryPathParamForResources = (tenant) => {
        const verb = 'get';
        const paramType = 'query';
        const paramName = 'count';
        const paramDataType = 'string';
        const apiName = Utils.generateName();
        const apiVersion = '1.0.0';
        cy.loginToPublisher(publisher, password, tenant);
        Utils.addAPI({ name: apiName, version: apiVersion }).then((apiId) => {
            testApiId = apiId;
            addApiAndResource(verb, apiId);

            cy.get(`#${verb}\\${target}`).click();
            cy.get(`#param-${verb}\\${target}`).click();
            cy.get(`#param-${verb}\\${target}\\/${paramType}`).click();

            cy.get(`#name-${verb}\\${target}`).click();
            cy.get(`#name-${verb}\\${target}`).type(paramName);

            // Clicking the parameter data type drop down
            cy.get(`#data-${verb}\\${target}`).click();
            cy.get(`#data-${verb}\\${target}\\/${paramDataType}`).click();
            cy.get(`#param-${verb}\\${target}-add-btn`).click({ force: true });

            // Save the resources
            cy.get('#resources-save-operations').click();

            // Validating if the param exists after saving
            cy.get('#resources-save-operations', { timeout: 30000 });
            cy.get(`#param-list-${paramType}-${paramName}-${paramDataType}`).should('be.visible');
        });
    }

    const addAdvanceThrottlingPoliciesPerResource = (tenant) => {
        const verb = 'get';
        const rateLimitName = '50KPerMin';
        const apiName = Utils.generateName();
        const apiVersion = '1.0.0';
        cy.loginToPublisher(publisher, password, tenant);
        Utils.addAPI({ name: apiName, version: apiVersion }).then((apiId) => {
            testApiId = apiId;
            addApiAndResource(verb, apiId);
            // Click the operation level radio button on the top
            cy.get('#api-rate-limiting-operation-level').click({ force: true });

            // expand the section
            cy.get(`#${verb}\\${target}`).click();

            cy.get(`#${verb}\\${target}-operation_throttling_policy`).click();
            cy.get(`#${verb}\\${target}-operation_throttling_policy-${rateLimitName}`).click();

            // Save the resources
            cy.get('#resources-save-operations').click();

            cy.get('#resources-save-operations', { timeout: 30000 });
            cy.get(`#${verb}\\${target}-operation_throttling_policy`)
                .contains(rateLimitName)
                .should('be.visible');
        });
    }

    const addAndAssignScopesForApiResources = (tenant) => {
        const random_number = Math.floor(Date.now() / 1000);
        const verb = 'post';
        const scopeName = 'test' + random_number;
        const scopeDescription = 'test scope description';
        const role = 'internal/publisher';
        const apiName = Utils.generateName();
        const apiVersion = '1.0.0';
        cy.loginToPublisher(publisher, password, tenant);
        Utils.addAPI({ name: apiName, version: apiVersion }).then((apiId) => {
            testApiId = apiId;
            addApiAndResource(verb, apiId);

            // Go to local scope page
            cy.visit({url:`/publisher/apis/${apiId}/scopes/create`, retryOnStatusCodeFailure: true});

            cy.wait(2000);
            // Create a local scope
            cy.get('input#name').click({force:true});
            cy.get('input#name').type(scopeName, {force:true});

            cy.get('#displayName').click();
            cy.get('#displayName').type(scopeName);

            cy.get('#description').click();
            cy.get('#description').type(scopeDescription);

            cy.get('#roles-input').click();
            cy.get('#roles-input').type(`${role}{enter}`);

            cy.get('#scope-save-btn').click();
            cy
                .get('tbody')
                .get('tr')
                .contains(scopeName).should('be.visible');

            // Go to resources page
            cy.visit({url:`/publisher/apis/${apiId}/resources`, retryOnStatusCodeFailure: true});

            // Open the operation sub section
            cy.get(`#${verb}\\${target}`).click();
            cy.get(`#${verb}\\${target}-operation-scope-select`, { timeout: 3000 });
            cy.get(`#${verb}\\${target}-operation-scope-select`).click();
            cy.get(`#${verb}\\${target}-operation-scope-${scopeName}`).click();
            cy.get(`#${verb}\\${target}-operation-scope-${scopeName}`).type('{esc}');
            // // Save the resources
            cy.get('#resources-save-operations').click();

            cy.get('#resources-save-operations', { timeout: 30000 });
            cy.get(`#${verb}\\${target}-operation-scope-select`)
                .contains(scopeName)
                .should('be.visible');

        });
    }

    it.only("Verify admin user can add new resource for the API",{
        retries: {
          runMode: 3,
          openMode: 0,
        },
      }, () => {
        addNewResource(superTenant);
    });

    it.only("Verify admin user can add delete query path parameters for resources",{
        retries: {
          runMode: 3,
          openMode: 0,
        },
      }, () => {
        addDeleteQueryPathParamForResources(superTenant);
    });

    it.only("Verify admin user can add advance throttling policies per resource",{
        retries: {
          runMode: 3,
          openMode: 0,
        },
      }, () => {
        addAdvanceThrottlingPoliciesPerResource(superTenant);
    });

    it.only("Verify admin user can add and assign scopes for API resources",{
        retries: {
          runMode: 3,
          openMode: 0,
        },
      }, () => {
        addAndAssignScopesForApiResources(superTenant);
    });

    it.only("Verify tenant user can add new resource for the API",{
        retries: {
          runMode: 3,
          openMode: 0,
        },
      }, () => {
        addNewResource(testTenant);
    });

    it.only("Verify tenant user can add delete query path parameters for resources",{
        retries: {
          runMode: 3,
          openMode: 0,
        },
      }, () => {
        addDeleteQueryPathParamForResources(testTenant);
    });

    it.only("Verify tenant user can add advance throttling policies per resourcer",{
        retries: {
          runMode: 3,
          openMode: 0,
        },
      }, () => {
        addAdvanceThrottlingPoliciesPerResource(testTenant);
    });

    it.only("Verify tenant user can add and assign scopes for API resources",{
        retries: {
          runMode: 3,
          openMode: 0,
        },
      }, () => {
        addAndAssignScopesForApiResources(testTenant);
    });

    afterEach(() => {
        Utils.deleteAPI(testApiId);
    })

})
