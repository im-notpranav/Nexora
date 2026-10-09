import { expect, test } from "@playwright/test";
import { galleryUrl, MODES, PALETTES, STYLES } from "./design-data";

// M0 acceptance: all 18 styles × 14 palettes × light/dark render without layout breaks at 1280 and 375 px.

/** Runs in the browser. Returns plain-language layout problems in the gallery preview. */
function layoutIssues(): string[] {
  const issues: string[] = [];
  const root = document.querySelector("[data-gallery-theme]");
  if (!root) return ["The gallery preview did not render."];

  const viewport = document.documentElement.clientWidth;
  const pageWidth = document.documentElement.scrollWidth;
  if (pageWidth > viewport + 1) issues.push(`Page scrolls sideways by ${pageWidth - viewport}px.`);

  const overlaps = (a: DOMRect, b: DOMRect) =>
    a.left < b.right - 1 && b.left < a.right - 1 && a.top < b.bottom - 1 && b.top < a.bottom - 1;
  const checkSiblings = (elements: Element[], label: (el: Element, i: number) => string) => {
    const rects = elements.map((el) => el.getBoundingClientRect());
    for (let i = 0; i < rects.length; i++) {
      for (let j = i + 1; j < rects.length; j++) {
        if (overlaps(rects[i]!, rects[j]!)) {
          issues.push(`${label(elements[i]!, i)} overlaps ${label(elements[j]!, j)}.`);
        }
      }
    }
  };
  checkSiblings(
    [...root.querySelectorAll("[data-block]")],
    (el) => `Block "${el.getAttribute("data-block")}"`,
  );
  checkSiblings(
    [...root.querySelectorAll('[aria-label="Key figures"] > *')],
    (_, i) => `KPI card ${i + 1}`,
  );

  for (const el of root.querySelectorAll<HTMLElement>(".type-numeric")) {
    if (getComputedStyle(el).display === "inline") continue;
    if (el.scrollWidth > el.clientWidth + 1)
      issues.push(`Number "${el.textContent}" doesn't fit its box.`);
  }

  const heading = root.querySelector("h1");
  if (heading) {
    const family = getComputedStyle(heading).fontFamily.split(",")[0]!.trim().replace(/"/g, "");
    const loaded = [...document.fonts].some(
      (f) => f.family.replace(/"/g, "") === family && f.status === "loaded",
    );
    if (!loaded) issues.push(`Heading font "${family}" did not load.`);
  }
  return issues;
}

for (const width of [1280, 375]) {
  test.describe(`gallery at ${width}px`, () => {
    test.use({ viewport: { width, height: 900 } });

    for (const style of STYLES) {
      for (const palette of PALETTES) {
        for (const mode of MODES) {
          test(`${style.id} / ${palette.id} / ${mode}`, async ({ page }, testInfo) => {
            await page.goto(galleryUrl(style.id, palette.id, mode));
            await expect(
              page.locator(`[data-gallery-theme][data-style="${style.id}"]`),
            ).toBeVisible();
            await page.evaluate(() => document.fonts.ready);

            expect(await page.evaluate(layoutIssues)).toEqual([]);

            // Keep a full-page picture of each style in its own palette for human review.
            if (palette.id === style.defaults.palette) {
              await testInfo.attach(`${style.id}-${mode}-${width}`, {
                body: await page
                  .locator("[data-gallery-theme]")
                  .screenshot({ animations: "disabled" }),
                contentType: "image/png",
              });
            }
          });
        }
      }
    }
  });
}
