
import PublisherMenu from "../../../support/functions/PublisherMenu";
import Apis from "../../../support/functions/Apis";
describe("publisher-003-05 : Verify authorized user can enable and upload certificate under runtime configuration", () => {
    const publisher = 'publisher';
    const password = 'test123';
    const carbonUsername = 'admin';
    const carbonPassword = 'admin';
    const apiName = 'newapi' + Math.floor(Date.now() / 1000);
    const apiVersion = '1.0.0';

    it("Authorized user enable mutual ssl and upload cert", () => {
        cy.loginToPublisher(publisher, password);
        const random_number = Math.floor(Date.now() / 1000);
        const alias = `alias${random_number}`;

        cy.createAPIByRestAPIDesign(apiName, apiVersion);
        PublisherMenu.goToRuntimeConfigurations();
        //cy.get('[data-testid="left-menu-itemRuntimeConfigurations"]').click();
        cy.wait(3000)
        cy.get('[data-testid="transport-level-security-head"]').click();
        cy.get('[data-testid="mutual-ssl-checkbox"]').click();

        // uploading the cert
        cy.get('[data-testid="general-configuration-certs-add-btn"]').click();
        cy.get('[data-testid="select-policy-dropdown-input"]').click();
        cy.get('[data-testid="policy-item-Bronze"]').click();
        cy.get('[data-testid="certificate-alias-textbox"] input').click().type(alias);

        // upload the cert
        const filepath = 'api_artifacts/sample.crt.pem';
        cy.get('input[type="file"]').attachFile(filepath);

        // Click away
        cy.get('[data-testid="upload-cert-save-btn"]').click();
        cy.get('[data-testid="upload-cert-save-btn"]').then(() => {
            //cy.get('[data-testid="save-runtime-configurations"]').click();
            Apis.clickSaveOnRuntimeConfigurationsInPublisher();
        });
        cy.wait(3000)
        // cy.get('[data-testid="save-runtime-configurations"]').get(() => {
        //     cy.get('[data-testid="transport-level-security-head"]').click();
        //     cy.get('[data-testid="mutual-ssl-checkbox"] input').should('be.checked');
        //     cy.get('[data-testid="endpoint-cert-list"]').contains(alias).should('be.visible');
        // })

        cy.get('[data-testid="transport-level-security-head"]').click();
        cy.wait(1000)
        cy.get('[data-testid="mutual-ssl-checkbox"] input').should('be.checked');
        cy.get('[data-testid="endpoint-cert-list"]').contains(alias).should('be.visible');
    });


    after(function () {
         // Test is done. Now delete the api
         cy.deleteApi(apiName, apiVersion);
    })
});