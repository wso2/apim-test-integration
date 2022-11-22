
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
class RolesManagementPage {
    static getUrl(){
        return "/carbon/role/role-mgt.jsp";
    }
    static getRoleNameTextBox(){
        return cy.get('input[name="org.wso2.carbon.role.filter"]');

    }
    static getSearchRolesButton(){
        return cy.get('input[value="Search Roles"]')
    }

    static getDeleteButtonOfRole(roleName){
        return cy.get(`[onClick="deleteUserGroup(\\'${roleName}\\')"]`)
    }

    static getDialogYesButton(){
        return cy.get('div.ui-dialog-buttonset > button.ui-button').first()
    }
    // there can be multiple dialog boxes if we search and delete
    static getDialogOkButton(index){
        return cy.get('.ui-dialog-buttonpane button').eq(index)
    }
    static getNoMatchingRolesFoundDialogBox_MessageInfoDivSelectorOnly(){
        return '#messagebox-info'
    }
    


}

export default RolesManagementPage;