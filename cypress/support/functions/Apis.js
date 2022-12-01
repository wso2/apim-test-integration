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
import PublisherComonPage from "../pages/publisher/PublisherComonPage";
import DevportalComonPage from "../pages/devportal/DevportalComonPage";

class Apis {
    static createAPIFromPetstoreSwagger2AndPublish(fileName,apiName,apiContext,apiVersion,businessPlan){
        cy.visit(`/publisher/apis`);
        PublisherComonPage.waitUntillLoadingComponentsExit();
        // select the option from the menu item
        cy.get('[data-testid="itest-id-createapi"]').click();
        cy.get('[data-testid="create-api-open-api"]').click();
        cy.get('[data-testid="open-api-file-select-radio"]').click();
    
        // upload the swagger
        cy.get('[data-testid="browse-to-upload-btn"]').then(function () {
            const filepath = `api_artifacts/${fileName}`
            cy.get('input[type="file"]').attachFile(filepath)
        });
    
        // go to the next step
        cy.get('[data-testid="api-create-next-btn"]').click();
    
        // Fill the second step form
        if (apiName) {
    
            cy.get('[data-testid="itest-id-apiname-input"]').clear().type(apiName);
            cy.get('[data-testid="itest-id-apicontext-input"] input').click();
            cy.get('[data-testid="itest-id-apicontext-input"] input').clear().type(apiContext);
        }
        cy.get('#itest-id-apiversion-input').clear().type(apiVersion)
        cy.get('#itest-id-apiendpoint-input').clear().type("https://petstore.swagger.io/v2/");
        cy.get('[data-testid="select-policy-dropdown"]').click();
        cy.get('[data-testid="policy-item-Silver"]').click();
        cy.get('[data-testid="policy-item-Unlimited"]').click();
        cy.get('#menu-policies').click('topLeft');
    
        // validate
        cy.intercept('**/lifecycle-state').as('lifeCycleStatus');
        // finish the wizard
        cy.get('[data-testid="api-create-finish-btn"]').click();
        cy.contains("API created successfully")
        cy.wait('@lifeCycleStatus', { requestTimeout: 30000 });
    
        // publish
        cy.get('[data-testid="publish-btn"]', { timeout: 30000 });
        cy.get('[data-testid="publish-btn"]').click();
        
        cy.get('[data-testid="published-status"]', { timeout: 30000 });
        cy.get('[data-testid="published-status"]').contains('Published').should('exist');
    }

    static createSoapAPIFromPhoneverifyEndpoint(apiName,apiContext,apiVersion){
        cy.visit("publisher/apis/create/wsdl")
        PublisherComonPage.waitUntillLoadingComponentsExit();

        cy.intercept('**/apis/validate-wsdl').as('validateWsdl');
        cy.get("#outlined-full-width").type("http://ws.cdyne.com/phoneverify/phoneverify.asmx?wsdl")
        cy.get('input[value="url"]').click(); // this is to trigger url validation on above key entry event
        cy.wait('@validateWsdl', { requestTimeout: 30000 });
        cy.get("button>span").contains("Next").click()

        cy.get('#itest-id-apiname-input').type(apiName);
        cy.get('#itest-id-apicontext-input').type(apiContext)
        cy.get('#itest-id-apiversion-input').type(apiVersion)
        cy.get('#itest-id-apiendpoint-input').type('http://ws.cdyne.com/phoneverify/phoneverify.asmx')
        cy.get('[data-testid="select-policy-dropdown"]').click();
        cy.get('[data-testid="policy-item-Unlimited"]').click();
        cy.get('#menu-policies').click('topLeft');

        cy.intercept('**/lifecycle-state').as('lifeCycleStatus');
        cy.get("button>span").contains("Create").click()
        cy.contains("API created successfully")
        cy.wait('@lifeCycleStatus', { requestTimeout: 30000 });
        PublisherComonPage.waitUntillLoadingComponentsExit();
    }

    static searchAndDeleteAPIFromPublisher(apiName,version){
        // Delete the API from publisher
        cy.visit(`/publisher/apis`);
        cy.intercept('**/apis*').as('getApis');
        cy.wait('@getApis', { requestTimeout: 30000 });
        PublisherComonPage.waitUntillLoadingComponentsExit();
        cy.get('#searchQuery').clear().type(apiName).type('{enter}')
        cy.wait(3000)
        cy.get(`[id="${apiName}${version}-delete-button"]`, { timeout: 30000 });
        cy.get(`[id="${apiName}${version}-delete-button"]`).click();
        cy.intercept('DELETE','**/publisher/v1/apis/**').as('deleteAPI'); 
        cy.get('[data-testid="itest-id-deleteconf"]').click();
        cy.wait('@deleteAPI', { requestTimeout: 30000 });
    }

    /*
        e.g. tenant = "carbon.super"
    */
    static searchAndGetAPIFromDevportal(apiName,tenant){
        cy.visit(`/devportal/apis?tenant=${tenant}`);
        DevportalComonPage.waitUntillLoadingComponentsExit();
        cy.url().should('contain', '/apis?tenant=carbon.super');
        cy.get('#searchQuery').clear().type(apiName).type('{enter}')
        cy.wait(3000)
        cy.get(`[title="${apiName}"]`, { timeout: 30000 });
        cy.get(`[title="${apiName}"]`).click();
        DevportalComonPage.waitUntillLoadingComponentsExit();
    }

    static searchAndGetAPIFromPublisher(apiName){
        cy.visit('publisher/apis');
        PublisherComonPage.waitUntillLoadingComponentsExit();
        cy.get('#searchQuery').clear().type(apiName).type('{enter}')
        cy.wait(3000)
        cy.get(`[title="${apiName}"]`, { timeout: 30000 });
        cy.get(`[title="${apiName}"]`).click();
        PublisherComonPage.waitUntillLoadingComponentsExit();
    }

    static subscribeToapplication(appName){
        cy.get('#application-subscribe').click();
        cy.get(`.MuiAutocomplete-popper li`).contains(appName).click();
        cy.get(`[data-testid="subscribe-to-api-btn"]`).click();
        cy.get(`[data-testid="subscription-table"] td`).contains(appName).should('exist');
    }

    static clickUnsubscribOnApplcation(appName){
        cy.intercept('**/subscriptions/**').as('deleteSubscriptions');
        cy.get(`#${appName}-UN`).click()
        cy.contains("Subscription deleted successfully!")
        cy.wait('@deleteSubscriptions', { requestTimeout: 30000 });
    }
    static clickBlockAPIOnLIfecycleInPublisher(){
        cy.intercept('**/change-lifecycle?**').as('lifecycleChange');
        cy.get('[data-testid="Block"]').click();
        cy.contains("Lifecycle state updated successfully")
        cy.wait('@lifecycleChange', { requestTimeout: 30000 });
    }
    static clickRePublishAPIOnLIfecycleInPublisher(){
        cy.intercept('**/change-lifecycle?**').as('lifecycleChange');
        cy.get('[data-testid="Re-Publish"]').click();
        cy.contains("Lifecycle state updated successfully")
        cy.wait('@lifecycleChange', { requestTimeout: 30000 });
    }
    static getAPIRequestBaseURL(){
        const requestURL = Cypress.config().baseUrl.replace("9443", "8243");
        cy.log(requestURL)
    }
    

}
export default Apis;