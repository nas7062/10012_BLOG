import { test, expect } from "@playwright/test";

test.describe("헤더 네비게이션", () => {
  test("홈 링크로 이동한다", async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector('nav a[href="/"]', { timeout: 5000 });
    await page.getByRole("navigation").getByRole("link", { name: "홈" }).click();
    await expect(page).toHaveURL("/");
  });

  test("뉴스 링크로 이동한다", async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector('nav a[href="/news"]', { timeout: 5000 });
    await page.getByRole("link", { name: /뉴스/ }).click();
    await page.waitForURL(/\/news/, { timeout: 7000 });
    await expect(page).toHaveURL(/\/news/);
  });

  test("차트 링크로 이동한다", async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector('nav a[href="/chart"]', { timeout: 5000 });
    await page.getByRole("link", { name: /차트/ }).click();
    await page.waitForURL(/\/chart/, { timeout: 5000 });
    await expect(page).toHaveURL(/\/chart/);
  });

  test("피드 링크 클릭 시 로그인으로 리다이렉트된다", async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector('nav a[href="/feed"]', { timeout: 5000 });
    await page.getByRole("link", { name: /피드/ }).click();
    await page.waitForURL(/\/signin/, { timeout: 5000 });
    await expect(page).toHaveURL(/\/signin\?callbackUrl=%2Ffeed/);
  });
});