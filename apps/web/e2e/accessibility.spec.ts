import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { galleryUrl, MODES, PALETTES, STYLES } from "./design-data";

// Accessibility is a gate (CLAUDE.md rule 9). Serious and critical WCAG A/AA violations fail.
// By default every style is scanned in its own palette; GALLERY_FULL=1 scans all 504 combinations.

const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

async function seriousViolations(page: Page, include?: string) {
  let builder = new AxeBuilder({ page }).withTags(WCAG_TAGS);
  if (include) builder = builder.include(include);
  const results = await builder.analyze();
  return results.violations
    .filter((v) => v.impact === "serious" || v.impact === "critical")
    .map(
      (v) =>
        `${v.id}: ${v.help} (${v.nodes
          .map((n) => n.target.join(" "))
          .slice(0, 3)
          .join(", ")})`,
    );
}

const FULL = process.env.GALLERY_FULL === "1";

test.describe("gallery accessibility", () => {
  test.use({ viewport: { width: 1280, height: 900 } });
  for (const style of STYLES) {
    const palettes = FULL ? PALETTES.map((p) => p.id) : [style.defaults.palette];
    for (const palette of palettes) {
      for (const mode of MODES) {
        test(`${style.id} / ${palette} / ${mode}`, async ({ page }) => {
          await page.goto(galleryUrl(style.id, palette, mode));
          await page.evaluate(() => document.fonts.ready);
          expect(await seriousViolations(page, "[data-gallery-theme]")).toEqual([]);
        });
      }
    }
  }
});

for (const colorScheme of ["light", "dark"] as const) {
  test.describe(`platform pages accessibility (${colorScheme})`, () => {
    test.use({ colorScheme });
    for (const path of ["/", "/sign-in", "/gallery"]) {
      test(`${path}`, async ({ page }) => {
        await page.goto(path);
        expect(await seriousViolations(page)).toEqual([]);
      });
    }
  });
}
