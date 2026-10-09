import {
  clamp,
  composite,
  contrast,
  ensureContrast,
  fromLch,
  lch,
  shiftL,
  withAlpha,
  worstContrast,
  CONTRAST_MARGIN,
} from "./color";
import { designData, findFont, getPalette, getStyle } from "./data";
import type {
  Density,
  FontRole,
  KpiVariant,
  Mode,
  MotionLevel,
  NavLayout,
  PaletteSlots,
  ShadowKind,
  Style,
} from "./schema";

export type IndicScript = "telugu" | "devanagari" | "tamil";

/** A personal palette, e.g. one generated from the user's logo. */
export interface BrandPalette {
  id?: string;
  name?: string;
  baseMode: Mode;
  slots: PaletteSlots;
}

export type PaletteInput = string | BrandPalette;

export interface FineTune {
  density?: Density;
  /** Multiplies every non-pill radius. 0 = square, 1 = style default, 2 = double. */
  radiusScale?: number;
  fonts?: Partial<Record<"heading" | "body" | "numeric", string>>;
  motionLevel?: MotionLevel;
  colors?: Partial<PaletteSlots>;
}

export interface ResolveOptions {
  /** Indian scripts the app's content uses; matching Noto fonts join every font stack. */
  scripts?: readonly IndicScript[];
}

export type NavFamily = "rail" | "sidebar" | "top";

export interface ThemeLayout {
  nav: NavFamily;
  navLayout: NavLayout;
  kpi: KpiVariant;
  glass: boolean;
  group: Style["group"];
  features: readonly string[];
}

export interface GlassInfo {
  cardOpacity: number;
  /** Opaque colors that can sit behind a glass card (the generated backdrop). */
  backdropColors: string[];
}

export interface ResolvedTheme {
  styleId: string;
  paletteId: string;
  mode: Mode;
  density: Density;
  motionLevel: MotionLevel;
  /** CSS custom properties, keys include the leading "--". */
  vars: Record<string, string>;
  layout: ThemeLayout;
  glass: GlassInfo | null;
  /** Plain-language notes about colors changed to meet contrast rules. */
  adjustments: string[];
}

const NAV_FAMILY: Record<NavLayout, NavFamily> = {
  "icon-rail-left": "rail",
  sidebar: "sidebar",
  "sidebar-task-groups": "sidebar",
  "collapsible-sidebar": "sidebar",
  "sidebar-with-sections": "sidebar",
  "three-column": "sidebar",
  "split-panes": "sidebar",
  "top-icon-tabs": "top",
  "floating-pill-top": "top",
  top: "top",
  "ruled-top-bar": "top",
  "glass-top-bar": "top",
  "split-map-detail": "top",
};

const DENSITY: Record<
  Density,
  { card: number; gap: number; row: number; control: number; textScale: number }
> = {
  compact: { card: 12, gap: 12, row: 32, control: 32, textScale: 0.9 },
  comfortable: { card: 20, gap: 16, row: 44, control: 40, textScale: 1 },
  roomy: { card: 28, gap: 24, row: 52, control: 48, textScale: 1.05 },
};

/** Tailwind-compatible size scale in rem: [size, line-height]. */
const TEXT_SCALE: Record<string, number> = {
  xs: 0.75,
  sm: 0.875,
  base: 1,
  lg: 1.125,
  xl: 1.25,
  "2xl": 1.5,
  "3xl": 1.875,
  "4xl": 2.25,
};

const MOTION: Record<MotionLevel, { level: number; fast: number; base: number }> = {
  off: { level: 0, fast: 0, base: 0 },
  subtle: { level: 1, fast: 120, base: 220 },
  expressive: { level: 2, fast: 160, base: 320 },
};

const FALLBACK_STACK: Record<FontRole, string> = {
  ui: "ui-sans-serif, system-ui, sans-serif",
  "friendly-sans": "ui-sans-serif, system-ui, sans-serif",
  "characterful-sans": "ui-sans-serif, system-ui, sans-serif",
  display: "ui-sans-serif, system-ui, sans-serif",
  indic: "ui-sans-serif, system-ui, sans-serif",
  serif: "ui-serif, Georgia, serif",
  mono: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
};

const INDIC_FONT: Record<IndicScript, string> = {
  telugu: "Noto Sans Telugu",
  devanagari: "Noto Sans Devanagari",
  tamil: "Noto Sans Tamil",
};

