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

import Utils from "@support/utils";
import ApisHomePage from "../../../support/pages/publisher/ApisHomePage";
import PublisherMenu from "../../../support/functions/PublisherMenu";
import APIBasicInfoPage from "../../../support/pages/publisher/APIBasicInfoPage";
import DeploymentsPage from "../../../support/pages/publisher/DeploymentsPage";
import LifecyclePage from "../../../support/pages/publisher/LifecyclePage";

describe("publisher-000-05 : Verify API Search creiterias", () => {
    const { publisher, password} = Utils.getUserInfo();
    const randomNmber = getRandomeNumber()
    const apiName1 = "ABC_API_1_" + randomNmber
    const apiVersion1 = "1.0.0"
    const apiContext1 ="ABC_API_1_Context"
    const apiDescription1 = `ABC_API_1_${randomNmber}_desc`
    const api1Tage1 = "ABC_API_1_TAG"
    const api1Endpoint = "https://petstore.swagger.io/v2/store/inventory"
    const api1Status = "blocked"

    const apiName2 = "XYZ_API_2_" + randomNmber
    const apiVersion2 = "2.0.0"
    const apiContext2 ="XYZ_API_2_Context"

    const apiName3 = "PQR_API_3_"  + randomNmber
    const apiVersion3 = "3.3.3"
    const apiContext3 ="PQR_API_3_Context"
    let apiID_1, apiID_2, apiID_3

    before("Create Sample APIS",function () {
        cy.loginToPublisher(publisher, password);
        ApisHomePage.waitUntillLoadingComponentsExit();
        Utils.addAPIWithEndpoints({ name: apiName1, version: apiVersion1, context: apiContext1, endpoint: api1Endpoint}).then((createdApiId1) => {
            apiID_1 = createdApiId1;
            // update basic info
            PublisherMenu.goToBasicInfoByURL(apiID_1)
            cy.wait(5000);
            APIBasicInfoPage.editDescriptionAndUpdateContent(apiDescription1)
            APIBasicInfoPage.getTagsTextBox().type(api1Tage1).type('{enter}')
            APIBasicInfoPage.getSaveButton().click();

            PublisherMenu.goToDeploymentsByURL(apiID_1)
            DeploymentsPage.clickDeployAndWaitUntillComplete();

            PublisherMenu.goTolifecycleByURL(apiID_1);
            cy.wait(5000); // try to handle from API waiting

            LifecyclePage.clickPublishAndWaitUntillComplete();
            LifecyclePage.clickBlockAndWaitUntillComplete();

            Utils.addAPIWithEndpoints({ name: apiName2, version: apiVersion2, context: apiContext2 }).then((createdApiId2) => {
                apiID_2= createdApiId2;
                Utils.addAPIWithEndpoints({ name: apiName3, version: apiVersion3, context: apiContext3}).then((createdApiId3) => {
                    apiID_3= createdApiId3;
                })
            })
        });
    })

    it("Verify API Search creiterias of Publisher", () => { 

        // default/content search
        searchAndVerifyAPIByCreiteria("default",apiName1,apiName1)
        //searchAndVerifyAPIByCreiteria("default",apiVersion3,apiName3)
        searchAndVerifyAPIByCreiteria("default",apiContext2,apiName2)
        searchAndVerifyAPIByCreiteria("default",api1Status,apiName1)
        searchAndVerifyAPIByCreiteria("default",apiDescription1,apiName1)

        // TODO: since all APIs created from "publisher" user we cannot verify this exactly for now.
        // better to create API from a different user and varify this
        ApisHomePage.getSearchTestBox().clear().type("provider:").type("publisher").type("{enter}")
        ApisHomePage.waitUntillLoadingComponentsExit();
        ApisHomePage.getAllVisibleAPIs_divList().should('have.length.least', 3)

        searchAndVerifyAPIByCreiteria("name:",apiName2,apiName2)
        searchAndVerifyAPIByCreiteria("version:",apiVersion3,apiName3)
        searchAndVerifyAPIByCreiteria("context:",apiContext2,apiName2)

        searchAndVerifyAPIByCreiteria("status:",api1Status,apiName1)
        searchAndVerifyAPIByCreiteria("description:",apiDescription1,apiName1)
        searchAndVerifyAPIByCreiteria("tag:",api1Tage1,apiName1)
        //TODO: api-category
        //TODO: property-name
    });

    after("Delete Sample APIs",() => {
        Utils.deleteAPI(apiID_1);
        Utils.deleteAPI(apiID_2);
        Utils.deleteAPI(apiID_3);
    })
})

function getRandomeNumber(){
    return Math.floor(Date.now() / 1000);
}
function searchAndVerifyAPIByCreiteria(SearchCriteria,searchText, expectedAPIName){
    cy.log(`Searching for, Criteria = ${SearchCriteria} and SearchText = ${searchText}`)
    if(SearchCriteria=="default"){
        ApisHomePage.getSearchTestBox().clear().type(searchText).type("{enter}")
        ApisHomePage.waitUntillLoadingComponentsExit()
    }else {
        ApisHomePage.getSearchTestBox().clear().type(SearchCriteria).type(searchText).type("{enter}")
        ApisHomePage.waitUntillLoadingComponentsExit();
    }
    ApisHomePage.getApiLinkOfAPI(expectedAPIName).should('be.visible')
    ApisHomePage.getAllVisibleAPIs_divList().should('have.length', 1)
}