import { test, expect } from "@playwright/test";

test("글 작성 후 상세 페이지로 이동한다", async ({ page }) => {
  const title = `e2e-${Date.now()}`;

  await page.goto("/write");
  // 2) 제목 입력
  await page.getByTestId("write-title").fill(title);

  // 3) 태그 입력 + Enter
  await page.getByTestId("write-tag").fill("playwright");
  await page.getByTestId("write-tag").press("Enter");

  // 4) 에디터 본문 입력
  // TuiEditor 내부에 testid가 박혀있다는 전제
  await page.getByTestId("write-editor").click();
  await page.keyboard.type("E2E content");

  // 5) 제출
  await page.getByTestId("write-submit").click();

  // 6) 상세 URL로 이동했는지 확인: /{name}/{id}
  await expect(page).toHaveURL(/\/[^/]+\/\d+$/, { timeout: 15000 });

  // 7) 상세에 제목 표시 확인(상세 페이지에 title이 렌더된다는 전제)
  await expect(page.getByText(title)).toBeVisible({ timeout: 15000 });
});