const DEFAULT_WEIGHTS = { heading: 700, body: 400, numeric: 600 };
const TOUCH_TARGET_MIN = 40;
const PILL = 9999;

/**
 * Resolves a style + palette (or brand palette) + fine-tune options into theme tokens.
 * Steps follow docs/09-design-system.md: style defaults → palette slots → derived colors →
 * contrast pass (OKLCH lightness only) → fine-tune overrides (applied before the contrast pass).
 */
export function resolveTheme(
  styleId: string,
  paletteOrBrand?: PaletteInput,
  fineTune: FineTune = {},
  mode?: Mode,
  options: ResolveOptions = {},
): ResolvedTheme {
  const style = getStyle(styleId);
  const paletteInput = paletteOrBrand ?? style.defaults.palette;
  const palette =
    typeof paletteInput === "string"
      ? getPalette(paletteInput)
      : {
          id: paletteInput.id ?? "brand",
          baseMode: paletteInput.baseMode,
          slots: paletteInput.slots,
        };
  const resolvedMode = mode ?? style.defaults.mode;
  const density = fineTune.density ?? style.density;
  const motionLevel = fineTune.motionLevel ?? style.defaults.motionLevel;
  const adjustments: string[] = [];

  const slots: PaletteSlots = { ...palette.slots, ...fineTune.colors };
  const colors = resolveColors(slots, palette.baseMode, resolvedMode, adjustments);
  const glass = resolveGlass(style, colors, adjustments);

  const vars: Record<string, string> = {
    ...colorVars(colors, resolvedMode),
    ...glassVars(style, colors, glass),
    ...typeVars(style, fineTune, density, options.scripts ?? []),
    ...shapeVars(style, fineTune),
    // Outlined styles (thick borders or hard shadows) draw card edges in ink, not the soft border.
    "--card-border":
      style.shape.borderWidth >= 2 || style.depth.shadow === "hard-offset-4px"
        ? colors.ink
        : colors.border,
    ...shadowVars(style.depth.shadow, colors.ink, resolvedMode),
    ...densityVars(style, density),
    ...motionVars(motionLevel),
  };

  return {
    styleId: style.id,
    paletteId: palette.id,
    mode: resolvedMode,
    density,
    motionLevel,
    vars,
    layout: {
      nav: NAV_FAMILY[style.layout.nav],
      navLayout: style.layout.nav,
      kpi: style.recipes.kpi,
      glass: style.depth.glass !== false,
      group: style.group,
      features: style.features ?? [],
    },
    glass,
    adjustments,
  };
}

interface Colors {
  canvas: string;
  surface: string;
  surface2: string;
  ink: string;
  inkMuted: string;
  border: string;
  borderStrong: string;
  primary: string;
  primaryHover: string;
  primaryInk: string;
  primaryTint: string;
  onPrimary: string;
  onPrimaryTint: string;
  onDanger: string;
  focusRing: string;
  status: Record<StatusName, { base: string; bg: string; ink: string }>;
  charts: string[];
}

type StatusName = "success" | "warning" | "danger" | "info";
const STATUS_NAMES: StatusName[] = ["success", "warning", "danger", "info"];

function fix(
  color: string,
  against: readonly string[],
  min: number,
  adjustments: string[],
  note?: string,
): string {
  const result = ensureContrast(color, against, min);
  if (result.adjusted && note) adjustments.push(note);
  return result.color;
}

/** Light slots for a dark-base palette, or dark slots for a light-base palette. */
function oppositeModeSlots(p: PaletteSlots, mode: Mode): PaletteSlots {
  const primary = lch(p.primary);
  const tint = lch(p.primaryTint);
  const hue = primary.c > 0.02 ? primary.h : tint.h;
  if (mode === "dark") {
    return {
      primary: p.primary,
      onPrimary: p.onPrimary,
      surface: fromLch(0.23, 0.012, hue),
      ink: fromLch(0.95, 0.008, hue),
      primaryTint: fromLch(0.42, Math.min(tint.c, 0.09), tint.h),
    };
  }
  return {
    primary: p.primary,
    onPrimary: p.onPrimary,
    surface: fromLch(0.985, 0.005, hue),
    ink: fromLch(0.22, 0.02, hue),
    primaryTint: fromLch(0.88, Math.min(tint.c, 0.08), tint.h),
  };
}

