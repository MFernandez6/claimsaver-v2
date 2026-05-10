/**
 * Canonical public site URL. Set NEXT_PUBLIC_SITE_URL in production (e.g. https://claimsaverplus.com).
 * OG metadata and links should use this—not alternate domains—unless you also control redirects.
 */
export function getPublicSiteUrl(): string {
  const raw =
    typeof process !== "undefined"
      ? process.env.NEXT_PUBLIC_SITE_URL || "https://claimsaverplus.com"
      : "https://claimsaverplus.com";
  return raw.endsWith("/") ? raw.slice(0, -1) : raw;
}
