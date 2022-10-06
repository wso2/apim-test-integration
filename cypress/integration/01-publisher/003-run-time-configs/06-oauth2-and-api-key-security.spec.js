
describe("Runtime configuration", () => {
    const publisher = 'publisher';
    const password = 'test123';
    const carbonUsername = 'admin';
    const carbonPassword = 'admin';
    const apiName = 'newapi' + Math.floor(Date.now() / 1000);
    const apiVersion = '1.0.0';

    beforeEach(function () {
        //cy.carbonLogin(carbonUsername, carbonPassword);
        //cy.addNewUser(publisher, ['Internal/publisher', 'Internal/creator', 'Internal/everyone'], password);
    })


    it.only("OAuth2 and api key security spec", () => {
        cy.loginToPublisher(publisher, password);
        cy.createAPIByRestAPIDesign(apiName, apiVersion);
        cy.get('[data-testid="left-menu-itemRuntimeConfigurations"]').click();
        cy.get('[data-testid="application-level-security-head"]').click();
        // Checking the two options
        cy.get('[data-testid="api-security-basic-auth-checkbox"]').click();
        cy.get('[data-testid="api-security-api-key-checkbox"]').click();

        cy.get('[data-testid="save-runtime-configurations"]').click();
        cy.get('[data-testid="save-runtime-configurations"]').then(() => {
            cy.get('[data-testid="application-level-security-head"]').click();
            cy.get('[data-testid="api-security-basic-auth-checkbox"] input').should('be.checked');
            cy.get('[data-testid="api-security-api-key-checkbox"] input').should('be.checked');
        })
    });


    after(function () {
        // Test is done. Now delete the api
        cy.deleteApi(apiName, apiVersion);

        //cy.visit('carbon/user/user-mgt.jsp');
        //cy.deleteUser(publisher);
    })
});