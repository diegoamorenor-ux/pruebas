class AccountsOverviewPage {
  constructor(page) {
    this.pageTitle = page.getByRole('heading', { name: 'Accounts Overview' });
    this.accountsTable = page.getByRole('table');
  }

  title() {
    return this.pageTitle;
  }

  table() {
    return this.accountsTable;
  }
}

module.exports = { AccountsOverviewPage };
