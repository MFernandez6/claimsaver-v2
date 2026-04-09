import {
  getSupabaseAdmin,
  CLAIM_DOCUMENTS_BUCKET,
} from "@/lib/supabase/admin";

export function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 180) || "file";
}

export function buildStoragePath(
  userId: string,
  documentId: string,
  fileName: string
): string {
  return `${userId}/${documentId}/${sanitizeFileName(fileName)}`;
}

export async function uploadClaimDocument(
  storagePath: string,
  data: Buffer | Uint8Array | ArrayBuffer,
  contentType: string
): Promise<void> {
  const supabase = getSupabaseAdmin();
  const body =
    data instanceof Buffer
      ? data
      : data instanceof ArrayBuffer
        ? Buffer.from(new Uint8Array(data))
        : Buffer.from(data);

  const { error } = await supabase.storage
    .from(CLAIM_DOCUMENTS_BUCKET)
    .upload(storagePath, body, {
      contentType,
      upsert: true,
    });

  if (error) {
    throw new Error(error.message);
  }
}

export async function downloadClaimDocumentBytes(
  storagePath: string
): Promise<Buffer> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.storage
    .from(CLAIM_DOCUMENTS_BUCKET)
    .download(storagePath);

  if (error || !data) {
    throw new Error(error?.message || "Download failed");
  }

  return Buffer.from(await data.arrayBuffer());
}

export async function removeClaimDocument(storagePath: string): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.storage
    .from(CLAIM_DOCUMENTS_BUCKET)
    .remove([storagePath]);

  if (error) {
    throw new Error(error.message);
  }
}
