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

describe("devportal-000-02 : Login logout from devportal", () => {
    const { developer, password, testTenant, superTenant } = Utils.getUserInfo();

    it.only("Login logout from devportal - super admin", {
        retries: {
          runMode: 3,
          openMode: 0,
        },
      }, () => {
        cy.loginToDevportal(developer, password, superTenant);
        cy.logoutFromDevportal();
    });

    it.only("Login logout from devportal - tenant user", {
        retries: {
          runMode: 3,
          openMode: 0,
        },
      }, () => {
        cy.loginToDevportal(developer, password, testTenant);
        cy.logoutFromDevportal();
    });
})