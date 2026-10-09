import path from "node:path";
import type { NextConfig } from "next";

const monorepoRoot = path.join(import.meta.dirname, "../..");

const nextConfig: NextConfig = {
  // Workspace packages ship TypeScript source; design-tokens also reads design/*.json at the repo root.
  transpilePackages: ["@nexora/design-tokens", "@nexora/blocks"],
  turbopack: { root: monorepoRoot },
  outputFileTracingRoot: monorepoRoot,
  poweredByHeader: false,
};

export default nextConfig;
