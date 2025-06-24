import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/db";
import Claim from "@/models/Claim";
import { createOrUpdateUser } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const body = await request.json();

    // Create or update user in our database
    await createOrUpdateUser(userId, {
      email: body.claimantEmail,
      firstName: body.claimantName.split(" ")[0] || body.claimantName,
      lastName: body.claimantName.split(" ").slice(1).join(" ") || "",
      phone: body.claimantPhone,
      address: body.claimantAddress,
    });

    // Create the claim
    const claim = new Claim({
      userId,
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
      injuries: body.injuries || [],
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
    });

    await claim.save();

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
      { error: "Internal server error" },
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

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Get claims for the current user
    const claims = await Claim.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Claim.countDocuments({ userId });

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
    console.error("Error fetching claims:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
