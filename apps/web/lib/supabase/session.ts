import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { supabaseEnv } from "./env";

const PROTECTED_PREFIXES = ["/dashboard"];

/** Refreshes the Supabase session cookie and sends signed-out visitors of protected pages to sign-in. */
export async function updateSession(request: NextRequest): Promise<NextResponse> {
  const env = supabaseEnv();
  const isProtected = PROTECTED_PREFIXES.some((p) => request.nextUrl.pathname.startsWith(p));
  const toSignIn = () => {
    const url = request.nextUrl.clone();
    url.pathname = "/sign-in";
    url.search = "";
    url.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  };

  if (!env) return isProtected ? toSignIn() : NextResponse.next({ request });

  let response = NextResponse.next({ request });
  const supabase = createServerClient(env.url, env.publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) request.cookies.set(name, value);
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet)
          response.cookies.set(name, value, options);
      },
    },
  });

  // getClaims verifies the token; don't run other code between creating the client and this call.
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims && isProtected) return toSignIn();
  return response;
}
