const fs = require('fs');
const path = require('path');

const RUN_STARTED_AT = new Date().toISOString().replace(/[-:]/g, '').slice(0, 15).replace('T', '_');
let stepCounter = 0;

function sanitize(stepName) {
  return stepName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function capture(page, stepName) {
  stepCounter += 1;
  const fileName = `${String(stepCounter).padStart(3, '0')}_${sanitize(stepName)}.png`;
  const dir = path.join('evidencias', 'playwright-js', RUN_STARTED_AT);
  fs.mkdirSync(dir, { recursive: true });
  await page.screenshot({ path: path.join(dir, fileName), fullPage: true });
}

module.exports = { capture };
