import type { ReactNode } from "react";

export interface DetailField {
  label: string;
  value: ReactNode;
}

export interface HistoryEntry {
  when: string;
  text: string;
}

/** Record detail page: key facts on the left, history on the right. */
export function DetailView({
  title,
  subtitle,
  status,
  actions,
  fields,
  history,
}: {
  title: string;
  subtitle?: string;
  status?: ReactNode;
  actions?: ReactNode;
  fields: DetailField[];
  history?: HistoryEntry[];
}) {
  return (
    <section className="flex min-w-0 flex-col gap-theme" aria-label={title}>
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-1">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="type-heading text-2xl">{title}</h2>
            {status}
          </div>
          {subtitle ? <p className="text-sm text-ink-muted">{subtitle}</p> : null}
        </div>
        {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
      </header>
      <div className="grid grid-cols-1 gap-theme lg:grid-cols-3">
        <dl className="surface-solid grid grid-cols-1 gap-4 p-card sm:grid-cols-2 lg:col-span-2">
          {fields.map((f) => (
            <div key={f.label} className="flex min-w-0 flex-col gap-1">
              <dt className="text-xs text-ink-muted">{f.label}</dt>
              <dd className="text-sm font-semibold break-words">{f.value}</dd>
            </div>
          ))}
        </dl>
        {history ? (
          <section className="surface-solid flex flex-col gap-3 p-card" aria-label="History">
            <h3 className="type-heading text-base">History</h3>
            <ol className="flex flex-col gap-3">
              {history.map((h) => (
                <li
                  key={`${h.when}-${h.text}`}
                  className="flex flex-col gap-0.5 border-s-2 border-border ps-3"
                >
                  <span className="text-xs text-ink-muted">{h.when}</span>
                  <span className="text-sm">{h.text}</span>
                </li>
              ))}
            </ol>
          </section>
        ) : null}
      </div>
    </section>
  );
}
