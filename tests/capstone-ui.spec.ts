import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

// Named by case ID, as the brief asks.
test('C3 Sort by price', async ({ page }) => {
  const home = new HomePage(page);

  // Arrange: open the shop and wait until products have loaded.
  await home.open();
  await expect(home.productPrices.first()).toBeVisible();

  // Act: choose the sort the shopper would choose.
  await home.sortBy('Price (Low - High)');


  // Assert: expect.poll retries until the prices are in order, so there is no fixed wait.
  await expect
    .poll(
      async () => {
        const prices = await home.readPrices();

        // Guard against a false pass: zero or one price is trivially "in order".
        if (prices.length < 2) return false;

        // Each price must be >= the one before it (>= so ties don't cause a false failure).
        return prices.every((price, i) => i === 0 || price >= prices[i - 1]);
      },
      { message: 'prices should run from cheapest to most expensive' }
    )
    .toBe(true);
});