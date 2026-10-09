import { resolveTheme, themePairToCss } from "@nexora/design-tokens";

// The platform UI uses style airy-pill with palette sky in light and dark (decision D13).
export const PLATFORM_STYLE = "airy-pill";
export const PLATFORM_PALETTE = "sky";

export const platformThemeCss = themePairToCss(
  resolveTheme(PLATFORM_STYLE, PLATFORM_PALETTE, {}, "light"),
  resolveTheme(PLATFORM_STYLE, PLATFORM_PALETTE, {}, "dark"),
);
