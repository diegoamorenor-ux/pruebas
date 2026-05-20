const { LOGIN_LOCATORS } = require('./login.locators');
const { capture } = require('../../support/evidence');

class LoginActions {
  open() {
    cy.visit('/index.htm');
    capture('parabank-separated-open-login');
    return this;
  }

  loginAs(username, password) {
    cy.get(LOGIN_LOCATORS.username).clear().type(username);
    capture('parabank-separated-type-username');
    cy.get(LOGIN_LOCATORS.password).clear().type(password);
    capture('parabank-separated-type-password');
    cy.get(LOGIN_LOCATORS.loginButton).click();
    capture('parabank-separated-click-login');
  }
}

module.exports = { LoginActions };
