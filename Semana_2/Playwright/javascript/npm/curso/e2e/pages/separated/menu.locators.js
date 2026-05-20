class MenuLocators {
  constructor(page) {
    this.page = page;
  }

  openNewAccountLink() {
    return this.page.getByRole('link', { name: 'Open New Account' });
  }
}

module.exports = { MenuLocators };
