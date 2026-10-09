"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";

export interface Option {
  id: string;
  name: string;
}

export interface GalleryControlsProps {
  styles: { dashboard: Option[]; expressive: Option[] };
  palettes: Option[];
  current: { style: string; palette: string; mode: "light" | "dark" };
}

const SELECT =
  "h-control rounded-control border-control bg-surface px-4 text-sm text-ink motion-colors";

/** Style / palette / mode switchers. Plain GET form, so it also works before JavaScript loads. */
export function GalleryControls({ styles, palettes, current }: GalleryControlsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  function update(form: HTMLFormElement) {
    const params = new URLSearchParams(new FormData(form) as unknown as Record<string, string>);
    startTransition(() => router.replace(`${pathname}?${params.toString()}`, { scroll: false }));
  }

  return (
    <form
      method="get"
      className="flex flex-wrap items-end gap-3"
      onChange={(e) => update(e.currentTarget)}
      aria-busy={pending}
    >
      <label className="flex flex-col gap-1 text-xs font-semibold text-ink-muted">
        Style
        <select name="style" defaultValue={current.style} className={SELECT}>
          <optgroup label="Dashboard styles">
            {styles.dashboard.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </optgroup>
          <optgroup label="Expressive styles">
            {styles.expressive.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </optgroup>
        </select>
      </label>
      <label className="flex flex-col gap-1 text-xs font-semibold text-ink-muted">
        Palette
        <select name="palette" defaultValue={current.palette} className={SELECT}>
          {palettes.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </label>
      <fieldset className="flex flex-col gap-1">
        <legend className="text-xs font-semibold text-ink-muted">Mode</legend>
        <div className="flex h-control items-center gap-1 rounded-control border-control bg-surface p-1">
          {(["light", "dark"] as const).map((mode) => (
            <label
              key={mode}
              className="flex h-full cursor-pointer items-center rounded-control px-3 text-sm font-semibold text-ink-muted has-checked:bg-primary has-checked:text-on-primary has-focus-visible:focus-ring"
            >
              <input
                type="radio"
                name="mode"
                value={mode}
                defaultChecked={current.mode === mode}
                className="sr-only"
              />
              {mode === "light" ? "Light" : "Dark"}
            </label>
          ))}
        </div>
      </fieldset>
      <noscript>
        <button
          type="submit"
          className="h-control rounded-control bg-primary px-4 text-sm font-semibold text-on-primary"
        >
          Show
        </button>
      </noscript>
    </form>
  );
}
