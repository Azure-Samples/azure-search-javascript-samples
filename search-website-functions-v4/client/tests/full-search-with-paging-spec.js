import { test, expect } from "@playwright/test";
import { getTestTimeStamp } from "./setup";

test("full search with paging", async ({ page }) => {
  await page.goto("https://http://localhost:3000/");

  await page.getByLabel("What are you looking for?").click();
  await page.getByLabel("What are you looking for?").fill("boy");

  await page.getByRole("button", { name: "Search" }).nth(1).click();
  await page.getByLabel("Go to next page").click();

  await page
    .getByRole("link", {
      name: 'Bloody Jack: Being an Account of the Curious Adventures of Mary "Jacky" Faber, Ship\'s Boy Bloody Jack: Being an Account of th...',
    })
    .click();

  // wait for auto complete suggestions so they appear in screenshot
  await page.screenshot({
    path: `./test-results/${getTestTimeStamp()}-test-image-full-search-with-paging-spec.png`,
    fullPage: true,
  });

  await page.getByRole("tab", { name: "Raw Data" }).click();

  await page
    .getByText(
      '{ "authors": [ "L.A. Meyer" ], "average_rating": 4.11, "best_book_id": 295649, "'
    )
    .click();
});
