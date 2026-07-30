import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const AUTH_REQUIRED_PREFIXES = [
  "/dashboard",
  "/admin",
  "/claim/",
  "/claim-form",
  "/account",
];

function isProtectedPath(pathname: string): boolean {
  return AUTH_REQUIRED_PREFIXES.some((p) =>
    p.endsWith("/") ? pathname.startsWith(p) : pathname.startsWith(p),
  );
}

/** Supabase Auth sets chunked cookies like sb-<ref>-auth-token. */
function hasSupabaseAuthCookies(request: NextRequest): boolean {
  return request.cookies.getAll().some((c) => c.name.includes("-auth-token"));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const needsAuth = isProtectedPath(pathname);

  // Fast path: protected route with no session cookies → redirect without calling Supabase.
  if (needsAuth && !hasSupabaseAuthCookies(request)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", `${pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(url);
  }

  // Only refresh session when cookies exist or route is auth-related.
  const shouldRefreshSession =
    hasSupabaseAuthCookies(request) ||
    pathname.startsWith("/auth/") ||
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/forgot-password" ||
    pathname === "/update-password";

  if (!shouldRefreshSession) {
    return NextResponse.next();
  }

  const { user, supabaseResponse, timedOut } = await updateSession(request);

  if (needsAuth && !user) {
    // Supabase slow/unreachable — let the page load instead of 504 or false redirect.
    if (timedOut) {
      return supabaseResponse;
    }
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", `${pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

/** Only auth-related routes — avoids Supabase round-trips on marketing pages (504 timeouts). */
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/claim-form/:path*",
    "/account/:path*",
    "/claim/:path*",
    "/auth/:path*",
    "/login",
    "/signup",
    "/forgot-password",
    "/update-password",
  ],
};
