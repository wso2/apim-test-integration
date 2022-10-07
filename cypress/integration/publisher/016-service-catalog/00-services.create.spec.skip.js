import { getSampleServiceMeta, getSampleOpenAPI } from '../../../support/mockData/serviceCatalog';
import Utils from "@support/utils";


describe("publisher-016-00 : Service catalog create flow", () => {
    const { publisher, password, superTenant, testTenant } = Utils.getUserInfo();

    const serviceCreate = (tenant) => {
        // login before each test
        cy.viewport(1920, 980)
        cy.loginToPublisher(publisher, password, tenant)
        cy.getCookies()
            .then((cookies) => {
                let i = Utils.getRandomRange(15, 25);

                while (i > 0) {
                    const random_number = Utils.getRandomDate();
                    const randomName = Utils.getRandomString();
                    
                    const sampleOAS = getSampleOpenAPI();
                    const serviceMeta = getSampleServiceMeta();

                    serviceMeta.name = `${randomName}-${random_number}`;
                    serviceMeta.version += `${random_number}`;
                    serviceMeta.serviceUrl += `${random_number}`;
                    sampleOAS.info.description += serviceMeta.name;
                    delete serviceMeta.serviceKey;
                    const definitionFile = new File([JSON.stringify(sampleOAS)],
                        'definitionFile.json', { type: 'application/json', lastModified: new Date().getTime() });
                    const serviceMetadataFile = new File([JSON.stringify(serviceMeta)],
                        'serviceMetadata.json', { type: 'application/json', lastModified: new Date().getTime() });

                    const formData = new FormData();
                    formData.append('serviceMetadata', serviceMetadataFile);
                    formData.append('definitionFile', definitionFile);

                    const tokenP1 = cookies.find(c => c.name === "WSO2_AM_TOKEN_1_Default");
                    fetch(`${Cypress.config().baseUrl}/api/am/service-catalog/v0/services`, {
                        method: 'POST',
                        body: formData,
                        headers: {
                            'authorization': 'Bearer ' + tokenP1.value
                        }
                    })
                    i -= 1;
                }

            })
        cy.visit(`/publisher/service-catalog`);
    }
    it.skip("Deploy sample service", () => {
        cy.visit(`/publisher/service-catalog`);
        cy.get('#itest-service-catalog-onboarding').should('be.visible')
        cy.get('#itest-services-landing-deploy-sample').click()

    });

    it("Create 15~25 services - super admin", () => {
        serviceCreate(superTenant);
    });
    it("Create 15~25 services - tenant user", () => {
        serviceCreate(testTenant);
    });


})
