import { NextResponse } from "next/server";
import {
  buildContentSecurityPolicy,
  SECURITY_HEADERS,
} from "@/lib/security/csp";

/** Apply security headers on HTML/API responses in production. */
export function applySecurityHeaders(response: NextResponse): NextResponse {
  if (
    process.env.DISABLE_CSP === "1" ||
    process.env.NODE_ENV !== "production"
  ) {
    return response;
  }

  for (const { key, value } of SECURITY_HEADERS) {
    response.headers.set(key, value);
  }
  response.headers.set("Content-Security-Policy", buildContentSecurityPolicy());
  return response;
}
