const { AccountsOverviewPage } = require('./accounts-overview.page');
const { capture } = require('../evidence');

const URL = 'https://parabank.parasoft.com/parabank/index.htm';

/**
 * POM clasico: localizadores y acciones viven juntos.
 */
class LoginPage {
  constructor(page) {
    this.page = page;
    // ParaBank no asocia labels accesibles a estos campos, por eso aqui CSS sigue siendo la opcion clara.
    this.usernameInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.getByRole('button', { name: 'Log In' });
  }

  async open() {
    await this.page.goto(URL);
    await capture(this.page, 'parabank-open-login');
    return this;
  }

  async loginAs(username, password) {
    await this.usernameInput.fill(username);
    await capture(this.page, 'parabank-type-username');
    await this.passwordInput.fill(password);
    await capture(this.page, 'parabank-type-password');
    await this.loginButton.click();
    await capture(this.page, 'parabank-click-login');
    return new AccountsOverviewPage(this.page);
  }
}

module.exports = { LoginPage };
