import mongoose from "mongoose";

const ClaimSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    claimNumber: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      required: true,
      enum: [
        "pending",
        "reviewing",
        "approved",
        "rejected",
        "in_progress",
        "completed",
      ],
      default: "pending",
    },
    priority: {
      type: String,
      required: true,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    // Accident Details
    accidentDate: {
      type: Date,
      required: true,
    },
    accidentLocation: {
      type: String,
      required: true,
    },
    accidentDescription: {
      type: String,
      required: true,
    },
    // Personal Information
    claimantName: {
      type: String,
      required: true,
    },
    claimantEmail: {
      type: String,
      required: true,
    },
    claimantPhone: {
      type: String,
      required: true,
    },
    claimantAddress: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
    },
    // Insurance Information
    insuranceCompany: {
      type: String,
      required: true,
    },
    policyNumber: {
      type: String,
      required: true,
    },
    // Vehicle Information
    vehicleMake: {
      type: String,
      required: true,
    },
    vehicleModel: {
      type: String,
      required: true,
    },
    vehicleYear: {
      type: String,
      required: true,
    },
    licensePlate: {
      type: String,
      required: true,
    },
    // Injuries and Damages
    injuries: [
      {
        type: String,
        description: String,
        severity: {
          type: String,
          enum: ["minor", "moderate", "severe"],
        },
      },
    ],
    propertyDamage: {
      type: String,
      default: "",
    },
    // Financial Information
    estimatedValue: {
      type: Number,
      default: 0,
    },
    settlementAmount: {
      type: Number,
      default: 0,
    },
    // Admin Fields
    assignedTo: {
      type: String,
      default: "",
    },
    notes: [
      {
        content: String,
        author: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    documents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Document",
      },
    ],
    // Timestamps
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Generate claim number
ClaimSchema.pre("save", function (next) {
  if (this.isNew) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");
    this.claimNumber = `CS${year}${month}-${random}`;
  }
  this.lastUpdated = new Date();
  next();
});

export default mongoose.models.Claim || mongoose.model("Claim", ClaimSchema);
