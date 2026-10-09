# 06 — Generation pipeline

From a plain-language idea to a deployed app. Each stage is a resumable build step with a checkpoint.

## Stages

| # | Stage | LLM? | Output |
| --- | --- | --- | --- |
| 1 | Intake | No | Idea text, uploads, quick fields stored |
| 2 | Spec draft | Yes (strong) | `ProductSpec` v1 draft + list of assumptions |
| 3 | Plan review | Optional (plan-diff on user edits) | Approved `ProductSpec` |
| 4 | Design choice | No | `DesignChoice` (style, palette/brand, fonts, density, radius, mode, motion) |
| 5 | Scaffold | No | App from `templates/app-starter` + blocks: schema, RLS, auth, CRUD, dashboard, theme |
| 6 | Custom work | Yes (coder) | Business rules, custom pages, custom queries — parallel tasks |
| 7 | Checks | No | `check_results` |
| 8 | Fix loop | Yes (fast/coder) | Patches for failed checks; back to 7 |
| 9 | Readiness | No | `readiness_scores` |
| 10 | Publish | No | Migrations applied, commit/PR, deploy |

## ProductSpec (sketch — implement in `packages/spec` with Zod)

```ts
interface ProductSpec {
  version: number;
  name: string;
  summary: string;                         // one paragraph, plain language
  locale: { default: string; scripts?: ("latin" | "telugu" | "devanagari" | "tamil")[] };
  roles: Role[];                           // e.g. admin, employee
  auth: { providers: ("email" | "google" | "github")[]; selfSignup: boolean; defaultRole: string };
  entities: Entity[];
  pages: Page[];
  dashboards: Dashboard[];
  workflows: Workflow[];                   // e.g. request → approve → issue → return
  notifications: Notification[];
  integrations: Integration[];             // email service, storage, etc.
  assumptions: Assumption[];               // things the AI inferred; user confirms
}

interface Role { id: string; label: string; description: string }

interface Entity {
  id: string;                               // snake_case table name
  label: string;
  fields: Field[];
  ownership?: { field: string; role?: string };   // e.g. created_by
  permissions: Record<string /* role id */, ("create" | "read" | "update" | "delete" | "read_own" | "update_own")[]>;
  softDelete?: boolean;
  audit?: boolean;                          // created_at, updated_at, created_by
}

interface Field {
  name: string;
  label: string;
  type: "text" | "long_text" | "number" | "money" | "boolean" | "date" | "datetime"
      | "enum" | "email" | "phone" | "url" | "image" | "file" | "ref" | "status";
  required?: boolean;
  unique?: boolean;
  enumValues?: string[];
  ref?: { entity: string; display: string; onDelete: "restrict" | "cascade" | "set_null" };
  validation?: { min?: number; max?: number; pattern?: string };
}

interface Page {
  route: string;
  kind: "list" | "detail" | "form" | "dashboard" | "settings" | "custom";
  entity?: string;
  roles: string[];
  description: string;                      // used for custom pages
}

interface Dashboard {
  route: string;
  roles: string[];
  kpis: { label: string; entity: string; aggregate: "count" | "sum" | "avg"; field?: string;
          filter?: Record<string, unknown>; compareTo?: "previous_period" }[];
  charts: { title: string; kind: "line" | "bar" | "donut" | "table"; entity: string;
            groupBy: string; measure: string }[];
}

interface Workflow {
  id: string; entity: string; statusField: string;
  transitions: { from: string; to: string; roles: string[]; notify?: string[] }[];
}
```

Example: the college inventory idea yields roles `admin`, `employee`; entities `equipment`, `request`, `issue_record`; a workflow `request: pending → approved → issued → returned | damaged | missing`; dashboard KPIs Available, Issued, Damaged, Missing.

The spec is the single source of truth. Code is regenerated from it; change requests edit the spec first.

## What templates generate (no LLM)

| From spec | Generated |
| --- | --- |
| Entities + fields | SQL migration (tables, types, constraints, indexes, FKs), TypeScript types, Zod schemas |
| Permissions + ownership | RLS policies per role, role table and helper functions, server-side guards |
| Auth | Supabase Auth setup, sign-in/up pages, role assignment, protected layouts |
| Pages (list/detail/form/settings) | Data table with search, filter, sort, pagination; detail view; create/edit forms with validation; empty, loading and error states |
| Dashboards | KPI cards (per style recipe), charts, queries/views |
| Workflows | Status enum, transition guard function, transition buttons per role, history table |
| Notifications | Email templates + trigger points (provider key left to setup checklist) |
| DesignChoice | Theme CSS variables, fonts via Fontsource, favicons and icons, logo placement, motion level |
| Always | Tests: auth, RLS per role, CRUD smoke tests, page-load Playwright tests |

Template blocks live in `templates/blocks/` and are parameterized by spec + style recipe. Blocks must render correctly in all 18 styles.

## What the LLM generates

- Custom pages (`kind: "custom"`) from their description and the frozen contracts
- Business rules not expressible as workflow transitions (e.g. "a request can't exceed available quantity")
- Custom queries and reports
- Fixes for failed checks

Each task gets: the relevant spec excerpt, contract types, the style's component recipes, and only the files it touches.

## Fix loop

- Input per issue: check name, failure output (trimmed), files at fault, spec excerpt.
- Output: a unified diff, applied and re-checked.
- Limits: max 3 attempts per issue, max 25 fix calls per build by default. After that, the issue stays open with a plain-language explanation and appears in Issues and the readiness score.
- Never "fix" a test by deleting or weakening it; reject diffs that do.

## Change requests

1. User text → LLM produces a **spec diff** (plan-diff role).
2. Show the diff in plain language; user confirms.
3. Regenerate affected template output; run LLM tasks only for affected custom code.
4. Run checks, compute score, open a GitHub PR with a summary. New migrations are additive; destructive schema changes need explicit user confirmation.

## Generated app structure

```
app/                     Next.js routes per spec pages
components/              shadcn/ui + style-specific recipes
lib/supabase/            clients (browser, server), typed queries
lib/auth/                role helpers, guards
lib/validation/          Zod schemas per entity
supabase/migrations/     ordered SQL files
supabase/seed.sql        demo data for previews
theme/                   tokens.css generated from DesignChoice
public/                  favicons, icons, og image, logo
tests/                   vitest + playwright
README.md                plain-language setup and env vars
.env.example             every required variable, no values
```
