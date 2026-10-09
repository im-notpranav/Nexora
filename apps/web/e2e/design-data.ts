import { readFileSync } from "node:fs";
import { join } from "node:path";

// Read the design JSON directly so tests don't depend on how workspace packages are transpiled.
const DESIGN_DIR = join(import.meta.dirname, "..", "..", "..", "design");

function read<T>(file: string): T {
  return JSON.parse(readFileSync(join(DESIGN_DIR, file), "utf8")) as T;
}

export interface StyleInfo {
  id: string;
  defaults: { palette: string; mode: "light" | "dark" };
}

export const STYLES = read<{ styles: StyleInfo[] }>("styles.json").styles;
export const PALETTES = read<{ palettes: { id: string }[] }>("palettes.json").palettes;
export const MODES = ["light", "dark"] as const;

export function galleryUrl(style: string, palette: string, mode: string): string {
  return `/gallery?style=${style}&palette=${palette}&mode=${mode}`;
}
