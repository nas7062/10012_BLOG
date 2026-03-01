import { test, expect } from "@playwright/test";

test.describe("헤더 네비게이션", () => {
  test("홈 링크로 이동한다", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /홈/ }).click();
    await expect(page).toHaveURL("/");
  });

  test("피드 링크로 이동한다", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /피드/ }).click();
    await expect(page).toHaveURL(/\/feed/);
  });

  test("뉴스 링크로 이동한다", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /뉴스/ }).click();
    await expect(page).toHaveURL(/\/news/);
  });

  test("차트 링크로 이동한다", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /차트/ }).click();
    await expect(page).toHaveURL(/\/chart/);
  });
});
