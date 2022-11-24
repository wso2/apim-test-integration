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


describe("admin-10 : Verify SOAP API creation", () => {
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

   /*---------------------------------------------------------------------
    | 
    |  Test Scenario:  Verify Deny policy at API Context level 
    |  - GGo to publisher and create a SOPA API
    |  - Publish API
    |  Assertions:
    |        Assert "API created successfully"
    |        Assert "API published successfully"
    |
    *-------------------------------------------------------------------*/
    it("Verify Super Tenant user can create and publish SOAP API from WSDL URL", () => {
        Portals.logInToPublisher(publisher, password);
        Apis.createSoapAPIFromPhoneverifyEndpoint(apiName,apiContext,apiVersion);
        //publish API
        cy.intercept('**/lifecycle-state').as('lifeCycleStatus');
        cy.get('button[data-testid="publish-btn"]').click()
        cy.contains('Lifecycle state updated successfully')
        cy.wait('@lifeCycleStatus', { requestTimeout: 30000 });
        cy.get('div[data-testid="published-status"]').contains("Published")
    });


    after(function () {
        //cy.loginToPublisher(publisher, password);
        PublisherComonPage.waitUntillLoadingComponentsExit()
        Apis.searchAndDeleteAPIFromPublisher(apiName,apiVersion)
    })



});