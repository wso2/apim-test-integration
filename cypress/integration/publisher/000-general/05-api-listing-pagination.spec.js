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

/*
 * This test asserts the fix added to the public issue
 * https://github.com/wso2/api-manager/issues/798
 */

import Utils from "@support/utils";

describe("API listing pagination persistency", () => {
    const { publisher, password } = Utils.getUserInfo();
    const random_number = Utils.getRandomRange(11, 20);
    let apiIds;

    before(function () {
        cy.loginToPublisher(publisher, password);

        let data;
        let promises = [];
        //Create random number of APIs between 11-20
        for (let i = 0; i < random_number; i++) {
            const endpoint = `https://test.wso2.com/v1/api/endpoint${i}`;
            data = {endpoint};
            promises.push(Utils.addAPIWithEndpoints(data));
        }

        Cypress.Promise.all(promises).then(res => {
            apiIds = res;
        });
    })

    it.only("Check pagination persistency", () => {
        cy.visit(`/publisher/apis`);
        // Change pagination (num of rows) to 15
        cy.get("#pagination-rows").click();
        cy.get("#pagination-menu-list>li").eq(1).click();
        // Reload the page
        cy.reload();
        // Assert the pagination persistency after reloading
        cy.get("#pagination-rows").invoke('text').then(parseFloat).should('eq', 15);
    });

    after(function () {
        apiIds.forEach(id => {
            Utils.deleteAPI(id);
        })
    });
});
