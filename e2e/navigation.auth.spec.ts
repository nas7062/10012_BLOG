import { test, expect } from "@playwright/test";

test.describe("헤더 네비게이션 - 로그인 상태", () => {
  // 디버그용 - 세션 확인
  test("세션 쿠키 확인", async ({ page, context }) => {
    // 세션 쿠키 확인
    const cookies = await context.cookies();
    const hasSession = cookies.some(cookie => 
      cookie.name.toLowerCase().includes('session-token') ||
      cookie.name === 'authjs.session-token'
    );
    
    console.log("세션 쿠키:", hasSession ? "있음" : "없음");
    console.log("쿠키 목록:", cookies.map(c => c.name).join(", "));
    
    if (!hasSession) {
      throw new Error("세션 쿠키가 없습니다. global.setup이 제대로 실행되지 않았을 수 있습니다.");
    }

    await page.goto("/feed", { waitUntil: "domcontentloaded" });
    
    // 로그인 페이지로 리다이렉트되었는지 확인
    const currentUrl = page.url();
    if (currentUrl.includes("/signin")) {
      throw new Error(`로그인 페이지로 리다이렉트됨: ${currentUrl}. 세션이 제대로 인식되지 않습니다.`);
    }

    await expect(page).toHaveURL(/\/feed/);
  });

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