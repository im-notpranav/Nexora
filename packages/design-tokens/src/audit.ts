import { composite, contrast } from "./color";
import type { ResolvedTheme } from "./resolve";

export interface ContrastPair {
  label: string;
  fg: string;
  bg: string;
  min: number;
}

export interface ContrastFailure extends ContrastPair {
  ratio: number;
}

const TEXT = 4.5;
const NON_TEXT = 3;

/**
 * Every foreground/background pair a theme promises to keep readable (WCAG AA):
 * 4.5:1 for text, 3:1 for UI parts and chart marks. Glass themes are checked over each
 * backdrop color their card can sit on.
 */
export function contrastPairs(theme: ResolvedTheme): ContrastPair[] {
  const v = (name: string): string => {
    const value = theme.vars[name];
    if (value === undefined) throw new Error(`Theme is missing ${name}`);
    return value;
  };
  const backgrounds = ["--surface", "--canvas", "--surface-2"];
  const pairs: ContrastPair[] = [];
  const add = (fg: string, bg: string, min: number) =>
    pairs.push({ label: `${fg} on ${bg}`, fg: v(fg), bg: v(bg), min });

  for (const bg of backgrounds) {
    add("--ink", bg, TEXT);
    add("--ink-muted", bg, TEXT);
    add("--primary-ink", bg, TEXT);
    add("--focus-ring", bg, NON_TEXT);
    add("--border-strong", bg, NON_TEXT);
    for (const s of ["--success", "--warning", "--danger", "--info"]) add(s, bg, TEXT);
  }
  add("--on-primary", "--primary", TEXT);
  add("--on-primary", "--primary-hover", TEXT);
  add("--on-primary-tint", "--primary-tint", TEXT);
  add("--on-danger", "--danger", TEXT);
  for (const s of ["success", "warning", "danger", "info"]) add(`--${s}-ink`, `--${s}-bg`, TEXT);
  for (let i = 1; i <= 6; i++) add(`--chart-${i}`, "--surface", NON_TEXT);

  if (theme.glass) {
    const textVars = [
      "--ink",
      "--ink-muted",
      "--primary-ink",
      "--success",
      "--warning",
      "--danger",
      "--info",
    ];
    theme.glass.backdropColors.forEach((backdrop, i) => {
      const card = composite(v("--surface"), theme.glass!.cardOpacity, backdrop);
      for (const fg of textVars) {
        pairs.push({
          label: `${fg} on glass card over backdrop ${i + 1}`,
          fg: v(fg),
          bg: card,
          min: TEXT,
        });
      }
    });
  }
  return pairs;
}

export function auditContrast(theme: ResolvedTheme): ContrastFailure[] {
  return contrastPairs(theme)
    .map((pair) => ({ ...pair, ratio: contrast(pair.fg, pair.bg) }))
    .filter((pair) => pair.ratio < pair.min);
}
