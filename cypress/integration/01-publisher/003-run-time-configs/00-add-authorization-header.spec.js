
describe("publisher-003-00 : Verify authorized user can add authorization header under the runtime configurations", () => {
    const publisher = 'publisher';
    const password = 'test123';
    const carbonUsername = 'admin';
    const carbonPassword = 'admin';
    const apiName = 'newapi' + Math.floor(Date.now() / 1000);
    const apiVersion = '1.0.0';

    before(function(){
        //cy.carbonLogin(carbonUsername, carbonPassword);
        //cy.addNewUser(publisher, ['Internal/publisher', 'Internal/creator', 'Internal/everyone'], password);
    })


    it.only("Authroized user add authorization header for the api", () => {
        const customAuthHeader = '-custom';
        cy.loginToPublisher(publisher, password);
        cy.createAPIByRestAPIDesign(apiName, apiVersion);
        cy.wait(3000);
        cy.get('[data-testid="left-menu-itemRuntimeConfigurations"]').click();
        cy.get('[data-testid="application-level-security-head"').click();
        cy.get('[data-testid="outlined-name-test"] input').focus().type(customAuthHeader);
        cy.get('[data-testid="save-runtime-configurations"]').click();
        cy.get('[data-testid="application-level-security-head"]').click();
        cy.get('[data-testid="outlined-name-test"] input').should('have.value', 'Authorization' + customAuthHeader);
    });

    after(function () {
          // Test is done. Now delete the api
          cy.deleteApi(apiName, apiVersion);

        // delete publisher
        //cy.visit('carbon/user/user-mgt.jsp');
        //cy.deleteUser(publisher);
    })
});
