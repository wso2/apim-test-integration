
describe("Add business information", () => {
    const publisher = 'publisher';
    const password = 'test123';
    const carbonUsername = 'admin';
    const carbonPassword = 'admin';
    const apiName = 'newapi' + Math.floor(Date.now() / 1000);
    const apiVersion = '1.0.0';

    before(function () {
        //cy.carbonLogin(carbonUsername, carbonPassword);
        //cy.addNewUser(publisher, ['Internal/publisher', 'Internal/creator', 'Internal/everyone'], password);
    })

    it.only("Add business information", () => {
        const ownerName = 'Raccoon Panda';
        const ownerEmail = 'raccoon@wso2.com';
        const techOwnerName = 'Big Cat';
        const techOwnerEmail = 'bigcat@wso2.com';

        cy.loginToPublisher(publisher, password);
        cy.wait(3000);
        cy.createAPIByRestAPIDesign(apiName, apiVersion);
        cy.get('[data-testid="left-menu-itembusinessinfo"]').click();
        cy.get('[data-testid="business-owner-name"]').click().type(ownerName);
        cy.get('[data-testid="business-owner-email"]').click().type(ownerEmail);
        cy.get('[data-testid="technical-owner-name"]').click().type(techOwnerName);
        cy.get('[data-testid="technical-owner-email"]').click().type(techOwnerEmail);

        cy.get('[data-testid="business-info-save"]').click();

        cy.get('[data-testid="business-info-save"]').then(function () {
            cy.get('[data-testid="business-owner-name"] input').should('have.value', ownerName);
            cy.get('[data-testid="business-owner-email"] input').should('have.value', ownerEmail);
            cy.get('[data-testid="technical-owner-name"] input').should('have.value', techOwnerName);
            cy.get('[data-testid="technical-owner-email"] input').should('have.value', techOwnerEmail);
        });
    });

    after(function () {
          // Test is done. Now delete the api
          cy.deleteApi(apiName, apiVersion);

        //cy.visit('carbon/user/user-mgt.jsp');
        //cy.deleteUser(publisher);
    })
});