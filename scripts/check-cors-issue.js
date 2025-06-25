#!/usr/bin/env node

require("dotenv").config({ path: ".env.local" });

console.log("🔍 Checking for CORS Issues with Clerk...\n");

const config = {
  publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  keyType: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.startsWith("pk_live_")
    ? "production"
    : "development",
  nodeEnv: process.env.NODE_ENV || "development",
};

console.log("📋 Current Configuration:");
console.log("==========================");
console.log(
  `🔑 Publishable Key: ${config.publishableKey ? "Set" : "❌ Missing"}`
);
console.log(`   Type: ${config.keyType}`);
console.log(`   Value: ${config.publishableKey?.substring(0, 20)}...`);
console.log(`🌍 Environment: ${config.nodeEnv}`);
console.log("");

console.log("🚨 CORS Issue Diagnosis:");
console.log("=========================");

if (config.keyType === "production") {
  console.log("✅ Using production keys");
  console.log("");
  console.log("🔧 To fix CORS issues:");
  console.log("");
  console.log("1. Go to your Clerk dashboard: https://clerk.com");
  console.log("2. Select your application");
  console.log("3. Go to 'Domains' in the sidebar");
  console.log("4. Add your main domain (e.g., 'www.claimsaverplus.net')");
  console.log("5. If you have a custom Clerk domain, either:");
  console.log("   - Remove it to use default Clerk domain");
  console.log("   - Or ensure it's properly configured");
  console.log("");
  console.log("6. Wait for DNS propagation (can take up to 24 hours)");
  console.log("7. Redeploy your application");
  console.log("");
  console.log("📋 Common CORS Error:");
  console.log(
    "Access to script at 'https://clerk.claimsaverplus.net/...' from origin 'https://www.claimsaverplus.net' has been blocked by CORS policy"
  );
  console.log("");
  console.log("💡 This means:");
  console.log("- Your main site: www.claimsaverplus.net");
  console.log("- Clerk trying to load from: clerk.claimsaverplus.net");
  console.log("- These domains don't match, causing CORS error");
  console.log("");
  console.log("🔧 Quick Fix:");
  console.log("1. In Clerk dashboard → Domains");
  console.log("2. Remove the custom domain 'clerk.claimsaverplus.net'");
  console.log("3. Add 'www.claimsaverplus.net' to allowed domains");
  console.log("4. Redeploy your application");
} else {
  console.log("⚠️  Using development keys");
  console.log("   CORS issues typically occur in production");
  console.log("   Make sure to use production keys for live deployment");
}

console.log("");
console.log("📖 For more help, see: PRODUCTION_CLERK_FIX.md");
