import { test, expect } from "@playwright/test";

test.describe("헤더 네비게이션 - 로그인 상태", () => {

  // 디버그용 - 세션 확인
  test("세션 쿠키 확인", async ({ page, context }) => {
    const cookies = await context.cookies();

    await page.goto("/feed");

    await expect(page).toHaveURL(/\/feed/);
  });

  test("피드 링크 클릭 시 피드 페이지로 이동한다", async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector('nav a[href="/feed"]', { timeout: 5000 });
    await page.getByRole("link", { name: /피드/ }).click();
    await page.waitForURL(/\/feed/, { timeout: 15000 });
    await expect(page).toHaveURL(/\/feed/);
  });
});