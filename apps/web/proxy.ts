import type { NextRequest } from "next/server";
import { updateSession } from "./lib/supabase/session";

export function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    // Everything except static files, images and the style gallery (which needs no account).
    "/((?!_next/static|_next/image|favicon.ico|gallery|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?)$).*)",
  ],
};
