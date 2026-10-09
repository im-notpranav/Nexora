import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { cn } from "./cn";

const CONTROL =
  "w-full bg-surface text-ink border-control motion-colors placeholder:text-ink-muted aria-invalid:border-danger";

export interface FieldProps {
  id: string;
  label: string;
  hint?: string;
  /** Plain-language message: what is wrong and how to fix it. */
  error?: string;
  required?: boolean;
  children: (describedBy: string | undefined, invalid: boolean) => ReactNode;
}

/** Label, control, hint and error wired together for screen readers. */
export function Field({ id, label, hint, error, required, children }: FieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-ink">
        {label}
        {required ? <span className="text-ink-muted"> (required)</span> : null}
      </label>
      {children(describedBy, Boolean(error))}
      {hint ? (
        <p id={hintId} className="text-xs text-ink-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="text-xs font-semibold text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function TextInput({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(CONTROL, "h-control rounded-control px-4", className)} {...props} />;
}

export function SelectInput({
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn(CONTROL, "h-control rounded-control px-4", className)} {...props}>
      {children}
    </select>
  );
}

export function TextArea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea className={cn(CONTROL, "min-h-24 rounded-md px-4 py-2", className)} {...props} />
  );
}

/** A form on a solid surface with a title and an actions row. */
export function FormCard({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description?: string;
  actions: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="surface-solid flex flex-col gap-6 p-card" aria-label={title}>
      <header className="flex flex-col gap-1">
        <h2 className="type-heading text-xl">{title}</h2>
        {description ? <p className="text-sm text-ink-muted">{description}</p> : null}
      </header>
      <div className="grid grid-cols-1 gap-theme md:grid-cols-2">{children}</div>
      <div className="flex flex-wrap justify-end gap-3">{actions}</div>
    </section>
  );
}
