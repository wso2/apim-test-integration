/*
 * Copyright (c) 2023, WSO2 LLC. (http://www.wso2.org) All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import Utils from "@support/utils";

function getSuperTenantEmail(username){
    return `${username}@test.com`;
}

describe("Self Signup", () => {
    const {publisher, password, carbonUsername, carbonPassword} = Utils.getUserInfo();
    const testTenant = 'wso2.com';
    const superTenant = 'carbon.super';
    const devPortal = 'devportal';
    const adminPortal = 'admin';
    const firstName = 'firstName';
    const lastName = 'lastName';
    const superTenant1Username = 'superTenant1';
    const superTenant2Username = 'superTenant2'; 
    const superTenant3Username = 'superTenant3';  
    const tenant1Username = 'tenant1'; 
    const tenant2Username = 'tenant2';
    const tenant3Username = 'tenant3';
    const incorrectUsername = 'incorrectUsername';
    const incorrectPassword = 'incorrectPassword';
    const tenantAdminUsername = 'admin';
    const tenantAdminPassword = 'admin';
         
it.only("Verify default self-signup behaviour of the super tenant", () => {
    cy.addNewUserUsingSelfSignUp(superTenant1Username, password, firstName, lastName, getSuperTenantEmail(superTenant1Username), superTenant);
    cy.addExistingUserUsingSelfSignUp(superTenant1Username, superTenant);
    cy.portalLogin(superTenant1Username, password, superTenant, devPortal);
    cy.logoutFromDevportal();
});

it.only("Verify default self-signup behaviour of the wso2 tenant", () => {
    cy.addNewUserUsingSelfSignUp(Utils.getTenentUser(tenant1Username, testTenant), password, firstName, lastName, Utils.getTenentUser(tenant1Username, testTenant), testTenant);
    cy.addExistingUserUsingSelfSignUp(Utils.getTenentUser(tenant1Username, testTenant), testTenant);
    cy.portalLogin(tenant1Username, password, testTenant, devPortal,);
    cy.logoutFromDevportal();
});

it.only("Verify login to the devPortal using incorrect user credentials", () => {
    cy.portalLoginUsingIncorrectUserCredentials(incorrectUsername, incorrectPassword, devPortal, testTenant);
});

it.only("Test - Login to the publisher portal using incorrect user credentials", () => {
    cy.portalLoginUsingIncorrectUserCredentials(incorrectUsername, incorrectPassword, publisher, superTenant);
});

it.only("Test - Login to the admin portal using incorrect user credentials", () => {
    cy.portalLoginUsingIncorrectUserCredentials(incorrectUsername, incorrectPassword, adminPortal, superTenant);
});

it.only("Test - Login to the carbon using incorrect user credentials", () => {
    cy.carbonLogin(incorrectUsername, incorrectPassword);
    cy.contains('Login failed! Please recheck the username and password and try again.').should('exist');
});

it.only("Test - Login to the publisher using newly created user(superTenant1) credentials", () => {
    cy.portalLogin(superTenant1Username, password, superTenant, publisher);
    cy.contains('Error 403 : Forbidden').should('exist');
    cy.contains('The server could not verify that you are authorized to access the requested resource.').should('exist');
    cy.logoutFromPublisher();
});

it.only("Test - Login to the admin portal using newly created user(superTenant1) credentials", () => {
    cy.portalLogin(superTenant1Username, password, superTenant, adminPortal);
    cy.contains('Error 403 : Forbidden').should('exist');
    cy.contains('The server could not verify that you are authorized to access the requested resource.').should('exist');
    cy.logoutFromAdminPortal();
});

it.only("Test - Login to the carbon using newly created user(superTenant1) credentials", () => {
    cy.carbonLogin(superTenant1Username, password);
    cy.get('#region1_dashboard_main_menu').should('not.exist');
    cy.get('#region3_registry_menu').should('not.exist');
    cy.get('#region3_metadata_menu').should('not.exist');
    cy.carbonLogout();
});

it.only("Test - Disable self signup from the carbon portal for the super tenant", () => {
    cy.disableSelfSignUpInCarbonPortal(carbonUsername, carbonPassword, superTenant);
    cy.visit(`${Utils.getAppOrigin()}/devportal/apis?tenant=${superTenant}`);
    cy.get('#itest-devportal-sign-in').click();
    cy.get('#registerLink').click();
    cy.get('#username').type(superTenant2Username);
    cy.get('#registrationSubmit').click();
    cy.contains(`Self registration is disabled for tenant - ${superTenant}`).should('exist');
});

it.only("Test - Disable self signup from the carbon portal for the wso2 tenant", () => {
    cy.disableSelfSignUpInCarbonPortal(tenantAdminUsername, tenantAdminPassword, testTenant);
    cy.visit(`${Utils.getAppOrigin()}/devportal/apis?tenant=${testTenant}`);
    cy.get('#itest-devportal-sign-in').click();
    cy.get('#registerLink').click();
    cy.get('#username').type(Utils.getTenentUser(tenant2Username, testTenant));
    cy.get('#registrationSubmit').click();
    cy.contains(`Self registration is disabled for tenant - ${testTenant}`).should('exist');
});

it.only("Test - Enable self signup back for the super tenant", () => {
    cy.enableSelfSignUpInCarbonPortal(carbonUsername, carbonPassword, superTenant);
    cy.addNewUserUsingSelfSignUp(superTenant3Username, password, firstName, lastName, getSuperTenantEmail(superTenant3Username), superTenant);
    cy.portalLogin(superTenant3Username, password, superTenant, devPortal,);
    cy.logoutFromDevportal();
});

it.only("Test - Enable self signup back for the wso2 tenant", () => {
    cy.enableSelfSignUpInCarbonPortal(tenantAdminUsername, tenantAdminPassword, testTenant);
    cy.addNewUserUsingSelfSignUp(Utils.getTenentUser(tenant3Username, testTenant), password, firstName, lastName, Utils.getTenentUser(tenant3Username, testTenant), testTenant);
    cy.portalLogin(tenant3Username, password, testTenant, devPortal,);
    cy.logoutFromDevportal();
});

it.only("Test - Create a user for a unregistered tenant", () => {
    cy.visit(`${Utils.getAppOrigin()}/devportal/apis?tenant=${testTenant}`);
    cy.get('#itest-devportal-sign-in').click();
    cy.get('#registerLink').click();
    cy.get('#username').type('test@abc.com');
    cy.get('#registrationSubmit').click();
    cy.contains(`Invalid tenant domain - abc.com`).should('exist');
});

after(function () {
    cy.carbonLogin(carbonUsername, carbonPassword);
    // delete all the created users for super tenant
    cy.visit(`${Utils.getAppOrigin()}/carbon/user/user-mgt.jsp`);
    cy.deleteUser(superTenant1Username);
    cy.deleteUser(superTenant3Username);
    cy.carbonLogout();

    cy.carbonLogin(tenantAdminUsername, tenantAdminPassword, testTenant);
    // delete all the created users for tenant
    cy.visit(`${Utils.getAppOrigin()}/carbon/user/user-mgt.jsp`);
    cy.deleteUser(tenant1Username);
    cy.deleteUser(tenant3Username);
   
    // Remove created user roles
    cy.carbonLogout();

    // Reset all the configs back to ensure default behaviour
    cy.enableSelfSignUpInCarbonPortal(carbonUsername, carbonPassword, superTenant);
    cy.enableSelfSignUpInCarbonPortal(tenantAdminUsername, tenantAdminPassword, testTenant);
})

});
