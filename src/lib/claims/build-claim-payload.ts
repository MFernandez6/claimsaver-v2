import type { SupabaseClient } from "@supabase/supabase-js";
import { FLORIDA_PIP_MILESTONE_TEMPLATES } from "@/lib/florida-pip-milestones";

export interface InjuryData {
  type: string;
  description: string;
  severity: "minor" | "moderate" | "severe";
}

/**
 * Parses wizard/API body into structured claim_data and supporting fields
 * (mirrors /api/claims POST semantics).
 */
export function parseInjuriesFromBody(body: Record<string, unknown>): InjuryData[] {
  let processedInjuries: InjuryData[] = [];
  const inj = body.injuries;
  if (inj && Array.isArray(inj)) {
    processedInjuries = (inj as InjuryData[]).map((injury: InjuryData) => ({
      type: injury.type || "",
      description: injury.description || "",
      severity: injury.severity || "minor",
    }));
  } else if (inj && typeof inj === "string") {
    try {
      const parsedInjuries = JSON.parse(inj);
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
  return processedInjuries;
}

export function parseAccidentDate(body: Record<string, unknown>): Date {
  const accidentDateRaw = body.accidentDate || body.dateOfAccident;
  try {
    const accidentDateParsed = accidentDateRaw
      ? new Date(String(accidentDateRaw))
      : new Date();
    if (Number.isNaN(accidentDateParsed.getTime())) {
      return new Date();
    }
    return accidentDateParsed;
  } catch {
    return new Date();
  }
}

export function buildClaimDataFromBody(
  body: Record<string, unknown>,
  options: { submittedAt?: string } = {},
): Record<string, unknown> {
  const processedInjuries = parseInjuriesFromBody(body);
  const accidentDateParsed = parseAccidentDate(body);
  const submittedAt = options.submittedAt ?? new Date().toISOString();

  return {
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
        timestamp: submittedAt,
      },
    ],
    submittedAt,
  };
}

export function generateClaimNumber(): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `CS${year}${month}-${random}`;
}

/** Draft claims use a distinct prefix until finalized. */
export function generateDraftClaimNumber(): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `D-CS${year}${month}-${random}`;
}

export type InsertMilestoneResult =
  | { ok: true; count: number }
  | { ok: false; error: string };

/**
 * Inserts Florida PIP milestone rows for a claim (general info; not legal advice).
 */
export async function insertFloridaPipMilestonesForClaim(
  supabase: SupabaseClient,
  {
    userId,
    claimId,
    accidentDate,
  }: {
    userId: string;
    claimId: string;
    accidentDate: Date;
  },
): Promise<InsertMilestoneResult> {
  if (Number.isNaN(accidentDate.getTime())) {
    return { ok: false, error: "Invalid accident date" };
  }

  const rows = FLORIDA_PIP_MILESTONE_TEMPLATES.map((m) => {
    const d = new Date(accidentDate);
    d.setDate(d.getDate() + m.dayOffset);
    const y = d.getFullYear();
    const mo = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const dateStr = `${y}-${mo}-${day}`;

    return {
      user_id: userId,
      claim_id: claimId,
      title: m.label,
      date: dateStr,
      time: "09:00",
      type: "deadline" as const,
      description: m.description,
      priority: (m.critical ? "high" : "medium") as "high" | "medium",
      completed: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  });

  const { error } = await supabase.from("calendar_events").insert(rows);

  if (error) {
    console.error("insertFloridaPipMilestonesForClaim:", error);
    return { ok: false, error: error.message };
  }
  return { ok: true, count: rows.length };
}
