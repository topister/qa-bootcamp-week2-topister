import { test, expect } from '@playwright/test';

test.describe('Toolshop tests', () => {
  test('has expected home page title', async ({ page }) => {
    await page.goto('https://practicesoftwaretesting.com');

    await expect(page).toHaveTitle('Practice Software Testing - Toolshop - v5.0');
    
    // Intentionally broken assertion
    // await expect(page).toHaveTitle('Practice Software Testing - Wrong Title');
  });
});