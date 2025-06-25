import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function POST(req: Request) {
  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || "");

  let evt: WebhookEvent;

  // Verify the payload with the headers
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

  // Handle the webhook
  const eventType = evt.type;

  if (eventType === "user.created") {
    try {
      await dbConnect();

      const { id, email_addresses, first_name, last_name } = evt.data;
      const email = email_addresses?.[0]?.email_address;

      if (!email) {
        console.error("No email found in webhook data");
        return NextResponse.json({ error: "No email found" }, { status: 400 });
      }

      // Check if user already exists
      const existingUser = await User.findOne({ clerkId: id });

      if (existingUser) {
        console.log("User already exists:", email);
        return NextResponse.json({ message: "User already exists" });
      }

      // Create new user
      const user = new User({
        clerkId: id,
        email: email,
        firstName: first_name || "Unknown",
        lastName: last_name || "User",
        role: "user", // Default role
        isActive: true,
      });

      await user.save();
      console.log("Created new user:", email);

      return NextResponse.json({ message: "User created successfully" });
    } catch (error) {
      console.error("Error creating user:", error);
      return NextResponse.json(
        { error: "Failed to create user" },
        { status: 500 }
      );
    }
  }

  if (eventType === "user.updated") {
    try {
      await dbConnect();

      const { id, email_addresses, first_name, last_name } = evt.data;
      const email = email_addresses?.[0]?.email_address;

      if (!email) {
        console.error("No email found in webhook data");
        return NextResponse.json({ error: "No email found" }, { status: 400 });
      }

      // Update existing user
      const user = await User.findOneAndUpdate(
        { clerkId: id },
        {
          email: email,
          firstName: first_name || "Unknown",
          lastName: last_name || "User",
        },
        { new: true }
      );

      if (!user) {
        console.log("User not found for update, creating new user:", email);
        // Create user if not found
        const newUser = new User({
          clerkId: id,
          email: email,
          firstName: first_name || "Unknown",
          lastName: last_name || "User",
          role: "user",
          isActive: true,
        });
        await newUser.save();
      }

      return NextResponse.json({ message: "User updated successfully" });
    } catch (error) {
      console.error("Error updating user:", error);
      return NextResponse.json(
        { error: "Failed to update user" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ message: "Webhook processed" });
}
