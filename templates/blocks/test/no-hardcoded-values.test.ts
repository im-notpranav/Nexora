import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

// CLAUDE.md rule 7: no hard-coded colors, fonts or radii in components. Blocks are copied into
// generated apps, so they must also never import a Nexora package.

const SRC = join(import.meta.dirname, "..", "src");
const files = readdirSync(SRC)
  .filter((f) => f.endsWith(".ts") || f.endsWith(".tsx"))
  .map((f) => ({ name: f, text: readFileSync(join(SRC, f), "utf8") }));

const TAILWIND_PALETTE =
  "white|black|slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose";

const FORBIDDEN: Array<[string, RegExp]> = [
  ["hex color", /#[0-9a-fA-F]{3,8}\b/],
  ["color function", /\b(?:rgba?|hsla?|oklch|oklab|lab|lch|hwb)\(/],
  ["Tailwind palette color", new RegExp(`\\b[a-z-]+-(?:${TAILWIND_PALETTE})(?:-\\d{2,3})?\\b`)],
  ["arbitrary color/radius/font", /\b(?:bg|text|border|ring|fill|stroke|outline|rounded|font)-\[/],
  ["fixed radius", /\brounded(?:-[a-z]+)?-(?:none|xs|xl|2xl|3xl|4xl|full)\b/],
  ["font family utility", /\bfont-(?:sans|serif|mono)\b/],
  ["inline font or radius", /\b(?:fontFamily|borderRadius|color|background(?:Color)?)\s*:/],
  ["Nexora import", /from\s+["']@nexora\//],
];

describe("blocks use design tokens only", () => {
  it("finds the block sources", () => {
    expect(files.length).toBeGreaterThan(5);
  });

  it.each(files)("$name has no hard-coded colors, fonts, radii or Nexora imports", ({ text }) => {
    const hits = FORBIDDEN.flatMap(([what, re]) =>
      text
        .split("\n")
        .map((line, i) => ({ line, n: i + 1 }))
        .filter(
          ({ line }) =>
            re.test(line) && !line.trim().startsWith("//") && !line.trim().startsWith("*"),
        )
        .map(({ line, n }) => `${what} at line ${n}: ${line.trim()}`),
    );
    expect(hits).toEqual([]);
  });
});
