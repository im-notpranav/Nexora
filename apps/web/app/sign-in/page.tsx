import { Button } from "@nexora/blocks";
import type { Metadata } from "next";
import Link from "next/link";
import { NexoraMark } from "@/components/nexora-mark";
import { safeNextPath, supabaseEnv } from "@/lib/supabase/env";
import { signInWithGoogle } from "./actions";
import { EmailSignInForm } from "./email-form";

export const metadata: Metadata = { title: "Sign in" };

const ERRORS: Record<string, string> = {
  google: "Google sign-in didn't finish. Try again, or use the email link instead.",
  callback: "That sign-in link has expired or was already used. Ask for a new one below.",
  "not-configured": "Sign-in isn't set up on this server yet.",
};

export default async function SignInPage({ searchParams }: PageProps<"/sign-in">) {
  const params = await searchParams;
  const next = safeNextPath(typeof params.next === "string" ? params.next : undefined);
  const errorKey = typeof params.error === "string" ? params.error : undefined;
  const configured = supabaseEnv() !== null;

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center gap-6 px-4 py-10">
      <Link href="/" className="flex items-center gap-2 self-start">
        <NexoraMark />
        <span className="type-heading text-lg">Nexora</span>
      </Link>
      <section className="surface-card flex flex-col gap-6 p-card" aria-labelledby="sign-in-title">
        <header className="flex flex-col gap-1">
          <h1 id="sign-in-title" className="type-heading text-2xl">
            Sign in
          </h1>
          <p className="text-sm text-ink-muted">New here? Signing in creates your account.</p>
        </header>

        {errorKey && ERRORS[errorKey] ? (
          <p role="alert" className="rounded-md bg-danger-bg px-4 py-3 text-sm text-danger-ink">
            {ERRORS[errorKey]}
          </p>
        ) : null}

        {configured ? (
          <>
            <form action={signInWithGoogle}>
              <input type="hidden" name="next" value={next} />
              <Button type="submit" variant="secondary" className="w-full">
                Continue with Google
              </Button>
            </form>
            <div className="flex items-center gap-3 text-xs text-ink-muted" aria-hidden="true">
              <span className="h-px flex-1 bg-border" />
              or
              <span className="h-px flex-1 bg-border" />
            </div>
            <EmailSignInForm next={next} />
          </>
        ) : (
          <p className="rounded-md bg-info-bg px-4 py-3 text-sm text-info-ink">
            Sign-in isn&apos;t set up on this server yet. Copy <code>apps/web/.env.example</code> to{" "}
            <code>apps/web/.env.local</code>, add the platform Supabase URL and publishable key, and
            restart.
          </p>
        )}
      </section>
      <p className="text-xs text-ink-muted">
        Free AI tiers may use your prompts to improve their models. Don&apos;t put private customer
        data in your app descriptions.
      </p>
    </main>
  );
}
