import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/db";
import Calendar from "@/models/Calendar";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { title, date, time, type, description, priority, completed } = body;

    console.log("Updating calendar event:", id, body);

    await dbConnect();

    const event = await Calendar.findOneAndUpdate(
      { _id: id, userId },
      {
        title,
        date,
        time,
        type,
        description: description || "",
        priority,
        completed,
      },
      { new: true }
    );

    if (!event) {
      return NextResponse.json(
        { error: "Calendar event not found" },
        { status: 404 }
      );
    }

    console.log("Calendar event updated successfully");
    return NextResponse.json(event);
  } catch (error) {
    console.error("Error updating calendar event:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    console.log("Deleting calendar event:", id);

    await dbConnect();

    const event = await Calendar.findOneAndDelete({ _id: id, userId });

    if (!event) {
      return NextResponse.json(
        { error: "Calendar event not found" },
        { status: 404 }
      );
    }

    console.log("Calendar event deleted successfully");
    return NextResponse.json({
      message: "Calendar event deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting calendar event:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
