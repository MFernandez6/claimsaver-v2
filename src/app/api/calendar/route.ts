import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/db";
import Calendar from "@/models/Calendar";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Fetching calendar events for user:", userId);
    await dbConnect();
    console.log("Connected to MongoDB successfully");

    const events = await Calendar.find({ userId }).sort({ date: 1, time: 1 });
    console.log("Found calendar events:", events.length);

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

    // Check if MongoDB URI is configured
    if (!process.env.MONGODB_URI) {
      console.error("MONGODB_URI environment variable is not set");
      return NextResponse.json(
        { error: "Database configuration error" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { title, date, time, type, description, priority } = body;

    console.log("Received calendar event:", {
      title,
      date,
      time,
      type,
      description,
      priority,
    });

    if (!title || !date || !time || !type || !priority) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          received: { title, date, time, type, priority },
        },
        { status: 400 }
      );
    }

    console.log("Connecting to MongoDB...");
    await dbConnect();
    console.log("Connected to MongoDB successfully");

    const event = new Calendar({
      userId,
      title,
      date,
      time,
      type,
      description: description || "",
      priority,
      completed: false,
    });

    console.log("Saving calendar event to MongoDB...");
    await event.save();
    console.log("Calendar event saved successfully");

    return NextResponse.json(event);
  } catch (error) {
    console.error("Error creating calendar event:", error);

    // Provide specific error messages for common MongoDB issues
    if (error instanceof Error) {
      if (error.message.includes("whitelist")) {
        return NextResponse.json(
          {
            error: "Database connection error",
            details:
              "MongoDB Atlas IP whitelist issue. Please contact support or check your MongoDB Atlas configuration.",
            code: "IP_WHITELIST_ERROR",
          },
          { status: 500 }
        );
      }

      if (error.message.includes("authentication")) {
        return NextResponse.json(
          {
            error: "Database authentication error",
            details:
              "MongoDB credentials are invalid. Please check your connection string.",
            code: "AUTH_ERROR",
          },
          { status: 500 }
        );
      }

      if (error.message.includes("ENOTFOUND")) {
        return NextResponse.json(
          {
            error: "Database connection error",
            details:
              "MongoDB host not found. Please check your connection string.",
            code: "HOST_NOT_FOUND",
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
