import { NextResponse } from "next/server";

/** Legacy endpoint — profiles are created on first Supabase Auth sign-in. */
export async function POST() {
  return NextResponse.json(
    {
      error:
        "Clerk webhooks are disabled. This app uses Supabase Auth; profiles sync via createUserIfMissing on sign-in.",
    },
    { status: 410 },
  );
}
