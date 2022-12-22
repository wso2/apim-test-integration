
/*
 * Copyright (c) 2021, WSO2 LLC. (http://www.wso2.org) All Rights Reserved.
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

import DevportalComonPage from "../../../support/pages/devportal/DevportalComonPage";
import PublisherComonPage from "../../../support/pages/publisher/PublisherComonPage";
import Portals from "../../../support/functions/Portals";

describe("devportal-000-01 : Verify anonymous user can view public apis", () => {
    const developer = 'developer';
    const publisher = 'publisher';
    const password = 'test123';
    const carbonUsername = 'admin';
    const carbonPassword = 'admin';
    const apiVersion = '2.0.0';
    let randomNumber;
    let apiName;
    let apiContext;

    before(function () {
        cy.loginToPublisher(publisher, password);

        randomNumber = Math.floor(Math.random() * (100000 - 1 + 1) + 1);
        apiName = `anonymousApi`;
        apiContext = `anonymous${randomNumber}`;
        cy.createAndPublishAPIByRestAPIDesign(apiName, apiVersion, apiContext);
        cy.logoutFromPublisher();
        cy.wait(10000)
    })
    it("Verify anonymous user can view public APIs in devportal", () => {
        cy.visit('/devportal/apis?tenant=carbon.super');
        DevportalComonPage.waitUntillLoadingComponentsExit();
        cy.url().should('contain', '/apis?tenant=carbon.super');

        // After publishing the api appears in devportal with a delay.
        // We need to keep refresing and look for the api in the listing page
        // following waitUntilApiExists function does that recursively.
        let remainingAttempts = 30;

        function waitUntilApiExists() {
            let $apis = Cypress.$(`[title="${apiName}"]`);
            if ($apis.length) {
                // At least one with api name was found.
                // Return a jQuery object.
                return $apis;
            }

            if (--remainingAttempts) {
                cy.log('Table not found yet. Remaining attempts: ' + remainingAttempts);

                // Requesting the page to reload (F5)
                cy.reload();

                // Wait a second for the server to respond and the DOM to be present.
                return cy.wait(4000).then(() => {
                    return waitUntilApiExists();
                });
            }
            throw Error('Table was not found.');
        }

        waitUntilApiExists().then($apis => {
            cy.log('apis: ' + $apis.text());
        });
    })

    it("Verify anonymous user can download swagger file from public APIs in devportal", () => {
        cy.visit('/devportal/apis?tenant=carbon.super');
        DevportalComonPage.waitUntillLoadingComponentsExit();
        cy.url().should('contain', '/apis?tenant=carbon.super');
        cy.wait(1000);
        cy.get(`[title="${apiName}"]`, { timeout: 30000 });
        cy.get(`[title="${apiName}"]`).click();
        cy.get('[data-testid="left-menu-overview"]').click();

        // Downloading swagger
        cy.get('#panel1a-header').click();
        cy.get('[data-testid="swagger-download-btn"]').click();

        const downloadsFolder = Cypress.config('downloadsFolder')
        const downloadedFilename = `${downloadsFolder}/swagger.json`;
        cy.readFile(downloadedFilename).its('info.title').should('eq', apiName);
    })

    it("Verify authorized user can download client sdks", () => {
        //cy.loginToDevportal(developer, password);
        //DevportalComonPage.waitUntillLoadingComponentsExit();
        Portals.logInToDevportal();
        cy.visit('/devportal/apis?tenant=carbon.super');
        DevportalComonPage.waitUntillLoadingComponentsExit();
        cy.url().should('contain', '/apis?tenant=carbon.super');
        cy.get(`[title="${apiName}"]`, { timeout: 30000 });
        cy.get(`[title="${apiName}"]`).click();
        cy.get('[data-testid="left-menu-sdk"]').click();
        // Download all sdks one by one
        cy.get('[data-testid="download-sdk-btn"]').each(($btn) => {
            const fileName = $btn.get()[0].getAttribute('data-download-file');
            cy.wrap($btn).click();
            // Downloading SDK
            const downloadsFolder = Cypress.config('downloadsFolder')
            const downloadedFilename = `${downloadsFolder}/${fileName}.zip`;
            cy.wait(5000)
            cy.readFile(downloadedFilename, 'binary', { timeout: 15000 })
                .should(buffer => expect(buffer.length).to.be.gt(100));
        })
        cy.logoutFromDevportal();
    })

    /*
      this should go to a after hook , due to an issue in cypress if test failed in above it block then after block is not execute properly
    */

    it("After block : Cleanup created test data",function () {
        cy.log("Clean created data")
    });

    after(() => {
        cy.loginToPublisher(publisher, password);
        PublisherComonPage.waitUntillLoadingComponentsExit();
        cy.deleteApi(apiName, apiVersion);
    })
})
