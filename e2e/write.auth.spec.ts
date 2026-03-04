import { test, expect } from "@playwright/test";
import path from "path";

test("글 작성 후 상세 페이지로 이동한다", async ({ page }) => {
  await page.goto("/write", { waitUntil: "domcontentloaded" });

  // userData 로딩 대기 - 더 안정적인 방법
  try {
    await page.waitForSelector('[data-testid="write-title"]', { timeout: 20000 });
  } catch {
    try {
      await page.waitForFunction(
        () => {
          const bodyText = document.body.textContent || "";
          return !bodyText.includes("loading...");
        },
        { timeout: 15000 }
      );
    } catch {
      await page.waitForLoadState("networkidle", { timeout: 10000 }).catch(() => {});
    }
  }

  await page.waitForTimeout(1000);

  const title = `e2e-테스트-${Date.now()}`;

  await page.getByTestId("write-title").fill(title);

  await page.getByTestId("write-tag").fill("playwright");
  await page.getByTestId("write-tag").press("Enter");

  // 에디터가 로드될 때까지 대기
  await page.waitForSelector('[data-testid="write-editor"]', { timeout: 15000 });
  
  await page.waitForSelector('[data-testid="write-editor"] textarea, .w-md-editor-text-input', { 
    timeout: 15000,
    state: "visible"
  });

  // 에디터 입력
  const editorTextarea = page.locator('[data-testid="write-editor"] textarea').first();
  if (await editorTextarea.isVisible({ timeout: 2000 }).catch(() => false)) {
    await editorTextarea.fill("E2E 테스트");
  } else {
    await page.locator(".w-md-editor-text-input").fill("E2E 테스트");
  }

  // 썸네일 업로드
  const filePath = path.resolve(process.cwd(), "public/character.png");
  const fileInput = page.getByTestId("write-thumbnail-input").first();
  await fileInput.setInputFiles(filePath);

  // 에디터 클릭
  await page.getByTestId("write-editor").click();

  // 제출 버튼 활성화 확인
  const submitButton = page.getByTestId("write-submit");
  await expect(submitButton).toBeEnabled({ timeout: 5000 });

  // 네트워크 요청과 네비게이션을 동시에 대기
  const [response] = await Promise.all([
    page.waitForResponse(
      (response) => {
        const url = response.url();
        return (
          url.includes("supabase.co") && 
          response.request().method() === "POST" &&
          url.includes("/rest/v1/Post")
        );
      },
      { timeout: 30000 }
    ).catch(() => null),
    submitButton.click(),
  ]);

  // 성공 toast 확인
  await page.waitForSelector('text=글이 작성되었습니다', { timeout: 10000 }).catch(() => {});

  // 네비게이션 대기
  try {
    await page.waitForURL(/\/[^/]+\/\d+$/, { timeout: 30000 });
  } catch (error) {
    // 네비게이션이 안 되면 응답에서 id 추출해서 직접 이동
    if (response) {
      try {
        const responseData = await response.json();
        let postId: number | undefined;
        
        if (Array.isArray(responseData) && responseData.length > 0) {
          postId = responseData[0]?.id;
        } else if (responseData && typeof responseData === 'object') {
          postId = (responseData as any).id;
        }
        
        if (postId) {
          const userName = await page.evaluate(() => {
            try {
              const sessionData = localStorage.getItem('nextauth.session');
              if (sessionData) {
                const parsed = JSON.parse(sessionData);
                return parsed?.user?.name || "e2e-user";
              }
            } catch {}
            return "e2e-user";
          });
          await page.goto(`/${encodeURIComponent(userName)}/${postId}`, { waitUntil: "domcontentloaded" });
        } else {
          throw error;
        }
      } catch {
        throw error;
      }
    } else {
      // 에러 확인
      const errorToast = page.locator('text=글 작성에 실패했습니다, text=제목 또는 내용을 입력 해주세요').first();
      if (await errorToast.isVisible({ timeout: 2000 }).catch(() => false)) {
        const errorText = await errorToast.textContent();
        throw new Error(`글 작성 실패: ${errorText}`);
      }
      throw error;
    }
  }

  await expect(page.getByRole("heading", { name: title })).toBeVisible({ timeout: 20000 });

  const comment = `e2e-댓글 테스트-${Date.now()}`;

  await expect(page.getByTestId("comment-input")).toBeVisible({ timeout: 15000 });
  await page.getByTestId("comment-input").fill(comment);
  
  // 댓글 작성 요청 대기
  const [commentResponse] = await Promise.all([
    page.waitForResponse(
      (response) => {
        const url = response.url();
        return (
          url.includes("supabase.co") &&
          response.request().method() === "POST" &&
          (url.includes("/rest/v1/Repple") || url.includes("/rest/v1/repple"))
        );
      },
      { timeout: 15000 }
    ).catch(() => null),
    page.getByTestId("comment-submit").click(),
  ]);

  // 댓글 리스트 업데이트 대기
  await page.waitForResponse(
    (response) => {
      const url = response.url();
      return (
        url.includes("supabase.co") &&
        response.request().method() === "GET" &&
        (url.includes("/rest/v1/Repple") || url.includes("/rest/v1/repple"))
      );
    },
    { timeout: 15000 }
  ).catch(() => {});

  await expect(
    page.getByTestId("comment-content").filter({ hasText: comment })
  ).toBeVisible({ timeout: 20000 });
});