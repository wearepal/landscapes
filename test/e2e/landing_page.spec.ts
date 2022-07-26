import { test, expect, type Page } from "@playwright/test";

test.describe("Landing Page layout", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("page title is set", async ({ page }) => {
    await expect(page).toHaveTitle("AI Landscape Modelling Tool");
  });

  test("sign in option is shown", async ({ page }) => {
    const signIn = page.locator("text=Sign In/Register");

    // Click the get started link.
    await expect(page.locator("input[name='email']")).toHaveCount(0);
    await expect(page.locator("input[name='password']")).toHaveCount(0);

    await signIn.click();

    await expect(page.locator("input[name='email']")).toBeVisible();
    await expect(page.locator("input[name='password']")).toBeVisible();
  });
});
