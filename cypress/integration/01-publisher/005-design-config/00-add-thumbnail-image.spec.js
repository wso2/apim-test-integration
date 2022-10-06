
describe("Upload thumbnail", () => {
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
    it.only("Upload thumbnail", () => {
        cy.loginToPublisher(publisher, password);
        cy.createAPIByRestAPIDesign(apiName, apiVersion);
        cy.get('[data-testid="left-menu-itemDesignConfigurations"]').click();
        cy.get('[data-testid="edit-api-thumbnail-btn"]').click();
        cy.get('[data-testid="edit-api-thumbnail-upload"]').click();

        // upload the image
        const filepath = 'api_artifacts/api-pic.jpg';
        cy.get('input[type="file"]').attachFile(filepath);

        // Save
        cy.get('[data-testid="edit-api-thumbnail-save-btn"]').click();

        // Validate
        cy.get('[alt="API Thumbnail"]')
            .should('be.visible')
            .and(($img) => {
                // "naturalWidth" and "naturalHeight" are set when the image loads
                expect($img[0].naturalWidth).to.be.greaterThan(0)
            })
    });

    after(function () {
          // Test is done. Now delete the api
          cy.deleteApi(apiName, apiVersion);

        //cy.visit('carbon/user/user-mgt.jsp');
        //cy.deleteUser(publisher);
    })
});