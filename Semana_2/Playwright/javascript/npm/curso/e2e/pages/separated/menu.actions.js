const { MenuLocators } = require('./menu.locators');
const { capture } = require('../evidence');

class MenuActions {
  constructor(page) {
    this.page = page;
    this.locators = new MenuLocators(page);
  }

  async openNewAccount() {
    await this.locators.openNewAccountLink().click();
    await capture(this.page, 'parabank-separated-open-new-account');
  }
}

module.exports = { MenuActions };
