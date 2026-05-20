import { Locator, Page } from '@playwright/test';

export class AccountsOverviewPage {
  private readonly pageTitle: Locator;
  private readonly accountsTable: Locator;

  constructor(page: Page) {
    this.pageTitle = page.getByRole('heading', { name: 'Accounts Overview' });
    this.accountsTable = page.getByRole('table');
  }

  title(): Locator {
    return this.pageTitle;
  }

  table(): Locator {
    return this.accountsTable;
  }
}
