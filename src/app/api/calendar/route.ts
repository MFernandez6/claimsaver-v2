import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";
import { calendarRowToLegacy } from "@/lib/supabase/mappers";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 503 }
      );
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("calendar_events")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: true })
      .order("time", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const events = (data || []).map((row) =>
      calendarRowToLegacy(row as Record<string, unknown>)
    );

    return NextResponse.json(events);
  } catch (error) {
    console.error("Error fetching calendar events:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { title, date, time, type, description, priority } = body;

    if (!title || !date || !time || !type || !priority) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          received: { title, date, time, type, priority },
        },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();
    const now = new Date().toISOString();

    const { data: inserted, error } = await supabase
      .from("calendar_events")
      .insert({
        user_id: userId,
        title,
        date,
        time,
        type,
        description: description || "",
        priority,
        completed: false,
        created_at: now,
        updated_at: now,
      })
      .select()
      .single();

    if (error || !inserted) {
      return NextResponse.json(
        { error: error?.message || "Failed to save event" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      calendarRowToLegacy(inserted as Record<string, unknown>)
    );
  } catch (error) {
    console.error("Error creating calendar event:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
