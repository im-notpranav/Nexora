import { describe, expect, it } from "vitest";
import {
  auditContrast,
  contrast,
  listPalettes,
  listStyles,
  resolveTheme,
  themeToCss,
  type BrandPalette,
  type Mode,
} from "../src";

const MODES: Mode[] = ["light", "dark"];

describe("resolveTheme: every style × palette × mode", () => {
  const combos = listStyles().flatMap((style) =>
    listPalettes().flatMap((palette) => MODES.map((mode) => [style.id, palette.id, mode] as const)),
  );

  it("covers 504 combinations", () => {
    expect(combos).toHaveLength(18 * 14 * 2);
  });

  it.each(combos)("%s / %s / %s passes every contrast pair", (styleId, paletteId, mode) => {
    const theme = resolveTheme(styleId, paletteId, {}, mode);
    const failures = auditContrast(theme).map(
      (f) => `${f.label}: ${f.ratio.toFixed(2)} < ${f.min}`,
    );
    expect(failures).toEqual([]);
  });
});

describe("resolveTheme behavior", () => {
  it("defaults palette and mode from the style", () => {
    const theme = resolveTheme("industrial-dark");
    expect(theme.paletteId).toBe("lime-night");
    expect(theme.mode).toBe("dark");
    expect(theme.layout.kpi).toBe("progress");
  });

  it("is deterministic", () => {
    expect(resolveTheme("airy-pill", "sky", {}, "light")).toEqual(
      resolveTheme("airy-pill", "sky", {}, "light"),
    );
  });

  it("keeps palette colors untouched in the palette's own mode when they already pass", () => {
    const theme = resolveTheme("airy-pill", "sky", {}, "light");
    expect(theme.vars["--primary"]).toBe("#1A68CF");
    expect(theme.vars["--surface"]).toBe("#F9F9FB");
    expect(theme.vars["--ink"]).toBe("#0B1220");
    expect(theme.adjustments).toEqual([]);
  });

  it("never lets status colors take the brand color", () => {
    const theme = resolveTheme("airy-pill", {
      baseMode: "light",
      slots: {
        primary: "#15803D",
        primaryTint: "#BBF7D0",
        surface: "#FFFFFF",
        ink: "#111111",
        onPrimary: "#FFFFFF",
      },
    });
    expect(theme.vars["--success"]).toBe("#15803D");
    expect(theme.vars["--danger"]).toBe("#B91C1C");
  });

  it("maps style shape, type and density to tokens", () => {
    const pill = resolveTheme("airy-pill");
    expect(pill.vars["--radius-card"]).toBe("20px");
    expect(pill.vars["--radius-control"]).toBe("9999px");
    expect(pill.vars["--font-heading"]).toContain('"Manrope Variable"');
    expect(pill.vars["--weight-numeric"]).toBe("300");

    const dense = resolveTheme("data-dense-pro");
    expect(dense.vars["--row-height"]).toBe("32px");
    expect(dense.vars["--font-numeric"]).toContain("JetBrains Mono");

    const editorial = resolveTheme("editorial");
    expect(editorial.vars["--radius-card"]).toBe("0px");
    expect(editorial.vars["--font-heading"]).toMatch(/^"Anton", /);
  });

  it("applies fine-tune overrides", () => {
    const theme = resolveTheme(
      "corporate-classic",
      "cobalt",
      { radiusScale: 0, density: "compact", motionLevel: "off", fonts: { heading: "Fraunces" } },
      "light",
    );
    expect(theme.vars["--radius-card"]).toBe("0px");
    expect(theme.vars["--row-height"]).toBe("32px");
    expect(theme.vars["--dur-base"]).toBe("0ms");
    expect(theme.vars["--font-heading"]).toContain("Fraunces");
    expect(theme.vars["--font-heading"]).toContain("serif");
  });

  it("adds Indian-script fonts when the app uses them", () => {
    const theme = resolveTheme("corporate-classic", undefined, {}, undefined, {
      scripts: ["telugu"],
    });
    expect(theme.vars["--font-body"]).toContain('"Noto Sans Telugu"');
  });

  it("raises glass opacity until text is readable over the backdrop", () => {
    const theme = resolveTheme("light-glass", "plum-dark", {}, "light");
    expect(theme.glass).not.toBeNull();
    expect(auditContrast(theme)).toEqual([]);
  });

  it("emits reduced-motion and touch-target rules with the CSS", () => {
    const css = themeToCss(resolveTheme("airy-pill"), "[data-x]");
    expect(css).toContain("[data-x] {");
    expect(css).toContain("prefers-reduced-motion: reduce");
    expect(css).toContain("--control-height: var(--control-height-touch)");
    expect(css).toContain("color-scheme: light");
  });
});

describe("brand palettes", () => {
  const awkward: BrandPalette[] = [
    // Very light brand color: button text must flip to dark.
    {
      baseMode: "light",
      slots: {
        primary: "#FFF200",
        primaryTint: "#FFE4E1",
        surface: "#FFFFFF",
        ink: "#333333",
        onPrimary: "#FFFFFF",
      },
    },
    // Mid-gray brand color that passes with neither black nor white comfortably.
    {
      baseMode: "light",
      slots: {
        primary: "#8A8A8A",
        primaryTint: "#DDDDDD",
        surface: "#FAFAFA",
        ink: "#777777",
        onPrimary: "#FFFFFF",
      },
    },
    // Dark brand on a dark base.
    {
      baseMode: "dark",
      slots: {
        primary: "#202040",
        primaryTint: "#303060",
        surface: "#101018",
        ink: "#9999AA",
        onPrimary: "#FFFFFF",
      },
    },
  ];

  it.each(awkward.flatMap((p) => MODES.map((m) => [p, m] as const)))(
    "fixes contrast for awkward brand colors (%#)",
    (palette, mode) => {
      for (const style of listStyles()) {
        const theme = resolveTheme(style.id, palette, {}, mode);
        expect(auditContrast(theme), `${style.id} ${mode}`).toEqual([]);
        expect(
          contrast(theme.vars["--on-primary"]!, theme.vars["--primary"]!),
        ).toBeGreaterThanOrEqual(4.5);
      }
    },
  );

  it("explains why a brand color changed", () => {
    const theme = resolveTheme("airy-pill", awkward[1], {}, "light");
    expect(theme.adjustments.length).toBeGreaterThan(0);
  });
});
