# Nexora

Describe an app in plain words, connect your own free AI keys and accounts, pick a design, and get a working, deployed, full-stack app you own.

- Start with [CLAUDE.md](CLAUDE.md): project context, fixed rules and the doc index.
- Product and architecture docs are in [docs/](docs/).
- Design tokens (18 styles, 14 palettes, fonts) are in [design/](design/).
- Build order and acceptance criteria: [docs/12-roadmap.md](docs/12-roadmap.md).

Status: milestone M0 (foundations and design tokens) in progress.

## Getting started

Requires Node 24 and pnpm 12 (`npm install -g pnpm@12`).

```bash
pnpm install
pnpm dev            # platform at http://localhost:3100, style gallery at /gallery
```

Sign-in needs Nexora's platform Supabase project: copy `apps/web/.env.example` to `apps/web/.env.local` and fill it in. Everything else, including the gallery, works without it.

## Checks

```bash
pnpm typecheck && pnpm lint && pnpm test   # before declaring work done
pnpm e2e                                   # builds the web app, then runs Playwright
```

`GALLERY_FULL=1 pnpm e2e` also runs the accessibility scan on all 504 style × palette × mode combinations.

## Layout

| Path | What it is |
| --- | --- |
| `apps/web` | Platform UI (Next.js 16, Tailwind 4): landing, sign-in, dashboard shell, `/gallery` |
| `packages/design-tokens` | Loads and validates `design/*.json`; `resolveTheme` turns style + palette into contrast-checked CSS variables |
| `templates/blocks` | Token-driven React blocks (app shell, KPI cards, table, form, detail, empty state) copied into generated apps |
| `design/` | Machine-readable styles, palettes and fonts |
