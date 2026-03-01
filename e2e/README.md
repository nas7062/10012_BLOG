# E2E 테스트 (Playwright)

## 실행 방법

1. **로컬에서 실행**  
   터미널 1: `npm run dev`  
   터미널 2: `npm run test:e2e`

2. **UI 모드 (디버깅)**  
   `npm run dev` 실행 후: `npm run test:e2e:ui`

3. **CI**  
   `playwright.config.ts`의 `webServer`가 `npm run build && npm run start`로 서버를 띄운 뒤 테스트를 실행합니다.

## 브라우저 설치

최초 한 번: `npx playwright install` (Chromium 등 브라우저 바이너리 설치)
