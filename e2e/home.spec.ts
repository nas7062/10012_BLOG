import { test, expect } from "@playwright/test";

test.describe("홈 페이지", () => {
  test("페이지 타이틀에 10012가 포함된다", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/10012/);
  });

  test("로고 이미지가 보인다", async ({ page }) => {
    await page.goto("/");
    const logo = page.getByRole("img", { name: "로고" });
    await expect(logo).toBeVisible();
  });

  test("로고 클릭 시 홈(/)으로 이동한다", async ({ page }) => {
    await page.goto("/feed");
    await page.getByRole("img", { name: "로고" }).click();
    await expect(page).toHaveURL("/");
  });
});
