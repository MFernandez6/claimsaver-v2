import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";
import { claimRowToLegacy } from "@/lib/supabase/mappers";
import { createOrUpdateUser } from "@/lib/auth";

interface InjuryData {
  type: string;
  description: string;
  severity: "minor" | "moderate" | "severe";
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: "Database configuration error. Please contact support." },
        { status: 503 }
      );
    }

    const body = await request.json();

    await createOrUpdateUser(userId, {
      email: body.claimantEmail,
      firstName: body.claimantName.split(" ")[0] || body.claimantName,
      lastName: body.claimantName.split(" ").slice(1).join(" ") || "",
      phone: body.claimantPhone,
      address: body.claimantAddress,
    });

    let processedInjuries: InjuryData[] = [];
    if (body.injuries && Array.isArray(body.injuries)) {
      processedInjuries = body.injuries.map((injury: InjuryData) => ({
        type: injury.type || "",
        description: injury.description || "",
        severity: injury.severity || "minor",
      }));
    } else if (body.injuries && typeof body.injuries === "string") {
      try {
        const parsedInjuries = JSON.parse(body.injuries);
        if (Array.isArray(parsedInjuries)) {
          processedInjuries = parsedInjuries.map((injury: InjuryData) => ({
            type: injury.type || "",
            description: injury.description || "",
            severity: injury.severity || "minor",
          }));
        }
      } catch {
        processedInjuries = [];
      }
    }

    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");
    const claimNumber = `CS${year}${month}-${random}`;

    const status = "pending";
    const priority =
      body.estimatedValue > 10000 ? "high" : ("medium" as const);

    const accidentDateRaw = body.accidentDate || body.dateOfAccident;
    let accidentDateParsed: Date;
    try {
      accidentDateParsed = accidentDateRaw
        ? new Date(accidentDateRaw)
        : new Date();
      if (Number.isNaN(accidentDateParsed.getTime())) {
        accidentDateParsed = new Date();
      }
    } catch {
      accidentDateParsed = new Date();
    }

    const claim_data = {
      claimantName: body.claimantName,
      claimantEmail: body.claimantEmail,
      claimantPhone: body.claimantPhone,
      claimantAddress: body.claimantAddress,
      accidentDate: accidentDateParsed,
      accidentLocation: body.accidentLocation,
      accidentDescription: body.accidentDescription,
      insuranceCompany: body.insuranceCompany,
      policyNumber: body.policyNumber,
      vehicleMake: body.vehicleMake || "Not specified",
      vehicleModel: body.vehicleModel || "Not specified",
      vehicleYear: body.vehicleYear || "Not specified",
      licensePlate: body.licensePlate || "Not specified",
      estimatedValue: body.estimatedValue || 0,
      injuries: processedInjuries,
      propertyDamage: body.propertyDamage || "",
      completionMethod: body.completionMethod || "",
      employersList: body.employersList || "",
      noFaultWorksheet: body,
      notes: [
        {
          content:
            "No-fault application worksheet saved (draft for user's insurer form).",
          author: "System",
          timestamp: new Date().toISOString(),
        },
      ],
      submittedAt: new Date().toISOString(),
    };

    const supabase = getSupabaseAdmin();
    const now = new Date().toISOString();

    const { data: inserted, error } = await supabase
      .from("claims")
      .insert({
        user_id: userId,
        claim_number: claimNumber,
        status,
        priority,
        claim_data,
        created_at: now,
        updated_at: now,
      })
      .select()
      .single();

    if (error || !inserted) {
      console.error("Claim insert error:", error);
      return NextResponse.json(
        { error: error?.message || "Failed to save claim" },
        { status: 500 }
      );
    }

    const claim = claimRowToLegacy(inserted as Record<string, unknown>);

    return NextResponse.json(
      {
        claim,
        message: "Claim submitted successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting claim:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Internal server error",
        details:
          process.env.NODE_ENV === "development"
            ? error instanceof Error
              ? error.message
              : "Unknown error"
            : undefined,
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: "Database configuration error. Please contact support." },
        { status: 503 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const supabase = getSupabaseAdmin();

    const { data: rows, error, count } = await supabase
      .from("claims")
      .select("*", { count: "exact" })
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const claims = (rows || []).map((r) =>
      claimRowToLegacy(r as Record<string, unknown>)
    );
    const total = count ?? 0;

    return NextResponse.json({
      claims,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    console.error("Error fetching claims:", error);

    return NextResponse.json(
      {
        error: "Internal server error. Please try again.",
        details:
          process.env.NODE_ENV === "development"
            ? error instanceof Error
              ? error.message
              : "Unknown error"
            : undefined,
      },
      { status: 500 }
    );
  }
}
