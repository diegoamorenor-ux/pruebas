import { Locator, Page } from '@playwright/test';

export const LOGIN_URL = 'https://parabank.parasoft.com/parabank/index.htm';

export class LoginLocators {
  constructor(private readonly page: Page) {
  }

  usernameInput(): Locator {
    // ParaBank no tiene <label> asociado; por eso este campo queda como CSS.
    return this.page.locator('input[name="username"]');
  }

  passwordInput(): Locator {
    // Los input type=password no siempre exponen un rol util; CSS por name es mas estable aqui.
    return this.page.locator('input[name="password"]');
  }

  loginButton(): Locator {
    return this.page.getByRole('button', { name: 'Log In' });
  }
}
