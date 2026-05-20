describe('Cypress - Locator Strategies', () => {
  it('deberia usar locators tradicionales: id, name, css, xpath y otros', () => {
    cy.visit('https://www.selenium.dev/selenium/web/web-form.html');

    cy.get('#my-text-id').should('be.visible');
    cy.get('[name="my-text"]').should('be.visible');
    cy.get('input[name="my-password"]').should('be.visible');
    cy.findByXpath('//textarea[@name="my-textarea"]').should('be.visible');
    cy.get('.form-check-input').first().should('be.visible');
    cy.get('select').should('be.visible');
    cy.contains('a', 'Return to index').should('be.visible');
    cy.contains('a', 'Return').should('be.visible');
  });

  it('deberia comparar locators semanticos contra css/xpath', () => {
    cy.visit('https://www.selenium.dev/selenium/web/web-form.html');

    cy.findByLabelText('Text input').type('Cypress semantico');
    cy.get('#my-text-id').should('have.value', 'Cypress semantico');
    cy.findByXpath('//input[@name="my-text"]').should('have.value', 'Cypress semantico');

    cy.findByRole('button', { name: 'Submit' }).click();
    cy.contains('#message', 'Received!').should('be.visible');
  });
});
