# QA Bootcamp Week 2: Toolshop Test Suite - Day 9 Updates

Automated tests for the [Toolshop](https://practicesoftwaretesting.com) demo shop, written with Playwright and TypeScript. The suite has UI tests (using page objects), API tests (using Playwright's `request` fixture) and one Cucumber-js scenario.

## Prerequisites

- [Node.js](https://nodejs.org/) (current LTS version)
- [Git](https://git-scm.com/)

## Set up and run (3 steps)

1. **Install** the dependencies and the Chromium browser:

   ```bash
   npm install
   npx playwright install chromium
   ```

2. **Copy** `.env.example` to `.env`:

   ```bash
   # macOS / Linux / Git Bash
   cp .env.example .env

   # Windows PowerShell
   copy .env.example .env
   ```

   `.env` already holds the Toolshop website URL (`TOOLSHOP_URL`) and API URL (`TOOLSHOP_API_URL`). Only change them if your trainer gives you different ones.

3. **Run** the tests:

   ```bash
   npm test
   ```

To run a single file, use `npx playwright test tests/<file>.spec.ts`. Add `--headed` to watch the browser.

> **Warning:** never commit `.env`. It is listed in `.gitignore`. Do not remove it from there.

## What the suite covers

| Test file | Type | What it checks |
|---|---|---|
| `tests/invalid-login.spec.ts` | UI | An invalid login is rejected and shows an error message |
| `tests/home-title.spec.ts` | UI | The home page has the expected title |
| `tests/search-pliers.spec.ts` | UI | Searching for "pliers" returns only products with "pliers" in the name |
| `tests/cart-totals.spec.ts` | UI (page objects) | TO-35 / DB-101: add multiple products to the cart and verify prices and total |
| `tests/products-api.spec.ts` | API | `GET /products` returns 200 and a non-empty product list |
| `tests/carts-api.spec.ts` | API | Creates a cart, adds a product and checks the response fields; requesting a cart id that doesn't exist returns 404 |
| `features/shopping-cart.feature` | Cucumber | "Add multiple products to the cart and verify the total" (tagged `@cart-total`) |

`npm test` runs the Playwright tests (the first six rows). The Cucumber scenario runs separately (see below).

## Cucumber

The feature file describes the cart flow in plain English (Given / When / Then). Step definitions connect each sentence to code, and they reuse the same page objects as the Playwright tests, so the steps contain no locators.

```bash
npm run test:cucumber
```

To watch the browser, set `HEADED=true` first:

```powershell
# Windows PowerShell
$env:HEADED="true"; npm run test:cucumber
```

```bash
# macOS / Linux / Git Bash
HEADED=true npm run test:cucumber
```

Only the first scenario ("Add multiple products to the cart and verify the total") is automated. The second scenario (removing an item) is written in the feature file but has no step definitions yet, so the `@cart-total` tag in `cucumber.js` limits the run to the first one.

## Project structure

| Folder | What it is for |
|---|---|
| `tests/` | Playwright test files. Specs contain no locators and no fixed waits. |
| `pages/` | Page objects (`HomePage.ts`, `ProductPage.ts`, `CartPage.ts`). Locators and user actions live here. |
| `api/` | `CartsApi.ts`, a helper that wraps the Toolshop API requests. |
| `features/` | The Cucumber feature file. `step-definitions/` holds the steps, and `support/` holds the world and the browser setup hooks. |
| `scripts/` | Helper scripts. `check.ts` is run by `npm run check`. |
| `src/` | Week 2 Day 6 TypeScript exercises (see below). |

## Design notes

- **Page objects:** each page has one class. Page objects find things and perform actions, and every `expect` lives in the test or the step.
- **No fixed waits:** tests wait on conditions with web-first `expect` assertions.
- **Data comes from the page:** the cart test chooses in-stock products and reads each name and price from the product page, and compares money in cents, so it doesn't depend on hard-coded prices.
- **API tests use the full API address**, so `playwright.config.ts` (whose `baseURL` points at the UI site) doesn't affect them.
- **API tests clean up after themselves:** the cart test deletes the cart in a `finally` block, so it is removed even if a check fails. Tests don't depend on each other's data.
- **API tests check the content type** as well as the status, so an HTML error page from the server fails with a clear message.

## Other scripts

- `npm run check`: checks your `.env` and that you can reach the Toolshop API. It prints your Node version, the HTTP status, the number of products and `PASS`.
- `npm run test:cucumber`: runs the Cucumber scenario.

## Known limitations

- The Toolshop site is shared, and it is sometimes unavailable or reset (empty catalog, Apache error pages). If an API test fails with an HTML response or `"total":0`, check the site in a browser and rerun later before assuming the test is wrong.
- The Cucumber scenario uses the product names and prices written in the feature file. If the shop's catalog or prices change, update the feature file.
- Cucumber runs with `tsx` (not `ts-node`), because `ts-node` does not work with the TypeScript version in this repo.

## Week 2, Day 6: TypeScript basics and profile validator

- `src/ts-basics/`: core TypeScript exercises on primitive types, type aliases, optional properties and typed functions.
- `src/profile-validator.ts`: defines a typed `UserProfile` model and an `isNotified(user)` helper that uses optional chaining (`?.`) and nullish coalescing (`??`) to handle missing `settings` or `notifications` fields without runtime errors.