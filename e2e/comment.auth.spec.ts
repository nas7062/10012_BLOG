import { test, expect } from "@playwright/test";
import { createPost } from "./helpers/createPost";

test.describe("댓글 E2E", () => {
  test.beforeEach(async ({ page }) => {
    const { url } = await createPost(page);
    await page.goto(url, { waitUntil: "domcontentloaded" });
  });

  test("댓글 작성", async ({ page }) => {
    const text = `e2e-comment-${Date.now()}`;

    await page.getByTestId("comment-input").fill(text);
    await page.getByTestId("comment-submit").click();

    const item = page.getByTestId("comment-item").filter({ hasText: text });
    await expect(item).toBeVisible({ timeout: 20000 });
  });

  test("댓글 수정", async ({ page }) => {
    const original = `e2e-comment-${Date.now()}`;
    const updated = `e2e-comment-updated-${Date.now()}`;

    // 작성
    await page.getByTestId("comment-input").fill(original);
    await page.getByTestId("comment-submit").click();

    const item = page.getByTestId("comment-item").filter({ hasText: original });
    await expect(item).toBeVisible({ timeout: 20000 });

    // 수정 진입
    await item.getByTestId("comment-edit").click();

    // 수정 입력
    await item.getByTestId("comment-edit-input").fill(updated);

    // 수정 완료
    await item.getByTestId("comment-edit-submit").click();

    // 반영 확인
    await expect(page.getByTestId("comment-content").filter({ hasText: updated }))
      .toBeVisible({ timeout: 20000 });
  });

  test("댓글 삭제", async ({ page }) => {
    const text = `e2e-comment-${Date.now()}`;

    // 작성
    await page.getByTestId("comment-input").fill(text);
    await page.getByTestId("comment-submit").click();

    const item = page.getByTestId("comment-item").filter({ hasText: text });
    await expect(item).toBeVisible({ timeout: 20000 });

    // 삭제
    await item.getByTestId("comment-delete").click();

    // 사라짐 확인
    await expect(item).toHaveCount(0, { timeout: 20000 });
  });
});