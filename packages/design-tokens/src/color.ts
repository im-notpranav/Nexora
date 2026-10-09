import { clampChroma, converter, formatHex, wcagContrast, wcagLuminance } from "culori";

// Color math in OKLCH. Every function takes and returns 6-digit hex strings so results are
// exactly what ships in CSS, and contrast is measured on those same values.

export interface Lch {
  l: number;
  c: number;
  h: number;
}

const toOklch = converter("oklch");
const toRgb = converter("rgb");

/** Extra headroom over a WCAG minimum so 8-bit rounding never lands a color just under it. */
export const CONTRAST_MARGIN = 0.02;

export function lch(hex: string): Lch {
  const c = toOklch(hex);
  if (!c) throw new Error(`Invalid color "${hex}"`);
  return { l: c.l, c: c.c, h: c.h ?? 0 };
}

export function fromLch(l: number, c: number, h: number): string {
  const inGamut = clampChroma({ mode: "oklch", l: clamp(l, 0, 1), c: Math.max(0, c), h }, "oklch");
  return formatHex(inGamut);
}

export function shiftL(hex: string, delta: number): string {
  const { l, c, h } = lch(hex);
  return fromLch(l + delta, c, h);
}

export function withL(hex: string, l: number): string {
  const { c, h } = lch(hex);
  return fromLch(l, c, h);
}

export function contrast(a: string, b: string): number {
  return wcagContrast(a, b);
}

export function luminance(hex: string): number {
  return wcagLuminance(hex);
}

export function rgbChannels(hex: string): [number, number, number] {
  const c = toRgb(hex);
  if (!c) throw new Error(`Invalid color "${hex}"`);
  return [c.r, c.g, c.b].map((v) => Math.round(clamp(v, 0, 1) * 255)) as [number, number, number];
}

/** CSS color with alpha, e.g. rgb(11 18 32 / 0.08). */
export function withAlpha(hex: string, alpha: number): string {
  const [r, g, b] = rgbChannels(hex);
  return `rgb(${r} ${g} ${b} / ${round(alpha, 3)})`;
}

/** The opaque color seen when `fg` at `alpha` is painted over `bg` (sRGB source-over). */
export function composite(fg: string, alpha: number, bg: string): string {
  const f = rgbChannels(fg);
  const b = rgbChannels(bg);
  const mix = f.map((v, i) => Math.round(v * alpha + (b[i] ?? 0) * (1 - alpha)));
  return `#${mix.map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

/** Lowest contrast of `color` against every background. */
export function worstContrast(color: string, against: readonly string[]): number {
  return Math.min(...against.map((bg) => contrast(color, bg)));
}

export interface ContrastFix {
  color: string;
  adjusted: boolean;
}

/**
 * Returns `color`, or the nearest color of the same hue and chroma (changing only OKLCH lightness)
 * that reaches `min` contrast against every background. Moves away from the backgrounds first;
 * falls back to black or white if no lightness works.
 */
export function ensureContrast(
  color: string,
  against: readonly string[],
  min: number,
): ContrastFix {
  const target = min + CONTRAST_MARGIN;
  const passes = (c: string) => worstContrast(c, against) >= target;
  if (passes(color)) return { color, adjusted: false };

  const base = lch(color);
  const backgroundsAreLight =
    against.reduce((sum, bg) => sum + luminance(bg), 0) / against.length > 0.18;
  const directions = backgroundsAreLight ? [-1, 1] : [1, -1];
  for (const dir of directions) {
    for (let step = 1; step <= 200; step++) {
      const l = base.l + dir * step * 0.005;
      if (l < 0 || l > 1) break;
      const candidate = fromLch(l, base.c, base.h);
      if (passes(candidate)) return { color: candidate, adjusted: true };
    }
  }
  const fallback = ["#000000", "#ffffff"].sort(
    (a, b) => worstContrast(b, against) - worstContrast(a, against),
  )[0];
  return { color: fallback ?? "#000000", adjusted: true };
}

export function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

export function round(v: number, digits: number): number {
  const f = 10 ** digits;
  return Math.round(v * f) / f;
}
