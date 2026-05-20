class AccountsOverviewPage {
  title() {
    return cy.get('.title').invoke('text');
  }

  accountsTable() {
    return cy.get('#accountTable');
  }
}

module.exports = { AccountsOverviewPage };
