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

describe("publisher-013-04 : Life cycle support for API Products", () => {
    const { publisher, password, superTenant, testTenant } = Utils.getUserInfo();
    const productName = Utils.generateName();
    const apiName = Utils.generateName();

    const lifeCycleSupportForApiProduct = (tenant) => {
        cy.loginToPublisher(publisher, password, tenant);
        cy.visit(`/publisher/apis/create/openapi`, {timeout: Cypress.config().largeTimeout});
        cy.get('#open-api-file-select-radio').click();


        // upload the swagger
        cy.get('#browse-to-upload-btn').then(function () {
            const filepath = `api_artifacts/pizzashack.json`
            cy.get('input[type="file"]').attachFile(filepath)
        });
        cy.get('#open-api-create-next-btn').click();
        cy.get('#itest-id-apiversion-input', {timeout: Cypress.config().largeTimeout});

        cy.document().then((doc) => {
            cy.get('#itest-id-apicontext-input').clear();
            cy.get('#itest-id-apicontext-input').type(apiName);
            cy.get('#itest-id-apiversion-input').click();
            const version = doc.querySelector('#itest-id-apiversion-input').value;

            // finish the wizard
            cy.get('#open-api-create-btn').should('not.have.class', 'Mui-disabled').click({force:true});

            // validate
            cy.get('#itest-api-name-version', {timeout: Cypress.config().largeTimeout});
            cy.get('#itest-api-name-version').contains(version);

            // Get the api id
            cy.location('pathname').then((pathName) => {
                const pathSegments = pathName.split('/');
                const uuid = pathSegments[pathSegments.length - 2];

                // Go to api product create page
                cy.visit(`/publisher/api-products/create`);

                // fill the form
                cy.get('#itest-id-apiname-input').type(productName);
                cy.get('#context').type(productName);
                cy.get('#itest-id-apiname-input').click();

                cy.intercept('**/swagger').as('swaggerGet');
                cy.get('#api-product-next-btn').click();
                cy.wait('@swaggerGet', { timeout: Cypress.config().largeTimeout }).then(() => {
                    cy.intercept('GET', '**/swagger').as('getSwagger');
                    cy.get(`#checkbox-list-label-${uuid}`).click();
                    cy.wait('@getSwagger');
                    // Wait until the api is saved
                    cy.get('#resource-wrapper').children().should('have.length.gte', 1);

                    // add all resources
                    cy.get('#add-all-resources-btn').click();
                    cy.get('#create-api-product-btn').scrollIntoView().click();
                    cy.get('#itest-api-name-version', { timeout: Cypress.config().largeTimeout });
                    cy.get('#itest-api-name-version').contains(productName);

                    //Get the api product id
                    cy.location('pathname').then((pathName) => {
                        const pathSegments = pathName.split('/');
                        const uuidProduct = pathSegments[pathSegments.length - 2];

                        cy.log(uuid, uuidProduct);

                        cy.get('#left-menu-itemdeployments').click();

                        // Deploying
                        cy.get('#deploy-btn', { timeout: Cypress.config().largeTimeout }).should('not.have.class', 'Mui-disabled').click({ force: true });

                        cy.get('#left-menu-itemlifecycle').click();

                        // Publishing api product
                        cy.wait(2000);
                        cy.get('[data-testid="Publish-btn"]').click();
                        // Validate
                        cy.get('button[data-testid="Demote to Created-btn"]').should('exist');

                        //Demote to create
                        cy.get('[data-testid="Demote to Created-btn"]').click();

                        //publish as a prototype
                        cy.get('[data-testid="Deploy as a Prototype-btn"]').click();

                        // Deleting the api and api product
                        cy.visit(`/publisher/api-products/${uuidProduct}/overview`);
                        cy.get('#itest-id-deleteapi-icon-button').click();
                        cy.get('#itest-id-deleteconf').click();

                        cy.visit(`/publisher/apis/${uuid}/overview`);
                        cy.get('#itest-api-name-version', { timeout: Cypress.config().largeTimeout });
                        cy.get(`#itest-id-deleteapi-icon-button`).click();
                        cy.get(`#itest-id-deleteconf`).click();

                        cy.logoutFromPublisher();
                    });
                });
            });
        });
    }

    it("Life cycle support for API Products - super admin", {
        retries: {
            runMode: 3,
            openMode: 0,
        },
    }, () => {
        lifeCycleSupportForApiProduct(superTenant);
    });
    it("Life cycle support for API Products - tenant user", {
        retries: {
            runMode: 3,
            openMode: 0,
        },
    }, () => {
        lifeCycleSupportForApiProduct(testTenant);
    });
})