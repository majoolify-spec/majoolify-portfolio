import { expect, test } from "@playwright/test";

test("@smoke renders the English homepage", async ({ page }) => {
  await page.goto("/en");

  await expect(page.getByRole("heading", { name: /Beautiful software products/i })).toBeVisible();
  await expect(page.getByText("Majoolify • software development agency")).toBeVisible();
});

test("@smoke renders the French homepage", async ({ page }) => {
  await page.goto("/fr");

  await expect(page.getByRole("heading", { name: /Des produits logiciels beaux/i })).toBeVisible();
});

test("@smoke renders case studies and handles redacted content", async ({ page }) => {
  await page.goto("/en/work/ai-frontend-testing-platform");
  await expect(page.getByRole("heading", { name: /AI frontend testing platform/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Live demo/i })).toBeVisible();

  await page.goto("/en/work/confidential-agency-dashboard");
  await expect(page.getByText(/Some client details are intentionally withheld/i)).toBeVisible();
  await expect(page.getByRole("link", { name: /Live demo/i })).toHaveCount(0);
});

test("@smoke protects the admin route", async ({ page }) => {
  await page.goto("/admin");
  await expect(page.getByText(/Portfolio backoffice/i)).toBeVisible();
  await expect(page.getByRole("link", { name: /Sign in with GitHub/i })).toBeVisible();
});

test("@smoke supports a mocked admin publish flow", async ({ page }) => {
  await page.goto("/api/test-auth");
  await page.goto("/admin");

  await expect(page.getByRole("heading", { name: /Majoolify backoffice/i })).toBeVisible();
  await page.getByRole("button", { name: /Publish site config/i }).click();
  await expect(page.getByText(/site-saved/i)).toBeVisible();
});
