const https = require("https");

async function checkDomain(domain) {
  return new Promise((resolve) => {
    const req = https.request(
      {
        hostname: domain,
        port: 443,
        path: "/",
        method: "GET",
        timeout: 5000,
      },
      (res) => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          working: res.statusCode < 400,
        });
      }
    );

    req.on("error", (err) => {
      resolve({
        error: err.message,
        working: false,
      });
    });

    req.on("timeout", () => {
      req.destroy();
      resolve({
        error: "Timeout",
        working: false,
      });
    });

    req.end();
  });
}

async function diagnoseClerkIssue() {
  console.log("🔍 Diagnosing Clerk domain issue...\n");

  const domains = [
    "clerk.claimsaverplus.net",
    "www.claimsaverplus.net",
    "claimsaverplus.net",
  ];

  for (const domain of domains) {
    console.log(`📋 Checking ${domain}...`);
    const result = await checkDomain(domain);

    if (result.working) {
      console.log(`✅ ${domain} is accessible (Status: ${result.status})`);
    } else {
      console.log(
        `❌ ${domain} is not accessible: ${result.error || "Unknown error"}`
      );
    }
    console.log("");
  }

  console.log("🔧 Solutions to try:\n");
  console.log("1. Go to https://dashboard.clerk.com/");
  console.log("2. Select your application");
  console.log('3. Go to "Domains" in the sidebar');
  console.log("4. Add these domains:");
  console.log("   - www.claimsaverplus.net");
  console.log("   - claimsaverplus.net");
  console.log("5. Verify each domain (follow the verification steps)");
  console.log("6. Make sure the domains are active (not disabled)");
  console.log(
    "\n7. Alternative: Use Clerk's default domain by removing custom domain"
  );
  console.log("   - In your Clerk dashboard, remove the custom domain");
  console.log("   - This will make Clerk use their default domain");
  console.log("\n8. After making changes, redeploy your application");
}

diagnoseClerkIssue().catch(console.error);
