import { test as setup, expect } from '@playwright/test';
import fs from 'fs';
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
const authFile = 'playwright/.auth/user.json';
const email = process.env.TEST_USER_EMAIL;
const password = process.env.TEST_USER_PASSWORD;

if (!email || !password) {
  throw new Error("TEST_USER_EMAIL/TEST_USER_PASSWORD가 설정되지 않았습니다. (CI면 GitHub Secrets+env 주입 필요)");
}


setup('로그인 세션 저장', async ({ page }) => {
  await page.goto('/signin');
  await expect(page.getByTestId('app-modal')).toBeVisible({ timeout: 15000 });
  await expect(page.getByTestId('email')).toBeVisible({ timeout: 15000 });

  await page.getByTestId('email').fill(email);
  await page.getByTestId('password').fill(password);
  await page.getByTestId('signin-submit').click();

  // signin 페이지 벗어날 때까지 대기
  await page.waitForURL((url) => !url.pathname.includes('/signin'), { timeout: 15000 });

  // ✅ 세션 쿠키 생성 확인
  const cookies = await page.context().cookies();
  const sessionCookie = cookies.find(c =>
    c.name.includes('session-token') ||
    c.name.includes('authjs.session-token') ||
    c.name === 'next-auth.session-token' ||
    c.name === 'authjs.session-token'
  );

  console.log('모든 쿠키:', cookies.map(c => c.name));

  if (!sessionCookie) {
    throw new Error(`세션 쿠키가 없습니다. 로그인 실패. 쿠키 목록: ${cookies.map(c => c.name).join(', ')}`);
  }

  console.log('세션 쿠키 확인:', sessionCookie.name);

  fs.mkdirSync('playwright/.auth', { recursive: true });
  await page.context().storageState({ path: authFile });
});