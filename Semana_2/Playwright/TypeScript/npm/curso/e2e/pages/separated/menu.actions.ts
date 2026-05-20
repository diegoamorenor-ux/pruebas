import { Page } from '@playwright/test';
import { MenuLocators } from './menu.locators';
import { capture } from '../evidence';

export class MenuActions {
  private readonly page: Page;
  private readonly locators: MenuLocators;

  constructor(page: Page) {
    this.page = page;
    this.locators = new MenuLocators(page);
  }

  async openNewAccount(): Promise<void> {
    await this.locators.openNewAccountLink().click();
    await capture(this.page, 'parabank-separated-open-new-account');
  }
}
