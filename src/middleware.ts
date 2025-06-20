// Temporarily disabled Clerk middleware to allow deployment without Clerk environment variables
// import { clerkMiddleware } from "@clerk/nextjs/server";

// // Check if Clerk is properly configured
// const isClerkConfigured = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY;

// // Only use Clerk middleware if it's properly configured
// const middleware = isClerkConfigured
//   ? clerkMiddleware()
//   : () => new Response('OK', { status: 200 });

// export default middleware;

import { NextResponse } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware() {
  // Simply continue to the next middleware or page
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    // Skip all internal paths (_next)
    "/((?!_next|.*\\..*).*)",
    // Optional: Match API routes
    "/(api|trpc)(.*)",
  ],
};
