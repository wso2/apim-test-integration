/*
 * Copyright (c) 2023, WSO2 LLC. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
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

describe("publisher-012-01 : creating documents with different visibilities", () => {
    const apiName = Utils.generateName();
    const apiVersion = '1.0.0';
    const { publisher,developer, password, superTenant, testTenant} = Utils.getUserInfo();
    const addEditInlineDocument = (tenant) => {
        cy.loginToPublisher(publisher, password, tenant);
        const documentName1 = 'SameAsAPI';
        const documentSummary1 = 'Visibility same as API';
        const documentName2 = 'OwnersOnly';
        const documentSummary2 = 'Visibility owners only';
        const documentName3 = 'Private';
        const documentSummary3 = 'Visibility private';
        Utils.addAPIWithEndpoints({ name: apiName, version: apiVersion }).then((apiId) => {
            cy.visit({url:`/publisher/apis/${apiId}/overview`, retryOnStatusCodeFailure: true});
            cy.get('#itest-api-details-portal-config-acc').click();
            cy.get('#left-menu-itemdocuments').click();

            cy.get('#add-new-document-btn').click();
            cy.get('#doc-name').type(documentName1);
            cy.get('#doc-summary').click();
            cy.get('#doc-summary').type(documentSummary1);
            cy.get('#docVisibility-selector').scrollIntoView().click();
            cy.get('#public-visibility-selector').scrollIntoView().click();
            cy.get('#add-document-btn').scrollIntoView();
            cy.get('#add-document-btn').click();
            cy.get('#add-content-back-to-listing-btn').click();

            cy.get('[data-testid="add-document-btn"]').click({force:true});
            cy.get('#doc-name').type(documentName2);
            cy.get('#doc-summary').click();
            cy.get('#doc-summary').type(documentSummary2);
            cy.get('#docVisibility-selector').scrollIntoView().click();
            cy.get('#owners-only-visibility-selector').scrollIntoView().click();
            cy.get('#add-document-btn').scrollIntoView();
            cy.get('#add-document-btn').click();
            cy.get('#add-content-back-to-listing-btn').click();

            cy.get('[data-testid="add-document-btn"]').click({force:true});
            cy.get('#doc-name').type(documentName3);
            cy.get('#doc-summary').click();
            cy.get('#doc-summary').type(documentSummary3)
            cy.get('#docVisibility-selector').scrollIntoView().click();
            cy.get('#private-visibility-selector').scrollIntoView().click();
            cy.get('#add-document-btn').scrollIntoView();
            cy.get('#add-document-btn').click();
            cy.get('#add-content-back-to-listing-btn').click();
        
            // Checking Documents existence
            cy.get('table a').contains(documentName3).should('be.visible');

            // Deploying
            cy.get('#left-menu-itemdeployments').click();
            cy.wait(2000);
            cy.get('#add-description-btn').click();
            cy.get('#add-description').click();
            cy.get('#add-description').type('test');
            cy.get('#deploy-btn').should('not.have.class', 'Mui-disabled').click();
            cy.get('#undeploy-btn').should('not.have.class', 'Mui-disabled').should('exist');

            // Publishing
            cy.get('#left-menu-itemlifecycle').click();
            cy.wait(2000);
            cy.get('[data-testid="Publish-btn"]').click();

            cy.logoutFromPublisher();

            // View the documents in devportal
            viewDocumentsBydeveloper(tenant, apiId);
            viewDocumentsBySwitchingdeveloportal(tenant, apiId);

            cy.loginToPublisher(publisher, password, tenant);
                // Test is done. Now delete the api
                Utils.deleteAPI(apiId);

            });
    }

    const viewDocumentsBydeveloper = (tenant, apiId) => {
        if (tenant == superTenant) {
            cy.loginToDevportal(developer, password, superTenant);
            cy.visit(`/devportal/apis/${apiId}/overview?tenant=${tenant}`);
            cy.get('[aria-label="Available document list"]').should('contain', 'SameAsAPI');
            cy.get('[aria-label="Available document list"]').should('contain', 'OwnersOnly');
            cy.get('[aria-label="Available document list"]').should('not.contain', 'Private');
            cy.logoutFromDevportal();
        }else {
            cy.loginToDevportal(developer, password, testTenant);
            cy.visit(`/devportal/apis/${apiId}/overview?tenant=${tenant}`);
            cy.get('[aria-label="Available document list"]').should('contain', 'SameAsAPI');
            cy.get('[aria-label="Available document list"]').should('contain', 'OwnersOnly');
            cy.get('[aria-label="Available document list"]').should('not.contain', 'Private');
            cy.get('#switchDevPortal').click();
            cy.get('#tenantList_wso2com').click();
            cy.logoutFromDevportal();
        }
    }

    const viewDocumentsBySwitchingdeveloportal = (tenant, apiId) => {
        if (tenant == superTenant) {
            cy.loginToDevportal(developer, password, testTenant);
            cy.get('#switchDevPortal').click();
            cy.get('#tenantList_carbonsuper').click();
            cy.visit(`/devportal/apis/${apiId}/overview?tenant=${tenant}`);
            cy.get('[aria-label="Available document list"]').should('contain', 'SameAsAPI');
            cy.get('[aria-label="Available document list"]').should('not.contain', 'OwnersOnly');
            cy.get('[aria-label="Available document list"]').should('not.contain', 'Private');
            cy.get('#switchDevPortal').click();
            cy.get('#tenantList_wso2com').click();
            cy.logoutFromDevportal();
        }
    }

    it.only("Creating inline document - super admin", () => {
        addEditInlineDocument(superTenant);
           
    });
    it.only("Creating inline document - tenant user", () => {
        addEditInlineDocument(testTenant);
    });
});

