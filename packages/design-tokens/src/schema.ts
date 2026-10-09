import { z } from "zod";

// Zod schemas for design/styles.json, design/palettes.json and design/fonts.json.
// Strict objects so a typo in the JSON fails loudly instead of being ignored.

export const HexSchema = z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Expected a 6-digit hex color");
export const ModeSchema = z.enum(["light", "dark"]);
export const MotionLevelSchema = z.enum(["off", "subtle", "expressive"]);
export const DensitySchema = z.enum(["compact", "comfortable", "roomy"]);
export const ShadowSchema = z.enum([
  "none",
  "faint",
  "soft",
  "hard-offset-4px",
  "clay-double-inner",
]);
export const KpiVariantSchema = z.enum([
  "standard",
  "comparison",
  "progress",
  "outlined",
  "strip",
  "terminal",
]);
export const NavSchema = z.enum([
  "icon-rail-left",
  "sidebar",
  "top-icon-tabs",
  "floating-pill-top",
  "sidebar-task-groups",
  "top",
  "collapsible-sidebar",
  "sidebar-with-sections",
  "three-column",
  "ruled-top-bar",
  "glass-top-bar",
  "split-map-detail",
  "split-panes",
]);

const WeightSchema = z.number().int().min(100).max(900);

export const GlassSchema = z.union([
  z.literal(false),
  z.strictObject({
    opacity: z.number().min(0).max(1),
    blurPx: z.number().min(0),
    backdrop: z.string(),
    textLayerOpacity: z.number().min(0).max(1).optional(),
  }),
]);

export const StyleSchema = z.strictObject({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  group: z.enum(["dashboard", "expressive"]),
  bestFor: z.array(z.string()).min(1),
  reference: z.string().min(1),
  defaults: z.strictObject({
    palette: z.string(),
    mode: ModeSchema,
    motionLevel: MotionLevelSchema,
  }),
  type: z.strictObject({
    heading: z.string(),
    body: z.string(),
    numeric: z.string(),
    weights: z
      .strictObject({ heading: WeightSchema, body: WeightSchema, numeric: WeightSchema })
      .partial()
      .optional(),
  }),
  shape: z.strictObject({
    radiusCard: z.number().int().min(0),
    radiusControl: z.number().int().min(0),
    pillControls: z.boolean(),
    borderWidth: z.number().int().min(0).max(4),
  }),
  depth: z.strictObject({
    shadow: ShadowSchema,
    glass: GlassSchema,
  }),
  density: DensitySchema,
  layout: z.looseObject({ nav: NavSchema }),
  recipes: z.strictObject({
    kpi: KpiVariantSchema,
    kpiCard: z.string(),
    charts: z.string(),
  }),
  imagery: z.string().optional(),
  workMode: z.string().optional(),
  headingCase: z.enum(["uppercase", "none"]).optional(),
  rowHeightPx: z.number().int().min(24).optional(),
  minTouchTargetPx: z.number().int().min(24).optional(),
  features: z.array(z.string()).optional(),
  alternatePalettes: z.array(z.string()).optional(),
  grid: z
    .strictObject({
      columns: z.number().int().min(1),
      gapPx: z.number().int().min(0).optional(),
      tileSizes: z.array(z.string()).optional(),
    })
    .optional(),
  surfaces: z.record(z.string(), z.string()).optional(),
  texture: z.string().optional(),
  decor: z.string().optional(),
  alignment: z.string().optional(),
});

export const StylesFileSchema = z.strictObject({
  $comment: z.string().optional(),
  version: z.literal(1),
  acceptance: z.array(z.string()).min(1),
  styles: z.array(StyleSchema).min(1),
});

export const PaletteSlotsSchema = z.strictObject({
  primary: HexSchema,
  primaryTint: HexSchema,
  surface: HexSchema,
  ink: HexSchema,
  onPrimary: HexSchema,
});

export const PaletteSchema = z.strictObject({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  baseMode: ModeSchema,
  mood: z.string(),
  slots: PaletteSlotsSchema,
  usage: z.string().optional(),
});

const StatusSetSchema = z.strictObject({
  success: HexSchema,
  warning: HexSchema,
  danger: HexSchema,
  info: HexSchema,
});

export const PalettesFileSchema = z.strictObject({
  $comment: z.string().optional(),
  version: z.literal(1),
  status: z.strictObject({ light: StatusSetSchema, dark: StatusSetSchema }),
  palettes: z.array(PaletteSchema).min(1),
});

export const FontRoleSchema = z.enum([
  "ui",
  "friendly-sans",
  "characterful-sans",
  "serif",
  "display",
  "mono",
  "indic",
]);

export const FontSchema = z.strictObject({
  family: z.string().min(1),
  role: FontRoleSchema,
  fontsourceId: z.string().regex(/^[a-z0-9-]+$/),
  variable: z.boolean(),
  fitsStyles: z.union([z.array(z.number().int().min(1)), z.literal("all")]),
  verified: z.boolean(),
});

export const FontsFileSchema = z.strictObject({
  $comment: z.string().optional(),
  version: z.literal(1),
  license: z.literal("OFL-1.1"),
  fonts: z.array(FontSchema).min(1),
  paidSwaps: z.array(
    z.strictObject({
      asked: z.array(z.string()).min(1),
      offer: z.array(z.string()).min(1),
      note: z.string().optional(),
    }),
  ),
});

export type Mode = z.infer<typeof ModeSchema>;
export type MotionLevel = z.infer<typeof MotionLevelSchema>;
export type Density = z.infer<typeof DensitySchema>;
export type ShadowKind = z.infer<typeof ShadowSchema>;
export type KpiVariant = z.infer<typeof KpiVariantSchema>;
export type NavLayout = z.infer<typeof NavSchema>;
export type Style = z.infer<typeof StyleSchema>;
export type Palette = z.infer<typeof PaletteSchema>;
export type PaletteSlots = z.infer<typeof PaletteSlotsSchema>;
export type StatusColors = z.infer<typeof StatusSetSchema>;
export type Font = z.infer<typeof FontSchema>;
export type FontRole = z.infer<typeof FontRoleSchema>;
export type StylesFile = z.infer<typeof StylesFileSchema>;
export type PalettesFile = z.infer<typeof PalettesFileSchema>;
export type FontsFile = z.infer<typeof FontsFileSchema>;
