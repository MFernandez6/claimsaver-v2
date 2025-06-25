#!/usr/bin/env node

require("dotenv").config({ path: ".env.local" });

console.log("🔍 Checking Clerk Configuration...\n");

const config = {
  timestamp: new Date().toISOString(),
  hasPublishableKey: !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
    ? process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.substring(0, 20) + "..."
    : "Not set",
  keyType: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.startsWith("pk_live_")
    ? "production"
    : process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.startsWith("pk_test_")
    ? "development"
    : "unknown",
  hasSecretKey: !!process.env.CLERK_SECRET_KEY,
  secretKey: process.env.CLERK_SECRET_KEY
    ? process.env.CLERK_SECRET_KEY.substring(0, 20) + "..."
    : "Not set",
  secretKeyType: process.env.CLERK_SECRET_KEY?.startsWith("sk_live_")
    ? "production"
    : process.env.CLERK_SECRET_KEY?.startsWith("sk_test_")
    ? "development"
    : "unknown",
  nodeEnv: process.env.NODE_ENV || "development",
  isConfigured: !!(
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
    process.env.CLERK_SECRET_KEY
  ),
};

console.log("📋 Configuration Summary:");
console.log("==========================");
console.log(
  `✅ Publishable Key: ${config.hasPublishableKey ? "Set" : "❌ Missing"}`
);
console.log(`   Type: ${config.keyType}`);
console.log(`   Value: ${config.publishableKey}`);
console.log("");
console.log(`✅ Secret Key: ${config.hasSecretKey ? "Set" : "❌ Missing"}`);
console.log(`   Type: ${config.secretKeyType}`);
console.log(`   Value: ${config.secretKey}`);
console.log("");
console.log(`🌍 Environment: ${config.nodeEnv}`);
console.log(`🔧 Configured: ${config.isConfigured ? "✅ Yes" : "❌ No"}`);
console.log("");

if (config.isConfigured) {
  console.log("🎉 Clerk appears to be properly configured!");

  if (config.nodeEnv === "production") {
    if (
      config.keyType === "production" &&
      config.secretKeyType === "production"
    ) {
      console.log(
        "✅ Production keys detected - ready for production deployment"
      );
    } else {
      console.log(
        "⚠️  Warning: Using development keys in production environment"
      );
      console.log("   Please update to production keys for live deployment");
    }
  } else {
    if (
      config.keyType === "development" &&
      config.secretKeyType === "development"
    ) {
      console.log("✅ Development keys detected - ready for local development");
    } else {
      console.log(
        "⚠️  Warning: Using production keys in development environment"
      );
      console.log("   This is fine for testing production configuration");
    }
  }
} else {
  console.log("❌ Clerk is not properly configured");
  console.log("");
  console.log("🔧 To fix this:");
  console.log("1. Go to https://clerk.com and get your API keys");
  console.log("2. Add them to your .env.local file:");
  console.log("");
  console.log("   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here");
  console.log("   CLERK_SECRET_KEY=sk_test_your_key_here");
  console.log("");
  console.log(
    "3. For production, use keys starting with 'pk_live_' and 'sk_live_'"
  );
}

console.log("");
console.log("📖 For more help, see: PRODUCTION_CLERK_FIX.md");
