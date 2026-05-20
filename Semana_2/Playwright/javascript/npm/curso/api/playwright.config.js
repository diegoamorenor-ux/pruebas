// @ts-check
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  timeout: 30000,
  expect: {
    timeout: 10000
  },
  reporter: [
    ['list'],
    ['html', { open: 'never' }]
  ]
});
