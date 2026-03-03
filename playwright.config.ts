import { defineConfig, devices } from "@playwright/test";
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
/**
 * Next.js 앱 E2E 테스트 설정
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL ?? "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: 'setup',
      testMatch: /global\.setup\.ts/,
    },
    {
      // 비로그인 테스트 - 로그인 상태 테스트 파일 제외
      name: 'chromium - 비로그인',
      use: { ...devices['Desktop Chrome'] },
      testIgnore: /.*auth.*/,  // auth 관련 파일 제외
    },
    {
      // 로그인 테스트 - 별도 파일만 실행
      name: 'chromium - 로그인',
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/user.json',
      },
      testMatch: /.*auth.*/,  // auth 관련 파일만 실행
    },
  ],

  webServer: process.env.CI
    ? {
      command: "npm run build && npm run start",
      url: "http://localhost:3000",
      reuseExistingServer: false,
      timeout: 120_000,
    }
    : undefined,
});
