const { OPEN_ACCOUNT_LOCATORS } = require('./open-account.locators');
const { capture } = require('../../support/evidence');

class OpenAccountActions {
  openSavingsAccount() {
    cy.get(OPEN_ACCOUNT_LOCATORS.accountType).select('SAVINGS');
    capture('parabank-separated-select-savings');
    cy.get(OPEN_ACCOUNT_LOCATORS.fromAccount)
      .find('option')
      .its('length')
      .should('be.greaterThan', 0);

    cy.get(OPEN_ACCOUNT_LOCATORS.openAccountButton).click();
    capture('parabank-separated-click-open-account');

    return cy
      .get(OPEN_ACCOUNT_LOCATORS.newAccountId, { timeout: 10000 })
      .should(($id) => {
        expect($id.text().trim()).to.match(/^\d+$/);
      })
      .invoke('text')
      .then((text) => {
        const accountId = text.trim();
        capture('parabank-separated-account-created');
        return cy.wrap(accountId);
      });
  }
}

module.exports = { OpenAccountActions };
