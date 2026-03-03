import { test, expect } from "@playwright/test";
import path from "path";
test("글 작성 후 상세 페이지로 이동한다", async ({ page }) => {
  await page.goto("/write", { waitUntil: "domcontentloaded" });

  const title = `e2e-테스트-${Date.now()}`;

  await page.getByTestId("write-title").fill(title);

  await page.getByTestId("write-tag").fill("playwright");
  await page.getByTestId("write-tag").press("Enter");

  // CodeMirror 에디터 입력 영역 직접 타겟
  await page.waitForSelector(".w-md-editor-text-input", { timeout: 5000 });
  await page.locator(".w-md-editor-text-input").fill("E2E 테스트");

  //  썸네일 업로드
  const filePath = path.resolve(process.cwd(), "public/character.png");
  const fileInput = page.getByTestId("write-thumbnail-input").first();
  await fileInput.setInputFiles(filePath);

  await page.getByTestId("write-submit").click();

  await expect(page).toHaveURL(/\/[^/]+\/\d+$/, { timeout: 20000 });
  await expect(page.getByRole("heading", { name: title })).toBeVisible({ timeout: 20000 });
});