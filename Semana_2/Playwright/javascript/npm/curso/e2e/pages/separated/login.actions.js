const { LOGIN_URL, LoginLocators } = require('./login.locators');
const { capture } = require('../evidence');

class LoginActions {
  constructor(page) {
    this.page = page;
    this.locators = new LoginLocators(page);
  }

  async open() {
    await this.page.goto(LOGIN_URL);
    await capture(this.page, 'parabank-separated-open-login');
    return this;
  }

  async loginAs(username, password) {
    await this.locators.usernameInput().fill(username);
    await capture(this.page, 'parabank-separated-type-username');
    await this.locators.passwordInput().fill(password);
    await capture(this.page, 'parabank-separated-type-password');
    await this.locators.loginButton().click();
    await capture(this.page, 'parabank-separated-click-login');
  }
}

module.exports = { LoginActions };
