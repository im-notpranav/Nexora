import type { ReactNode } from "react";

/** What a list shows before it has data: what this place is for and the first thing to do. */
export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 px-4 py-10 text-center">
      {icon ? (
        <div
          className="flex size-12 items-center justify-center rounded-pill bg-primary-tint text-on-primary-tint"
          aria-hidden="true"
        >
          {icon}
        </div>
      ) : null}
      <h3 className="type-heading text-lg">{title}</h3>
      <p className="max-w-sm text-sm text-ink-muted">{description}</p>
      {action ? <div className="pt-2">{action}</div> : null}
    </div>
  );
}
