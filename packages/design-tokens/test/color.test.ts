import { describe, expect, it } from "vitest";
import { composite, contrast, ensureContrast, fromLch, lch } from "../src/color";

describe("color helpers", () => {
  it("measures WCAG contrast", () => {
    expect(contrast("#000000", "#ffffff")).toBeCloseTo(21, 5);
    expect(contrast("#777777", "#777777")).toBeCloseTo(1, 5);
  });

  it("round-trips hex through OKLCH", () => {
    for (const hex of ["#1a68cf", "#c6f432", "#141414", "#fff8f9"]) {
      const { l, c, h } = lch(hex);
      expect(fromLch(l, c, h)).toBe(hex);
    }
  });

  it("leaves a passing color alone", () => {
    expect(ensureContrast("#0b1220", ["#f9f9fb"], 4.5)).toEqual({
      color: "#0b1220",
      adjusted: false,
    });
  });

  it("darkens a failing color on a light background, keeping its hue", () => {
    const result = ensureContrast("#ffd43b", ["#fff6e9"], 4.5);
    expect(result.adjusted).toBe(true);
    expect(contrast(result.color, "#fff6e9")).toBeGreaterThanOrEqual(4.5);
    expect(Math.abs(lch(result.color).h - lch("#ffd43b").h)).toBeLessThan(15);
  });

  it("lightens a failing color on a dark background", () => {
    const result = ensureContrast("#1a1a1a", ["#14121c"], 3);
    expect(lch(result.color).l).toBeGreaterThan(lch("#1a1a1a").l);
    expect(contrast(result.color, "#14121c")).toBeGreaterThanOrEqual(3);
  });

  it("satisfies several backgrounds at once", () => {
    const result = ensureContrast("#888888", ["#ffffff", "#eeeeee"], 4.5);
    expect(contrast(result.color, "#ffffff")).toBeGreaterThanOrEqual(4.5);
    expect(contrast(result.color, "#eeeeee")).toBeGreaterThanOrEqual(4.5);
  });

  it("composites alpha over a background", () => {
    expect(composite("#ffffff", 0.5, "#000000")).toBe("#808080");
    expect(composite("#123456", 1, "#ffffff")).toBe("#123456");
  });
});
