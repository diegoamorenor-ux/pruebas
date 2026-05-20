import { test, expect } from '@playwright/test';

// Test de ejemplo generado con Playwright Codegen
// Demuestra cómo se graban interacciones automáticamente
test('test', async ({ page }) => {
  await page.goto('https://parabank.parasoft.com/parabank/index.htm');
  await page.locator('input[name="username"]').fill('TEST');
  await page.locator('input[name="password"]').fill('TEST');
  await page.getByRole('button', { name: 'Log In' }).click();

  // El mensaje de error aparece dentro del formulario de login
  const errorPanel = page.locator('.error, p.error, b');
  await expect(errorPanel.first()).toBeVisible({ timeout: 10000 });
});
