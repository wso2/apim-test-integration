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
class AdminMenu {

    static goToDenyPoliciesByURL(){
        cy.intercept('GET','**/throttling/blacklist').as('getPolicies');
        cy.visit('/admin/throttling/blacklisted')
        cy.wait('@getPolicies', { requestTimeout: 30000 });
        AdminComonPage.waitUntillLoadingComponentsExit()
        AdminComonPage.waitUntillProgressComponentsExit();
    }

    static goToApplicationsByURL(){
        cy.intercept('GET','**/applications?**').as('applications');
        cy.visit('/admin/settings/applications')
        cy.wait('@applications', { requestTimeout: 30000 });
        AdminComonPage.waitUntillLoadingComponentsExit()
        AdminComonPage.waitUntillProgressComponentsExit();
    }

    static goToLogoutURL(){
        cy.visit('/admin/services/logout')
        cy.wait(5000);
    }

}
export default AdminMenu;