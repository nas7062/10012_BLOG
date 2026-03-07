// eslint.config.cjs
const eslintPluginNext = require("@next/eslint-plugin-next");
const eslintPluginPrettier = require("eslint-plugin-prettier");
const eslintConfigPrettier = require("eslint-config-prettier");

/** @type {import("eslint").Linter.Config[]} */
module.exports = [
  {
    ignores: [
      "node_modules/",
      ".next/",
      "dist/",
      "out/",
      "playwright/",
      "test-results/",
    ],
  },
  {
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      "@next/next": eslintPluginNext,
      prettier: eslintPluginPrettier,
    },
    rules: {
      // Prettier와 충돌 방지
      "prettier/prettier": "error",
      // Next.js 권장 규칙
      "@next/next/no-html-link-for-pages": "error",
      "@next/next/no-img-element": "warn",
    },
  },
  // Prettier 설정을 마지막에 추가하여 다른 규칙과 충돌 방지
  eslintConfigPrettier,
];
