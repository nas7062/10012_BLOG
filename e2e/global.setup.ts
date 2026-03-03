import { test as setup, expect } from "@playwright/test";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const authFile = "playwright/.auth/user.json";
const email = process.env.TEST_USER_EMAIL!;
const password = process.env.TEST_USER_PASSWORD!;

setup("로그인 세션 저장", async ({ page }) => {
  await page.goto("/signin?e2e=1", { waitUntil: "domcontentloaded" });

  const modal = page.getByTestId("signin-modal");
  await expect(modal).toBeVisible({ timeout: 15000 });

  await modal.getByTestId("email").fill(email);
  await modal.getByTestId("password").fill(password);

  // 기본 submit 네비게이션 방지 + click 안정화
  await Promise.all([
    // 네비게이션이 발생할 수도 있으니 wait를 같이 건다
    page.waitForLoadState("networkidle").catch(() => { }),
    modal.getByTestId("signin-submit").click({ timeout: 15000 }),
  ]);

  //  URL 이동을 기다리지 말고, 세션 쿠키가 생길 때까지 기다린다
  await expect
    .poll(
      async () => {
        const cookies = await page.context().cookies();
        const session = cookies.find(
          (c) =>
            c.name.includes("session-token") ||
            c.name.includes("authjs.session-token") ||
            c.name === "next-auth.session-token" ||
            c.name === "authjs.session-token"
        );
        return Boolean(session);
      },
      { timeout: 20000, intervals: [250, 500, 1000] }
    )
    .toBeTruthy();

  fs.mkdirSync("playwright/.auth", { recursive: true });
  await page.context().storageState({ path: authFile });
});