import { after } from "mocha"


describe("Resource add edit operations", () => {
    const publisher = 'publisher';
    const password = 'test123';
    const carbonUsername = 'admin';
    const carbonPassword = 'admin';
    const target = '/test';

    before(function () {
        //cy.carbonLogin(carbonUsername, carbonPassword);
        //cy.addNewUser(publisher, ['Internal/publisher', 'Internal/creator', 'Internal/everyone'], password);
    })

    beforeEach(function () {
        //cy.loginToPublisher(publisher, password);
    })

    it.only("Add new resource", () => {
        const apiName = 'newapi' + Math.floor(Date.now() / 1000);
        const apiVersion = '1.0.0';
        cy.loginToPublisher(publisher, password);
        cy.createAPIByRestAPIDesign(apiName, apiVersion);
        // Typing the resource name
        cy.get('[data-testid="left-menu-itemresources"]').click();
        cy.get('#operation-target').type(target);
        cy.get('body').click();
        cy.get('[data-testid="add-operation-selection-dropdown"]').click();

        // Checking all the operations
        cy.get('[data-testid="add-operation-get"]').click();
        cy.get('[data-testid="add-operation-post"]').click();
        cy.get('[data-testid="add-operation-put"]').click();
        cy.get('[data-testid="add-operation-patch"]').click();
        cy.get('[data-testid="add-operation-delete"]').click();
        cy.get('[data-testid="add-operation-head"]').click();

        cy.get('body').click();
        cy.get('[data-testid="add-operation-button"]').click();
        cy.get('[data-testid="resources-save-operations"]').click();

        // Validating if the resource exists after saving
        cy.get('[data-testid="resources-save-operations"]', { timeout: 30000 });

        cy.get(`[data-testid="operation-${target}-get"]`).should('be.visible');
        cy.get(`[data-testid="operation-${target}-post"]`).should('be.visible');
        cy.get(`[data-testid="operation-${target}-put"]`).should('be.visible');
        cy.get(`[data-testid="operation-${target}-patch"]`).should('be.visible');
        cy.get(`[data-testid="operation-${target}-delete"]`).should('be.visible');
        cy.get(`[data-testid="operation-${target}-head"]`).should('be.visible');

        // Test is done. Now delete the api
        cy.get(`[data-testid="itest-id-deleteapi-icon-button"]`).click();
        cy.get(`[data-testid="itest-id-deleteconf"]`).click();
    });

    const addApiAndResource = (verb) => {
        // Typing the resource name
        cy.get('[data-testid="left-menu-itemresources"]').click();
        cy.get('#operation-target').type(target);
        cy.get('body').click();
        cy.get('[data-testid="add-operation-selection-dropdown"]').click();

        // Checking all the operations
        cy.get(`[data-testid="add-operation-${verb}"]`).click();

        cy.get('body').click();
        cy.get('[data-testid="add-operation-button"]').click();
        cy.get('[data-testid="resources-save-operations"]').click();

        // Validating if the resource exists after saving
        cy.get('[data-testid="resources-save-operations"]', { timeout: 30000 });

        cy.get(`[data-testid="operation-${target}-${verb}"]`).should('be.visible');
    }
    it.only("Add delete query path parameters for resources", () => {
        const verb = 'get';
        const paramType = 'query';
        const paramName = 'count';
        const paramDataType = 'string';
        const apiName = 'newapi' + Math.floor(Date.now() / 1000);
        const apiVersion = '1.0.0';

        cy.loginToPublisher(publisher, password);
        cy.createAPIByRestAPIDesign(apiName, apiVersion);
        addApiAndResource(verb);

        cy.get(`[data-testid="operation-${target}-${verb}"]`).click();
        cy.get(`[data-testid="add-parameter-${target}-${verb}-param-type"]`).click();
        cy.get(`[data-testid="add-parameter-${target}-${verb}-${paramType}"]`).click();

        cy.get(`[data-testid="add-parameter-${target}-${verb}-param-name"]`).click();
        cy.get(`[data-testid="add-parameter-${target}-${verb}-param-name"] input`).type(paramName);

        // Clicking the parameter data type drop down
        cy.get(`[data-testid="add-parameter-${target}-${verb}-param-data-type"]`).click();
        cy.get(`[data-testid="add-parameter-${target}-${verb}-${paramDataType}"]`).click();
        cy.get(`[data-testid="add-parameter-${target}-${verb}-add-btn"]`).click();

        // Save the resources
        cy.get('[data-testid="resources-save-operations"]').click();

        // Validating if the param exists after saving
        cy.get('[data-testid="resources-save-operations"]', { timeout: 30000 });
        cy.get(`[data-testid="param-list-${paramType}-${paramName}-${paramDataType}"]`).should('be.visible');

        // Test is done. Now delete the api
        cy.get(`[data-testid="itest-id-deleteapi-icon-button"]`).click();
        cy.get(`[data-testid="itest-id-deleteconf"]`).click();
    });

    it.only("Add advance throttling policies per resource", () => {
        const verb = 'get';
        const rateLimitName = '50KPerMin';
        const apiName = 'newapi' + Math.floor(Date.now() / 1000);
        const apiVersion = '1.0.0';
        cy.loginToPublisher(publisher, password);
        cy.createAPIByRestAPIDesign(apiName, apiVersion);
        addApiAndResource(verb);
        // Click the operation level radio button on the top
        cy.get('[data-testid="api-rate-limiting-operation-level"]').click();

        // expand the section
        cy.get(`[data-testid="operation-${target}-${verb}"]`).click();

        cy.get(`[data-testid="${target}-${verb}-operation-rate-limiting-policy"]`).click();
        cy.get(`[data-testid="${target}-${verb}-operation-rate-limiting-policy-${rateLimitName}"]`).click();

        // Save the resources
        cy.get('[data-testid="resources-save-operations"]').click();

        cy.get('[data-testid="resources-save-operations"]', { timeout: 30000 });
        cy.get(`[data-testid="${target}-${verb}-operation-rate-limiting-policy"] .selected`)
            .contains(rateLimitName)
            .should('be.visible');

        // Test is done. Now delete the api
        cy.get(`[data-testid="itest-id-deleteapi-icon-button"]`).click();
        cy.get(`[data-testid="itest-id-deleteconf"]`).click();
    });

    it.only("Add and assign scopes for API resources", () => {
        const random_number = Math.floor(Date.now() / 1000);
        const verb = 'post';
        const scopeName = 'test' + random_number;
        const scopeDescription = 'test scope description';
        const role = 'internal/publisher';
        const apiName = 'newapi' + Math.floor(Date.now() / 1000);
        const apiVersion = '1.0.0';

        cy.loginToPublisher(publisher, password);
        cy.createAPIByRestAPIDesign(apiName, apiVersion);
        addApiAndResource(verb);

        // Go to local scope page
        cy.get('[data-testid="left-menu-itemLocalScopes"]').click();

        // Create a local scope
        cy.get('[data-testid="create-scope-start-btn"]').click();
        cy.get('[data-testid="scope-name"]').click();
        cy.get('[data-testid="scope-name"]').type(scopeName);

        cy.get('[data-testid="scope-description"]').click();
        cy.get('[data-testid="scope-description"]').type(scopeDescription);

        cy.get('[data-testid="scope-roles-input"]').click();
        cy.get('[data-testid="scope-roles-input"]').type(`${role}{enter}`);

        cy.get('[data-testid="scope-save-btn"]').click();
        cy.contains('[data-testid="scope-list-table"]', scopeName).should('be.visible');

        // Go to resources page
        cy.get('[data-testid="left-menu-itemresources"]').click();

        // Open the operation sub section
        cy.get(`[data-testid="operation-${target}-${verb}"]`).click();
        cy.get(`[data-testid="${target}-${verb}-operation-scope-select"] > div`, { timeout: 3000 });
        cy.get(`[data-testid="${target}-${verb}-operation-scope-select"] > div`).click();
        cy.get(`[data-testid="${target}-${verb}-operation-scope-${scopeName}"]`).click();
        cy.get(`[data-testid="${target}-${verb}-operation-scope-${scopeName}"]`).type('{esc}');
        // // Save the resources
        cy.get('[data-testid="resources-save-operations"]').click();

        cy.get('[data-testid="resources-save-operations"]', { timeout: 30000 });
        cy.get(`[data-testid="${target}-${verb}-operation-scope-select"] .selected`)
            .contains(scopeName)
            .should('be.visible');

        // Test is done. Now delete the api
        cy.get(`[data-testid="itest-id-deleteapi-icon-button"]`).click();
        cy.get(`[data-testid="itest-id-deleteconf"]`).click();

    });

    after(function () {
        //cy.carbonLogin(carbonUsername, carbonPassword);
        //cy.visit('carbon/user/user-mgt.jsp');
        //cy.deleteUser(publisher);
    })
})