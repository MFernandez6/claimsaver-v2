import { NextResponse } from "next/server";

/** Host only — never return credentials from MONGODB_URI */
function mongoConnectionHost(uri: string | undefined): string | null {
  if (!uri) return null;
  try {
    const normalized = uri
      .replace(/^mongodb\+srv:\/\//i, "https://")
      .replace(/^mongodb:\/\//i, "https://");
    return new URL(normalized).hostname;
  } catch {
    return "configured";
  }
}

export async function GET() {
  const envCheck = {
    timestamp: new Date().toISOString(),
    clerk: {
      hasPublishableKey: !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
      publishableKeyType:
        process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.startsWith("pk_live_")
          ? "production"
          : "development",
      hasSecretKey: !!process.env.CLERK_SECRET_KEY,
      secretKeyType: process.env.CLERK_SECRET_KEY?.startsWith("sk_live_")
        ? "production"
        : "development",
      publishableKeyPreview:
        process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.substring(0, 20) + "...",
    },
    database: {
      hasMongoUri: !!process.env.MONGODB_URI,
      mongoHost: mongoConnectionHost(process.env.MONGODB_URI),
      supabase: {
        hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        urlHost: process.env.NEXT_PUBLIC_SUPABASE_URL
          ? (() => {
              try {
                return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!).host;
              } catch {
                return "invalid";
              }
            })()
          : null,
        hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      },
    },
    app: {
      hasAppUrl: !!process.env.NEXT_PUBLIC_APP_URL,
      appUrl: process.env.NEXT_PUBLIC_APP_URL,
    },
  };

  return NextResponse.json(envCheck);
}
