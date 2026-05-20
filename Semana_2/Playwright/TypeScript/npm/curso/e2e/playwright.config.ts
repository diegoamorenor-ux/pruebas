import { defineConfig } from '@playwright/test';

const browserChannel = process.env.BROWSER_CHANNEL ?? 'chrome';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 5,
  timeout: 30_000,
  expect: {
    timeout: 10_000
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
