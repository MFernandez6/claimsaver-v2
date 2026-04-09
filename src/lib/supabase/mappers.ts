import type { PostgrestError } from "@supabase/supabase-js";

export function pgErrorMessage(err: PostgrestError | null): string {
  return err?.message ?? "Database error";
}

/** Profile row → legacy Mongoose-like shape for dashboard / admin */
export function profileRowToLegacy(row: Record<string, unknown>) {
  const address = (row.address as Record<string, string>) || {};
  const preferences = (row.preferences as Record<string, unknown>) || {};
  const adminPermissions =
    (row.admin_permissions as Record<string, boolean>) || {};
  const stats = (row.stats as Record<string, number>) || {};

  return {
    _id: String(row.id ?? ""),
    clerkId: String(row.clerk_id ?? ""),
    email: String(row.email ?? ""),
    firstName: String(row.first_name ?? ""),
    lastName: String(row.last_name ?? ""),
    role: String(row.role ?? "user"),
    isActive: Boolean(row.is_active ?? true),
    phone: typeof row.phone === "string" ? row.phone : "",
    address: {
      street: address.street ?? "",
      city: address.city ?? "",
      state: address.state ?? "",
      zipCode: address.zipCode ?? "",
      country: address.country ?? "USA",
    },
    preferences,
    adminPermissions,
    stats,
    lastLogin:
      row.last_login === null || row.last_login === undefined
        ? undefined
        : String(row.last_login),
    createdAt:
      row.created_at === null || row.created_at === undefined
        ? undefined
        : String(row.created_at),
    updatedAt:
      row.updated_at === null || row.updated_at === undefined
        ? undefined
        : String(row.updated_at),
  };
}

/** claim_documents row → legacy Document shape */
export function documentRowToLegacy(row: Record<string, unknown>) {
  const id = row.id as string;
  return {
    _id: id,
    userId: row.user_id,
    claimId: row.claim_id ?? null,
    name: row.name,
    type: row.type,
    fileType: row.file_type,
    size: row.size_display,
    uploadDate: row.upload_date,
    description: row.description ?? "",
    fileName: row.file_name,
    mimeType: row.mime_type,
    storage_path: row.storage_path,
    url: `/api/documents/${id}/view`,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/** calendar_events row → legacy */
export function calendarRowToLegacy(row: Record<string, unknown>) {
  return {
    _id: row.id,
    userId: row.user_id,
    title: row.title,
    date: row.date,
    time: row.time,
    type: row.type,
    description: row.description ?? "",
    priority: row.priority,
    completed: row.completed,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/** claims row + JSON payload → legacy claim object */
export function claimRowToLegacy(row: Record<string, unknown>) {
  const claimData =
    typeof row.claim_data === "object" && row.claim_data !== null
      ? (row.claim_data as Record<string, unknown>)
      : {};

  return {
    ...claimData,
    _id: row.id,
    userId: row.user_id,
    claimNumber: row.claim_number,
    status: row.status,
    priority: row.priority,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    submittedAt: claimData.submittedAt ?? row.created_at,
    lastUpdated: row.updated_at,
  };
}

export function isUuid(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    id
  );
}
