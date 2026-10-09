import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import root from "../../eslint.config.mjs";

// Next's rules first, then the shared TypeScript rules so the TypeScript parser wins for .ts/.tsx.
export default defineConfig([
  ...nextVitals,
  ...root,
  globalIgnores([".next/**", "next-env.d.ts", "playwright-report/**", "test-results/**"]),
]);
