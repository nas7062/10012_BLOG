import { test, expect } from "@playwright/test";


async function loginUser(page: any, email: string, password: string) {
   await page.context().clearCookies();
  await page.goto("/signin");
  await expect(page).toHaveURL(/\/signin/);
  await expect(page.getByTestId("signin-page")).toBeAttached();
  await expect(page.getByTestId("app-modal")).toBeVisible({ timeout: 15000 });
  const emailInput = page.getByTestId("email");
  await expect(emailInput).toBeVisible({ timeout: 15000 });
  await emailInput.fill(email);
  await page.getByTestId("password").fill(password);
  await page.getByTestId("signin-submit").click();
  await page.goto("/");
  await page.waitForURL("/", { timeout: 15000 });
}

test.describe("헤더 네비게이션", () => {
  test("홈 링크로 이동한다", async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector('nav a[href="/"]', { timeout: 5000 });
    await page.getByRole("link", { name: /홈/ }).click();
    await expect(page).toHaveURL("/");
  });

  test("뉴스 링크로 이동한다", async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector('nav a[href="/news"]', { timeout: 5000 });
    await page.getByRole("link", { name: /뉴스/ }).click();
    await page.waitForURL(/\/news/, { timeout: 7000 });
    await expect(page).toHaveURL(/\/news/);
  });

  test("차트 링크로 이동한다", async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector('nav a[href="/chart"]', { timeout: 5000 });
    await page.getByRole("link", { name: /차트/ }).click();
    await page.waitForURL(/\/chart/, { timeout: 5000 });
    await expect(page).toHaveURL(/\/chart/);
  });

  
  test("피드 링크 클릭 시 로그인으로 리다이렉트된다", async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector('nav a[href="/feed"]', { timeout: 5000 });
    await page.getByRole("link", { name: /피드/ }).click();
    await page.waitForURL(/\/signin/, { timeout: 5000 });
    await expect(page).toHaveURL(/\/signin\?callbackUrl=%2Ffeed/);
  });

  
  test.describe("로그인 상태", () => {
    test.beforeEach(async ({ page }) => {
      const testEmail = process.env.TEST_USER_EMAIL || "test@example.com";
      const testPassword = process.env.TEST_USER_PASSWORD || "testpassword";
      await loginUser(page, testEmail, testPassword);
    });

    test("피드 링크 클릭 시 피드 페이지로 이동한다", async ({ page }) => {
      await page.goto("/");
      await page.waitForSelector('nav a[href="/feed"]', { timeout: 5000 });
      await page.getByRole("link", { name: /피드/ }).click();
      await page.waitForURL(/\/feed/, { timeout: 15000, waitUntil: "domcontentloaded" });
      await expect(page).toHaveURL(/\/feed/);
    });
  });
});