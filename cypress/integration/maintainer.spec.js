/// <reference types="Cypress" />

context('Maintainer Area', () => {
    context('Login', () => {
        beforeEach(() => {
            cy.visit('/maintainer/logout/').visit('/maintainer/login/');
        });
        it('should reject logins with wrong credentials', () => {
            cy.get('input[name="username"]')
                .type('klaschka@fliegwerk.com');
            cy.get('input[name="password"]')
                .type('wrong password');
            cy.get('input')
                .contains('Log in')
                .click();
            cy.location('pathname').should('contain', 'login');
        });

        it('should redirect unauthenticated users to login', () => {
            cy.visit('/maintainer/');
            cy.location('pathname').should('contain', 'login');
        });

        it('should accept logins with correct credentials', () => {
            cy.get('input[name="username"]')
                .type('klaschka@fliegwerk.com');
            cy.get('input[name="password"]')
                .type('12345');
            cy.get('input')
                .contains('Log in')
                .click();
            cy.location('pathname').should('not.contain', 'login');
        });
    });

    context('Logged in', () => {
        before(() => {
            cy.login('/maintainer/login/', 'klaschka@fliegwerk.com', '12345');
            cy.reload();
            cy.screenshot();
        });

        it('should be logged in as Maintainer 1', () => {
            cy.contains('Hi, Maintainer 1');
        });
        
        it('should contain two pending reviews', () => {
            cy.get('ul#pending').children('li').should('have.length', 2);
        });

        describe('Reject a release', () => {
            before(() => {
                cy.login('/maintainer/login/', 'klaschka@fliegwerk.com', '12345');
                cy.get('ul#pending a').first().click();
                cy.contains('Reject').children('input').click();
                cy.contains('Comment').children('textarea').type('Some rejection reason');
                cy.get('[type="submit"]').click();
            });
            
            it('should have returned to the maintainer home page', () => {
                cy.location('pathname').should('not.contain', 'review');
            });
            it('should have rejected the review', () => {
                cy.get('ul#pending').children('li').should('have.length', 1);
            })
        });
        describe('Approve a release', () => {
            before(() => {
                cy.login('/maintainer/login/', 'klaschka@fliegwerk.com', '12345');
                cy.get('ul#pending a').first().click();
                cy.contains('Reject').children('input').click();
                cy.contains('Comment').children('textarea').type('Some rejection reason');
                cy.get('[type="submit"]').click();
            });

            it('should have returned to the maintainer home page', () => {
                cy.location('pathname').should('not.contain', 'review');
            });
            it('should have rejected the review', () => {
                cy.get('ul#pending').children('li').should('have.length', 0);
            })
        });
    });
});
