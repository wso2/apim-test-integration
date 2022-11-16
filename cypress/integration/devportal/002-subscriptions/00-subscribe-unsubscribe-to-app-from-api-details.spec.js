/*
 * Copyright (c) 2022, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

describe("devportal-002-00 : Subscribe unsubscribe to application from api details page", () => {
    const { publisher, developer, password, superTenant, testTenant } = Utils.getUserInfo();

    const apiVersion = '2.0.0';
    let apiName;
    const apiContext = apiName;
    let testApiId;
    let appName;
    const appDescription = 'app description';
    let activeTenant;

    const subscribeUnsubscribeToAppFromApi = (tenant) => {
        cy.loginToPublisher(publisher, password, tenant);
        apiName = Utils.generateName();
        Utils.addAPIWithEndpoints({ name: apiName, version: apiVersion, context: apiContext }).then((apiId) => {
            cy.log("API created " + apiName);
            testApiId = apiId;
            Utils.publishAPI(apiId).then((result) => {
                cy.log("API published " + result)
                cy.logoutFromPublisher();
                cy.loginToDevportal(developer, password, tenant);
                appName = Utils.generateName();
                cy.createApp(appName, appDescription, tenant);
                cy.visit(`/devportal/apis?tenant=${tenant}`);
                cy.url().should('contain', `/apis?tenant=${tenant}`);
                cy.visit(`/devportal/apis/${apiId}/overview?tenant=${tenant}`);
                cy.get('#left-menu-credentials').click();
            
                // Click and select the new application
                cy.get('#application-subscribe').click();
                cy.get(`.MuiAutocomplete-popper li`).contains(appName).click();
                cy.get(`#subscribe-to-api-btn`).click();
                cy.get(`#subscription-table td`).contains(appName).should('exist');
            
            });
        });
    }

    it.only("Subscribe and unsubscribe to API from api details page - super admin", {
        retries: {
          runMode: 3,
          openMode: 0,
        },
      }, () => {
        activeTenant = superTenant;
        subscribeUnsubscribeToAppFromApi(superTenant);
    });
    it.only("Subscribe and unsubscribe to API from api details page - tenant user", {
        retries: {
          runMode: 3,
          openMode: 0,
        },
      }, () => {
        activeTenant = testTenant;
        subscribeUnsubscribeToAppFromApi(testTenant);
    });

    afterEach(() => {
        cy.deleteApp(appName, activeTenant);
        Utils.deleteAPI(testApiId);
    })
})