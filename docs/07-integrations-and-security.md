# 07 — Integrations and security

Users connect their own accounts before a project starts. Everything the app needs is created in those accounts, so the project is complete before the user opens any IDE.

## Supabase (user's account)

- **Connect:** Supabase OAuth for the Management API (users authorize their organization; no secret keys pasted).
- **Create project:** `POST /v1/projects` in the user's chosen organization and region (default: nearest to user, e.g. Mumbai `ap-south-1` for India). Generate a strong database password and store it encrypted.
- **Before creating:** check how many active free projects exist. Free plan: 2 active projects max; projects pause after 7 days of inactivity. If no slot is free, explain and let the user pick an existing project or pause one themselves.
- **Apply migrations:** Supabase's documented migrations endpoint (`POST /v1/projects/{ref}/database/migrations`) is limited to select partners as of October 2026. Until access is granted, apply our SQL migration files over a direct Postgres connection using the stored database password, recording versions in a migrations table. **Verify current API access before implementing.**
- **Configure:** auth providers (email, Google), redirect URLs, storage buckets, and fetch API keys (`anon`/publishable for the client, `service_role`/secret only for server env vars).
- **Safety:** create a restore point or schema backup before each migration batch; destructive migrations require explicit user confirmation.
- Docs: [Supabase for Platforms](https://supabase.com/docs/guides/integrations/supabase-for-platforms), [OAuth integration](https://supabase.com/docs/guides/integrations/build-a-supabase-oauth-integration).

## GitHub (user's account)

- **Connect:** a Nexora GitHub App. Use the user-to-server token to create the repo in the user's account, then install the app on that repo only (least privilege: contents, pull requests, metadata). **Verify current GitHub App rules for creating repos in user accounts before implementing.**
- **Initial build:** push to `main` with a clear commit history (one commit per milestone: scaffold, custom features, fixes).
- **Changes:** each change request is a branch + pull request with a plain-language description, readiness score delta, and migration notes.
- Commit messages are written for humans; never include secrets.

## Hosting (Vercel first, Netlify second)

- Connect via OAuth / integration; create a project linked to the GitHub repo so pushes deploy automatically.
- Set environment variables from the setup checklist: Supabase URL, publishable key, server-side secret key, any service keys the user added.
- Show deploy status and live URL on the Deployment tab.

## BYOK AI keys

- Entered in Settings; tested with a minimal call; models and limits detected.
- Stored encrypted by `packages/vault` (AES-256-GCM, per-record random IV, master key from the platform's KMS or a secret in the worker environment; key rotation supported).
- Display only a label and the last 4 characters. Never return the key to the browser after saving.

## Other service keys (email, storage, payments later)

- Stored the same way as AI keys.
- Placed only into the hosting provider's environment variables, never into generated source or the repo.
- Setup checklist lists every missing key with a plain explanation and a link to get one.

## Security rules

1. Secrets never appear in: prompts, logs, `build_events`, commits, client bundles, error messages, or URLs.
2. Generated apps: RLS enabled on every table; no table readable by `anon` unless the spec explicitly makes it public; server-only code for privileged operations.
3. A check fails the build if a secret-like string is found in the client bundle or repo.
4. OAuth tokens are refreshed and stored encrypted; revoking a connection deletes its tokens.
5. Sandboxes have no access to platform secrets; they receive only the env vars a generated app needs for testing (pointing to a test schema or seed data).
6. Uploaded files are scanned for type and size; documents sent to an LLM only with user consent when the provider may train on data.
7. Users can delete a project and all stored data; their GitHub/Supabase resources are left untouched unless they choose to remove them.

## Privacy notice (shown at onboarding)

- Free AI tiers may use prompts to improve models.
- Nexora stores your project description, spec, design choices and build logs; your app's data lives in your Supabase project.
- You can export or delete your Nexora data at any time.
