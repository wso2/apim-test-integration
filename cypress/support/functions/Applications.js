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
import DeveloperMenu from "../functions/DeveloperMenu";
class Applications {

    static  searchAndListApplicationFromDevportal(appName,tenant){
        DeveloperMenu.goToApplicationsByURL(tenant)
        cy.get('input[placeholder="Search application by name"]').clear().type(appName);
        cy.intercept('GET','**/applications?**').as('applications');
        cy.get('button > [class="MuiButton-label"]').contains("Search").click();
        cy.wait('@applications', { requestTimeout: 30000 });
        cy.wait(5000)
    }

    static deleteAplication(appName){
        cy.visit('/devportal/applications?tenant=carbon.super');
        DevportalComonPage.waitUntillLoadingComponentsExit();
        cy.wait(3000)
        cy.get(`[data-testid="delete-${appName}-btn"]`, { timeout: 30000 });
        cy.get(`[data-testid="delete-${appName}-btn"]`).click();
        cy.get(`[data-testid="application-delete-confirm-btn"]`).click();
    }
    


}
export default Applications;