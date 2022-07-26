import { expect, test } from "@playwright/test";
const { chromium } = require("playwright");

const USERNAME = "Andrew Anderson";
const EMAIL = "andrew@anderson.com";
const PASSWORD = "AndrewAnderson";
const _searchString = "text=" + USERNAME;

test.describe("Registering a user", () => {
  test("Register", async ({ page, context }) => {
    await page.goto("/");
    await page.locator("text=Sign In/Register").click();
    await page.locator("text=Click here to sign up").click();
    await page.locator('input[name="user[name]"]').fill(USERNAME);
    await page.locator('input[name="user[email]"]').fill(EMAIL);
    await page.locator('input[name="user[password]"]').fill(PASSWORD);
    await page.locator("input[value='Create Account']").click();
  });
});

test.describe("Log In", () => {
  test.beforeEach(async ({ page, browser }) => {
    await page.goto("/");
    await page.locator("text=Sign In/Register").click();
    await page.locator('input[name="email"]').fill(EMAIL);
    await page.locator('input[name="password"]').fill(PASSWORD);
    await page.locator("input[value='Sign In']").click();
  });
  test("User Dropdown Shown", async ({ page }) => {
    await expect(page.locator(_searchString)).toBeVisible();
  });

  test("Log out", async ({ page }) => {
    await page.locator(_searchString).click();
    await page.locator("text=Sign Out").click();
    await expect(page.locator("text=Sign In/Register")).toBeVisible();
  });
});
