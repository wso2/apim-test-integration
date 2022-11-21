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
import AdminComonPage from "../pages/admin/AdminComonPage";
class AdminRateLimitingPolicies {

    /*
    Format : ${context} 
    Eg : /test/1.0.0
    */
    static Denypolicies_AddAPIContextPolicy(apiContext){
        cy.get('.MuiButton-label').contains('Add Policy').click();
        cy.get('input[value="API"]').click();
        cy.get('input[name="conditionValue"]').type(apiContext);
        cy.get('button.MuiButton-containedPrimary > span').contains('Deny').click();
        cy.contains('Deny Policy added successfully.')
        cy.contains(apiContext)
    }
    static Denypolicies_AddApplicationPolicy(applicationValue){
        cy.get('.MuiButton-label').contains('Add Policy').click();
        cy.get('input[value="APPLICATION"]').click();
        cy.get('input[name="conditionValue"]').type(applicationValue);
        cy.get('button.MuiButton-containedPrimary > span').contains('Deny').click();
        cy.contains('Deny Policy added successfully.')
        cy.contains(applicationValue)
    }

    static Denypolicies_AddUserPolicy(userValue){
        cy.get('.MuiButton-label').contains('Add Policy').click();
        cy.get('input[value="USER"]').click();
        cy.get('input[name="conditionValue"]').type(userValue);
        cy.get('button.MuiButton-containedPrimary > span').contains('Deny').click();
        cy.contains('Deny Policy added successfully.')
        cy.contains(userValue)
    }

    static deleteAllDenyPoliocies(){    
            cy.get('body').then(($body) => {
                var appCount=0;
                appCount = $body.find(`div[data-testid="Application-actions"]`).length
                if ($body.find(`div[data-testid="Application-actions"]`).length > 0) {
                    appCount = $body.find(`div[data-testid="Application-actions"]`).length
    
                    while(appCount>0){
                        cy.get(`div[data-testid="Application-actions"] > span`).first().click();
                        cy.intercept("DELETE", "**/throttling/blacklist/**").as("application")
                        cy.get('button > span').contains('Delete').click();
                        cy.contains('Deny Policy successfully deleted.')
                        cy.wait('@application', { requestTimeout: 30000 });
                        AdminComonPage.waitUntillProgressComponentsExit();
                        appCount -= 1;
                    }
                }
                
                if ($body.find(`div[data-testid="API-actions"]`).length > 0) {
                    cy.wait(2000)
                    appCount = $body.find(`div[data-testid="API-actions"]`).length
                    while(appCount>0){
                        cy.get(`div[data-testid="API-actions"] > span`).first().click();
                        cy.intercept("DELETE", "**/throttling/blacklist/**").as("application")
                        cy.get('button > span').contains('Delete').click();
                        cy.contains('Deny Policy successfully deleted.')
                        cy.wait('@application', { requestTimeout: 30000 });
                        AdminComonPage.waitUntillProgressComponentsExit();
                        appCount -= 1;
                    }
                }

                if ($body.find(`div[data-testid="USER-actions"]`).length > 0) {
                    cy.wait(2000)
                    appCount = $body.find(`div[data-testid="USER-actions"]`).length
                    while(appCount>0){
                        cy.get(`div[data-testid="USER-actions"] > span`).first().click();
                        cy.intercept("DELETE", "**/throttling/blacklist/**").as("application")
                        cy.get('button > span').contains('Delete').click();
                        cy.contains('Deny Policy successfully deleted.')
                        cy.wait('@application', { requestTimeout: 30000 });
                        AdminComonPage.waitUntillProgressComponentsExit();
                        appCount -= 1;
                    }
                }
                
                if ($body.find(`div[data-testid="IP-actions"]`).length > 0) {
                    cy.wait(2000)
                    appCount = $body.find(`div[data-testid="IP-actions"]`).length
                    while(appCount>0){
                        cy.get(`div[data-testid="IP-actions"] > span`).first().click();
                        cy.intercept("DELETE", "**/throttling/blacklist/**").as("application")
                        cy.get('button > span').contains('Delete').click();
                        cy.contains('Deny Policy successfully deleted.')
                        cy.wait('@application', { requestTimeout: 30000 });
                        AdminComonPage.waitUntillProgressComponentsExit();
                        appCount -= 1;
                    }
                }
                cy.wait(2000)
            });
    }


}
export default AdminRateLimitingPolicies;