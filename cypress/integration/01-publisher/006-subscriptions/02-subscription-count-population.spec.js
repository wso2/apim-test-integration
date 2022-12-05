/*
 * Copyright (c) 2022, WSO2 LLC. (http://www.wso2.org) All Rights Reserved.
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

import PublisherComonPage from "../../../support/pages/publisher/PublisherComonPage";
import DevportalComonPage from "../../../support/pages/devportal/DevportalComonPage";
import Apis from "../../../support/functions/Apis";
import Applications from "../../../support/functions/Applications";
import PublisherMenu from "../../../support/functions/PublisherMenu";
import DeveloperMenu from "../../../support/functions/DeveloperMenu";
import ApplicationPage from "../../../support/pages/devportal/ApplicationPage";


describe("publisher-006-02 : Verify functionalities of subscription count ", () => {
    
    const random_number = Math.floor(Date.now() / 1000);
    const api1Name = `SubcountTest1_${random_number}`
    const api2Name = `SubcountTest2_${random_number}`
    const api3Name = `SubcountTest3_${random_number}`

    const api1Context = `/api1_${random_number}`
    const api2Context = `/api2_${random_number}`
    const api3Context = `/api3_${random_number}`

    const api1Version = '1.0.1';
    const api2Version = '1.0.2';
    const api3Version = '1.0.3';

    const developer = 'developer';
    const publisher = 'publisher';
    const password = 'test123';
    const carbonUsername = 'admin';
    const carbonPassword = 'admin';
    const swaggerFileName = "petstore_swagger_2.0_store-only.json";
    const tenant = "carbon.super";
    const appName = `SubcountTestApp_${random_number}`;
    const appDescription = 'SubcountTestApp';

    Cypress.on('uncaught:exception', (err, runnable) => {
        return false;
    });

    before("Create Test Data ",function () {
        cy.loginToPublisher(publisher, password);
        PublisherComonPage.waitUntillLoadingComponentsExit();
        Apis.createAPIFromPetstoreSwagger2AndPublish(swaggerFileName,api1Name,api1Context,api1Version,"")
        Apis.createAPIFromPetstoreSwagger2AndPublish(swaggerFileName,api2Name,api2Context,api2Version,"")
        Apis.createAPIFromPetstoreSwagger2AndPublish(swaggerFileName,api3Name,api3Context,api3Version,"")

        cy.logoutFromPublisher();
        cy.wait(5000)
    });

     /*---------------------------------------------------------------------
    | 
    |  Test Scenario:  Verify that Active subscription count populated correctly in an application when add remove subscriptions"
    |  - create 3 test APIs in publisher
    |  - create Sample Aplication in devportal
    |  - add apis to application and assert subscription count
    |  - remove apis from application and assert subscription count
    |  Assertions:
    |        when adding subscriptions , count shoud increasing one by one
    |        when removing subscriptions , count shoud decrease one by one
    *-------------------------------------------------------------------*/
    it("Verify that Active subscription count populated correctly in an application when add remove subscriptions",function () {


        cy.loginToDevportal(developer, password);
        DevportalComonPage.waitUntillLoadingComponentsExit();

        // // Create an app and subscribe
        cy.createApp(appName, appDescription);
        DevportalComonPage.waitUntillLoadingComponentsExit();

        //Add subscription and verify subscription count is increasing acordingly
        subscribeAPItoApplication(api1Name)
        asserrtSubscriptionCountIs(1)

        subscribeAPItoApplication(api2Name)
        asserrtSubscriptionCountIs(2)

        subscribeAPItoApplication(api3Name)
        asserrtSubscriptionCountIs(3)

        //Remove subscription and verify subscription count decreasing acordingly

        unSubscribeAPItoApplication(api1Name)
        asserrtSubscriptionCountIs(2)

        unSubscribeAPItoApplication(api2Name)
        asserrtSubscriptionCountIs(1)

        unSubscribeAPItoApplication(api3Name)
        asserrtSubscriptionCountIs(0)

        cy.logoutFromDevportal()
        cy.wait(5000)       
 
    });
    


    /*
      this should go to a after hook , due to an issue in cypress if test failed in above it block then after block is not execute properly
    */
    it("After block : Cleanup created test data",function () {
        cy.log("Clean created data")
    });

    after("Delete Data",function () {

        // Delte application
        cy.loginToDevportal(developer, password);
        DevportalComonPage.waitUntillLoadingComponentsExit();
        Applications.deleteAplication(appName );
        cy.logoutFromDevportal()
        cy.wait(5000)
        cy.log("Aplication is Deleted")
        
       // Delte created API
        cy.loginToPublisher(publisher, password);
        PublisherComonPage.waitUntillLoadingComponentsExit()
        Apis.searchAndDeleteAPIFromPublisher(api1Name,api1Version)
        Apis.searchAndDeleteAPIFromPublisher(api2Name,api2Version)
        Apis.searchAndDeleteAPIFromPublisher(api3Name,api3Version)
        cy.log("Apis are Deleted")
    });


    function subscribeAPItoApplication(apiToSubscribe){
        Apis.searchAndGetAPIFromDevportal(apiToSubscribe,tenant)
        DeveloperMenu.goToSubscriptions();
        Apis.subscribeToapplication(appName)
    };

    function unSubscribeAPItoApplication(apiToSubscribe){
        Apis.searchAndGetAPIFromDevportal(apiToSubscribe,tenant)
        DeveloperMenu.goToSubscriptions();
        Apis.clickUnsubscribOnApplcation(appName)
    };
    
    function asserrtSubscriptionCountIs(expectedCount){
        Applications.searchAndListApplicationFromDevportal(appName,tenant);
        DevportalComonPage.waitUntillLoadingComponentsExit();
        // search result should be unique and should come to the first row to do below assertions
        ApplicationPage.getAppNameTdOfFirstRow().contains(appName)
        ApplicationPage.getAppSubscriptionsTDOfFirstRow().contains(expectedCount)
    }
 
});

