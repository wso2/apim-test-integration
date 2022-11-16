import Utils from "@support/utils";

describe("publisher-016-01 : Service catalog delete flow", () => {
    const username = 'admin'
    const password = 'admin'
    const { superTenant, testTenant } = Utils.getUserInfo();
    const servicesDelete = (tenant) => {
        cy.loginToPublisher(username, password, tenant)
        cy.visit(`${Cypress.config().baseUrl}/publisher/service-catalog`);
        cy.get('#itest-services-listing-total')
            .then(
                (countElement) => {
                    let totalServices = parseInt(countElement.text());
                    debugger;
                    while (totalServices  > 0) {
                        cy.get('#itest-service-card-delete').click();
                        cy.get('#itest-service-card-delete-confirm').click();
                        totalServices -= 1;
                    }
                    cy.get('#itest-service-catalog-onboarding').should('be.visible')
                }
            )
    }

    it("Delete all APIs - super admin", () => {
        servicesDelete(superTenant);
    });
    it("Delete all APIs - tenant user", () => {
        servicesDelete(testTenant);
    });
})