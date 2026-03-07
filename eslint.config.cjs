const eslintPluginNext = require("@next/eslint-plugin-next");

/** @type {import("eslint").Linter.Config[]} */
module.exports = [
  {
    ignores: ["node_modules/", ".next/", "dist/", "out/"],
  },
  {
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
    },
    plugins: {
      "@next/next": eslintPluginNext,
    },
    rules: {
      // Prettier와 충돌 방지
      "prettier/prettier": "error",
    },
  },
];