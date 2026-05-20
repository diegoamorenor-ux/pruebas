class OpenAccountLocators {
  constructor(page) {
    this.page = page;
  }

  accountTypeSelect() {
    return this.page.getByRole('combobox').first();
  }

  fromAccountOptions() {
    return this.page.locator('#fromAccountId option');
  }

  openAccountButton() {
    return this.page.getByRole('button', { name: 'Open New Account' });
  }

  newAccountId() {
    return this.page.locator('#newAccountId');
  }
}

module.exports = { OpenAccountLocators };
