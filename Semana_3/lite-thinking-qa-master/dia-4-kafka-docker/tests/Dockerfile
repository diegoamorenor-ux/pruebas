# Playwright setup for E2E
# Official Playwright install (see https://playwright.dev/docs/intro)
FROM mcr.microsoft.com/playwright:v1.44.0-jammy
WORKDIR /tests
COPY package.json ./
RUN npm install && npx playwright install --with-deps
COPY . .
CMD ["npx", "playwright", "test"]
