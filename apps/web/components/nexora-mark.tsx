/** Nexora's working mark: a rounded tile with an "N". Colors come from theme tokens. */
export function NexoraMark({ className }: { className?: string }) {
  return (
    <span
      className={`flex size-9 items-center justify-center rounded-control bg-primary text-on-primary type-heading text-base ${className ?? ""}`}
      aria-hidden="true"
    >
      N
    </span>
  );
}
