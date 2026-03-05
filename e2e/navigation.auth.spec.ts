import { test, expect } from "@playwright/test";

test.describe("헤더 네비게이션 - 로그인 상태", () => {
  test("피드 링크 클릭 시 피드 페이지로 이동한다", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });

    // 네비게이션 링크가 로드될 때까지 대기
    await page.waitForSelector('nav a[href="/feed"]', { timeout: 10000 });

    // 피드 링크 클릭
    await page.getByRole("link", { name: /피드/ }).click();

    // 피드 페이지로 이동 대기
    await page.waitForURL(/\/feed/, { timeout: 15000 });
    await expect(page).toHaveURL(/\/feed/);
  });
});