import { Page } from '@playwright/test';
import { OpenAccountLocators } from './open-account.locators';
import { capture } from '../evidence';

export class OpenAccountActions {
  private readonly page: Page;
  private readonly locators: OpenAccountLocators;

  constructor(page: Page) {
    this.page = page;
    this.locators = new OpenAccountLocators(page);
  }

  async openSavingsAccount(): Promise<string> {
    await this.locators.fromAccountOptions().first().waitFor({ state: 'attached' });
    await this.locators.accountTypeSelect().selectOption({ label: 'SAVINGS' });
    await capture(this.page, 'parabank-separated-select-savings');
    await this.locators.openAccountButton().click();
    await capture(this.page, 'parabank-separated-click-open-account');
    await this.locators.newAccountId().waitFor({ state: 'visible' });
    await capture(this.page, 'parabank-separated-account-created');
    return (await this.locators.newAccountId().innerText()).trim();
  }
}
