import { Sparkline } from "./charts";
import { cn } from "./cn";
import { StatusBadge, type Tone } from "./status-badge";

/** Machine-readable KPI recipe from the style (design/styles.json recipes.kpi). */
export type KpiVariant = "standard" | "comparison" | "progress" | "outlined" | "strip" | "terminal";

export interface Kpi {
  label: string;
  value: string;
  unit?: string;
  /** e.g. "+12%". `good` decides the tone; null means neutral. */
  delta?: { text: string; good: boolean | null };
  /** Plain-language comparison, e.g. "vs last month". */
  caption?: string;
  /** 0–1, shown by the progress recipe. */
  progress?: number;
  series?: number[];
  status?: Exclude<Tone, "neutral">;
}

function deltaTone(delta: Kpi["delta"]): Tone {
  if (!delta || delta.good === null) return "neutral";
  return delta.good ? "success" : "danger";
}

const DELTA_TEXT: Record<Tone, string> = {
  success: "text-success",
  danger: "text-danger",
  warning: "text-warning",
  info: "text-info",
  neutral: "text-ink-muted",
};

const STATUS_DOT: Record<NonNullable<Kpi["status"]>, string> = {
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  info: "bg-info",
};

const STRIP_COLUMNS: Record<number, string> = {
  1: "md:grid-cols-1",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
  5: "md:grid-cols-5",
  6: "md:grid-cols-6",
};

/** Outlined (neo-brutalist) cards rotate through fills; each fill has a matching text token. */
const OUTLINED_FILLS = [
  "bg-primary text-on-primary",
  "bg-primary-tint text-on-primary-tint",
  "bg-surface text-ink",
];

function Value({ kpi, size = "text-3xl" }: { kpi: Kpi; size?: string }) {
  return (
    <p className={cn("type-numeric leading-none", size)}>
      {kpi.value}
      {kpi.unit ? <span className="ms-1 text-base">{kpi.unit}</span> : null}
    </p>
  );
}

function TickProgress({ value, label }: { value: number; label: string }) {
  const ticks = 24;
  const lit = Math.round(Math.min(1, Math.max(0, value)) * ticks);
  return (
    <div
      className="flex h-3 gap-0.5"
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(value * 100)}
    >
      {Array.from({ length: ticks }, (_, i) => (
        <span key={i} className={cn("flex-1 rounded-pill", i < lit ? "bg-chart-1" : "bg-border")} />
      ))}
    </div>
  );
}

function KpiCard({ kpi, variant, index }: { kpi: Kpi; variant: KpiVariant; index: number }) {
  const tone = deltaTone(kpi.delta);

  if (variant === "terminal") {
    return (
      <div className="surface-card flex flex-col gap-3 p-card">
        <p className="flex items-center gap-2 text-xs text-ink-muted uppercase">
          {kpi.status ? (
            <span
              className={cn("size-2 rounded-pill", STATUS_DOT[kpi.status])}
              aria-hidden="true"
            />
          ) : null}
          [ {kpi.label} ]
        </p>
        <Value kpi={kpi} size="text-2xl" />
        {kpi.delta ? <p className={cn("text-xs", DELTA_TEXT[tone])}>{kpi.delta.text}</p> : null}
      </div>
    );
  }

  if (variant === "outlined") {
    const fill = OUTLINED_FILLS[index % OUTLINED_FILLS.length];
    return (
      <div className={cn("surface-card flex flex-col gap-3 p-card", fill)}>
        <p className="text-sm font-semibold">{kpi.label}</p>
        <Value kpi={kpi} size="text-4xl" />
        {kpi.delta ? (
          <span className="self-start">
            <StatusBadge tone={tone}>{kpi.delta.text}</StatusBadge>
          </span>
        ) : null}
      </div>
    );
  }

  return (
    <div className="surface-card flex min-w-0 flex-col gap-3 p-card">
      <p className="text-sm text-ink-muted">{kpi.label}</p>
      <div className="flex flex-wrap items-end gap-2">
        <Value kpi={kpi} />
        {variant === "standard" && kpi.delta ? (
          <StatusBadge tone={tone}>{kpi.delta.text}</StatusBadge>
        ) : null}
      </div>
      {variant === "comparison" && kpi.delta ? (
        <p className="text-sm text-ink-muted">
          <span className={cn("font-semibold", DELTA_TEXT[tone])}>{kpi.delta.text}</span>
          {kpi.caption ? ` ${kpi.caption}` : null}
        </p>
      ) : null}
      {variant === "progress" ? (
        <TickProgress value={kpi.progress ?? 0} label={`${kpi.label} progress`} />
      ) : null}
      {variant === "standard" && kpi.series ? <Sparkline values={kpi.series} /> : null}
    </div>
  );
}

/** A row of KPI cards drawn in the style's KPI recipe. */
export function KpiGroup({ items, variant }: { items: Kpi[]; variant: KpiVariant }) {
  if (variant === "strip") {
    return (
      <section
        aria-label="Key figures"
        className={cn(
          "surface-card grid grid-cols-1 divide-y divide-border md:divide-x md:divide-y-0",
          STRIP_COLUMNS[Math.min(items.length, 6)],
        )}
      >
        {items.map((kpi) => (
          <div key={kpi.label} className="flex min-w-0 flex-col gap-2 p-card">
            <p className="text-xs text-ink-muted">{kpi.label}</p>
            <Value kpi={kpi} size="text-4xl" />
            {kpi.delta ? (
              <p className={cn("text-xs font-semibold", DELTA_TEXT[deltaTone(kpi.delta)])}>
                {kpi.delta.text}
                {kpi.caption ? (
                  <span className="font-normal text-ink-muted"> {kpi.caption}</span>
                ) : null}
              </p>
            ) : null}
          </div>
        ))}
      </section>
    );
  }
  return (
    <section
      aria-label="Key figures"
      className="grid grid-cols-1 gap-theme sm:grid-cols-2 xl:grid-cols-4"
    >
      {items.map((kpi, i) => (
        <KpiCard key={kpi.label} kpi={kpi} variant={variant} index={i} />
      ))}
    </section>
  );
}
