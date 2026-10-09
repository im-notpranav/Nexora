import type { ResolvedTheme } from "./resolve";

/**
 * CSS for a resolved theme scoped to `selector`. Adds the touch-target and reduced-motion
 * rules every theme needs, so callers never have to remember them.
 */
export function themeToCss(theme: ResolvedTheme, selector = ":root"): string {
  const declarations = Object.entries(theme.vars)
    .map(([name, value]) => `  ${name}: ${value};`)
    .join("\n");
  return [
    `${selector} {`,
    `  color-scheme: ${theme.mode};`,
    declarations,
    `}`,
    `@media (pointer: coarse) {`,
    `  ${selector} { --control-height: var(--control-height-touch); }`,
    `}`,
    `@media (prefers-reduced-motion: reduce) {`,
    `  ${selector} { --motion-level: 0; --dur-fast: 0ms; --dur-base: 0ms; }`,
    `}`,
    ``,
  ].join("\n");
}

/** CSS for a light theme plus a dark theme that follows the OS or an explicit data-theme. */
export function themePairToCss(
  light: ResolvedTheme,
  dark: ResolvedTheme,
  selector = ":root",
): string {
  return [
    themeToCss(light, selector),
    `@media (prefers-color-scheme: dark) {`,
    indent(themeToCss(dark, `${selector}:not([data-theme="light"])`)),
    `}`,
    themeToCss(dark, `${selector}[data-theme="dark"]`),
  ].join("\n");
}

/** The theme's variables as a React-compatible style object (no media rules). */
export function themeToStyle(theme: ResolvedTheme): Record<string, string> {
  return { colorScheme: theme.mode, ...theme.vars };
}

function indent(css: string): string {
  return css
    .split("\n")
    .map((line) => (line ? `  ${line}` : line))
    .join("\n");
}
