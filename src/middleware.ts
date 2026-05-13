import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const AUTH_REQUIRED_PREFIXES = ["/dashboard", "/admin", "/claim/"];

export async function middleware(request: NextRequest) {
  const { user, supabaseResponse } = await updateSession(request);

  const { pathname } = request.nextUrl;

  const needsAuth = AUTH_REQUIRED_PREFIXES.some((p) =>
    p.endsWith("/") ? pathname.startsWith(p) : pathname.startsWith(p),
  );

  if (needsAuth && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set(
      "next",
      `${pathname}${request.nextUrl.search}`,
    );
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all paths except static assets and image optimization.
     */
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
