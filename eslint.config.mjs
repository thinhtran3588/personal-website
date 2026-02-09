import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import { defineConfig, globalIgnores } from "eslint/config";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
  globalIgnores([
    ".next/**",
    ".wrangler/**",
    "out/**",
    "build/**",
    "bundled/**",
    "coverage/**",
    "nextjs-starter-kit-app/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
