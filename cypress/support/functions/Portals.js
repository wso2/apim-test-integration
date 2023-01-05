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
import PublisherComonPage from "../pages/publisher/PublisherComonPage";
import DevportalComonPage from "../pages/devportal/DevportalComonPage";

class Portals {
    static logInToPublisher(username = 'admin', password = 'admin'){
        Cypress.on('uncaught:exception', (err, runnable) => {
            // returning false here prevents Cypress from
            // failing the test
            return false
        });

        var portal = 'publisher';
        Cypress.log({
            name: 'logInToPublisher',
            message: `${username} | ${password}`,
        })
    
        cy.intercept('**/logincontext*').as('logincontext');
        cy.visit(portal);
        cy.wait(3000)
        cy.wait('@logincontext', { requestTimeout: 30000 });
        cy.url().should('contain', `/authenticationendpoint/login.do`);
        cy.get('#usernameUserInput').click();
        cy.get('#usernameUserInput').type(username);
        cy.wait(1000);
        cy.get('#password').type(password);
        cy.wait(1000);
        cy.intercept('**/api/am/publisher/v1/apis?limit**').as('getapis');
        
        //cy.wait(15000)
        const submitElement = 'button[type="submit"]';
        cy.get(submitElement).click();
        //cy.get('#loginForm').submit();
        cy.wait('@getapis', { requestTimeout: 30000 });
        PublisherComonPage.waitUntillLoadingComponentsExit()
        cy.url().should('contain', portal);
        cy.wait(5000);
        cy.log("submit Publisher login")

        // After first submit somtimes screen is freeze in automation, hence here we try another time if submit element exit and visible.
        cy.get("body").then($body => {
            if ($body.find(submitElement).length > 0) {   // is element exit
                cy.get(submitElement).then($button => {
                    if ($button.is(':visible')) { // is element visible
                        cy.wait(15000);
                        cy.log("retry Publisher login")
                        cy.get(submitElement).click();
                        PublisherComonPage.waitUntillLoadingComponentsExit()
                        cy.url().should('contain', portal);
                    }
                });
            }
        });
    }

    static logInToDevportal(username = 'admin', password = 'admin',tenant="carbon.super"){
        var portal = 'devportal';
        Cypress.log({
            name: 'logInToDevportal : ',
            message: `${username} | ${password}`,
        })
        cy.intercept('**/api/am/store/v1/apis?limit**').as('getapis');
        cy.visit(`/devportal/apis?tenant=${tenant}`);
        cy.wait(3000)
        //DevportalComonPage.waitUntillLoadingComponentsExit()
        cy.wait('@getapis', { requestTimeout: 30000 });
        cy.get('[data-testid="itest-devportal-sign-in"]').click();
        cy.url().should('contain', `/authenticationendpoint/login.do`);
        cy.wait(2000);

        cy.get('#usernameUserInput').click();
        cy.get('#usernameUserInput').type(username);
        cy.wait(1000);
        cy.get('#password').type(password);
        cy.wait(1000);
        
        const submitElement = 'button[type="submit"]';
        //cy.get('button[type="submit"]').click();
        cy.get('#loginForm').submit();
        cy.wait('@getapis', { requestTimeout: 30000 });
        DevportalComonPage.waitUntillLoadingComponentsExit()
        cy.url().should('contain', portal);
        cy.wait(5000);
        cy.log("submit Devportal login")

        // After first submit somtimes screen is freeze in automation, hence here we try another time if submit element exit and visible.
        cy.get("body").then($body => {
            if ($body.find(submitElement).length > 0) {   // is element exit
                cy.get(submitElement).then($button => {
                    if ($button.is(':visible')) { // is element visible
                        cy.wait(15000);
                        cy.log("retry Devportal login")
                        cy.get(submitElement).click();
                        PublisherComonPage.waitUntillLoadingComponentsExit()
                        cy.url().should('contain', portal);
                    }
                });
            }
        });


    }

}
export default Portals;