// vitest.config.ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    // DOM 환경 설정
    environment: "jsdom",

    // 테스트 전 설정 파일
    setupFiles: ["./src/test/setup.ts"],

    // 전역 API 사용 (describe, it, expect 등)
    globals: true,

    // 단위 테스트는 src/test/unit 폴더에서 일괄 관리
    include: ["src/test/unit/**/*.{test,spec}.{js,jsx,ts,tsx}"],

    // 제외할 파일
    exclude: ["node_modules", ".next", "e2e", "playwright"],

    // 코드 커버리지 설정
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "src/test/",
        "src/test/unit/",
        "**/*.d.ts",
        "**/*.config.*",
        "**/mockData/**",
        ".next/**",
        "e2e/**",
        "playwright/**",
      ],
    },
  },
  resolve: {
    alias: {
      // tsconfig paths "@/*": ["./*"] 와 동일하게 프로젝트 루트 기준
      "@": path.resolve(__dirname, "."),
    },
  },
});