/*
 * Copyright (c) 2023, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

describe("publisher-001-06 : Create api with version in context", () => {

    const { publisher, password, tenantUser, testTenant, } = Utils.getUserInfo();
    let testApiID;
    const apiName = `sample_api`;
    const apiVersion = '1.0.0';
    const apiContext = `/{version}/sample_context`;
    const apiContextWithVersion = `/1.0.0/sample_context`;

    const createApiwithVersionContext = () => {
        // select the option from the menu item
        cy.visit(`/publisher/apis/create/rest`);

        cy.get('#itest-id-apiname-input', {timeout: Cypress.config().largeTimeout}).type(apiName);
        cy.get('#itest-id-apicontext-input').click();
        cy.get('#itest-id-apicontext-input').type(apiContext);
        cy.get('#itest-id-apiversion-input').click();
        cy.get('#itest-id-apiversion-input').type(apiVersion);
        cy.get('#itest-id-apiendpoint-input').click();
        cy.get('#itest-id-apiendpoint-input').type('https://petstore3.swagger.io/api/v3/openapi.json');
        cy.get('#itest-id-apiversion-input').click();
        cy.get('body').click(0,0);
        cy.get('#itest-id-apicreatedefault-createnpublish').click({force:true});
    
        // Wait for the api to load
        cy.get('#itest-api-name-version', {timeout: Cypress.config().largeTimeout}).should('be.visible');
        cy.get('#itest-api-name-version').contains(apiVersion);

        cy.url().then(url => {
            testApiID = /apis\/(.*?)\/overview/.exec(url)[1];

        });

        describe('Check URL inclusion', () => {
          it('checks if URL is included', () => {
            cy.visit(`/publisher/apis/${testApiID}/test-console`);
            cy.get('select').should('contain', `https://localhost:8243${apiContextWithVersion}`)
          })
        })
    }
    afterEach(() => {
        Utils.deleteAPI(testApiID);

    })
    it("Create API with context includes version variable", {
        retries: {
          runMode: 3,
          openMode: 0,
        },
      }, () => {
        cy.loginToPublisher(publisher, password);
        createApiwithVersionContext();
    });
})
