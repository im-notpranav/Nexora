# 02 — The solution

## One sentence

An AI software team in a website: the user describes what they want, connects their own free AI keys and accounts, picks a design, and the platform plans, builds, checks, fixes and deploys a complete full-stack app they own.

## Core principle

The user decides **what** to build. The platform decides **how**. The user stays in control of every decision that matters to them: requirements, design, services and final approval.

## What makes it work on free keys

The design choice that makes this viable: **most of a business app is generated without any AI calls.**

1. The LLM writes a structured **product spec** (entities, fields, roles, permissions, pages, dashboards).
2. Deterministic **templates** turn the spec into 60–80% of the app: database schema, RLS policies, auth, CRUD screens, forms, tables, admin dashboard, KPI cards.
3. LLM calls are spent only on custom business logic, custom screens, and fixing problems that **automated checks** find.
4. All calls go through a router that spreads work across the user's providers, respects each provider's limits, and pauses and resumes builds instead of failing.

Estimated effect: a medium app needs roughly 100–150 LLM calls and 1–2M tokens instead of 500–1,500 calls and 10–30M tokens for a naive agent loop. These are estimates to validate in milestone M3.

## What the user gets at the end

| Deliverable | Where it lives |
| --- | --- |
| Live web app with its own link | User's Vercel or Netlify account |
| All source code | User's GitHub repo |
| Database with login, roles and file storage | User's Supabase project |
| Their brand everywhere: logo, colors, fonts, favicon | Inside the app |
| Brand kit: favicons, app icons, palette files | Project dashboard, downloadable |
| Product summary: every page, role and feature built | Project dashboard |
| Production Readiness Score with exact remaining issues | Project dashboard |
| Setup checklist: anything still needing the user | Project dashboard |

## Features in version 1

**Describe and plan**
- Explain the idea in plain words; upload logo, screenshots, documents
- AI turns it into a product plan the user reviews and approves before building

**Design and branding** (a core differentiator; see docs 09–11)
- 18 design styles drawn from current design trends, each a rule set that works with any palette
- 14 ready palettes, plus a personal palette generated from the user's logo or exact brand colors
- Every option previewed on the user's own app (their entities, KPI cards, tables, forms, login)
- Generated brand kit: favicons in every size, app icons, branded login, email header, link-preview image
- Fine-tuning after picking: any color, font, corner style, density, motion level; switch style later without rebuilding

**Build**
- Full app: screens, backend logic, database, login, roles and permissions, admin dashboard
- Live preview on the platform while it builds

**Quality and self-fixing**
- Automated checks: type check, lint, tests, page loads, permissions, accessibility, dependency audit
- AI fixes what checks find, then checks again (bounded retries)
- Production Readiness Score with plain-language explanations

**Your own services**
- BYOK free AI keys; the router shares work across them
- Build pauses and resumes on its own when all keys are exhausted, with a time estimate
- One-click Supabase and GitHub connection; deploy to Vercel/Netlify

**Change it later**
- Plain-language change requests applied to the existing project
- Each change arrives as a reviewable GitHub pull request; rollback supported

## Out of scope for v1

- Mobile apps, games, real-time video, complex AI apps
- Payments (Razorpay, Stripe) — planned next
- Importing and improving existing codebases — planned later
- Databases other than Supabase; hosts other than Vercel/Netlify
- Team workspaces
- Local/offline AI models — planned later

## How we differ from existing AI app builders

| Typical builder | Nexora |
| --- | --- |
| Needs paid AI credits | Runs on the user's free keys across many providers |
| App hosted on the builder | Code, data and hosting in the user's own accounts |
| "Done" means it rendered | Readiness score backed by real automated checks |
| Generic look | 18 styles × palettes × user brand, with a generated brand kit |
| Fails on rate limits | Builds pause and resume automatically |
