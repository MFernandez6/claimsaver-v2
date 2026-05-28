# Supabase production auth checklist

Complete these steps in the [Supabase Dashboard](https://supabase.com/dashboard) for **claimsaverplus.com**. Code changes alone cannot fix email confirmation redirects or branded templates.

## 1. Site URL and redirect allowlist (CRITICAL)

**Authentication → URL Configuration**

| Setting | Value |
|---------|--------|
| **Site URL** | `https://www.claimsaverplus.com` |
| **Redirect URLs** | Add `https://www.claimsaverplus.com/**` |

Remove `http://localhost:3000` from production redirect allowlists unless you still need local dev against this project.

Also set in Vercel (all environments you deploy):

```bash
NEXT_PUBLIC_SITE_URL=https://www.claimsaverplus.com
```

## 2. Confirm signup email template (CRITICAL)

**Authentication → Email Templates → Confirm signup**

Replace the default body with the branded HTML in [`supabase/email-templates/confirm-signup.html`](./supabase/email-templates/confirm-signup.html).

Subject suggestion: `Confirm your ClaimSaver+ account`

## 3. Enable MFA (recommended)

**Authentication → Multi-Factor Authentication**

- Enable TOTP (authenticator app)
- Optional: set assurance level to require MFA for sensitive operations

Users can enroll at **https://www.claimsaverplus.com/account/security**

## 4. Google OAuth (if used)

**Authentication → Providers → Google**

Ensure authorized redirect URIs include:

- `https://www.claimsaverplus.com/auth/callback`
- `https://<project-ref>.supabase.co/auth/v1/callback`

## 5. Smoke test after deploy

1. Sign up with a real inbox (not Mailinator for final check)
2. Confirm email link opens **claimsaverplus.com**, not localhost
3. Sign in → dashboard → upload a test PDF
4. Visit `/claim-form` logged out → should redirect to `/login?next=/claim-form`
5. Visit `/signin` → should redirect to `/login`
