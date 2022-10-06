
describe("Check endpoint test button", () => {
    const publisher = 'publisher';
    const password = 'test123';
    const carbonUsername = 'admin';
    const carbonPassword = 'admin';

    before(function () {
        //cy.carbonLogin(carbonUsername, carbonPassword);
        //cy.addNewUser(publisher, ['Internal/publisher', 'Internal/creator', 'Internal/everyone'], password);
    })

    it.only("Check endpoint test button", () => {
        const endpoint200 = 'https://petstore.swagger.io/v2/store/inventory'; // 200 OK
        const endpoint400 = 'https://petstore.swagger.io/v2/store/inventory/7777777'; //404 Not Found
        const endpointUnknown = 'http://bull-8772776363-url.foo123'; // Unknown Host
        const endpointNoProtocol = 'bullproto://'; // unknown protocol: bullproto
        cy.loginToPublisher(publisher, password);
        cy.createAPIWithoutEndpoint();

        cy.get('[data-testid="left-menu-itemendpoints"]').click();
        cy.get('[data-testid="http__rest_endpoint-start"]').click();

        // Add the prod and sandbox endpoints
        cy.get('[data-testid="production-endpoint-checkbox"]').click();

        // endpoint-test-icon
        cy.get('#primaryEndpoint').focus().type(endpoint200);
        cy.get('[data-testid="primaryEndpoint-endpoint-test-icon-btn"]').trigger("click");
        cy.get('[data-testid="primaryEndpoint-endpoint-test-status"] span', { timeout: 30000 }).should('have.text', '200 OK');

         // endpoint-test-icon
         cy.get('#primaryEndpoint').focus().clear().type(endpoint400);
         cy.get('[data-testid="primaryEndpoint-endpoint-test-icon-btn"]').trigger("click");
         cy.get('[data-testid="primaryEndpoint-endpoint-test-status"] span', { timeout: 30000 }).should('have.text', '404 Not Found');
 
        cy.get('#primaryEndpoint').focus().clear().type(endpointUnknown);
        cy.get('[data-testid="primaryEndpoint-endpoint-test-icon-btn"]').trigger("click");
        cy.get('[data-testid="primaryEndpoint-endpoint-test-status"] span', { timeout: 30000 }).should('have.text', 'Unknown Host');

        cy.get('#primaryEndpoint').focus().clear().type(endpointNoProtocol);
        cy.get('[data-testid="primaryEndpoint-endpoint-test-icon-btn"]').trigger("click");
        cy.get('[data-testid="primaryEndpoint-endpoint-test-status"] span', { timeout: 30000 }).should('have.text', 'unknown protocol: bullproto');
    });

    after(function () {
        // Test is done. Now delete the api
        cy.get(`[data-testid="itest-id-deleteapi-icon-button"]`).click();
        cy.get(`[data-testid="itest-id-deleteconf"]`).click();

        //cy.visit('carbon/user/user-mgt.jsp');
        //cy.deleteUser(publisher);
    })
});