
describe("nit-00 : Prepare test data for execution", () => {
    const publisher = 'publisher';
    const developer = 'developer';
    const password = 'test123';
    const carbonUsername = 'admin';
    const carbonPassword = 'admin';

    it.only("Login to devportal by supper tenant user", () => {
        cy.carbonLogin(carbonUsername, carbonPassword);
        cy.addNewTenant('wso2.com', 'admin');
    })
});