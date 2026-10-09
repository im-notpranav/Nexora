# 12 — Roadmap and milestones

Build in this order. Each milestone ends with something a user can see or test. Don't start a milestone before the previous one meets its acceptance criteria, unless the founder says otherwise.

## M0 — Foundations and design tokens (start here)

Goal: a working monorepo and a live gallery that proves the design system.

Tasks:
1. Monorepo: pnpm workspaces, Turborepo, TypeScript strict, ESLint, Prettier, Vitest, Playwright, CI (typecheck, lint, test on every PR).
2. `apps/web`: Next.js App Router, Tailwind, shadcn/ui; platform Supabase auth (email + Google); empty dashboard shell in style `airy-pill` + palette `sky`.
3. `packages/design-tokens`: load `design/*.json`, validate with Zod, implement `resolveTheme` (doc 09) with OKLCH derivation and contrast fixing; emit CSS variables.
4. `templates/blocks` first versions: KPI card, data table, form, detail, empty state, sidebar/top nav — all token-driven.
5. **Style gallery page** (`/gallery`): renders a sample inventory dashboard, table and form in any style × palette × mode, with switchers.

Acceptance:
- All 18 styles × 14 palettes × light/dark render without layout breaks (Playwright screenshot test at 1280 and 375 px).
- Automated contrast test passes for every combination.
- No hard-coded colors, fonts or radii in block components (lint rule or test).

## M1 — BYOK and the LLM router

1. `packages/vault`: encrypt/decrypt with AES-256-GCM; key rotation; tests.
2. Settings screen: add/test/remove keys; show detected models, limits, today's usage.
3. `packages/llm-router`: adapters for Gemini, NVIDIA NIM, Groq, Cerebras, OpenRouter, Mistral; rate buckets; routing; failover; `AllProvidersExhausted`; response cache; usage persistence.
4. Test harness with a fake provider that simulates RPM/TPM/RPD limits and 429s.

Acceptance:
- Simulated 200-task workload across 3 fake providers completes with zero unhandled 429s; buckets never exceed configured limits.
- Exhausting all providers yields a correct `resumeAt`.
- Keys never appear in logs or API responses (test).

## M2 — Describe and plan

1. `packages/spec`: Zod schemas for ProductSpec (doc 06), versioning, diff.
2. Describe screen with uploads; spec draft via router (strong class) with JSON validation and repair.
3. Plan review screen: plain-language cards, inline edits, plan-diff for free-text edits, approve.

Acceptance:
- 10 sample ideas (inventory, CRM, booking, textbook exchange, attendance, …) produce valid specs.
- Spec drafting uses ≤ 3 LLM calls per idea on average.

## M3 — Deterministic generator and sandbox

1. `templates/app-starter` (doc 06 structure).
2. `packages/generator`: spec → migrations, RLS, types, Zod, auth, CRUD pages, dashboards, workflows, theme, tests.
3. `apps/worker` + job queue + sandbox: install, build, run tests, serve preview; checkpoints per step.
4. Build progress screen with live preview.

Acceptance:
- The college inventory spec generates an app that builds, passes its generated tests, and shows correct role permissions — with zero LLM calls.
- A build interrupted at any step resumes correctly.
- Measure and record the share of the app produced by templates (target 60–80%).

## M4 — Custom code, checks, fix loop, readiness

1. LLM codegen tasks for custom pages and rules, with repo index and context budget.
2. `packages/checks` (doc 08) and `packages/readiness`.
3. Fix loop with limits; Issues and Quality tabs.

Acceptance:
- Inventory app with two custom rules builds end to end on free keys only; record calls, tokens and wall time (target ≤ 150 calls, ≤ 2M tokens).
- Readiness score reproducible: same code → same score.

## M5 — Integrations and go live

1. Supabase OAuth: create project (slot check), apply migrations, configure auth, fetch keys.
2. GitHub App: create repo, push, PRs.
3. Vercel (then Netlify): project linked to repo, env vars, deploy status.
4. Setup checklist and Deployment tab.

Acceptance:
- From a fresh account: connect → describe → approve → design → build → live URL, with no manual steps outside the platform except OAuth consent screens.

## M6 — Brand kit and design studio

1. `packages/brand-kit`: logo color extraction, personal palette, favicons, icons, OG image, email header.
2. Design studio: recommended 3 styles, gallery of 18, palettes, logo/brand colors, fine-tune, brand kit preview; previews use the user's own spec.
3. `packages/motion` P1 and P2 effects (doc 11), motion levels.

Acceptance:
- 20 sample logos produce palettes that pass contrast checks and favicons legible at 16 px (visual review).
- Switching style after launch updates the app via a PR with no data changes.

## M7 — Change requests

1. Chat on project → spec diff → confirm → partial regeneration → checks → PR.
2. Additive migrations by default; destructive ones need explicit confirmation.

Acceptance:
- "Add a dark mode", "Add employee roles", "Show monthly revenue on the dashboard" each produce a working PR with tests passing.

## Later (not v1)

Payments (Razorpay, Stripe), importing existing codebases, more databases and hosts, team workspaces, local AI models, mobile apps.
