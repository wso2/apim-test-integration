
describe("publisher-000-00 : Verify authorized user can deploy sample api in publisher portal", () => {
    const publisher = 'publisher';
    const developer = 'developer';
    const password = 'test123';
    const carbonUsername = 'admin';
    const carbonPassword = 'admin';

    before(function () {
        //cy.carbonLogin(carbonUsername, carbonPassword);
        //cy.addNewUser(developer, ['Internal/subscriber', 'Internal/everyone'], password);
        //cy.addNewUser(publisher, ['Internal/publisher', 'Internal/creator', 'Internal/everyone'], password);
        //cy.reload();
        //cy.carbonLogout();
        //cy.loginToPublisher(publisher, password);
    })

    it.only("Verify admin user can add test users", () => {
        cy.carbonLogin(carbonUsername, carbonPassword);
        cy.addNewUser(publisher, ['Internal/publisher', 'Internal/creator', 'Internal/everyone'], password);
        cy.addNewUser(developer, ['Internal/subscriber', 'Internal/everyone'], password);
        cy.reload();
        cy.carbonLogout();
    });

    it.only("Verify admin user can deploy sample api", () => {
        cy.loginToPublisher(publisher, password);
        cy.deploySampleAPI();
    });

    after(function () {
        // Test is done. Now delete the api
        cy.deleteApi('PizzaShackAPI', '1.0.0');

        //cy.visit('carbon/user/user-mgt.jsp');
        //cy.deleteUser(publisher);
    })
});