import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/db";
import Claim from "@/models/Claim";
import { createOrUpdateUser } from "@/lib/auth";

interface InjuryData {
  type: string;
  description: string;
  severity: "minor" | "moderate" | "severe";
}

export async function POST(request: NextRequest) {
  try {
    console.log("🔍 Claims API POST called");

    const { userId } = await auth();

    if (!userId) {
      console.log("❌ No user ID found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("✅ User authenticated:", userId);

    // Check if MongoDB URI is available
    if (!process.env.MONGODB_URI) {
      console.error("❌ MONGODB_URI environment variable is not set");
      return NextResponse.json(
        { error: "Database configuration error. Please contact support." },
        { status: 500 }
      );
    }

    console.log("🔗 Connecting to database...");
    await dbConnect();
    console.log("✅ Database connected");

    const body = await request.json();
    console.log("📋 Request body received:", JSON.stringify(body, null, 2));

    // Create or update user in our database
    console.log("👤 Creating/updating user...");
    await createOrUpdateUser(userId, {
      email: body.claimantEmail,
      firstName: body.claimantName.split(" ")[0] || body.claimantName,
      lastName: body.claimantName.split(" ").slice(1).join(" ") || "",
      phone: body.claimantPhone,
      address: body.claimantAddress,
    });
    console.log("✅ User created/updated");

    // Process injuries data to ensure it's in the correct format
    let processedInjuries: InjuryData[] = [];
    if (body.injuries && Array.isArray(body.injuries)) {
      processedInjuries = body.injuries.map((injury: InjuryData) => ({
        type: injury.type || "",
        description: injury.description || "",
        severity: injury.severity || "minor",
      }));
    } else if (body.injuries && typeof body.injuries === "string") {
      // Fallback: if injuries is a string, try to parse it
      try {
        const parsedInjuries = JSON.parse(body.injuries);
        if (Array.isArray(parsedInjuries)) {
          processedInjuries = parsedInjuries.map((injury: InjuryData) => ({
            type: injury.type || "",
            description: injury.description || "",
            severity: injury.severity || "minor",
          }));
        }
      } catch (e) {
        console.log(
          "⚠️ Could not parse injuries string:",
          body.injuries,
          "Error:",
          e
        );
        processedInjuries = [];
      }
    }

    console.log("🔍 Processed injuries:", processedInjuries);

    // Generate claim number manually if needed
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");
    const claimNumber = `CS${year}${month}-${random}`;

    const claimData = {
      userId,
      claimNumber, // Add claim number manually
      // Personal Information
      claimantName: body.claimantName,
      claimantEmail: body.claimantEmail,
      claimantPhone: body.claimantPhone,
      claimantAddress: body.claimantAddress,

      // Accident Details
      accidentDate: new Date(body.accidentDate),
      accidentLocation: body.accidentLocation,
      accidentDescription: body.accidentDescription,

      // Insurance Information
      insuranceCompany: body.insuranceCompany,
      policyNumber: body.policyNumber,

      // Vehicle Information
      vehicleMake: body.vehicleMake,
      vehicleModel: body.vehicleModel,
      vehicleYear: body.vehicleYear,
      licensePlate: body.licensePlate,

      // Additional Information
      estimatedValue: body.estimatedValue || 0,
      injuries: processedInjuries,
      propertyDamage: body.propertyDamage || "",

      // Set initial status and priority
      status: "pending",
      priority: body.estimatedValue > 10000 ? "high" : "medium",

      // Add initial note
      notes: [
        {
          content: "Claim submitted by user through online form",
          author: "System",
          timestamp: new Date(),
        },
      ],
    };

    console.log("📋 Claim data prepared:", JSON.stringify(claimData, null, 2));

    const claim = new Claim(claimData);

    console.log("📋 Claim object created, saving...");
    await claim.save();
    console.log(
      "✅ Claim saved successfully with claimNumber:",
      claim.claimNumber
    );

    return NextResponse.json(
      {
        claim,
        message: "Claim submitted successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Error submitting claim:", error);

    // Provide more specific error information
    let errorMessage = "Internal server error. Please try again.";
    let statusCode = 500;

    if (error instanceof Error) {
      if (
        error.message.includes("MongoDB") ||
        error.message.includes("MONGODB_URI")
      ) {
        errorMessage =
          "Database connection error. Please try again or contact support.";
      } else if (error.message.includes("authentication")) {
        errorMessage = "Authentication error. Please sign in again.";
        statusCode = 401;
      } else if (error.message.includes("validation")) {
        errorMessage = "Invalid data provided. Please check your information.";
        statusCode = 400;
      } else {
        errorMessage = error.message;
      }
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details:
          process.env.NODE_ENV === "development"
            ? error instanceof Error
              ? error.message
              : "Unknown error"
            : undefined,
      },
      { status: statusCode }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 Claims API GET called");

    const { userId } = await auth();

    if (!userId) {
      console.log("❌ No user ID found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("✅ User authenticated:", userId);

    // Check if MongoDB URI is available
    if (!process.env.MONGODB_URI) {
      console.error("❌ MONGODB_URI environment variable is not set");
      return NextResponse.json(
        { error: "Database configuration error. Please contact support." },
        { status: 500 }
      );
    }

    console.log("🔗 Connecting to database...");
    await dbConnect();
    console.log("✅ Database connected");

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    console.log("📋 Query params:", { page, limit, skip });

    // Get claims for the current user
    const claims = await Claim.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Claim.countDocuments({ userId });

    console.log(`✅ Found ${claims.length} claims out of ${total} total`);

    return NextResponse.json({
      claims,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("❌ Error fetching claims:", error);

    // Provide more specific error information
    let errorMessage = "Internal server error. Please try again.";
    let statusCode = 500;

    if (error instanceof Error) {
      if (
        error.message.includes("MongoDB") ||
        error.message.includes("MONGODB_URI")
      ) {
        errorMessage =
          "Database connection error. Please try again or contact support.";
      } else if (error.message.includes("authentication")) {
        errorMessage = "Authentication error. Please sign in again.";
        statusCode = 401;
      } else {
        errorMessage = error.message;
      }
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details:
          process.env.NODE_ENV === "development"
            ? error instanceof Error
              ? error.message
              : "Unknown error"
            : undefined,
      },
      { status: statusCode }
    );
  }
}
