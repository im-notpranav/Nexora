import type { ReactNode } from "react";
import { cn } from "./cn";

/** Navigation family from the style (design/styles.json layout.nav, grouped by design-tokens). */
export type NavFamily = "rail" | "sidebar" | "top";

export interface NavItem {
  label: string;
  href: string;
  icon: ReactNode;
  active?: boolean;
}

export interface AppShellProps {
  nav: NavFamily;
  appName: string;
  /** Logo or monogram. */
  mark: ReactNode;
  items: NavItem[];
  /** Right side of the top bar: user menu, theme switch. */
  actions?: ReactNode;
  children: ReactNode;
}

function NavLink({ item, compact }: { item: NavItem; compact?: boolean }) {
  return (
    <a
      href={item.href}
      aria-current={item.active ? "page" : undefined}
      title={compact ? item.label : undefined}
      className={cn(
        "flex min-h-control items-center gap-3 rounded-control px-3 text-sm font-semibold motion-colors",
        compact && "justify-center px-0",
        item.active
          ? "bg-primary text-on-primary"
          : "text-ink-muted hover:bg-surface-2 hover:text-ink",
      )}
    >
      <span aria-hidden="true" className="flex size-5 shrink-0 items-center justify-center">
        {item.icon}
      </span>
      <span className={cn(compact && "sr-only")}>{item.label}</span>
    </a>
  );
}

/** Phone navigation: a disclosure menu that works without JavaScript. */
function MobileMenu({ items }: { items: NavItem[] }) {
  return (
    <details className="relative md:hidden">
      <summary className="flex h-control cursor-pointer list-none items-center rounded-control border-control px-4 text-sm font-semibold">
        Menu
      </summary>
      <nav
        aria-label="Main"
        className="absolute end-0 z-20 mt-2 flex w-56 flex-col gap-1 rounded-card bg-surface p-2 shadow-pop"
      >
        {items.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}
      </nav>
    </details>
  );
}

function Brand({
  appName,
  mark,
  compact,
}: {
  appName: string;
  mark: ReactNode;
  compact?: boolean;
}) {
  return (
    <a href="#" className="flex min-w-0 items-center gap-2">
      <span className="flex size-9 shrink-0 items-center justify-center" aria-hidden="true">
        {mark}
      </span>
      <span className={cn("type-heading truncate text-base", compact && "sr-only")}>{appName}</span>
    </a>
  );
}

/** Page frame for the generated app in the style's navigation layout. */
export function AppShell({ nav, appName, mark, items, actions, children }: AppShellProps) {
  const skipLink = (
    <a
      href="#main"
      className="sr-only rounded-control bg-primary px-4 py-2 text-on-primary focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-30"
    >
      Skip to content
    </a>
  );
  const topBar = (
    <header className="flex items-center justify-between gap-4 border-b border-border bg-surface px-4 py-3 md:px-6">
      <div className={cn("flex min-w-0 items-center gap-6", nav !== "top" && "md:hidden")}>
        <Brand appName={appName} mark={mark} />
        {nav === "top" ? (
          <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
            {items.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </nav>
        ) : null}
      </div>
      <div className="ms-auto flex items-center gap-3">
        {actions}
        <MobileMenu items={items} />
      </div>
    </header>
  );
  const main = (
    <main id="main" className="min-w-0 flex-1 p-4 md:p-8">
      {children}
    </main>
  );

  if (nav === "top") {
    return (
      <div className="flex min-h-dvh flex-col">
        {skipLink}
        {topBar}
        {main}
      </div>
    );
  }

  const rail = nav === "rail";
  return (
    <div
      className={cn(
        "min-h-dvh md:grid",
        rail ? "md:grid-cols-[5rem_1fr]" : "md:grid-cols-[15rem_1fr]",
      )}
    >
      {skipLink}
      <aside
        className={cn(
          "sticky top-0 hidden h-dvh flex-col gap-6 border-e border-border bg-surface py-5 md:flex",
          rail ? "items-center px-3" : "px-4",
        )}
      >
        <Brand appName={appName} mark={mark} compact={rail} />
        <nav aria-label="Main" className={cn("flex flex-col gap-1", rail && "w-full")}>
          {items.map((item) => (
            <NavLink key={item.href} item={item} compact={rail} />
          ))}
        </nav>
      </aside>
      <div className="flex min-w-0 flex-col">
        {topBar}
        {main}
      </div>
    </div>
  );
}
