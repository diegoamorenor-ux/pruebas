const { LoginActions } = require('../pages/separated/login.actions');
const { MenuActions } = require('../pages/separated/menu.actions');
const { OpenAccountActions } = require('../pages/separated/open-account.actions');

describe('Cypress - Open Account Separated POM', () => {
  it('deberia abrir una cuenta savings con POM separado', () => {
    const login = new LoginActions();
    const menu = new MenuActions();
    const openAccount = new OpenAccountActions();

    login.open().loginAs('john', 'demo');
    menu.openNewAccount();

    openAccount.openSavingsAccount().then((newAccountId) => {
      expect(newAccountId.trim()).to.match(/^\d+$/);
    });
  });
});
