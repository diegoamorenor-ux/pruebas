import { Locator, Page } from '@playwright/test';
import { AccountsOverviewPage } from './accounts-overview.page';
import { capture } from '../evidence';

const URL = 'https://parabank.parasoft.com/parabank/index.htm';

/**
 * POM clasico: localizadores y acciones viven juntos.
 */
export class LoginPage {
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly registerLink: Locator;

  constructor(private readonly page: Page) {
    // ParaBank no asocia labels accesibles a estos campos, por eso aqui CSS sigue siendo la opcion clara.
    this.usernameInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.getByRole('button', { name: 'Log In' });
    this.registerLink = page.getByRole('button', { name: 'Log In' });
  }

  async open(): Promise<LoginPage> {
    await this.page.goto(URL);
    await capture(this.page, 'parabank-open-login');
    return this;
  }

  async loginAs(username: string, password: string): Promise<AccountsOverviewPage> {
    await this.usernameInput.fill(username);
    await capture(this.page, 'parabank-type-username');
    await this.passwordInput.fill(password);
    await capture(this.page, 'parabank-type-password');
    await this.loginButton.click();
    await capture(this.page, 'parabank-click-login');
    return new AccountsOverviewPage(this.page);
  }
}
