import { Page } from '@playwright/test';
import { LOGIN_URL, LoginLocators } from './login.locators';
import { capture } from '../evidence';

export class LoginActions {
  private readonly locators: LoginLocators;

  constructor(private readonly page: Page) {
    this.locators = new LoginLocators(page);
  }

  async open(): Promise<LoginActions> {
    await this.page.goto(LOGIN_URL);
    await capture(this.page, 'parabank-separated-open-login');
    return this;
  }

  async loginAs(username: string, password: string): Promise<void> {
    await this.locators.usernameInput().fill(username);
    await capture(this.page, 'parabank-separated-type-username');
    await this.locators.passwordInput().fill(password);
    await capture(this.page, 'parabank-separated-type-password');
    await this.locators.loginButton().click();
    await capture(this.page, 'parabank-separated-click-login');
  }
}