function resolveColors(
  input: PaletteSlots,
  baseMode: Mode,
  mode: Mode,
  adjustments: string[],
): Colors {
  const derived = baseMode !== mode;
  const p = derived ? oppositeModeSlots(input, mode) : input;
  const light = mode === "light";

  const surface = p.surface;
  const surfaceL = lch(surface);
  const canvas = light
    ? shiftL(surface, -0.035)
    : fromLch(Math.max(0.1, surfaceL.l - 0.04), surfaceL.c, surfaceL.h);
  const surface2 = shiftL(surface, light ? -0.018 : 0.045);
  const backgrounds = [surface, canvas, surface2];

  // Brand fill: kept as given, except in a derived mode where it would vanish into the surface.
  let primary = p.primary;
  if (derived) {
    primary = fix(
      primary,
      [surface],
      3,
      adjustments,
      `Brand color adjusted to stay visible in ${mode} mode.`,
    );
  }

  // Button text: keep the palette's choice if it reads; else pick black or white; else move the fill.
  let onPrimary = p.onPrimary;
  if (worstContrast(onPrimary, [primary]) < 4.5 + CONTRAST_MARGIN) {
    onPrimary = ["#ffffff", "#111111"].sort(
      (a, b) => worstContrast(b, [primary]) - worstContrast(a, [primary]),
    )[0] as string;
  }
  primary = fix(
    primary,
    [onPrimary],
    4.5,
    adjustments,
    "Button color adjusted so its text stays readable.",
  );

  const onPrimaryIsLight = lch(onPrimary).l > 0.6;
  const primaryHover = fix(
    shiftL(primary, onPrimaryIsLight ? -0.06 : 0.06),
    [onPrimary],
    4.5,
    adjustments,
  );

  const ink = fix(p.ink, backgrounds, 4.5, adjustments, "Text color adjusted for contrast.");
  const inkL = lch(ink);
  const inkMuted = fix(
    fromLch(inkL.l + (surfaceL.l - inkL.l) * 0.4, inkL.c, inkL.h),
    backgrounds,
    4.5,
    adjustments,
  );
  const border = shiftL(surface, light ? -0.08 : 0.09);
  const borderStrong = fix(shiftL(surface, light ? -0.35 : 0.33), backgrounds, 3, adjustments);

  const primaryInk = fix(primary, backgrounds, 4.5, adjustments);
  const focusRing = fix(primary, backgrounds, 3, adjustments);
  const primaryTint = p.primaryTint;
  const onPrimaryTint = fix(ink, [primaryTint], 4.5, adjustments);

  const statusSet = designData.palettes.status[mode];
  const status = Object.fromEntries(
    STATUS_NAMES.map((name) => {
      const raw = statusSet[name];
      const { c, h } = lch(raw);
      const bg = fromLch(light ? 0.95 : 0.3, Math.min(c, light ? 0.05 : 0.07), h);
      return [
        name,
        {
          base: fix(raw, backgrounds, 4.5, adjustments),
          bg,
          ink: fix(raw, [bg], 4.5, adjustments),
        },
      ];
    }),
  ) as Colors["status"];

  // Text on a filled danger button (delete actions). Status colors stay fixed; only the text adapts.
  const danger = status.danger.base;
  const onDanger = fix(
    ["#ffffff", "#111111"].sort(
      (a, b) => worstContrast(b, [danger]) - worstContrast(a, [danger]),
    )[0] as string,
    [danger],
    4.5,
    adjustments,
  );

  return {
    canvas,
    surface,
    surface2,
    ink,
    inkMuted,
    border,
    borderStrong,
    primary,
    primaryHover,
    primaryInk,
    primaryTint,
    onPrimary,
    onPrimaryTint,
    onDanger,
    focusRing,
    status,
    charts: chartColors(primary, primaryTint, surface, light),
  };
}

