/*
 * Copyright (c) 2026, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

describe("devportal-001-04 : Verify throttlingPolicyLimit in settings.js controls the number of policies shown in the application creation form", () => {
    const developer = 'developer';
    const password = 'test123';

    // The server has 4 policies but the limit is set to 2, so only 2 should appear.
    const allPolicies = [
        { name: "AppPolicy1", requestCount: 100 },
        { name: "AppPolicy2", requestCount: 200 },
        { name: "AppPolicy3", requestCount: 300 },
        { name: "AppPolicy4", requestCount: 400 },
    ];
    const limit = 2;
    const throttlingPoliciesResponse = {
        count: limit,
        list: allPolicies.slice(0, limit).map(({ name, requestCount }) => ({
            name,
            description: `App throttling policy ${name}`,
            policyLevel: "APPLICATION",
            attributes: {},
            requestCount,
            dataUnit: null,
            unitTime: 1,
            timeUnit: "min",
            rateLimitCount: 0,
            rateLimitTimeUnit: null,
            quotaPolicyType: "REQUESTCOUNT",
            tierPlan: "FREE",
            stopOnQuotaReach: true,
            monetizationAttributes: {
                billingType: null,
                billingCycle: null,
                fixedPrice: null,
                pricePerRequest: null,
                currencyType: null,
            },
            throttlingPolicyPermissions: { type: "ALLOW", roles: ["Internal/everyone"] },
        })),
        pagination: { offset: 0, limit, total: allPolicies.length, next: "", previous: "" },
    };

    it.only("Should display only 2 throttling policies in the dropdown when throttlingPolicyLimit is set to 2", () => {
        // Intercept settings.js to add throttlingPolicyLimit=2 to the response. This simulates the config being set in the server.
        cy.intercept("GET", "**/services/settings/settings.js", (req) => {
            req.reply((res) => {
                if (/"throttlingPolicyLimit"\s*:\s*\d+/.test(res.body)) {
                    res.body = res.body.replace(
                        /"throttlingPolicyLimit"\s*:\s*\d+/,
                        `"throttlingPolicyLimit":${limit}`
                    );
                } else {
                    res.body = res.body.replace(
                        /"app"\s*:\s*\{/,
                        `"app":{"throttlingPolicyLimit":${limit},`
                    );
                }
            });
        }).as("settingsJs");

        cy.intercept(
            "GET",
            "**/throttling-policies/application*",
            { body: throttlingPoliciesResponse }
        ).as("getThrottlingPolicies");

        cy.loginToDevportal(developer, password);
        cy.visit("/devportal/applications/create?tenant=carbon.super");

        // Confirm the API was called with limit=2, proving the config was read.
        cy.wait("@getThrottlingPolicies")
            .its("request.url")
            .should("include", `limit=${limit}`);

        // Open the Per Token Quota dropdown and assert only 2 options are rendered.
        cy.get("#per-token-quota").click();
        cy.get("ul[role='listbox'] li").should("have.length", limit);
    });
});
