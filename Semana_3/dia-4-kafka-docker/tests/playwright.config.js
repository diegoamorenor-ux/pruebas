const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: '.',
  timeout: 15000,
  expect: {
    timeout: 10000 // Espera hasta 10s para aserciones asíncronas
  },
  use: {
    baseURL: 'http://localhost:3000',
    headless: true, // Requerido para CI/CD
    screenshot: 'only-on-failure'
  }
});
