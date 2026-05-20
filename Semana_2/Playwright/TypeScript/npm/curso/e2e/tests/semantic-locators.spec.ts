import { expect, test } from '@playwright/test';

test('deberia usar locators recomendados de Playwright', async ({ page }) => {
  await page.goto('https://www.selenium.dev/selenium/web/web-form.html');

  await page.getByLabel('Text input').fill('Playwright');
  await page.getByLabel('Password').fill('secret');
  await page.getByLabel('Textarea').fill('Texto de practica');
  await page.getByLabel('Dropdown (select)').selectOption({ label: 'Two' });
  await page.getByPlaceholder('Type to search...').fill('Seattle');

  await page.getByRole('checkbox', { name: 'Default checkbox' }).check();
  await page.getByRole('radio', { name: 'Default radio' }).check();

  await expect(page.getByLabel('Text input')).toHaveValue('Playwright');
  await expect(page.getByRole('checkbox', { name: 'Default checkbox' })).toBeChecked();

  await page.getByRole('button', { name: 'Submit' }).click();

  await expect(page.getByText('Received!')).toBeVisible();
});


test('02. deberia usar locators recomendados de Playwright', async ({ page }) => {
  await page.goto('https://www.selenium.dev/selenium/web/web-form.html');

  await page.getByLabel('Text input').fill('Playwright');
  await page.getByLabel('Password').fill('secret');
  await page.getByLabel('Textarea').fill('Texto de practica');
  await page.getByLabel('Dropdown (select)').selectOption({ label: 'Two' });
  await page.getByPlaceholder('Type to search...').fill('Seattle');

  await page.getByRole('checkbox', { name: 'Default checkbox' }).check();
  await page.getByRole('radio', { name: 'Default radio' }).check();

  await expect(page.getByLabel('Text input')).toHaveValue('Playwright');
  await expect(page.getByRole('checkbox', { name: 'Default checkbox' })).toBeChecked();

  await page.getByRole('button', { name: 'Submit' }).click();

  await expect(page.getByText('Received!')).toBeVisible();
});


test('03. deberia usar locators recomendados de Playwright', async ({ page }) => {
  await page.goto('https://www.selenium.dev/selenium/web/web-form.html');

  await page.getByLabel('Text input').fill('Playwright');
  await page.getByLabel('Password').fill('secret');
  await page.getByLabel('Textarea').fill('Texto de practica');
  await page.getByLabel('Dropdown (select)').selectOption({ label: 'Two' });
  await page.getByPlaceholder('Type to search...').fill('Seattle');

  await page.getByRole('checkbox', { name: 'Default checkbox' }).check();
  await page.getByRole('radio', { name: 'Default radio' }).check();

  await expect(page.getByLabel('Text input')).toHaveValue('Playwright');
  await expect(page.getByRole('checkbox', { name: 'Default checkbox' })).toBeChecked();

  await page.getByRole('button', { name: 'Submit' }).click();

  await expect(page.getByText('Received!')).toBeVisible();
});
