const { OpenAccountLocators } = require('./open-account.locators');
const { capture } = require('../evidence');

class OpenAccountActions {
  constructor(page) {
    this.page = page;
    this.locators = new OpenAccountLocators(page);
  }

  async openSavingsAccount() {
    await this.locators.fromAccountOptions().first().waitFor({ state: 'attached' });
    await this.locators.accountTypeSelect().selectOption({ label: 'SAVINGS' });
    await capture(this.page, 'parabank-separated-select-savings');
    await this.locators.openAccountButton().click();
    await capture(this.page, 'parabank-separated-click-open-account');
    await this.locators.newAccountId().waitFor({ state: 'visible' });
    await capture(this.page, 'parabank-separated-account-created');
    return (await this.locators.newAccountId().innerText()).trim();
  }
}

module.exports = { OpenAccountActions };
