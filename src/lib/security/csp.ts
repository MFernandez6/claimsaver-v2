/** Production CSP — must allow Next.js `/_next/static` chunks (no nonce pipeline yet). */
export function buildContentSecurityPolicy(): string {
  const directives = [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'self'",
    [
      "script-src",
      "'self'",
      "'unsafe-inline'",
      "https://js.stripe.com",
      "https://*.stripe.com",
      "https://challenges.cloudflare.com",
      "https://accounts.google.com",
    ].join(" "),
    [
      "style-src",
      "'self'",
      "'unsafe-inline'",
      "https://fonts.googleapis.com",
    ].join(" "),
    ["img-src", "'self'", "data:", "blob:", "https:"].join(" "),
    ["font-src", "'self'", "data:", "https://fonts.gstatic.com"].join(" "),
    [
      "connect-src",
      "'self'",
      "https://*.supabase.co",
      "wss://*.supabase.co",
      "https://api.stripe.com",
      "https://*.stripe.com",
      "https://*.claimsaverplus.com",
      "https://claimsaverplus.com",
      "https://www.claimsaverplus.com",
      "https://accounts.google.com",
      "https://oauth2.googleapis.com",
      "https://www.googleapis.com",
      "https://challenges.cloudflare.com",
    ].join(" "),
    [
      "frame-src",
      "'self'",
      "https://js.stripe.com",
      "https://hooks.stripe.com",
      "https://*.stripe.com",
      "https://accounts.google.com",
      "https://*.google.com",
      "https://challenges.cloudflare.com",
    ].join(" "),
    "form-action 'self' https://checkout.stripe.com https://*.stripe.com",
    "upgrade-insecure-requests",
  ];
  return directives.join("; ").replace(/\s{2,}/g, " ").trim();
}

export const SECURITY_HEADERS: { key: string; value: string }[] = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  {
    key: "Access-Control-Allow-Origin",
    value: "https://www.claimsaverplus.com",
  },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
];
