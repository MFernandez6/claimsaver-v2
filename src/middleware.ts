import { clerkMiddleware, redirectToSignIn } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Check if Clerk is properly configured
const isClerkConfigured =
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY;

// Only use Clerk middleware if it's properly configured
const middleware = isClerkConfigured
  ? clerkMiddleware((auth, req) => {
      // Check if user is accessing a protected page
      const protectedPages = ["/dashboard", "/claim", "/claim-form"];
      const isProtectedPage = protectedPages.some((page) =>
        req.url.includes(page)
      );

      if (isProtectedPage && auth.userId) {
        // For protected pages, check if user has an active session
        // This will be handled by the client-side components
        return NextResponse.next();
      }

      return NextResponse.next();
    })
  : () => new Response("OK", { status: 200 });

export default middleware;

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    // Skip all internal paths (_next)
    "/((?!_next|.*\\..*).*)",
    // Optional: Match API routes
    "/(api|trpc)(.*)",
  ],
};
