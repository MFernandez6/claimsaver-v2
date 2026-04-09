import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const defaultAdminPerms = {
  canViewClaims: false,
  canEditClaims: false,
  canDeleteClaims: false,
  canManageUsers: false,
  canViewAnalytics: false,
};

const defaultStats = {
  totalClaims: 0,
  activeClaims: 0,
  completedClaims: 0,
  totalSettlements: 0,
};

export async function POST(req: Request) {
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || "");

  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  if (!isSupabaseConfigured()) {
    console.error("Clerk webhook: Supabase not configured");
    return NextResponse.json(
      { error: "Supabase not configured" },
      { status: 503 }
    );
  }

  const supabase = getSupabaseAdmin();
  const eventType = evt.type;

  if (eventType === "user.created" || eventType === "user.updated") {
    try {
      const { id, email_addresses, first_name, last_name } = evt.data;
      const email = email_addresses?.[0]?.email_address;

      if (!email) {
        console.error("No email found in webhook data");
        return NextResponse.json({ error: "No email found" }, { status: 400 });
      }

      const now = new Date().toISOString();
      const fn = first_name || "Unknown";
      const ln = last_name || "User";

      if (eventType === "user.created") {
        const { error } = await supabase.from("profiles").upsert(
          {
            clerk_id: id,
            email,
            first_name: fn,
            last_name: ln,
            role: "user",
            is_active: true,
            admin_permissions: defaultAdminPerms,
            stats: defaultStats,
            last_login: now,
            updated_at: now,
          },
          { onConflict: "clerk_id" }
        );

        if (error) {
          console.error("Supabase insert error:", error);
          return NextResponse.json(
            { error: "Failed to sync user" },
            { status: 500 }
          );
        }
      } else {
        const { data: existing, error: findErr } = await supabase
          .from("profiles")
          .select("id")
          .eq("clerk_id", id)
          .maybeSingle();

        if (findErr) {
          console.error("Supabase find profile:", findErr);
          return NextResponse.json(
            { error: "Failed to sync user" },
            { status: 500 }
          );
        }

        if (existing) {
          const { error } = await supabase
            .from("profiles")
            .update({
              email,
              first_name: fn,
              last_name: ln,
              updated_at: now,
            })
            .eq("clerk_id", id);

          if (error) {
            console.error("Supabase update error:", error);
            return NextResponse.json(
              { error: "Failed to sync user" },
              { status: 500 }
            );
          }
        } else {
          const { error } = await supabase.from("profiles").insert({
            clerk_id: id,
            email,
            first_name: fn,
            last_name: ln,
            role: "user",
            is_active: true,
            admin_permissions: defaultAdminPerms,
            stats: defaultStats,
            last_login: now,
            updated_at: now,
          });

          if (error) {
            console.error("Supabase insert (late) error:", error);
            return NextResponse.json(
              { error: "Failed to sync user" },
              { status: 500 }
            );
          }
        }
      }

      console.log(`Profile synced (${eventType}):`, email);
      return NextResponse.json({ message: "User synced successfully" });
    } catch (error) {
      console.error("Webhook user sync error:", error);
      return NextResponse.json(
        { error: "Failed to sync user" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ message: "Webhook processed" });
}
