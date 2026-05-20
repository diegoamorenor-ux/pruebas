const { LoginPage } = require('../pages/classic/login.page');
const { AccountsOverviewPage } = require('../pages/classic/accounts-overview.page');

describe('Cypress - Login Classic POM', () => {
  it('deberia iniciar sesion con POM clasico', () => {
    const loginPage = new LoginPage();
    const overviewPage = new AccountsOverviewPage();

    loginPage.visit().login('john', 'demo');

    overviewPage.title().should('contain', 'Accounts Overview');
    overviewPage.accountsTable().should('be.visible');
  });
});
