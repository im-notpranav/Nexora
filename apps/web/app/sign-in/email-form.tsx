"use client";

import { Button, Field, TextInput } from "@nexora/blocks";
import { useActionState } from "react";
import { signInWithEmail, type SignInState } from "./actions";

export function EmailSignInForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState<SignInState, FormData>(signInWithEmail, {
    status: "idle",
  });
  const error = state.status === "error" ? state.message : undefined;

  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="next" value={next} />
      <Field id="email" label="Email address" error={error}>
        {(describedBy, invalid) => (
          <TextInput
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
            aria-describedby={describedBy}
            aria-invalid={invalid}
          />
        )}
      </Field>
      <Button type="submit" disabled={pending}>
        {pending ? "Sending link…" : "Email me a sign-in link"}
      </Button>
      <p role="status" className="text-sm text-success">
        {state.status === "sent" ? state.message : null}
      </p>
    </form>
  );
}
