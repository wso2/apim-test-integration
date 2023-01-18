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
class PublisherMenu {

    static goToSubscriptions(){
        cy.get('[data-testid="left-menu-itemsubscriptions"]').click();
        cy.intercept('**/am/publisher/v1/subscriptions/**/subscriber-info').as('subscriptions');
        cy.wait('@subscriptions', { requestTimeout: 30000 });
        cy.get('h2[class*="MuiTypography-root"]').eq(0).contains("Business Plans");
    }
    static goToLifecycle(){
        cy.intercept('**/apis/**/lifecycle-history').as('lifecycleHistory');
        cy.get('[data-testid="left-menu-itemlifecycle"]').click();
        cy.wait('@lifecycleHistory', { requestTimeout: 30000 });
        cy.get('h2[class*="MuiTypography-root"]').eq(0).contains("Lifecycle");
    }
    static goToDocumentationByUI(){
        cy.intercept('GET','**/documents?**').as('documents');
        cy.get('[data-testid="left-menu-itemDocumentation"]').click();
        cy.wait('@documents', { requestTimeout: 30000 });
        PublisherComonPage.waitUntillLoadingComponentsExit();
    }

    static goToRuntimeConfigurations(){
        cy.intercept('GET','**/key-managers').as('runtimeconfig_keyManagers');
        cy.get('[data-testid="left-menu-itemRuntimeConfigurations"]').click();
        cy.wait('@runtimeconfig_keyManagers', { requestTimeout: 30000 });
        PublisherComonPage.waitUntillLoadingComponentsExit();
    }
}
export default PublisherMenu;