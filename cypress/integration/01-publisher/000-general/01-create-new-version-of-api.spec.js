
describe("Create a new version of API", () => {
    const apiName = 'newapi' + Math.floor(Date.now() / 1000);
    const apiVersion = '1.0.0';
    const newVersion = '2.0.0';
    const publisher = 'publisher';
    const password = 'test123';
    const carbonUsername = 'admin';
    const carbonPassword = 'admin';

    before(function () {
        //cy.carbonLogin(carbonUsername, carbonPassword);
        //cy.addNewUser(publisher, ['Internal/publisher', 'Internal/creator', 'Internal/everyone'], password);
    })
    it.only("Create a new version of API", () => {
        cy.loginToPublisher(publisher, password);

        cy.createAPIByRestAPIDesign(apiName, apiVersion);

        cy.get('[data-testid="create-new-version-btn"]').click();
        cy.get('[data-testid="new-version-textbox"] input').type(newVersion);
        cy.get('[data-testid="new-version-save-btn"]').click();

        // Validate
        cy.get('[data-testid="api-name-version-title"]', { timeout: 30000 }).should('be.visible');
        cy.get('[data-testid="api-name-version-title"]').contains(`${apiName} :${apiVersion}`);
    });

    after(function () {
        // Test is done. Now delete the api
        cy.deleteApi(apiName, apiVersion);
        cy.deleteApi(apiName, newVersion);

        // delete publisher user.
        //cy.visit('carbon/user/user-mgt.jsp');
        //cy.deleteUser(publisher);
    })
});