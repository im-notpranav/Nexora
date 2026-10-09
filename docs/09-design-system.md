# 09 — Design system

Design and branding is a core differentiator. Generated apps must look deliberately designed and carry the user's brand, never like a generic AI template. All of it is deterministic code: zero LLM calls.

## The model

```
Style (18)  ×  Palette (14 or the user's brand)  ×  Fine-tune options  →  Theme tokens  →  CSS variables
```

- A **style** defines structure and character: fonts, shape, depth, density, layout, component recipes (KPI card, nav, table, chart look), motion defaults. It never contains brand colors.
- A **palette** fills color slots: primary, tint, surface, canvas, ink, muted ink, border.
- **Fine-tune** options override: mode (light/dark), density, radius scale, font pair, motion level, any individual color.
- **Status colors** (success, warning, danger, info) are fixed per mode and only adjusted for contrast. They never take the brand color.

Machine-readable sources: [`design/styles.json`](../design/styles.json), [`design/palettes.json`](../design/palettes.json), [`design/fonts.json`](../design/fonts.json). `packages/design-tokens` resolves them.

## Token schema

Semantic tokens every component reads (CSS custom properties):

| Group | Tokens |
| --- | --- |
| Color | `--canvas`, `--surface`, `--surface-2`, `--ink`, `--ink-muted`, `--border`, `--primary`, `--primary-tint`, `--on-primary`, `--success`, `--warning`, `--danger`, `--info` (+ `-bg`, `-ink` variants) |
| Chart | `--chart-1` … `--chart-6` derived from primary + tint; status colors for good/bad |
| Type | `--font-heading`, `--font-body`, `--font-numeric`, size scale `--text-xs` … `--text-4xl`, `--weight-*` |
| Shape | `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-pill`, `--border-width` |
| Depth | `--shadow-card`, `--shadow-pop`, `--blur-glass`, `--glass-opacity` |
| Density | `--space-*`, `--row-height`, `--control-height` |
| Motion | `--motion-level`, `--dur-fast`, `--dur-base`, `--ease-standard` |
| Derived (D19) | `--primary-ink`, `--primary-hover`, `--on-primary-tint`, `--on-danger`, `--border-strong`, `--focus-ring`, `--card-bg`, `--card-bg-strong`, `--card-border`, `--backdrop`, `--overlay`, `--control-height-touch` |

Rules:
- Components read only semantic tokens; no raw hex, font names or pixel radii in component code.
- Tailwind config maps utilities to these variables.
- Dark mode is a second token set, not inverted colors. Every style ships light and dark.

## Resolving a theme

```ts
resolveTheme(styleId, paletteOrBrand, fineTune, mode) => {
  // 1. Start from style defaults (shape, type, density, depth, motion, recipes)
  // 2. Fill color slots from the palette (or the brand palette)
  // 3. Derive tints, chart colors, on-primary text color
  // 4. Contrast pass: adjust lightness (in OKLCH) until ink/surface >= 4.5:1,
  //    on-primary/primary >= 4.5:1, large text and UI parts >= 3:1
  // 5. Apply fine-tune overrides, re-run contrast pass
  // 6. Emit CSS variables + Tailwind theme + a JSON snapshot stored in design_choices
}
```

Special cases:
- A palette whose primary is too light for its surface (e.g. Sunflower pop) is only used as a fill with an outline or dark text, as the style recipe defines.
- Dark-by-nature styles (Industrial dark, Terminal) ship a light variant too.

## Brand pipeline (logo or brand colors → personal palette and brand kit)

Implemented in `packages/brand-kit`. Inputs: logo (SVG preferred, PNG/JPG accepted), optional exact brand colors (hex) and brand fonts.

1. **Normalize the logo:** SVG sanitized; raster trimmed and converted.
2. **Extract colors:** cluster pixels in OKLCH (ignore near-white, near-black and transparent), rank by area and chroma. Pick primary (most prominent saturated hue) and secondary.
3. **Build ramps:** generate 50–950 tonal ramps in OKLCH for primary and neutral (neutral slightly tinted toward the primary hue).
4. **Map to slots:** primary, tint, surface, canvas, ink, muted ink, border, for light and dark.
5. **Contrast fix** as above. If the exact brand color fails contrast as a button, keep it for accents and use a darker/lighter shade for text-bearing surfaces; tell the user why.
6. **Brand kit outputs:**
   - Favicons: `favicon.ico` (16/32/48), `favicon.svg` (with dark-mode variant when the logo allows), `apple-touch-icon.png` (180), PWA icons 192/512 and a maskable 512
   - Logo placements: sidebar (compact mark), login page (full logo), email header
   - Link-preview (Open Graph) image 1200×630 from a template: logo + app name + palette background
   - `brand.json` and a palette file (CSS + JSON) for download
7. **Quality notes:** blurry or very busy logos produce weaker palettes and favicons; recommend SVG or a high-resolution PNG. If the logo is a wordmark too wide for a favicon, generate a monogram from the first letter in the brand font and primary color, and let the user choose.

Libraries to consider: `culori` (OKLCH math), `sharp` (raster processing), an SVG sanitizer. Validate licenses before adding.

## Design studio UX (platform)

1. Recommended styles first: 3 styles chosen by app type (see the "Best for" column in doc 10), then "Browse all 18".
2. Previews render the user's own app: their entity names, KPI labels, sample rows from seed data, their logo once uploaded.
3. Palette row under the preview; "Use my logo" and "Enter brand colors" sit beside the palettes.
4. Fine-tune drawer: mode, density, corners, font pair, motion level, individual colors with live contrast warnings.
5. Switching style or palette later updates tokens only; no rebuild.

## Accessibility requirements (all styles)

- Text contrast ≥ 4.5:1; large text and UI components ≥ 3:1
- Visible focus ring in every style (uses `--primary`, 2px, offset)
- Glass styles place text on a more solid layer so contrast holds over any backdrop
- Hit targets ≥ 40px on touch layouts
- `prefers-reduced-motion` disables non-essential motion
- Indian-script support: when the spec lists Telugu, Devanagari or Tamil, add the matching Noto/Anek font to the stack automatically
