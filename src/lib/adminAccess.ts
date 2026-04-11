/**
 * Single source of truth for who may use /admin and admin APIs.
 * Matches server checks (checkAdminAuth) and client UI (navbar, admin pages).
 */
export const DESIGNATED_ADMIN_EMAILS: readonly string[] = [
  "miguelfernandez023@gmail.com",
];

export function isDesignatedAdminEmail(
  email: string | null | undefined
): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  return (DESIGNATED_ADMIN_EMAILS as readonly string[]).includes(normalized);
}
