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
class APIBasicInfoPage {
    static getUrl(apiID){
        return `publisher/apis/${apiID}/configuration`;
    }
    static getTagsTextBox(){
        return cy.get('#tags')
    }
    static getDefaultVersionYesRadio(){
        return cy.get('input[name="defaultVersion"][value="true"]')
    }
    static getDefaultVersionNoRadio(){
        return cy.get('input[name="defaultVersion"][value="false"]')
    }
    static getThirdPartyYesRadio(){
        return cy.get('input[name="advertised"][value="true"]')
    }
    static getThirdPartyNoRadio(){
        return cy.get('input[name="advertised"][value="false"]')
    }
    static getSaveButton(){
        return cy.get('#design-config-save-btn')
    }
    static getUpdateToolTip(){
        return cy.get('div[role="status"][aria-live="polite"]')
    }
    static getEditDescriptionButton(){
        return cy.get('#edit-api-thumbnail-btn + div > button')
    }
    static getEditThumbnailButton(){
        return cy.get('#edit-api-thumbnail-btn > button')
    }
    static getThumbnailUploadButton(){
        return cy.get('#edit-api-thumbnail-upload-btn')
    }
    static getDescriptionTextArea(){
        return cy.get('#itest-description-textfield')
    }
    static getUpdateContectButton(){
        return cy.get('div[role="dialog"] > header > div > div > div:nth-child(2) > button')
    }
    static getThumbnailFileUpload(){
        return cy.get('input[type="file"]')
    }

    // Actions
    static editDescriptionAndUpdateContent(description){
        this.getEditDescriptionButton().should('be.visible').should("have.text","Edit description").click({force: true})
        this.getDescriptionTextArea().type(description)
        this.getUpdateContectButton().click()
    }
}
export default APIBasicInfoPage;