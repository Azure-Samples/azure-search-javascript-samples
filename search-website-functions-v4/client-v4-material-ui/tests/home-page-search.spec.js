import { test, expect } from '@playwright/test';
import { getTestTimeStamp } from "./setup";

test('home page search button', async ({ page }) => {
  await page.goto('https://http://localhost:3000/');
  await page.getByLabel('What are you looking for?').click();
  await page.getByLabel('What are you looking for?').fill('boy');
  
  // wait for auto complete suggestions so they appear in screenshot
  await page.waitForTimeout(5000);
  await page.screenshot({ path:  `./test-results/${getTestTimeStamp()}-test-image-home-page-search.spec.png`, fullPage: true });

  await page.getByRole('button', { name: 'Search' }).nth(1).click();
  await page.goto('https://http://localhost:3000/');
});