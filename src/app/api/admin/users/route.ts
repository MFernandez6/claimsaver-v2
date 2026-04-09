import { NextRequest, NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/adminAuth";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";
import { profileRowToLegacy } from "@/lib/supabase/mappers";

export async function GET(request: NextRequest) {
  try {
    const authResult = await checkAdminAuth();

    if (!authResult.isAuthorized) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 503 }
      );
    }

    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const supabase = getSupabaseAdmin();

    let query = supabase
      .from("profiles")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(skip, skip + limit - 1);

    if (role && role !== "all") {
      query = query.eq("role", role);
    }

    if (search && search.trim()) {
      const safe = search.trim().replace(/[%]/g, "");
      const p = `%${safe}%`;
      query = query.or(
        `email.ilike.${p},first_name.ilike.${p},last_name.ilike.${p}`
      );
    }

    const { data: rows, error, count } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const data = (rows || []).map((r) =>
      profileRowToLegacy(r as Record<string, unknown>)
    );
    const total = count ?? 0;

    return NextResponse.json({
      data,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
