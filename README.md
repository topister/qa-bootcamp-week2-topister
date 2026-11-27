# QA Bootcamp Week 2: Toolshop Test Suite

Automated tests for the [Toolshop](https://practicesoftwaretesting.com) demo shop, written with Playwright and TypeScript. The suite has UI tests (using page objects), API tests (using Playwright's `request` fixture), a flakiness drill, and one Cucumber-js scenario.

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
| `tests/capstone-ui.spec.ts` | UI (page object) | **C3 Sort by price:** choosing "Price (Low - High)" shows prices from cheapest to most expensive |
| `tests/capstone-api.spec.ts` | API | **C4 Add to a cart:** creating a cart returns 201, adding a product returns 200, and the cart contains that product |
| `tests/drill/flaky-fixed.spec.ts` | UI (drill) | Clicking Save shows "Saved" after a random delay, using a retrying assertion |
| `features/shopping-cart.feature` | Cucumber | "Add multiple products to the cart and verify the total" (tagged `@cart-total`) |

`npm test` runs all the Playwright tests. The Cucumber scenario runs separately (see below).

## Capstone: how to reproduce today's work

### Case choices

I chose **C3 Sort by price (UI)** and **C4 Add to a cart (API)**. C3 has a meaningful assertion (the whole price list is in order) and needs a wait on a condition, and C4 creates data, so it has to clean up after itself. I left out C1, C2, C5 and C6; the reasons and the two test-design notes are on my deliverables page.

### 1. Run the two capstone tests

```bash
npx playwright test tests/capstone-ui.spec.ts tests/capstone-api.spec.ts
```

Both should pass.

- **C3** (`tests/capstone-ui.spec.ts`) opens the home page, chooses "Price (Low - High)", and uses `expect.poll` to wait until every price on the page is greater than or equal to the one before it. It also requires at least two prices, so an empty or one-item list cannot pass by accident. The locators and the price parsing live in `pages/HomePage.ts` (`sortBy`, `readPrices`).
- **C4** (`tests/capstone-api.spec.ts`) reads a real product from the catalog, creates a cart (201), adds the product (200), reads the cart back and checks the product id and name. It deletes the cart in a `finally` block, so the cart is removed even if a check fails. It uses the helper in `api/CartsApi.ts` and the full API address.

### 2. Break a test on purpose and read the trace

1. In `tests/capstone-ui.spec.ts`, change the sort option to `'Price (High - Low)'` (the assertion still expects cheapest first).
2. Run the test and record a trace:

   ```bash
   npx playwright test tests/capstone-ui.spec.ts --trace on
   ```

3. Open the trace from the `test-results` folder:

   ```bash
   npx playwright show-trace test-results/<test-folder>/trace.zip
   ```

4. In the viewer, find the failing step (the `expect.poll` assertion), look at the screenshot and the `products` request in the Network tab, and classify the failure.

My result: the sort step succeeded and the page showed the option I chose, so the failure was a **test problem**. The two `401` responses on `me` at page load are the app's login check and are unrelated.

5. Change the option back to `'Price (Low - High)'` and run the test again. It should pass.

### 3. Flakiness drill

`tests/drill/index.html` is a page with a Save button. After a click, "Saved" appears after a random delay of 0 to 1 second.

**Fixed test** (kept in the repo): `tests/drill/flaky-fixed.spec.ts` uses `await expect(page.locator('#status')).toHaveText('Saved')`, which retries until the text appears.

```bash
npx playwright test tests/drill/flaky-fixed.spec.ts --repeat-each=20
```

**Unfixed test** (not kept in the repo, because it fails randomly and would break `npm test`): to recreate it, copy the fixed test and replace the assertion with a fixed wait and a one-time read:

```typescript
await page.waitForTimeout(500);
const message = await page.locator('#status').textContent();
expect(message).toBe('Saved');
```

Then run it with `--repeat-each=20`.

| Version | Result over 20 runs |
|---|---|
| Unfixed (500ms fixed wait, one-time read) | 15 passed, 5 failed |
| Fixed (`toHaveText`, retries) | 20 passed, 0 failed |

Every failure said `Expected: "Saved"` and `Received: ""`, meaning the test read the message before the page had shown it.

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

Only the first scenario is automated. The second scenario (removing an item) is written in the feature file but has no step definitions yet, so the `@cart-total` tag in `cucumber.js` limits the run to the first one.

## Project structure

| Folder | What it is for |
|---|---|
| `tests/` | Playwright test files. Specs contain no locators and no fixed waits. |
| `tests/drill/` | The flakiness drill: `index.html` and the fixed test. |
| `pages/` | Page objects (`HomePage.ts`, `ProductPage.ts`, `CartPage.ts`). Locators and user actions live here. |
| `api/` | `CartsApi.ts`, a helper that wraps the Toolshop API requests. |
| `features/` | The Cucumber feature file. `step-definitions/` holds the steps, and `support/` holds the world and the browser setup hooks. |
| `scripts/` | Helper scripts. `check.ts` is run by `npm run check`. |
| `src/` | Week 2 Day 6 TypeScript exercises (see below). |

## Design notes

- **Page objects:** each page has one class. Page objects find things and perform actions, and every `expect` lives in the test or the step.
- **No fixed waits:** tests wait on conditions with web-first assertions (`expect(...)` and `expect.poll`).
- **Data comes from the page or the API:** tests read names, prices and product ids from the live site, so they don't depend on hard-coded values.
- **API tests use the full API address**, so `playwright.config.ts` (whose `baseURL` points at the UI site) doesn't affect them.
- **API tests clean up after themselves:** carts are deleted in a `finally` block, and tests don't depend on each other's data.
- **API tests check the content type** as well as the status, so an HTML error page from the server fails with a clear message.

## Other scripts

- `npm run check`: checks your `.env` and that you can reach the Toolshop API.
- `npm run test:cucumber`: runs the Cucumber scenario.

## Known limitations

- The Toolshop site is shared, and it is sometimes unavailable or reset (empty catalog, Apache error pages). If an API test fails with an HTML response or `"total":0`, check the site in a browser and rerun later before assuming the test is wrong.
- C3 checks the prices on the first page of results, not the whole catalog.
- The Cucumber scenario uses the product names and prices written in the feature file. If the shop's catalog or prices change, update the feature file.
- Cucumber runs with `tsx` (not `ts-node`), because `ts-node` does not work with the TypeScript version in this repo.

## Week 2, Day 6: TypeScript basics and profile validator

- `src/ts-basics/`: core TypeScript exercises on primitive types, type aliases, optional properties and typed functions.
- `src/profile-validator.ts`: defines a typed `UserProfile` model and an `isNotified(user)` helper that uses optional chaining (`?.`) and nullish coalescing (`??`) to handle missing `settings` or `notifications` fields without runtime errors.