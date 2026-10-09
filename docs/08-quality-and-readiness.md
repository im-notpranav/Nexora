# 08 — Quality checks and the Production Readiness Score

The score is computed from automated checks only. It must be explainable: every point lost maps to a finding the user can read and, where possible, fix with one click.

## Checks

| Check | Tool | Runs on | Fails when |
| --- | --- | --- | --- |
| Types | `tsc --noEmit` | Every build | Any type error |
| Lint | ESLint (Next.js + a11y rules) | Every build | Any error-level rule |
| Build | `next build` | Every build | Build fails |
| Unit tests | Vitest | Every build | Any failure |
| End-to-end | Playwright | Every build | Page fails to load, auth flow fails, CRUD smoke fails |
| Permissions | Generated RLS tests per role | Every build | A role can read or write what the spec forbids, or can't do what it allows |
| RLS lint | Custom: every table has RLS + policies | Every build | Table without RLS or without policies |
| Secrets | Secret scanner on repo + client bundle | Every build | Secret-like string found |
| Dependencies | `pnpm audit` | Every build | High or critical vulnerability |
| Accessibility | axe via Playwright on every page | Every build | Serious/critical violations; contrast below AA |
| Performance | Lighthouse (mobile) on key pages | Before publish | Performance score below threshold |
| Responsive | Playwright screenshots at 375, 768, 1280 px | Before publish | Horizontal overflow, overlapping elements |
| States | Generated tests: empty, loading, error states exist per list page | Every build | Missing state |
| Spec coverage | Compare spec pages/entities/roles to generated routes, tables, policies | Every build | Anything in spec not implemented |
| Deploy readiness | Env checklist vs `.env.example` | Before publish | Required variable missing in host |

## Score

Total 100, by category:

| Category | Weight | Main inputs |
| --- | --- | --- |
| Functionality | 25 | Spec coverage, e2e, unit tests |
| Security | 20 | RLS tests, RLS lint, secrets, audit |
| Code quality | 10 | Types, lint, build |
| Testing | 10 | Tests exist for critical flows and pass |
| Accessibility | 10 | axe, contrast, keyboard |
| Performance | 10 | Lighthouse |
| Reliability | 10 | Error/empty/loading states, error boundaries |
| Deployment readiness | 5 | Env vars, build, migrations applied |

Rules:
- A critical security finding caps the total at 60 regardless of other scores.
- A failing build caps the total at 30.
- Each finding has: category, severity, plain-language message, technical detail (collapsed), affected files, and a "Fix it for me" action when the fix loop can handle it.

Example finding: "Login works, but two admin pages can be opened by employees. Fix it for me."

## Definition of done for a build

- Build, types, lint pass
- All generated tests pass
- No critical security findings
- Score ≥ 80, or the user explicitly accepts a lower score with findings listed
