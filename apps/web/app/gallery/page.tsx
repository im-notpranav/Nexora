import {
  getStyle,
  isPaletteId,
  isStyleId,
  listPalettes,
  listStyles,
  resolveTheme,
  themeToCss,
  type Mode,
} from "@nexora/design-tokens";
import type { Metadata } from "next";
import Link from "next/link";
import { NexoraMark } from "@/components/nexora-mark";
import { PLATFORM_STYLE } from "@/lib/platform-theme";
import { GalleryControls } from "./controls";
import { SampleApp } from "./sample-app";

export const metadata: Metadata = {
  title: "Style gallery",
  description: "Every Nexora style with every palette, in light and dark, on a sample app.",
};

function param(value: string | string[] | undefined): string | undefined {
  return typeof value === "string" ? value : undefined;
}

export default async function GalleryPage({ searchParams }: PageProps<"/gallery">) {
  const params = await searchParams;
  const styleParam = param(params.style);
  const styleId = styleParam && isStyleId(styleParam) ? styleParam : PLATFORM_STYLE;
  const style = getStyle(styleId);
  const paletteParam = param(params.palette);
  const paletteId =
    paletteParam && isPaletteId(paletteParam) ? paletteParam : style.defaults.palette;
  const modeParam = param(params.mode);
  const mode: Mode =
    modeParam === "light" || modeParam === "dark" ? modeParam : style.defaults.mode;

  const theme = resolveTheme(styleId, paletteId, {}, mode);
  const css = themeToCss(theme, "[data-gallery-theme]");
  const styles = listStyles().map((s) => ({ id: s.id, name: s.name, group: s.group }));

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-40 flex flex-col gap-4 border-b border-border bg-surface px-4 py-4 md:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <NexoraMark />
            <span className="type-heading text-lg">Style gallery</span>
          </Link>
          <p className="text-sm text-ink-muted">
            <strong className="text-ink">{style.name}</strong> · best for {style.bestFor.join(", ")}
          </p>
        </div>
        <GalleryControls
          styles={{
            dashboard: styles.filter((s) => s.group === "dashboard"),
            expressive: styles.filter((s) => s.group === "expressive"),
          }}
          palettes={listPalettes().map((p) => ({ id: p.id, name: p.name }))}
          current={{ style: styleId, palette: paletteId, mode }}
        />
        {theme.adjustments.length > 0 ? (
          <p className="text-xs text-ink-muted" data-testid="contrast-notes">
            Contrast notes: {[...new Set(theme.adjustments)].join(" ")}
          </p>
        ) : null}
      </header>

      <style>{css}</style>
      <div
        data-gallery-theme
        data-style={styleId}
        data-palette={paletteId}
        data-mode={mode}
        className="theme-root flex-1"
      >
        <SampleApp nav={theme.layout.nav} kpi={theme.layout.kpi} />
      </div>
    </div>
  );
}
