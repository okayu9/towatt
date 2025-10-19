import { test, expect, type Page } from "@playwright/test";

async function pressKey(page: Page, key: string) {
  await page.locator(`.keypad__key[data-key="${key}"]`).click();
}

test.describe("Microwave Conversion Flow", () => {
  test("completes the happy path", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("#setup-view")).toBeVisible();

    await page.fill("#setup-target-input", "500");
    await page.locator("[data-locale-key='setup.submit']").click();

    await expect(page.locator("#calculation-view")).toBeVisible();

    await page.getByRole("button", { name: "600W" }).click();
    await expect(page.locator("#time-step")).toBeVisible();

    await pressKey(page, "0");
    await pressKey(page, "1");
    await pressKey(page, "3");
    await pressKey(page, "0");

    await expect(page.locator("#result-step")).toBeVisible();
    await expect(page.locator("#result-display")).toHaveText("01:48");
    await expect(page.locator("#result-seconds")).toContainText("108");
  });
});
