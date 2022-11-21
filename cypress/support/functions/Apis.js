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

class Apis {
    static createAPIFromPetstoreSwagger2AndPublish(apiName,apiContext,apiVersion,businessPlan){
        cy.visit(`/publisher/apis`);
        PublisherComonPage.waitUntillLoadingComponentsExit();
        // select the option from the menu item
        cy.get('[data-testid="itest-id-createapi"]').click();
        cy.get('[data-testid="create-api-open-api"]').click();
        cy.get('[data-testid="open-api-file-select-radio"]').click();
    
        // upload the swagger
        cy.get('[data-testid="browse-to-upload-btn"]').then(function () {
            const filepath = 'api_artifacts/swagger_2.0.json'
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

}
export default Apis;