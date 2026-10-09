import { describe, expect, it } from "vitest";
import fontsJson from "../../../design/fonts.json";
import palettesJson from "../../../design/palettes.json";
import stylesJson from "../../../design/styles.json";
import { DesignDataError, designData, listPalettes, listStyles, parseDesignData } from "../src";

describe("design data", () => {
  it("has the 18 styles and 14 palettes the docs promise", () => {
    expect(listStyles()).toHaveLength(18);
    expect(listPalettes()).toHaveLength(14);
  });

  it("uses only verified OFL fonts", () => {
    expect(designData.fonts.license).toBe("OFL-1.1");
    for (const font of designData.fonts.fonts) expect(font.verified, font.family).toBe(true);
  });

  it("lists every style a font is used in under that font's fitsStyles", () => {
    listStyles().forEach((style, index) => {
      for (const role of ["heading", "body", "numeric"] as const) {
        const font = designData.fonts.fonts.find((f) => f.family === style.type[role]);
        const fits = font?.fitsStyles;
        expect(
          fits === "all" || fits?.includes(index + 1),
          `${style.id} ${role} ${style.type[role]}`,
        ).toBe(true);
      }
    });
  });

  it("rejects a style that points at a missing palette", () => {
    const styles = structuredClone(stylesJson);
    styles.styles[0]!.defaults.palette = "does-not-exist";
    expect(() => parseDesignData({ styles, palettes: palettesJson, fonts: fontsJson })).toThrow(
      DesignDataError,
    );
  });

  it("rejects unknown keys so typos in the JSON fail loudly", () => {
    const palettes = structuredClone(palettesJson) as { palettes: Record<string, unknown>[] };
    palettes.palettes[0]!.primry = "#000000";
    expect(() => parseDesignData({ styles: stylesJson, palettes, fonts: fontsJson })).toThrow(
      DesignDataError,
    );
  });
});
