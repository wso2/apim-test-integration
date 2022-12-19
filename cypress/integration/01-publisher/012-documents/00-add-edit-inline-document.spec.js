
/*
 * Copyright (c) 2022, WSO2 LLC. (http://www.wso2.org) All Rights Reserved.
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

import Apis from "../../../support/functions/Apis";
import DevportalComonPage from "../../../support/pages/devportal/DevportalComonPage";
import PublisherComonPage from "../../../support/pages/publisher/PublisherComonPage";
import DeveloperMenu from "../../../support/functions/DeveloperMenu";
import PublisherMenu from "../../../support/functions/PublisherMenu";

describe("publisher-012-00 : Verify an authorized user can create an inline document for the API", () => {
    const publisher = 'publisher';
    const developer = 'developer';
    const password = 'test123';
    const carbonUsername = 'admin';
    const carbonPassword = 'admin';
    const tenant = "carbon.super";
    const random_number = Math.floor(Date.now() / 1000);
    const apiName = 'documentTestAPI' + random_number;
    const swaggerFileName = "petstore_swagger_2.0_store-only.json";
    const apiContext = `/api_${random_number}`;
    const apiVersion = '1.0.2';
    const inlineDoc = `InlineDoc_${random_number}`;

    before(function () {
        //cy.carbonLogin(carbonUsername, carbonPassword);
        //cy.addNewUser(publisher, ['Internal/publisher', 'Internal/creator', 'Internal/everyone'], password);

    })

    it("Authorized user creates an inline document", () => {
        const documentName = 'api document';
        const documentSummery = 'api document summery';
        cy.loginToPublisher(publisher, password);
        cy.wait(4000);
        Apis.createAPIFromPetstoreSwagger2AndPublish(swaggerFileName,apiName,apiContext,apiVersion,"")

        PublisherMenu.goToDocumentationByUI();
        //cy.get('[data-testid="left-menu-itemDocumentation"]').click();

        cy.get('[data-testid="add-new-document-btn"]').click();
        cy.get('[data-testid="doc-name-textbox"]').type(documentName);
        cy.get('[data-testid="doc-summery-textbox"]').click();
        cy.get('[data-testid="doc-summery-textbox"]').type(documentSummery);
        cy.get('[data-testid="add-document-btn"]').click();
        cy.get('button[data-testid="add-content-btn"]').click()
        cy.wait(8000);
        cy.get('div[data-block="true"]').type(inlineDoc)
        cy.wait(5000)
        cy.get('div[role="none presentation"] > div  > div > button:nth-child(3)').click()
        cy.contains("updated successfully.")

        // Checking it's existence
        cy.get('table a').contains(documentName).should('be.visible');
        cy.logoutFromPublisher();
        cy.wait(5000)

    });

    it("Verify that Subscriber should able to see the documentation", () => {
        cy.loginToDevportal(developer, password);
        DevportalComonPage.waitUntillLoadingComponentsExit();
        Apis.searchAndGetAPIFromDevportal(apiName,tenant)
        DeveloperMenu.goToDocumentationByUI();
        cy.contains(inlineDoc);
    });

    it("After Block : clen created test data", () => {
        cy.log("Cleaning data")
    });

    after(function () {
        // Delete created API
        cy.loginToPublisher(publisher, password);
        PublisherComonPage.waitUntillLoadingComponentsExit()
        Apis.searchAndDeleteAPIFromPublisher(apiName,apiVersion)
    })
});