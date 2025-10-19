import { test, expect, type Page } from "@playwright/test";

async function submitTarget(page: Page, value: string) {
  await page.fill("#setup-target-input", value);
  await page.locator("[data-locale-key='setup.submit']").click();
  await expect(page.locator("#calculation-view")).toBeVisible();
}

test.describe("Validation flow", () => {
  test("shows an error banner when manual wattage is out of range", async ({ page }) => {
    await page.goto("/");

    await submitTarget(page, "500");

    const manualInput = page.locator("#manual-source-input");
    await manualInput.fill("50");
    await manualInput.press("Enter");

    const errorBanner = page.locator("#error-banner");
    await expect(errorBanner).toBeVisible();
    await expect(errorBanner).not.toHaveText("");
  });
});
