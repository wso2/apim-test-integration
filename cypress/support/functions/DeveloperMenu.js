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
import DevportalComonPage from "../pages/devportal/DevportalComonPage";
class DeveloperMenu {

    static goToSubscriptions(){
        cy.get('[data-testid="left-menu-credentials"]').click();
        cy.get('h2[class*="MuiTypography-root"]').contains("Subscriptions");
    }
    static goToTryOut(){
        cy.intercept('**/oauth-keys').as('oauthKeys');
        cy.get('[data-testid="left-menu-test"]').click();
        cy.wait('@oauthKeys');
        DevportalComonPage.waitUntillLoadingComponentsExit();
    }
    static goToApplicationsByURL(tenant){
        cy.intercept('GET','**/applications?**').as('applications');
        cy.visit(`/devportal/applications?tenant=${tenant}`);
        cy.wait('@applications', { requestTimeout: 30000 });
        DevportalComonPage.waitUntillLoadingComponentsExit();
    }


}
export default DeveloperMenu;