import { test, expect } from '@playwright/test';


test('invalid login is rejected and shows an error message', async ({ page }) => {
    await page.goto('https://practicesoftwaretesting.com');

    await page.getByRole('link', { name: 'Sign in' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).fill('invalid@example.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('WrongPassword123!');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByText('Invalid email or password')).toBeVisible();
  });