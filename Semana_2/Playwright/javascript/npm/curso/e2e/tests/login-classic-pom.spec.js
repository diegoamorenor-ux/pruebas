const { expect, test } = require('@playwright/test');
const { LoginPage } = require('../pages/classic/login.page');

test('deberia iniciar sesion usando POM clasico', async ({ page }) => {
  const loginPage = await new LoginPage(page).open();
  const overviewPage = await loginPage.loginAs('john', 'demo');

  await expect(overviewPage.title()).toHaveText('Accounts Overview');
  await expect(overviewPage.table()).toBeVisible();
});
