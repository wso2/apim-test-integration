
describe("nit-00 : Prepare test data for execution", () => {
    const publisher = 'publisher';
    const developer = 'developer';
    const password = 'test123';
    const carbonUsername = 'admin';
    const carbonPassword = 'admin';

    it.only("Create test users and tenants from carbon admin", () => {
        cy.carbonLogin(carbonUsername, carbonPassword);
        cy.addNewUser(publisher, ['Internal/publisher', 'Internal/creator', 'Internal/everyone'], password);
        cy.addNewUser(developer, ['Internal/subscriber', 'Internal/everyone'], password);
        cy.addNewTenant('wso2.com', 'admin');
        cy.wait(3000)
        // cy.reload();
        // cy.carbonLogout();
    })
});