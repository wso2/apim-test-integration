/*
 * Copyright (c) 2022, WSO2 LLC. (http://www.wso2.org) All Rights Reserved.
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
class LifecyclePage {
    static getUrl(apiID){
        return cy.get(`publisher/apis/${apiID}/lifecycle`);
    }
    static getLifecycleHeader(){
        return cy.get('#itest-api-details-lifecycle-head')
    }
    static getPublishButton(){
        return cy.get('button[data-testid="Publish-btn"]')
    }
    static getBlockButton(){
        return cy.get('button[data-testid="Block-btn')
    }


    // composite functions
    static clickPublishAndWaitUntillComplete(){
        cy.intercept('GET', `**/revisions?query=deployed**`).as('revisions');
        this.getPublishButton().click();
        cy.wait('@revisions',{timeout: Cypress.config().largeTimeout}).its('response.statusCode').should('equal', 200)
    }
    static clickBlockAndWaitUntillComplete(){
        cy.intercept('GET', `**/revisions?query=deployed**`).as('revisions');
        this.getBlockButton().click();
        cy.wait('@revisions',{timeout: Cypress.config().largeTimeout}).its('response.statusCode').should('equal', 200)
    }


}
export default LifecyclePage;