/// <reference types="Cypress" />

context('Home page', () => {
   beforeEach(() => {
       cy.visit('/');
   });
   
   it('takes a screenshot', () => {
       cy.screenshot();
   });
    
    it('should contain a link to the Developer Login', () => {
        cy.get('a')
            .contains('Developer')
            .should('exist')
            .click();
        cy.location('pathname').should('contain', 'dev/login')
    });

    it('should contain a link to the Maintainer Login', () => {
        cy.get('a')
            .contains('Maintainer')
            .should('exist')
            .click();
        cy.location('pathname').should('contain', 'maintainer/login')
    });
});
