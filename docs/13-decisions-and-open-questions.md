# 13 — Decisions and open questions

Add new decisions at the bottom with the date. Don't reverse a decision without the founder's agreement.

## Decisions

| ID | Date | Decision | Why |
| --- | --- | --- | --- |
| D1 | 2026-10-08 | Users bring their own free AI keys (BYOK); the platform supplies no AI credits in v1 | Zero AI cost for users; key to the target market |
| D2 | 2026-10-08 | Spread load across different providers, never multiple accounts on one provider | Provider terms; Gemini limits are per project, not per key |
| D3 | 2026-10-08 | One opinionated stack for generated apps: Next.js + TypeScript + Tailwind + shadcn/ui + Supabase, deployed to Vercel (Netlify second) | Templates can cover most of the app only with one stack |
| D4 | 2026-10-08 | Deterministic templates generate everything a spec fully describes; LLM only for spec, custom logic, custom UI and fixes | 5–10× fewer LLM calls; reliability |
| D5 | 2026-10-08 | Quality and the readiness score come from automated checks, never from an LLM's opinion of its own output | Trustworthy, reproducible score |
| D6 | 2026-10-08 | User owns all infrastructure: their Supabase, GitHub and host accounts, connected by OAuth before the project starts | Ownership; project complete before any IDE is opened |
| D7 | 2026-10-08 | v1 scope is business apps and dashboards (internal tools, CRUD, roles, approvals, reports) | Highest template coverage; matches target users |
| D8 | 2026-10-08 | Design library: 18 styles (11 from founder's references, 7 from 2026 trends) × 14 palettes + logo-generated palette; styles never contain brand colors | Generated apps must not look generic |
| D9 | 2026-10-08 | Status colors are fixed and never take the brand color | Meaning must stay consistent |
| D10 | 2026-10-08 | OFL fonts only, self-hosted via Fontsource | Generated apps redistribute font files |
| D11 | 2026-10-08 | React Bits is a reference only; no code copied until written permission from its author | MIT + Commons Clause forbids redistributing components in a bundle |
| D12 | 2026-10-08 | Builds pause and resume on rate limits instead of failing, with ETA shown before and during builds | Free tiers are the normal operating condition |
| D13 | 2026-10-08 | Platform UI uses style `airy-pill` with palette `sky` | Calm platform so user previews stand out |
| D14 | 2026-10-08 | Primary market India: Indian-script fonts supported; default Supabase region Mumbai; Razorpay first when payments arrive | Target users |
| D15 | 2026-10-09 | TypeScript pinned to 6.0.x and ESLint to 9.x | typescript-eslint supports TypeScript < 6.1 only; Next's lint plugins target ESLint 9. Revisit when both support newer majors |
| D16 | 2026-10-09 | Keep pnpm's minimum-release-age policy on, with no per-package exceptions; `unrs-resolver`'s install script is denied (`allowBuilds`) | Supply-chain safety; its native binary already arrives as an optional dependency |
| D17 | 2026-10-09 | `styles.json` gains machine-readable `recipes.kpi` (standard, comparison, progress, outlined, strip, terminal) and optional `type.weights`; `fonts.json` gains `variable` and all fonts are verified on npm (OFL-1.1) | Blocks read rules from data, not prose; variable fonts register as "Family Variable" |
| D18 | 2026-10-09 | A palette's `surface` slot is the card surface; `canvas` is derived from it (darker in both modes). In a palette's opposite mode, surface, ink and tint are derived in OKLCH and the brand fill is kept unless it falls below 3:1 against the surface | Matches palettes.json comment; keeps brand colors untouched wherever they already work |
| D19 | 2026-10-09 | Tokens beyond doc 09's table: `--primary-ink` (brand color as text), `--primary-hover`, `--on-primary-tint`, `--on-danger`, `--border-strong` (3:1 control outline), `--focus-ring`, `--card-bg`, `--card-bg-strong`, `--card-border`, `--backdrop`, `--overlay`, `--control-height-touch`. shadcn/ui color names are aliased to these | A brand fill and a readable brand text color are often different; shadcn components follow the theme without edits |
| D20 | 2026-10-09 | Glass styles get a generated backdrop from palette colors; card opacity is raised (in 0.05 steps) until all text reaches 4.5:1 over every backdrop color | Doc 09's "text on a more solid layer" made measurable; user photos as backdrops come with Q5 |
| D21 | 2026-10-09 | M0 visual acceptance is automated layout checks (no sideways scroll, no overlapping blocks or KPI cards, numbers fit, heading font loaded) on all 1,008 style × palette × mode × width combinations, with screenshots attached for human review instead of pixel baselines. axe runs on every style in its default palette; `GALLERY_FULL=1` scans all 504 | Pixel baselines differ between Windows and Linux font rendering and would be flaky in CI |
| D22 | 2026-10-09 | `templates/blocks` are self-contained React + Tailwind components that import nothing from Nexora (enforced by a test); the platform reuses them for its own shell in M0 | They are copied into generated apps, which must not depend on Nexora packages |
| D23 | 2026-10-09 | Platform env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_SITE_URL`. Sign-in by email link or Google; session refreshed in `proxy.ts` (Next 16's renamed middleware) | Supabase's current publishable-key naming; no passwords to manage |
| D24 | 2026-10-09 | Local dev server runs on port 3100 | Port 3000 was unavailable on the founder's machine |

## Open questions (decide before the milestone that needs them)

| ID | Question | Needed by | Current recommendation |
| --- | --- | --- | --- |
| Q1 | Job queue: Postgres-backed (pg-boss) vs hosted workflow engine | M3 | pg-boss in platform Postgres to start; revisit at scale |
| Q2 | Build sandbox: own container host vs hosted sandbox service | M3 | Containers on a worker host we control; compare costs per build minute |
| Q3 | Supabase migrations: is the Management API migrations endpoint available to us? | M5 | Apply migrations over a direct Postgres connection until access is confirmed |
| Q4 | GitHub: exact flow to create a repo in the user's account with a GitHub App | M5 | User-to-server token creates repo; app installed on that repo only — verify |
| Q5 | Imagery for styles 3, 10, 12, 13: user uploads only, free stock, or generated abstract art | M6 | User uploads first, generated abstract art as default; stock only with license check |
| Q6 | React Bits: request permission from David Haz, or build all effects in-house | M6 | Ask; build P1 effects in-house regardless |
| Q7 | Default style shown first to new users | M6 | `airy-pill` or `corporate-classic`, chosen by app type |
| Q8 | Supabase free plan limits (2 active projects, pause after 7 days): how to keep live apps from pausing | M5 | Explain clearly; recommend paid plan for live business apps; never ping projects to dodge the pause rule |
| Q9 | Platform business model: free tier limits, paid plan for sandbox minutes or team features | Before public launch | Undecided |
| Q10 | Product name: "Nexora" is a working name | Before public launch | Check trademark and domain availability |

## Assumptions to verify early

- Free-tier limits in doc 05 (snapshot from October 2026).
- ~~Fontsource package names for every font in `design/fonts.json`~~ Verified 2026-10-08: all 41 exist on npm under OFL-1.1; 7 have no variable build (see `variable` in fonts.json).
- Supabase key naming (publishable/secret vs anon/service_role) in the current API.
