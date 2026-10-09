"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { safeNextPath, siteUrl } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface SignInState {
  status: "idle" | "sent" | "error";
  message?: string;
}

const EmailForm = z.object({
  email: z.email(),
  next: z.string().optional(),
});

async function origin(): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return siteUrl(`${proto}://${host}`);
}

function callbackUrl(base: string, next: string): string {
  return `${base}/auth/callback?next=${encodeURIComponent(next)}`;
}

const NOT_CONFIGURED: SignInState = {
  status: "error",
  message:
    "Sign-in isn't set up on this server yet. Add the Supabase settings from .env.example and restart.",
};

export async function signInWithEmail(
  _prev: SignInState,
  formData: FormData,
): Promise<SignInState> {
  const parsed = EmailForm.safeParse({
    email: formData.get("email"),
    next: formData.get("next") ?? undefined,
  });
  if (!parsed.success) {
    return {
      status: "error",
      message: "That email address doesn't look right. Check it and try again.",
    };
  }
  const supabase = await createSupabaseServerClient();
  if (!supabase) return NOT_CONFIGURED;

  const { error } = await supabase.auth.signInWithOtp({
    email: parsed.data.email,
    options: { emailRedirectTo: callbackUrl(await origin(), safeNextPath(parsed.data.next)) },
  });
  if (error) {
    return {
      status: "error",
      message: "We couldn't send the sign-in email just now. Wait a minute, then try again.",
    };
  }
  return {
    status: "sent",
    message: `We sent a sign-in link to ${parsed.data.email}. Open it on this device.`,
  };
}

export async function signInWithGoogle(formData: FormData): Promise<void> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect("/sign-in?error=not-configured");
  const next = safeNextPath(String(formData.get("next") ?? ""));
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: callbackUrl(await origin(), next) },
  });
  if (error || !data.url) redirect("/sign-in?error=google");
  redirect(data.url);
}
