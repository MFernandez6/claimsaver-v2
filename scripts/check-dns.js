const dns = require("dns").promises;

async function checkDNS() {
  console.log(
    "🔍 Checking DNS configuration for clerk.claimsaverplus.net...\n"
  );

  try {
    // Check if the domain resolves
    const addresses = await dns.resolve4("clerk.claimsaverplus.net");
    console.log("✅ DNS resolution successful");
    console.log("📋 IP addresses:", addresses);

    // Check CNAME record
    try {
      const cname = await dns.resolveCname("clerk.claimsaverplus.net");
      console.log("✅ CNAME record found:", cname);
    } catch (error) {
      console.log("❌ CNAME record not found or not configured");
    }
  } catch (error) {
    console.log("❌ DNS resolution failed:", error.message);
    console.log("\n💡 This means the DNS records are not set up yet.");
    console.log("\n📋 To fix this:");
    console.log("1. Go to your domain provider (GoDaddy, Namecheap, etc.)");
    console.log("2. Add a CNAME record:");
    console.log("   - Name: clerk");
    console.log("   - Value: clerk.accounts.dev (or what Clerk provided)");
    console.log("3. Wait 15-30 minutes for DNS propagation");
    console.log("4. Run this check again");
  }
}

checkDNS();
