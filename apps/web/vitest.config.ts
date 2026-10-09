import { defineConfig } from "vitest/config";

// Unit tests only; Playwright owns e2e/.
export default defineConfig({
  test: {
    include: ["**/*.test.ts", "**/*.test.tsx"],
    exclude: ["e2e/**", "node_modules/**", ".next/**"],
  },
});
