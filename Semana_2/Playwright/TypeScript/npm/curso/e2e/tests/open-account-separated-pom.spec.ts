import { expect, test } from '@playwright/test';
import { LoginActions } from '../pages/separated/login.actions';
import { MenuActions } from '../pages/separated/menu.actions';
import { OpenAccountActions } from '../pages/separated/open-account.actions';

test('deberia abrir una cuenta savings usando POM separado', async ({ page }) => {
  const login = await new LoginActions(page).open();
  await login.loginAs('john', 'demo');

  await new MenuActions(page).openNewAccount();
  const newAccountId = await new OpenAccountActions(page).openSavingsAccount();

  expect(newAccountId).not.toBe('');
  expect(newAccountId).toMatch(/^\d+$/);
});
