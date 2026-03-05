import { test as setup, expect } from "@playwright/test";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const authFile = "playwright/.auth/user.json";
const email = process.env.TEST_USER_EMAIL!;
const password = process.env.TEST_USER_PASSWORD!;

setup("로그인 세션 저장", async ({ page, context }) => {
  if (!email || !password) {
    throw new Error("TEST_USER_EMAIL 또는 TEST_USER_PASSWORD가 설정되지 않았습니다.");
  }

  //signin 페이지 이동 (e2e 환경에서만 )
  await page.goto("/signin?e2e=1", { waitUntil: "domcontentloaded" });

  // SignInmodal 대기 
  const modal = page.getByTestId("signin-modal");
  await expect(modal).toBeVisible({ timeout: 30000 });

  // email,password 입력
  await modal.getByTestId("email").fill(email, { timeout: 10000 });
  await modal.getByTestId("password").fill(password, { timeout: 10000 });


  // 로그인 버튼 클릭
  await modal.getByTestId("signin-submit").click();

  // 세션 쿠키 확인
  let hasSessionCookie = false;
  const maxAttempts = 50; // 최대 50번 시도

  for (let i = 0; i < maxAttempts; i++) {
    try {
      // context.cookies()로 확인 
      const cookies = await context.cookies();
      hasSessionCookie = cookies.some(cookie => {
        const name = cookie.name.toLowerCase();
        return (
          name.includes('session-token') ||
          name === 'authjs.session-token' ||
          name === '__secure-authjs.session-token' ||
          name === 'next-auth.session-token'
        );
      });

      // 세션 쿠기 있으면 종료
      if (hasSessionCookie) {
        const sessionCookie = cookies.find(c =>
          c.name.toLowerCase().includes('authjs.session-token')
        );
        break;
      }

      // 쿠키가 없으면 재시도
      if (i < maxAttempts - 1) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    } catch (e) {
      if (e instanceof Error && (e.message.includes('closed') || e.message.includes('Target closed'))) {
        console.log("⚠️ 페이지가 닫혔습니다.");
        break;
      }
      throw e;
    }
  }

  // 쿠키가 확인되지 않았으면 실패
  if (!hasSessionCookie) {
    // 최종 쿠키 확인 및 로그
    const finalCookies = await context.cookies();

    // 에러 메시지 확인
    const errorMessage = await page.locator('text=로그인을 다시 시도해주세요').isVisible({ timeout: 2000 }).catch(() => false);
    if (errorMessage) {
      try {
        await page.screenshot({ path: "test-results/login-error.png", fullPage: true });
      } catch { }
      throw new Error("로그인 실패: 잘못된 자격증명 또는 서버 오류");
    }

    try {
      await page.screenshot({ path: "test-results/login-no-cookie.png", fullPage: true });
    } catch { }
    throw new Error("로그인 실패: 세션 쿠키가 설정되지 않았습니다.");
  }

  // 세션 상태 저장
  fs.mkdirSync("playwright/.auth", { recursive: true });

  try {
    await context.storageState({ path: authFile });

    // 저장된 쿠키 확인
    const savedState = JSON.parse(fs.readFileSync(authFile, 'utf-8'));
    const hasSavedCookie = savedState.cookies?.some((cookie: any) => {
      const name = cookie.name.toLowerCase();
      return (
        name.includes('session-token') ||
        name === 'authjs.session-token' ||
        name === '__secure-authjs.session-token'
      );
    });

    if (!hasSavedCookie) {
      savedState.cookies?.forEach((cookie: any) => {
        console.log(`쿠키 저장- ${cookie.name}`);
      });
      throw new Error("세션 저장 실패: 세션 쿠키가 저장되지 않았습니다.");
    }

  } catch (error) {
    console.error("세션 상태 저장 실패:", error);
    throw error;
  }
});