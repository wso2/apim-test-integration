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

import PublisherComonPage from "../../../support/pages/publisher/PublisherComonPage";
import Apis from "../../../support/functions/Apis";
import Portals from "../../../support/functions/Portals";


describe("publisher-001-07 : Verify swagger validation", () => {
    //const apiName = 'SoapAPI' + Math.floor(Date.now() / 1000);
    const apiVersion = '1.0.0';
    const random_number = Math.floor(Date.now() / 1000);
    const apiName = 'SoapAPI' + random_number;
    const apiContext = `/soapcontext_${random_number}`
    const appDescription = 'change tier app description';
    const developer = 'developer';
    const publisher = 'publisher';
    const password = 'test123';
    const carbonUsername = 'admin';
    const carbonPassword = 'admin';

    Cypress.on('uncaught:exception', (err, runnable) => {
        return false;
    });

   /*---------------------------------------------------------------------
    | 
    |  Test Scenario:  Verify swagger Ui validation on Resources page for SOAP UI
    |  - Go to publisher and create a SOPA API
    |  - Go to Resource page of the API and delete the last resource
    |  Assertions:
    |        Verify user cannot save an API without anyone http method
    |
    *-------------------------------------------------------------------*/

    it("Verify swagger Ui validation on Resources page for SOAP UI", () => {

        Portals.logInToPublisher(publisher, password);
        Apis.createSoapAPIFromPhoneverifyEndpoint(apiName,apiContext,apiVersion);

        cy.intercept('**/swagger').as('swagger');
        cy.get('a[data-testid="left-menu-itemresources"]').click()
        cy.wait('@swagger', { requestTimeout: 30000 });
        PublisherComonPage.waitUntillLoadingComponentsExit();
        PublisherComonPage.waitUntillProgressComponentsExit();

        // Delete resource and Verify user cannot save an API without anyone http method
        cy.get('div[data-testid="operation-/*-post"] >div >div > div:nth-child(4)>div>button[aria-label="delete operation"]').click()
        cy.get('button[data-testid="resources-save-operations"]').click()
        cy.contains('At least one operation is required for the API')

    });

});