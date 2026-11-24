import { test, expect } from '@playwright/test';

test.describe('Toolshop tests', () => {
  test('has expected home page title', async ({ page }) => {
    await page.goto('https://practicesoftwaretesting.com');

    await expect(page).toHaveTitle('Practice Software Testing - Toolshop - v5.0');
  });

  test('searching for "pliers" returns only products with "pliers" in the name', async ({ page }) => {
    await page.goto('https://practicesoftwaretesting.com');

    await page.getByRole('textbox', { name: 'Search' }).fill('pliers');
    await page.getByRole('button', { name: 'Search' }).click();

    const productHeadings = page.getByRole('link').getByRole('heading');

    // 1. Wait until old unfiltered products disappear
    await expect(productHeadings).not.toContainText(['Bolt Cutters']);
    // 2. Wait until the new search result cards actually finish rendering
    await expect(productHeadings.first()).toBeVisible();

    const names = await productHeadings.allTextContents();
    expect(names.length).toBeGreaterThan(0);
    for (const name of names) {
      expect(name.toLowerCase()).toContain('pliers');
    }
  });


  test('invalid login is rejected and shows an error message', async ({ page }) => {
    await page.goto('https://practicesoftwaretesting.com');

    await page.getByRole('link', { name: 'Sign in' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).fill('invalid@example.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('WrongPassword123!');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByText('Invalid email or password')).toBeVisible();
  });
});
