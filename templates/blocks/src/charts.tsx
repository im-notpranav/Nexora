import { cn } from "./cn";

/** Tiny trend line. Decorative unless given a label. */
export function Sparkline({
  values,
  label,
  className,
}: {
  values: number[];
  label?: string;
  className?: string;
}) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const points = values
    .map((v, i) => `${(i / Math.max(values.length - 1, 1)) * 100},${30 - ((v - min) / span) * 28}`)
    .join(" ");
  return (
    <svg
      viewBox="0 0 100 32"
      preserveAspectRatio="none"
      className={cn("h-8 w-full text-chart-1", className)}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export interface BarDatum {
  label: string;
  value: number;
}

/** Simple vertical bar chart; one bar can be highlighted in the primary chart color. */
export function BarChart({
  data,
  label,
  highlight,
}: {
  data: BarDatum[];
  label: string;
  highlight?: number;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <figure className="flex flex-col gap-2">
      <div className="flex h-40 items-end gap-2" role="img" aria-label={label}>
        {data.map((d, i) => (
          <div
            key={d.label}
            className={cn(
              "min-w-0 flex-1 rounded-t-sm",
              i === highlight ? "bg-chart-1" : "bg-chart-2",
            )}
            style={{ height: `${Math.max(4, (d.value / max) * 100)}%` }}
          />
        ))}
      </div>
      <div className="flex gap-2" aria-hidden="true">
        {data.map((d) => (
          <span
            key={d.label}
            className="min-w-0 flex-1 truncate text-center text-xs text-ink-muted"
          >
            {d.label}
          </span>
        ))}
      </div>
    </figure>
  );
}
