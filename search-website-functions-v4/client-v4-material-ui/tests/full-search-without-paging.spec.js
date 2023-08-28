import { test, expect } from '@playwright/test';
import { getTestTimeStamp } from "./setup";

test('full e2e search without paging', async ({ page }) => {
  await page.goto('https://http://localhost:3000/');
  await page.getByLabel('What are you looking for?').click();
  await page.getByLabel('What are you looking for?').fill('tree');
  await page.getByRole('option', { name: 'The Giving Tree' }).click();
  await page.getByRole('button', { name: 'Search' }).nth(1).click();
  await page.locator('li').filter({ hasText: 'Authors' }).getByTestId('ExpandMoreIcon').click();
  await page.locator('[id="David\\ Eddings"]').getByRole('checkbox').check();
  await page.getByTestId('ExpandMoreIcon').click();

  // wait for facets so they appear in screenshot
  await page.waitForTimeout(5000);
  await page.screenshot({ path:  `./test-results/${getTestTimeStamp()}-test-image-full-search-without-paging.spec.png`, fullPage: true });


  await page.locator('#en-GB').getByRole('checkbox').check();
  await page.getByRole('link', { name: 'King of the Murgos King of the Murgos' }).click();
  await page.getByRole('tab', { name: 'Raw Data' }).click();
  await page.getByText('{ "authors": [ "David Eddings" ], "average_rating": 4.1, "best_book_id": 189811,').click();
});
