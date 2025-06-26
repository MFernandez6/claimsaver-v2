async function testClerkDomain() {
  console.log("🧪 Testing Clerk domain fix...\n");

  try {
    // Test the production site
    const response = await fetch("https://www.claimsaverplus.net");
    const html = await response.text();

    // Look for Clerk script
    const clerkScriptMatch = html.match(/https:\/\/[^"]*clerk[^"]*\.js/);

    if (clerkScriptMatch) {
      const clerkDomain = new URL(clerkScriptMatch[0]).hostname;
      console.log(`✅ Found Clerk script loading from: ${clerkDomain}`);

      if (clerkDomain.includes("clerk.claimsaverplus.net")) {
        console.log("❌ Still using custom domain - fix not applied yet");
        console.log(
          "💡 Make sure you removed the custom domain in Clerk dashboard"
        );
      } else {
        console.log("✅ Using Clerk default domain - fix should be working!");
        console.log("🎉 The CORS error should be resolved");
      }
    } else {
      console.log("❌ Could not find Clerk script in the page");
    }
  } catch (error) {
    console.log("❌ Error testing site:", error.message);
  }

  console.log("\n📋 Next steps:");
  console.log(
    "1. If still using custom domain, remove it from Clerk dashboard"
  );
  console.log("2. Redeploy your application");
  console.log("3. Run this test again");
}

testClerkDomain();
