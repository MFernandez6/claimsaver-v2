import { NextRequest, NextResponse } from "next/server";
import {
  buildContentSecurityPolicy,
  SECURITY_HEADERS,
} from "@/lib/security/csp";

export function applySecurityHeaders(
  request: NextRequest,
  response: NextResponse,
): NextResponse {
  if (
    process.env.DISABLE_CSP === "1" ||
    process.env.NODE_ENV !== "production"
  ) {
    return response;
  }

  const nonce =
    request.headers.get("x-nonce") ??
    Buffer.from(crypto.randomUUID()).toString("base64");

  for (const { key, value } of SECURITY_HEADERS) {
    response.headers.set(key, value);
  }
  response.headers.set(
    "Content-Security-Policy",
    buildContentSecurityPolicy(nonce),
  );
  return response;
}

export function withRequestNonce(request: NextRequest): NextRequest {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const headers = new Headers(request.headers);
  headers.set("x-nonce", nonce);
  return new NextRequest(request.url, {
    headers,
    method: request.method,
  });
}