/** Six chart colors from primary + tint, each at least 3:1 against the card surface. */
function chartColors(primary: string, tint: string, surface: string, light: boolean): string[] {
  const p = lch(primary);
  const t = lch(tint);
  const hue = p.c > 0.02 ? p.h : t.h;
  const chroma = clamp(p.c > 0.02 ? p.c : t.c, 0.09, 0.16);
  const l = light ? 0.6 : 0.72;
  // A pale tint darkened to 3:1 turns muddy; use a richer color in the tint's hue instead.
  const second =
    contrast(tint, surface) >= 3
      ? tint
      : fromLch(l, Math.max(t.c, p.c * 0.6), t.c > 0.02 ? t.h : hue);
  const seeds = [
    primary,
    second,
    ...[40, -40, 80, -80].map((offset) => fromLch(l, chroma, (hue + offset + 360) % 360)),
  ];
  return seeds.map((c) => ensureContrast(c, [surface], 3).color);
}

function resolveGlass(style: Style, colors: Colors, adjustments: string[]): GlassInfo | null {
  const glass = style.depth.glass;
  if (glass === false) return null;
  const backdropColors = [
    colors.canvas,
    composite(colors.primaryTint, 0.55, colors.canvas),
    composite(colors.primary, 0.25, colors.canvas),
  ];
  const textColors = [
    colors.ink,
    colors.inkMuted,
    colors.primaryInk,
    ...STATUS_NAMES.map((n) => colors.status[n].base),
  ];
  const readable = (opacity: number) =>
    backdropColors.every((bd) => {
      const card = composite(colors.surface, opacity, bd);
      return textColors.every((t) => worstContrast(t, [card]) >= 4.5 + CONTRAST_MARGIN);
    });
  let cardOpacity = glass.opacity;
  while (!readable(cardOpacity) && cardOpacity < 1) cardOpacity = Math.min(1, cardOpacity + 0.05);
  if (cardOpacity > glass.opacity) {
    adjustments.push("Glass panels made more solid so text stays readable.");
  }
  return { cardOpacity: Math.round(cardOpacity * 100) / 100, backdropColors };
}

function colorVars(c: Colors, mode: Mode): Record<string, string> {
  const vars: Record<string, string> = {
    "--canvas": c.canvas,
    "--surface": c.surface,
    "--surface-2": c.surface2,
    "--ink": c.ink,
    "--ink-muted": c.inkMuted,
    "--border": c.border,
    "--border-strong": c.borderStrong,
    "--primary": c.primary,
    "--primary-hover": c.primaryHover,
    "--primary-ink": c.primaryInk,
    "--primary-tint": c.primaryTint,
    "--on-primary": c.onPrimary,
    "--on-primary-tint": c.onPrimaryTint,
    "--on-danger": c.onDanger,
    "--focus-ring": c.focusRing,
    "--overlay": withAlpha(mode === "dark" ? "#000000" : c.ink, mode === "dark" ? 0.6 : 0.4),
  };
  for (const name of STATUS_NAMES) {
    vars[`--${name}`] = c.status[name].base;
    vars[`--${name}-bg`] = c.status[name].bg;
    vars[`--${name}-ink`] = c.status[name].ink;
  }
  c.charts.forEach((color, i) => {
    vars[`--chart-${i + 1}`] = color;
  });
  vars["--chart-good"] = c.status.success.base;
  vars["--chart-bad"] = c.status.danger.base;
  return vars;
}

function glassVars(style: Style, c: Colors, glass: GlassInfo | null): Record<string, string> {
  const g = style.depth.glass;
  if (g === false || glass === null) {
    return {
      "--backdrop": c.canvas,
      "--card-bg": c.surface,
      "--card-bg-strong": c.surface,
      "--blur-glass": "none",
      "--glass-opacity": "1",
    };
  }
  const strong = Math.max(glass.cardOpacity, g.textLayerOpacity ?? 0.85);
  return {
    "--backdrop": [
      `radial-gradient(60% 60% at 12% 8%, ${withAlpha(c.primaryTint, 0.55)} 0%, transparent 70%)`,
      `radial-gradient(55% 55% at 88% 18%, ${withAlpha(c.primary, 0.25)} 0%, transparent 70%)`,
      c.canvas,
    ].join(", "),
    "--card-bg": withAlpha(c.surface, glass.cardOpacity),
    "--card-bg-strong": withAlpha(c.surface, strong),
    "--blur-glass": `blur(${g.blurPx}px)`,
    "--glass-opacity": String(glass.cardOpacity),
  };
}

