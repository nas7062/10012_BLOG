import { expect, Page } from "@playwright/test";
import path from "path";

export async function createPost(page: Page) {
  await page.goto("/write", { waitUntil: "domcontentloaded" });

  // userData 로딩 대기 - 더 안정적인 방법
  // 방법 1: write-title 입력 필드가 나타날 때까지 대기
  try {
    await page.waitForSelector('[data-testid="write-title"]', { timeout: 20000 });
  } catch {
    // 방법 2: loading... 텍스트가 사라질 때까지 대기
    try {
      await page.waitForFunction(
        () => {
          const bodyText = document.body.textContent || "";
          return !bodyText.includes("loading...");
        },
        { timeout: 15000 }
      );
    } catch {
      // 방법 3: 페이지가 완전히 로드될 때까지 대기
      await page.waitForLoadState("networkidle", { timeout: 10000 }).catch(() => {});
    }
  }

  await page.waitForTimeout(1000);

  const title = `e2e-post-${Date.now()}`;
  await page.getByTestId("write-title").fill(title);

  await page.getByTestId("write-tag").fill("playwright");
  await page.getByTestId("write-tag").press("Enter");

  // 에디터 로드 대기
  await page.waitForSelector('[data-testid="write-editor"]', { timeout: 15000 });
  await page.waitForSelector('[data-testid="write-editor"] textarea, .w-md-editor-text-input', {
    timeout: 15000,
    state: "visible",
  });

  // 에디터 입력
  const editorTextarea = page.locator('[data-testid="write-editor"] textarea').first();
  if (await editorTextarea.isVisible({ timeout: 2000 }).catch(() => false)) {
    await editorTextarea.fill("E2E 테스트 본문");
  } else {
    await page.locator(".w-md-editor-text-input").fill("E2E 테스트 본문");
  }

  // 썸네일 업로드
  const filePath = path.resolve(process.cwd(), "public/character.png");
  await page.getByTestId("write-thumbnail-input").first().setInputFiles(filePath);

  await page.getByTestId("write-editor").click();

  // 제출 버튼 활성화 확인
  const submitButton = page.getByTestId("write-submit");
  await expect(submitButton).toBeEnabled({ timeout: 5000 });

  // Supabase Post insert 응답을 기다리면서 클릭
  const [response] = await Promise.all([
    page
      .waitForResponse((res) => {
        const url = res.url();
        return (
          url.includes("supabase.co") &&
          res.request().method() === "POST" &&
          url.includes("/rest/v1/Post")
        );
      }, { timeout: 30000 })
      .catch(() => null),
    submitButton.click(),
  ]);

  // 응답이 없으면 토스트/폼 상태 보고 바로 에러
  if (!response) {
    const errorToast = page
      .locator('text=글 작성에 실패했습니다, text=제목 또는 내용을 입력 해주세요')
      .first();
    if (await errorToast.isVisible({ timeout: 3000 }).catch(() => false)) {
      const errorText = await errorToast.textContent();
      throw new Error(`글 작성 실패: ${errorText}`);
    }
    throw new Error("글 작성 실패: Supabase 응답이 없습니다 (로그인/유저 로딩 문제일 수 있음).");
  }

  // 성공 toast 확인
  await page.waitForSelector('text=글이 작성되었습니다', { timeout: 10000 }).catch(() => {});

  // Supabase 응답에서 id 추출
  let postId: number | undefined;
  try {
    const responseData = await response.json();
    if (Array.isArray(responseData) && responseData.length > 0) {
      postId = responseData[0]?.id;
    } else if (responseData && typeof responseData === 'object') {
      postId = (responseData as any).id;
    }
  } catch (error) {
    console.error("응답 파싱 실패:", error);
  }

  // id를 찾지 못했으면 URL에서 추출 시도
  if (!postId) {
    try {
      await page.waitForURL(/\/[^/]+\/(\d+)$/, { timeout: 10000 });
      const currentUrl = page.url();
      const match = currentUrl.match(/\/([^/]+)\/(\d+)$/);
      if (match) {
        postId = Number(match[2]);
      }
    } catch {
      throw new Error("글 작성 응답에서 id를 찾지 못했고, URL도 변경되지 않았습니다.");
    }
  }

  if (!postId) {
    throw new Error("글 작성 응답에서 id를 찾지 못했습니다.");
  }

  // 실제 유저 이름 가져오기 (세션에서)
  let userName = "e2e-user";
  try {
    userName = await page.evaluate(() => {
      const sessionData = localStorage.getItem('nextauth.session');
      if (sessionData) {
        try {
          const parsed = JSON.parse(sessionData);
          return parsed?.user?.name || "e2e-user";
        } catch {
          return "e2e-user";
        }
      }
      return "e2e-user";
    });
  } catch {
    userName = "e2e-user";
  }

  const nameEncoded = encodeURIComponent(userName);
  const url = `/${nameEncoded}/${postId}`;

  // 이미 올바른 URL에 있으면 이동하지 않음
  const currentUrl = page.url();
  if (!currentUrl.includes(`/${postId}`)) {
    await page.goto(url, { waitUntil: "domcontentloaded" });
  }

  return { title, url, id: postId, nameEncoded };
}