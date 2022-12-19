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
import AdminMenu from "../functions/AdminMenu";

class AdminSettings {

    static changeApplicationOwner(appName,currentOwner, newOwner){
        AdminMenu.goToApplicationsByURL();

        cy.get('input[placeholder="Search by Application Name"]').clear().type(appName)
        cy.wait(3000)
        cy.get('td[data-testid="MuiDataTableBodyCell-1-0"]').contains(appName) // this is to verify searched app is rendered in the first row
        cy.get('td[data-testid="MuiDataTableBodyCell-3-0"] > div > span[role="button"]').click()
        cy.get('input[name="name"]').should("have.value",appName);
        cy.get('input[name="owner"]').should("have.value",currentOwner);
        cy.get('input[name="owner"]').clear().type(newOwner)

        cy.intercept('**/change-owner?**').as('changeOwner');
        cy.get('span[class="MuiButton-label"]').contains("Save").click()
        cy.contains('Application owner changed successfully')
        cy.wait('@changeOwner', { requestTimeout: 30000 });
        cy.get(3000)
        cy.get('input[placeholder="Search by Application Name"]').clear().type(appName)
        cy.wait(3000)
        cy.get('td[data-testid="MuiDataTableBodyCell-2-0"]').contains(newOwner)
    }
}
export default AdminSettings;