# Fix Sign-In Button in Production

## Issue

The sign-in button is not appearing after deployment because Clerk environment variables are not properly configured in production.

## Quick Fix Steps

### 1. Check Current Environment Variables

First, check what environment variables are currently set in your production environment:

```bash
# If using Vercel, check in the Vercel dashboard
# Go to your project → Settings → Environment Variables
```

### 2. Required Environment Variables

Make sure these environment variables are set in your production environment:

```env
# Clerk Authentication (REQUIRED)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_your_actual_production_key_here
CLERK_SECRET_KEY=sk_live_your_actual_production_secret_here

# Clerk URLs (OPTIONAL but recommended)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# App Configuration (OPTIONAL)
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### 3. Get Your Production Clerk Keys

1. Go to [clerk.com](https://clerk.com) and sign in
2. Select your application
3. Go to "API Keys" in the sidebar
4. Copy the **Production** keys (not the test keys)
   - Look for keys starting with `pk_live_` and `sk_live_`

### 4. Set Environment Variables

#### If using Vercel:

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add each variable:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` = `pk_live_your_key`
   - `CLERK_SECRET_KEY` = `sk_live_your_key`
5. Click "Save"
6. Redeploy your application

#### If using other platforms:

Set the environment variables according to your platform's documentation.

### 5. Configure Clerk Dashboard

1. In your Clerk dashboard, go to "Domains"
2. Add your production domain (e.g., `yourdomain.com`)
3. Make sure the domain is verified

### 6. Fix CORS Issues (If Applicable)

If you see CORS errors like:

```
Access to script at 'https://clerk.claimsaverplus.net/npm/@clerk/clerk-js@5/dist/clerk.browser.js'
from origin 'https://www.claimsaverplus.net' has been blocked by CORS policy
```

**Solution:**

1. Go to your Clerk dashboard
2. Navigate to "Domains" section
3. Make sure your main domain is added (e.g., `www.claimsaverplus.net`)
4. If you have a custom Clerk domain, ensure it matches your main domain
5. Or remove the custom Clerk domain to use the default Clerk domain

**Alternative Solution:**
If you want to use a custom Clerk domain, make sure it's properly configured:

1. In Clerk dashboard → Domains
2. Add both your main domain and the Clerk subdomain
3. Ensure DNS records are properly configured

### 7. Test the Fix

1. Redeploy your application
2. Visit your production site
3. Check the browser console (F12) for any Clerk-related errors
4. The sign-in button should now appear

## Debugging

### Check Clerk Configuration

Visit this URL to check your Clerk configuration:

```
https://your-domain.com/api/test-clerk
```

You should see something like:

```json
{
  "timestamp": "2024-01-01T00:00:00.000Z",
  "hasPublishableKey": true,
  "publishableKey": "pk_live_abc123...",
  "keyType": "production",
  "hasSecretKey": true,
  "secretKey": "sk_live_xyz789...",
  "secretKeyType": "production",
  "nodeEnv": "production",
  "isConfigured": true
}
```

### Common Issues

1. **Using Test Keys in Production**

   - Make sure you're using `pk_live_` and `sk_live_` keys, not `pk_test_` and `sk_test_`

2. **Domain Not Allowed**

   - Add your production domain to Clerk dashboard → Domains

3. **Environment Variables Not Set**

   - Double-check that the variables are set correctly in your deployment platform

4. **CORS Errors**

   - Ensure your domain is properly configured in Clerk dashboard
   - Check that the Clerk domain matches your main domain
   - Remove custom Clerk domains if causing issues

5. **Build Cache Issues**
   - Clear build cache and redeploy

### Browser Console Debugging

Open browser console (F12) and look for:

- Clerk initialization errors
- Environment variable warnings
- Authentication errors
- CORS errors

The navbar now logs detailed information about Clerk availability. Look for messages like:

- "🔍 Clerk availability check: ..."
- "✅ Clerk appears to be available in production"
- "❌ Clerk not available in production - missing publishable key"

## Fallback Behavior

If Clerk is not available, the navbar will show a disabled "Sign In" button with a tooltip saying "Authentication temporarily unavailable".

## Support

If the issue persists:

1. Check the browser console for errors
2. Verify environment variables are set correctly
3. Ensure your domain is allowed in Clerk dashboard
4. Fix any CORS issues by configuring domains properly
5. Contact Clerk support if needed
