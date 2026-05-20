const { capture } = require('../../support/evidence');

class LoginPage {
  visit() {
    cy.visit('/index.htm');
    capture('parabank-open-login');
    return this;
  }

  login(username, password) {
    cy.get('input[name="username"]').clear().type(username);
    capture('parabank-type-username');
    cy.get('input[name="password"]').clear().type(password);
    capture('parabank-type-password');
    cy.get('input[value="Log In"]').click();
    capture('parabank-click-login');
  }
}

module.exports = { LoginPage };
