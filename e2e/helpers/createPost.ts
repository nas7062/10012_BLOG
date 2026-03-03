import { expect, Page } from "@playwright/test";
import path from "path";

export async function createPost(page: Page) {
  await page.goto("/write", { waitUntil: "domcontentloaded" });

  const title = `e2e-post-${Date.now()}`;
  await page.getByTestId("write-title").fill(title);

  await page.getByTestId("write-tag").fill("playwright");
  await page.getByTestId("write-tag").press("Enter");

  // 에디터 입력(프로젝트에 맞게 유지)
  await page.waitForSelector(".w-md-editor-text-input", { timeout: 5000 });
  await page.locator(".w-md-editor-text-input").fill("E2E 테스트 본문");

  // 썸네일(선택)
  const filePath = path.resolve(process.cwd(), "public/character.png");
  await page.getByTestId("write-thumbnail-input").first().setInputFiles(filePath);

  await page.getByTestId("write-editor").click();
  await page.getByTestId("write-submit").click();

  await expect(page).toHaveURL(/\/[^/]+\/\d+$/, { timeout: 20000 });

  const url = page.url();
  const m = url.match(/\/([^/]+)\/(\d+)$/);
  if (!m) throw new Error(`상세 URL 파싱 실패: ${url}`);

  const nameEncoded = m[1];
  const id = Number(m[2]);

  return { title, url, id, nameEncoded };
}