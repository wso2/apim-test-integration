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
class DocumentsPage {
    static getUrl(apiID){
        return cy.get(`publisher/apis/${apiID}/documents`);
    }
    static getDocumentsHeader(){
        return cy.get('#itest-api-details-documents-head')
    }
    static getAddNewDocumentButton(){
        return cy.get('#add-new-document-btn')
    }
    static getNameTextBox(){
        return cy.get('#doc-name')
    }
    static getSummaryTextBox(){
        return cy.get('#doc-summary')
    }
    static getType_HowToCheckBox(){
        return cy.get('input[value="HOWTO"]')
    }
    static getSource_InLineCheckBox(){
        return cy.get('input[value="INLINE"]')
    }
    static getAddDocumentButton(){
        return cy.get('#add-document-btn')
    }
    static getBackToListiningButton(){
        return cy.get('#add-content-back-to-listing-btn')
    }
    static getDocumentNameOfTableRow(tableRowIndex){ // start form 0
        return cy.get(`td[data-testid="MuiDataTableBodyCell-1-${tableRowIndex}"]`)
    }
}
export default DocumentsPage;