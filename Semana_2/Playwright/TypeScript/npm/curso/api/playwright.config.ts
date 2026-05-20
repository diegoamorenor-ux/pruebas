import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  timeout: 30_000,
  expect: {
    timeout: 10_000
  },
  reporter: [
    ['list'],
    ['html', { open: 'never' }]
  ]
});
