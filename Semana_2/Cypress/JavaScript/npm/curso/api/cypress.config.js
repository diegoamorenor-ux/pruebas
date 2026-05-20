const { defineConfig } = require('cypress');

module.exports = defineConfig({
  allowCypressEnv: false,
  video: false,
  screenshotOnRunFailure: true,
  e2e: {
    supportFile: 'cypress/support/e2e.js',
    specPattern: 'cypress/e2e/api/**/*.cy.js'
  }
});
