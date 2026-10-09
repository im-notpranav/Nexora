import { afterEach, describe, expect, it, vi } from "vitest";
import { safeNextPath, siteUrl, supabaseEnv } from "./env";

describe("safeNextPath", () => {
  it("keeps same-site paths", () => {
    expect(safeNextPath("/dashboard/projects?tab=1")).toBe("/dashboard/projects?tab=1");
  });

  it.each([
    "https://evil.example.com",
    "//evil.example.com",
    "/\\evil.example.com",
    "javascript:alert(1)",
    "",
  ])("rejects %j", (next) => {
    expect(safeNextPath(next)).toBe("/dashboard");
  });

  it("uses the given fallback", () => {
    expect(safeNextPath(null, "/")).toBe("/");
  });
});

describe("supabaseEnv and siteUrl", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("is null until both public values are set", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://x.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "");
    expect(supabaseEnv()).toBeNull();
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "sb_publishable_test");
    expect(supabaseEnv()).toEqual({
      url: "https://x.supabase.co",
      publishableKey: "sb_publishable_test",
    });
  });

  it("prefers the configured site URL and drops a trailing slash", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://nexora.example/");
    expect(siteUrl("http://localhost:3100")).toBe("https://nexora.example");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    expect(siteUrl("http://localhost:3100")).toBe("http://localhost:3100");
  });
});
