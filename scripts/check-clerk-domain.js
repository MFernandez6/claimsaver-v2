#!/usr/bin/env node

/**
 * Clerk Domain Configuration Checker
 *
 * This script helps diagnose Clerk authentication issues related to domain configuration.
 *
 * Common issues:
 * 1. Port mismatch (3000 vs 3001)
 * 2. Missing domain in Clerk dashboard
 * 3. Incorrect environment variables
 */

console.log("🔍 Clerk Domain Configuration Checker");
console.log("=====================================\n");

// Check environment variables
const envVars = {
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env
    .NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
    ? "Set"
    : "Not Set",
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY ? "Set" : "Not Set",
  NEXT_PUBLIC_CLERK_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
  NEXT_PUBLIC_CLERK_SIGN_UP_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
  NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL:
    process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL,
  NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL:
    process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL,
};

console.log("📋 Environment Variables:");
Object.entries(envVars).forEach(([key, value]) => {
  console.log(`  ${key}: ${value}`);
});

console.log("\n🔧 To fix the 422 error, follow these steps:");
console.log("\n1. Go to your Clerk Dashboard: https://dashboard.clerk.com");
console.log("2. Select your application");
console.log('3. Go to "User & Authentication" → "Email, Phone, Username"');
console.log('4. Scroll down to "Allowed origins"');
console.log("5. Add these URLs:");
console.log("   - http://localhost:3000");
console.log("   - http://localhost:3001");
console.log("   - http://127.0.0.1:3000");
console.log("   - http://127.0.0.1:3001");
console.log("\n6. Save the changes");
console.log("\n7. Clear your browser cache and cookies for localhost");
console.log("8. Restart your development server");
console.log(
  "\n💡 Alternative: Kill any process using port 3000 so your app runs on 3000:"
);
console.log("   lsof -ti:3000 | xargs kill -9");

console.log(
  "\n✅ After making these changes, the 422 error should be resolved."
);
