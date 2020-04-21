/// <reference types="Cypress" />

context('Maintainer Area Login', () => {
    beforeEach(() => {
        cy.visit('/maintainer/logout/');
        cy.visit('/maintainer/');
    });

    it('shows a login screen', () => {
        cy.location('pathname').should('contain', 'login');
        cy.contains('Login');
        cy.wait(200);
        cy.screenshot();
    });

    it(`rejects wrong credentials`, () => {
        cy.get('input[name="username"]').focus().type('wrongUser@email.com')
        cy.get('input[name="password"]').type('12345')
        cy.get('input[type="submit"]').contains('Log in').click();
        cy.get('.uk-alert-danger').contains('Invalid');

        cy.wait(200);
        cy.screenshot();
    });

    it(`allows real credentials`, () => {
        cy.get('input[name="username"]').focus().type('contact@pabloklaschka.de')
        cy.get('input[name="password"]').type('12345')
        cy.get('input[type="submit"]').contains('Log in').click();

        cy.location('pathname').should('not.contain', 'login');
        cy.contains('Hi,')
        cy.contains('Logout');
    });
});

context('Maintainer Area Logged In', () => {
    beforeEach(() => {
        Cypress.Cookies.preserveOnce('connect.sid');
    })

    before(() => {
        cy.visit('/maintainer/');
        cy.get('input[name="username"]').focus().type('contact@pabloklaschka.de')
        cy.get('input[name="password"]').type('12345')
        cy.get('input[type="submit"]').contains('Log in').click();
    })

    it(`shows pending and past reviews`, () => {
        cy.visit('/maintainer/')


        cy.get('#pending')
            .children().should('have.length', 1)


        cy.get('#pending')
            .children()
            .contains('Table FEM');

        cy.get('#past')
            .children().should('have.length', 2);

        cy.get('.uk-card-badge')
            .should('contain', '1')

        cy.wait(200);
        cy.screenshot();
    });

    it(`open a pending review`, () => {
        cy.visit('/maintainer/')
        cy.get('#pending a').first().click();

        cy.location('pathname').should('contain', '/review/1')
        cy.get('h1').contains('Table FEM');

        cy.wait(200);
        cy.screenshot();

        cy.get('.uk-breadcrumb a').contains('Maintainer Area').click();
        cy.location('pathname').should('not.contain', 'review');
    });

    it('rejects a review', () => {
        cy.visit('/maintainer/review/1/')

        cy.contains('Reject').first().click();
        cy.get('textarea').type('Some arbitrary reason ;-)');
        cy.get('input[type="submit"]').click();
    });

})
