const LOGIN_URL = 'https://parabank.parasoft.com/parabank/index.htm';

class LoginLocators {
  constructor(page) {
    this.page = page;
  }

  usernameInput() {
    // ParaBank no tiene <label> asociado; por eso este campo queda como CSS.
    return this.page.locator('input[name="username"]');
  }

  passwordInput() {
    // Los input type=password no siempre exponen un rol util; CSS por name es mas estable aqui.
    return this.page.locator('input[name="password"]');
  }

  loginButton() {
    return this.page.getByRole('button', { name: 'Log In' });
  }
}

module.exports = { LOGIN_URL, LoginLocators };
