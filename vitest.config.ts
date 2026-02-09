import path from "node:path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "md-raw-loader",
      transform(code, id) {
        if (id.endsWith(".md")) {
          return `export default ${JSON.stringify(code)}`;
        }
      },
    },
  ],
  resolve: {
    alias: [
      {
        find: "@/common/routing/navigation",
        replacement: path.resolve(
          __dirname,
          "./src/__tests__/test-utils/navigation.tsx",
        ),
      },
      {
        find: "@/application/routing/navigation",
        replacement: path.resolve(
          __dirname,
          "./src/__tests__/test-utils/navigation.tsx",
        ),
      },
      {
        find: "@",
        replacement: path.resolve(__dirname, "./src"),
      },
    ],
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/__tests__/test-utils/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      thresholds: {
        lines: 100,
        functions: 100,
        branches: 100,
        statements: 100,
      },
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/__tests__/**",
        "src/**/interfaces/**",
        "src/**/domain/types.ts",
        "src/types/**/*.d.ts",
      ],
    },
  },
});
