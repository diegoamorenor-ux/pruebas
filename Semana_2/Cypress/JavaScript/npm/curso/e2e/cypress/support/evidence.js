const RUN_STARTED_AT = new Date().toISOString().replace(/[-:]/g, '').slice(0, 15).replace('T', '_');
let stepCounter = 0;

function sanitize(stepName) {
  return stepName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function capture(stepName) {
  stepCounter += 1;
  const fileName = `${String(stepCounter).padStart(3, '0')}_${sanitize(stepName)}`;
  cy.screenshot(`evidencias/cypress-js/${RUN_STARTED_AT}/${fileName}`);
}

module.exports = { capture };
