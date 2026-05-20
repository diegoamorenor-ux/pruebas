const { MENU_LOCATORS } = require('./menu.locators');
const { capture } = require('../../support/evidence');

class MenuActions {
  openNewAccount() {
    cy.get(MENU_LOCATORS.openNewAccount).click();
    capture('parabank-separated-open-new-account');
  }
}

module.exports = { MenuActions };
