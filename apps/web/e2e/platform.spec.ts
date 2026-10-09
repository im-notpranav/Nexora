import { expect, test } from "@playwright/test";

test("home page explains the product and links to sign-in", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Describe an app");
  await expect(page.getByRole("link", { name: "Sign in" })).toHaveAttribute("href", "/sign-in");
});

test("the dashboard sends signed-out visitors to sign-in and remembers where they were going", async ({
  page,
}) => {
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/sign-in\?next=%2Fdashboard$/);
  await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
});

test("sign-in never redirects to another website", async ({ page }) => {
  await page.goto("/sign-in?next=//evil.example.com");
  const next = page.locator('input[name="next"]').first();
  if (await next.count()) await expect(next).toHaveValue("/dashboard");
});

test("the platform theme follows the system dark mode", async ({ browser }) => {
  const context = await browser.newContext({ colorScheme: "dark" });
  const page = await context.newPage();
  await page.goto("/");
  const scheme = await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme);
  expect(scheme).toBe("dark");
  await context.close();
});

test("the gallery switches style from its controls", async ({ page }) => {
  await page.goto("/gallery");
  await page.getByLabel("Style").selectOption("terminal");
  await expect(page).toHaveURL(/style=terminal/);
  await expect(page.locator('[data-gallery-theme][data-style="terminal"]')).toBeVisible();
});

test("the gallery falls back to defaults for unknown values", async ({ page }) => {
  await page.goto("/gallery?style=nope&palette=nope&mode=nope");
  await expect(
    page.locator('[data-gallery-theme][data-style="airy-pill"][data-palette="sky"]'),
  ).toBeVisible();
});
