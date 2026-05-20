import { Locator, Page } from '@playwright/test';

export class OpenAccountLocators {
  constructor(private readonly page: Page) {
  }

  accountTypeSelect(): Locator {
    return this.page.getByRole('combobox').first();
  }

  fromAccountOptions(): Locator {
    return this.page.locator('#fromAccountId option');
  }

  openAccountButton(): Locator {
    return this.page.getByRole('button', { name: 'Open New Account' });
  }

  newAccountId(): Locator {
    return this.page.locator('#newAccountId');
  }
}
