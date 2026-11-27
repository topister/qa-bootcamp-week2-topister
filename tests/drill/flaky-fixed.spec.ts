import { test, expect } from '@playwright/test';
import { pathToFileURL } from 'url';
import path from 'path';

test('Drill (fixed): Save shows a message', async ({ page }) => {
  const fileUrl = pathToFileURL(path.join(__dirname, 'index.html')).href;
  await page.goto(fileUrl);

  await page.getByRole('button', { name: 'Save' }).click();

  // No fixed wait. toHaveText re-checks the element until it contains "Saved"
  // or the 5-second default timeout runs out. The page's longest delay is 1 second,
  // so 5 seconds is plenty and no custom timeout is needed.
  await expect(page.locator('#status')).toHaveText('Saved');
});