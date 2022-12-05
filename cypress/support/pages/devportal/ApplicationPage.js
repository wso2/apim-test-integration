import DevportalComonPage from "./DevportalComonPage";

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
class ApplicationPage extends DevportalComonPage{
    getUrl(tenant){
        return `devportal/applications?tenant=${tenant}r`;
    }

    static getAppNameTdOfFirstRow(){
       return cy.get('table[data-testid="application-listing-table"] > tbody > tr > td:nth-child(1)')
    }
    static getAppOwnerTDOfFirstRow(){
        return cy.get('table[data-testid="application-listing-table"] > tbody > tr > td:nth-child(2)')
    }
    static getAppPolicyTDOfFirstRow(){
        return cy.get('table[data-testid="application-listing-table"] > tbody > tr > td:nth-child(3)')
    }
    static getAppWorkflowStatusTDOfFirstRow(){
        return cy.get('table[data-testid="application-listing-table"] > tbody > tr > td:nth-child(4)')
    }
    static getAppSubscriptionsTDOfFirstRow(){
        return cy.get('table[data-testid="application-listing-table"] > tbody > tr > td:nth-child(5)')
    }
}
export default ApplicationPage;