const { defineConfig } = require('cypress');

module.exports = defineConfig({
  allowCypressEnv: false,
  video: false,
  screenshotOnRunFailure: true,
  e2e: {
    baseUrl: 'https://parabank.parasoft.com/parabank',
    supportFile: 'cypress/support/e2e.js',
    specPattern: 'cypress/e2e/**/*.cy.js'
  }
});
