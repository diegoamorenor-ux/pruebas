// @ts-check
const { defineConfig } = require('@playwright/test');

const browserChannel = process.env.BROWSER_CHANNEL ?? 'chrome';

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
  ],
  use: {
    ...(browserChannel ? { channel: browserChannel } : {}),
    viewport: { width: 1366, height: 768 },
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure'
  }
});
