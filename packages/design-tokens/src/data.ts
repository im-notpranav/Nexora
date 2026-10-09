import fontsJson from "../../../design/fonts.json";
import palettesJson from "../../../design/palettes.json";
import stylesJson from "../../../design/styles.json";
import {
  FontsFileSchema,
  PalettesFileSchema,
  StylesFileSchema,
  type Font,
  type FontsFile,
  type Palette,
  type PalettesFile,
  type Style,
  type StylesFile,
} from "./schema";

export interface DesignData {
  styles: StylesFile;
  palettes: PalettesFile;
  fonts: FontsFile;
}

export class DesignDataError extends Error {
  constructor(public readonly issues: string[]) {
    super(`Invalid design data:\n- ${issues.join("\n- ")}`);
    this.name = "DesignDataError";
  }
}

/** Validates raw JSON for the three design files, including references between them. */
export function parseDesignData(raw: {
  styles: unknown;
  palettes: unknown;
  fonts: unknown;
}): DesignData {
  const issues: string[] = [];
  const styles = StylesFileSchema.safeParse(raw.styles);
  const palettes = PalettesFileSchema.safeParse(raw.palettes);
  const fonts = FontsFileSchema.safeParse(raw.fonts);
  for (const [file, result] of [
    ["styles.json", styles],
    ["palettes.json", palettes],
    ["fonts.json", fonts],
  ] as const) {
    if (!result.success) {
      for (const issue of result.error.issues) {
        issues.push(`${file} ${issue.path.join(".")}: ${issue.message}`);
      }
    }
  }
  if (!styles.success || !palettes.success || !fonts.success) throw new DesignDataError(issues);

  const data: DesignData = { styles: styles.data, palettes: palettes.data, fonts: fonts.data };
  issues.push(...crossCheck(data));
  if (issues.length > 0) throw new DesignDataError(issues);
  return data;
}

function duplicates(values: string[]): string[] {
  return values.filter((v, i) => values.indexOf(v) !== i);
}

function crossCheck({ styles, palettes, fonts }: DesignData): string[] {
  const issues: string[] = [];
  const paletteIds = new Set(palettes.palettes.map((p) => p.id));
  const fontFamilies = new Set(fonts.fonts.map((f) => f.family));

  for (const id of duplicates(styles.styles.map((s) => s.id)))
    issues.push(`Duplicate style id ${id}`);
  for (const id of duplicates(palettes.palettes.map((p) => p.id)))
    issues.push(`Duplicate palette id ${id}`);
  for (const f of duplicates(fonts.fonts.map((x) => x.family))) issues.push(`Duplicate font ${f}`);

  for (const style of styles.styles) {
    for (const p of [style.defaults.palette, ...(style.alternatePalettes ?? [])]) {
      if (!paletteIds.has(p)) issues.push(`Style ${style.id} references unknown palette ${p}`);
    }
    for (const role of ["heading", "body", "numeric"] as const) {
      const family = style.type[role];
      if (!fontFamilies.has(family)) issues.push(`Style ${style.id} uses unknown font ${family}`);
    }
  }
  return issues;
}

export const designData: DesignData = parseDesignData({
  styles: stylesJson,
  palettes: palettesJson,
  fonts: fontsJson,
});

const styleById = new Map(designData.styles.styles.map((s) => [s.id, s]));
const paletteById = new Map(designData.palettes.palettes.map((p) => [p.id, p]));
const fontByFamily = new Map(designData.fonts.fonts.map((f) => [f.family, f]));

export function listStyles(): readonly Style[] {
  return designData.styles.styles;
}

export function listPalettes(): readonly Palette[] {
  return designData.palettes.palettes;
}

export function getStyle(id: string): Style {
  const style = styleById.get(id);
  if (!style) throw new Error(`Unknown style "${id}"`);
  return style;
}

export function getPalette(id: string): Palette {
  const palette = paletteById.get(id);
  if (!palette) throw new Error(`Unknown palette "${id}"`);
  return palette;
}

export function findFont(family: string): Font | undefined {
  return fontByFamily.get(family);
}

export function isStyleId(id: string): boolean {
  return styleById.has(id);
}

export function isPaletteId(id: string): boolean {
  return paletteById.has(id);
}