function fontStack(family: string, scripts: readonly IndicScript[]): string {
  const font = findFont(family);
  const names = font?.variable ? [`"${family} Variable"`, `"${family}"`] : [`"${family}"`];
  const indic = scripts.map((s) => `"${INDIC_FONT[s]}"`);
  return [...names, ...indic, FALLBACK_STACK[font?.role ?? "ui"]].join(", ");
}

function typeVars(
  style: Style,
  fineTune: FineTune,
  density: Density,
  scripts: readonly IndicScript[],
): Record<string, string> {
  const families = { ...style.type, ...fineTune.fonts };
  const weights = { ...DEFAULT_WEIGHTS, ...style.type.weights };
  const uppercase = style.headingCase === "uppercase";
  const scale = DENSITY[density].textScale;
  const vars: Record<string, string> = {
    "--font-heading": fontStack(families.heading, scripts),
    "--font-body": fontStack(families.body, scripts),
    "--font-numeric": fontStack(families.numeric, scripts),
    "--weight-heading": String(weights.heading),
    "--weight-body": String(weights.body),
    "--weight-numeric": String(weights.numeric),
    "--heading-transform": uppercase ? "uppercase" : "none",
    "--heading-tracking": uppercase ? "0.02em" : "-0.01em",
  };
  for (const [name, rem] of Object.entries(TEXT_SCALE)) {
    vars[`--text-${name}`] = `${Math.round(rem * scale * 1000) / 1000}rem`;
  }
  return vars;
}

function shapeVars(style: Style, fineTune: FineTune): Record<string, string> {
  const scale = clamp(fineTune.radiusScale ?? 1, 0, 2);
  const px = (v: number) => (v >= 999 ? `${PILL}px` : `${Math.round(v * scale)}px`);
  const card = style.shape.radiusCard;
  const control = style.shape.radiusControl;
  return {
    "--radius-sm": px(Math.round(card * 0.4)),
    "--radius-md": px(Math.min(control, card)),
    "--radius-lg": px(card),
    "--radius-card": px(card),
    "--radius-control": px(control),
    "--radius-pill": `${PILL}px`,
    "--border-width": `${style.shape.borderWidth}px`,
  };
}

function shadowVars(kind: ShadowKind, ink: string, mode: Mode): Record<string, string> {
  const shade = (alpha: number) =>
    withAlpha(mode === "dark" ? "#000000" : ink, mode === "dark" ? alpha * 3 : alpha);
  const pop = `0 16px 40px ${shade(0.16)}`;
  switch (kind) {
    case "none":
      return { "--shadow-card": "none", "--shadow-pop": `0 8px 24px ${shade(0.12)}` };
    case "faint":
      return {
        "--shadow-card": `0 1px 2px ${shade(0.04)}, 0 2px 8px ${shade(0.04)}`,
        "--shadow-pop": pop,
      };
    case "soft":
      return { "--shadow-card": `0 8px 24px ${shade(0.08)}`, "--shadow-pop": pop };
    case "hard-offset-4px":
      return { "--shadow-card": `4px 4px 0 0 ${ink}`, "--shadow-pop": `6px 6px 0 0 ${ink}` };
    case "clay-double-inner":
      return {
        "--shadow-card": [
          `inset -6px -6px 12px ${shade(0.08)}`,
          `inset 6px 6px 12px ${withAlpha("#ffffff", mode === "dark" ? 0.06 : 0.7)}`,
          `0 12px 24px ${shade(0.08)}`,
        ].join(", "),
        "--shadow-pop": pop,
      };
  }
}

function densityVars(style: Style, density: Density): Record<string, string> {
  const d = DENSITY[density];
  const row = density === style.density && style.rowHeightPx ? style.rowHeightPx : d.row;
  const control = Math.max(d.control, style.minTouchTargetPx ?? 0);
  return {
    "--space-card": `${d.card}px`,
    "--space-gap": `${style.grid?.gapPx ?? d.gap}px`,
    "--row-height": `${row}px`,
    "--control-height": `${control}px`,
    "--control-height-touch": `${Math.max(control, TOUCH_TARGET_MIN)}px`,
  };
}

function motionVars(level: MotionLevel): Record<string, string> {
  const m = MOTION[level];
  return {
    "--motion-level": String(m.level),
    "--dur-fast": `${m.fast}ms`,
    "--dur-base": `${m.base}ms`,
    "--ease-standard": "cubic-bezier(0.2, 0, 0, 1)",
  };
}
