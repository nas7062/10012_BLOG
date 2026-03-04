import { test, expect } from "@playwright/test";
import { createPost } from "./helpers/createPost";

test.describe("댓글 E2E", () => {
  // 내부에서 네트워크 대기를 많이 하기 때문에 테스트 타임아웃을 늘린다.
  test.describe.configure({ timeout: 90_000 });

  test.beforeEach(async ({ page }) => {
    const { url } = await createPost(page);
    await page.goto(url, { waitUntil: "domcontentloaded" });

    // 댓글 입력 필드가 로드될 때까지 대기
    await page.waitForSelector('[data-testid="comment-input"]', {
      timeout: 20000,
    });
  });

  test("댓글 작성", async ({ page }) => {
    const text = `e2e-comment-${Date.now()}`;

    await page.getByTestId("comment-input").fill(text);

    // 댓글 작성 요청과 제출을 동시에 실행
    await Promise.all([
      page
        .waitForResponse((response) => {
          const url = response.url();
          // Supabase POST 요청 (Repple 테이블 insert)
          return (
            url.includes("supabase.co") &&
            response.request().method() === "POST" &&
            (url.includes("/rest/v1/Repple") || url.includes("/rest/v1/repple"))
          );
        }, { timeout: 30000 })
        .catch(() => null),
      page.getByTestId("comment-submit").click(),
    ]);

    // 성공 toast 확인 (있으면 확인하고, 없어도 테스트는 계속 진행)
    await page
      .waitForSelector("text=댓글 작성 완료", { timeout: 10000 })
      .catch(() => { });

    // 댓글 리스트가 업데이트될 때까지 대기 (Supabase GET 요청)
    await page
      .waitForResponse((response) => {
        const url = response.url();
        return (
          url.includes("supabase.co") &&
          response.request().method() === "GET" &&
          (url.includes("/rest/v1/Repple") || url.includes("/rest/v1/repple"))
        );
      }, { timeout: 30000 })
      .catch(() => { });

    // 댓글 아이템이 나타날 때까지 대기
    await expect(
      page.getByTestId("comment-content").filter({ hasText: text })
    ).toBeVisible({ timeout: 30000 });
  });

  test("댓글 수정", async ({ page }) => {
    const original = `e2e-comment-${Date.now()}`;
    const updated = `e2e-comment-updated-${Date.now()}`;

    // 작성
    await page.getByTestId("comment-input").fill(original);

    await Promise.all([
      page
        .waitForResponse((response) => {
          const url = response.url();
          return (
            url.includes("supabase.co") &&
            response.request().method() === "POST" &&
            (url.includes("/rest/v1/Repple") || url.includes("/rest/v1/repple"))
          );
        }, { timeout: 30000 })
        .catch(() => null),
      page.getByTestId("comment-submit").click(),
    ]);

    // 댓글 리스트 업데이트 대기
    await page
      .waitForResponse((response) => {
        const url = response.url();
        return (
          url.includes("supabase.co") &&
          response.request().method() === "GET" &&
          (url.includes("/rest/v1/Repple") || url.includes("/rest/v1/repple"))
        );
      }, { timeout: 30000 })
      .catch(() => { });

    const item = page.getByTestId("comment-item").filter({ hasText: original });
    await expect(item).toBeVisible({ timeout: 30000 });

    // 수정 진입
    await item.getByTestId("comment-edit").click();

    // 수정 입력
    await item.getByTestId("comment-edit-input").fill(updated);

    // 수정 완료
    await Promise.all([
      page
        .waitForResponse((response) => {
          const url = response.url();
          return (
            url.includes("supabase.co") &&
            response.request().method() === "PATCH" &&
            (url.includes("/rest/v1/Repple") || url.includes("/rest/v1/repple"))
          );
        }, { timeout: 30000 })
        .catch(() => null),
      item.getByTestId("comment-edit-submit").click(),
    ]);

    // 댓글 리스트 업데이트 대기
    await page
      .waitForResponse((response) => {
        const url = response.url();
        return (
          url.includes("supabase.co") &&
          response.request().method() === "GET" &&
          (url.includes("/rest/v1/Repple") || url.includes("/rest/v1/repple"))
        );
      }, { timeout: 30000 })
      .catch(() => { });

    // 반영 확인
    await expect(
      page.getByTestId("comment-content").filter({ hasText: updated })
    ).toBeVisible({ timeout: 30000 });
  });

  test("댓글 삭제", async ({ page }) => {
    const text = `e2e-comment-${Date.now()}`;

    // 작성
    await page.getByTestId("comment-input").fill(text);

    await Promise.all([
      page
        .waitForResponse((response) => {
          const url = response.url();
          return (
            url.includes("supabase.co") &&
            response.request().method() === "POST" &&
            (url.includes("/rest/v1/Repple") || url.includes("/rest/v1/repple"))
          );
        }, { timeout: 30000 })
        .catch(() => null),
      page.getByTestId("comment-submit").click(),
    ]);

    // 댓글 리스트 업데이트 대기
    await page
      .waitForResponse((response) => {
        const url = response.url();
        return (
          url.includes("supabase.co") &&
          response.request().method() === "GET" &&
          (url.includes("/rest/v1/Repple") || url.includes("/rest/v1/repple"))
        );
      }, { timeout: 30000 })
      .catch(() => { });

    await expect(
      page.getByTestId("comment-content").filter({ hasText: text })
    ).toBeVisible({ timeout: 30000 });

    // 이후 삭제할 때 쓸 locator는 따로 잡기
    const item = page.getByTestId("comment-item").filter({ hasText: text });

    // 삭제 버튼 클릭
    await item.getByTestId("comment-delete").click();

    // 모달이 나타날 때까지 대기 (동적 로드까지 고려해서 넉넉하게)
    // const modal = page.getByTestId("app-modal");
    // await expect(modal).toBeVisible({ timeout: 15000 });

    // // 모달 내부의 "삭제" 버튼 찾기
    // const deleteButton = modal.getByRole("button", { name: "삭제" });
    // await expect(deleteButton).toBeVisible({ timeout: 5000 });

    // // 삭제 버튼 클릭
    // await deleteButton.click();

    // 성공 toast 확인 (이게 가장 확실한 신호)
    await page.waitForSelector("text=댓글 삭제 완료", { timeout: 30000 });

    // 댓글이 사라질 때까지 대기
    await page
      .waitForSelector("text=댓글 삭제 완료", { timeout: 30000 })
      .catch(() => {
        // 토스트가 안 떠도, 아래 DOM 기준 삭제 검증으로 계속 진행
      });

    // 최종 확인
    await expect(item).not.toBeVisible({ timeout: 5000 });
  });
});