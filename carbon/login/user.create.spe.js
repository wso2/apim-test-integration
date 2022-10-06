import Utils from "@support/utils";

describe("Basic login to carbon console", () => {
    const username = 'admin'
    const password = 'admin'
    const users = {
        "david": ["Internal/subscriber"],
        "paul": ["Internal/publisher"],
        "carl": ["Internal/creator"],
        "adam": ["admin"],
        "devdas": ["Internal/devops"]
    }
    beforeEach(function () {
        // login before each test
        cy.carbonLogin(username, password)
    })
    it("Create developer portal user", () => {
        cy.url().should('contains', `${Utils.getAppOrigin()}/carbon/admin/index.jsp`);
        cy.get('.normal:nth-child(3) .normal:nth-child(2) li:nth-child(1) > .menu-default').click();
        cy.url().should('contains', `${Utils.getAppOrigin()}/carbon/userstore/add-user-role.jsp`);
        cy.get('.tableEvenRow .icon-link').click();
        cy.url().should('contains', `${Utils.getAppOrigin()}/carbon/user/add-step1.jsp`);
        cy.get('input[type=text][name=username]').click();
        cy.get('input[type=text][name=username]').type('devuser');
        cy.get('#password').type('kasun123');
        cy.get('#password-repeat').type('kasun123');
        cy.get('.button:nth-child(1)').click();
        cy.url().should('contains', `${Utils.getAppOrigin()}/carbon/user/add-step2.jsp`);
        cy.get('#edit_users input[type=checkbox][value="Internal/subscriber"]').click();
        cy.get('#edit_users').submit();
        cy.url().should('contains', `${Utils.getAppOrigin()}/carbon/user/user-mgt.jsp`);
        cy.get("#messagebox-info").contains('added successfully')

    })

    it.skip("Delete users", () => {
        let i = Object.keys(users).length;
        while (i > 0) {
            cy.visit(`${Utils.getAppOrigin()}/carbon/admin/index.jsp`);
            cy.get('.normal:nth-child(3) .normal:nth-child(2) li:nth-child(2) > .menu-default').click();
            cy.url().should('contains', `${Utils.getAppOrigin()}/carbon/userstore/index.jsp`);
            cy.get('.tableEvenRow .icon-link').click();
            cy.url().should('contains', `${Utils.getAppOrigin()}/carbon/user/user-mgt.jsp`);
            cy.get(`#userTable > tbody > tr:nth-child(${i}) > td:nth-child(1)`).then((nameElement) => {
                if (nameElement[0].textContent.trim() !== "admin") {
                    cy.get(nameElement[0].parentElement).within(() => {
                        cy.get(`td > a:nth-child(4)`).click();
                    })
                    cy.get('button:nth-child(1)').click();
                    cy.url().should('contains', `${Utils.getAppOrigin()}/carbon/user/user-mgt.jsp`);
                    cy.get('button').click();
                }
            })
            i -= 1;
        }
    });

    it("Create user pool", () => {
        for (const [username, roles] of Object.entries(users)) {
            cy.get('.normal:nth-child(3) .normal:nth-child(2) li:nth-child(1) > .menu-default').click();
            cy.url().should('contains', `${Utils.getAppOrigin()}/carbon/userstore/add-user-role.jsp`);
            cy.get('.tableEvenRow .icon-link').click();
            cy.url().should('contains', `${Utils.getAppOrigin()}/carbon/user/add-step1.jsp`);
            cy.get('input[type=text][name=username]').click();
            cy.get('input[type=text][name=username]').type(username);
            cy.get('#password').type('kasun123');
            cy.get('#password-repeat').type('kasun123');
            cy.get('.button:nth-child(1)').click();
            cy.url().should('contains', `${Utils.getAppOrigin()}/carbon/user/add-step2.jsp`);

            for (const role of roles) {
                cy.get(`#edit_users input[type=checkbox][value="${role}"]`).click();
            }
            cy.get('#edit_users').submit();
            cy.url().should('contains', `${Utils.getAppOrigin()}/carbon/user/user-mgt.jsp`);
            cy.get("#messagebox-info").contains('added successfully');
            cy.get('button').click();
        }
    })
})