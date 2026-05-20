const { expect, test } = require('@playwright/test');
const { LoginActions } = require('../pages/separated/login.actions');
const { MenuActions } = require('../pages/separated/menu.actions');
const { OpenAccountActions } = require('../pages/separated/open-account.actions');

test('deberia abrir una cuenta savings usando POM separado', async ({ page }) => {
  const login = await new LoginActions(page).open();
  await login.loginAs('john', 'demo');

  await new MenuActions(page).openNewAccount();
  const newAccountId = await new OpenAccountActions(page).openSavingsAccount();

  expect(newAccountId).not.toBe('');
  expect(newAccountId).toMatch(/^\d+$/);
});
