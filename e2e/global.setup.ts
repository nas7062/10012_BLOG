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

  console.log("로그인 시작...");

  await page.goto("/signin?e2e=1", { waitUntil: "domcontentloaded" });

  console.log("모달 대기 중...");
  const modal = page.getByTestId("signin-modal");
  await expect(modal).toBeVisible({ timeout: 30000 });

  console.log("로그인 정보 입력 중...");
  await modal.getByTestId("email").fill(email, { timeout: 10000 });
  await modal.getByTestId("password").fill(password, { timeout: 10000 });

  console.log("로그인 제출 중...");

  // 제출 버튼 클릭
  await modal.getByTestId("signin-submit").click();

  // 로그인 완료 대기 - 세션 쿠키가 설정될 때까지
  console.log("세션 쿠키 확인 중...");

  let hasSessionCookie = false;
  const maxAttempts = 50; // 최대 50번 시도 (약 10초)

  for (let i = 0; i < maxAttempts; i++) {
    try {
      // context.cookies()로 확인 (더 확실함)
      const cookies = await context.cookies();
      hasSessionCookie = cookies.some(cookie => {
        const name = cookie.name.toLowerCase();
        return (
          name.includes('session-token') ||           // session-token 이 들어가면 다 인정
          name === 'authjs.session-token' ||
          name === '__secure-authjs.session-token' ||
          name === 'next-auth.session-token'
        );
      });

      if (hasSessionCookie) {
        const sessionCookie = cookies.find(c =>
          c.name.toLowerCase().includes('authjs.session-token')
        );
        console.log(`✅ 세션 쿠키 확인됨 (${i + 1}번째 시도): ${sessionCookie?.name}`);
        break;
      }

      // 쿠키가 없으면 200ms 대기 후 재시도
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
    console.log("최종 쿠키 상태:");
    finalCookies.forEach(cookie => {
      console.log(`  - ${cookie.name}`);
    });

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
  console.log("세션 상태 저장 중...");
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
      console.log("저장된 쿠키들:");
      savedState.cookies?.forEach((cookie: any) => {
        console.log(`  - ${cookie.name}`);
      });
      throw new Error("세션 저장 실패: 세션 쿠키가 저장되지 않았습니다.");
    }

    console.log("✅ 로그인 세션 저장 완료:", authFile);
  } catch (error) {
    console.error("세션 상태 저장 실패:", error);
    throw error;
  }
});