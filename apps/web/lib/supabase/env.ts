// Platform Supabase settings. Only public values live here; nothing secret is read in this app yet.

export interface SupabaseEnv {
  url: string;
  publishableKey: string;
}

export function supabaseEnv(): SupabaseEnv | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !publishableKey) return null;
  return { url, publishableKey };
}

/** Where people come back to after email links and Google sign-in. */
export function siteUrl(fallbackOrigin: string): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || fallbackOrigin).replace(/\/$/, "");
}

/** Only same-site paths, so a crafted link can't send people to another website after sign-in. */
export function safeNextPath(next: string | null | undefined, fallback = "/dashboard"): string {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\"))
    return fallback;
  return next;
}
