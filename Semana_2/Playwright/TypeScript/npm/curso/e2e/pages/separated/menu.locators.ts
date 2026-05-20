import { Locator, Page } from '@playwright/test';

export class MenuLocators {
  constructor(private readonly page: Page) {
  }

  openNewAccountLink(): Locator {
    return this.page.getByRole('link', { name: 'Open New Account' });
  }
}
