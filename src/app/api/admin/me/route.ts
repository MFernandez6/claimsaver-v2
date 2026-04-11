import { NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/adminAuth";

/** Returns 200 only if the current session may use admin APIs (DB role or designated admin email). */
export async function GET() {
  const result = await checkAdminAuth();
  if (!result.isAuthorized) {
    return NextResponse.json(
      { ok: false, error: result.error },
      { status: result.status }
    );
  }
  return NextResponse.json({
    ok: true,
    email: result.user.email,
  });
}
