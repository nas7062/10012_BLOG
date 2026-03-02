import { test, expect } from "@playwright/test";

test.describe("헤더 네비게이션 - 로그인 상태", () => {

  // 디버그용 - 세션 확인
  test("세션 쿠키 확인", async ({ page, context }) => {
    const cookies = await context.cookies();
    console.log("현재 쿠키:", cookies.map(c => `${c.name}=${c.value.slice(0, 20)}...`));

    await page.goto("/feed");
    console.log("현재 URL:", page.url());

    // /feed에 접근됐는지 확인
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