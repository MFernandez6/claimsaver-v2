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

    // Insurance Information
    insuranceCompany: {
      type: String,
      required: true,
    },
    policyNumber: {
      type: String,
      required: true,
    },
    adjusterName: {
      type: String,
      default: "",
    },
    adjusterPhone: {
      type: String,
      default: "",
    },
    fileNumber: {
      type: String,
      default: "",
    },
    policyHolder: {
      type: String,
      default: "",
    },
    dateOfAccident: {
      type: String,
      default: "",
    },

    // Medical Insurance
    medicalInsurance: {
      type: String,
      default: "",
    },
    medicalMemberId: {
      type: String,
      default: "",
    },

    // Claimant Information
    claimantName: {
      type: String,
      required: true,
    },
    claimantPhoneHome: {
      type: String,
      default: "",
    },
    claimantPhoneBusiness: {
      type: String,
      default: "",
    },
    claimantAddress: {
      type: String,
      default: "",
    },
    claimantDOB: {
      type: String,
      default: "",
    },
    claimantSSN: {
      type: String,
      default: "",
    },
    floridaResidencyDuration: {
      type: String,
      default: "",
    },
    permanentAddress: {
      type: String,
      default: "",
    },

    // Accident Details
    accidentDateTime: {
      type: String,
      default: "",
    },
    accidentPlace: {
      type: String,
      default: "",
    },
    accidentDescription: {
      type: String,
      required: true,
    },
    yourVehicle: {
      type: String,
      default: "",
    },
    familyVehicle: {
      type: String,
      default: "",
    },
    injured: {
      type: Boolean,
      default: false,
    },
    injuryDescription: {
      type: String,
      default: "",
    },

    // Medical Treatment
    treatedByDoctor: {
      type: Boolean,
      default: false,
    },
    doctorName: {
      type: String,
      default: "",
    },
    doctorAddress: {
      type: String,
      default: "",
    },
    hospitalInpatient: {
      type: Boolean,
      default: false,
    },
    hospitalOutpatient: {
      type: Boolean,
      default: false,
    },
    hospitalName: {
      type: String,
      default: "",
    },
    hospitalAddress: {
      type: String,
      default: "",
    },
    medicalBillsToDate: {
      type: String,
      default: "",
    },
    moreMedicalExpense: {
      type: Boolean,
      default: false,
    },

    // Employment & Wages
    inCourseOfEmployment: {
      type: Boolean,
      default: false,
    },
    lostWages: {
      type: Boolean,
      default: false,
    },
    wageLossToDate: {
      type: String,
      default: "",
    },
    averageWeeklyWage: {
      type: String,
      default: "",
    },
    disabilityStart: {
      type: String,
      default: "",
    },
    disabilityEnd: {
      type: String,
      default: "",
    },
    workersComp: {
      type: Boolean,
      default: false,
    },
    workersCompAmount: {
      type: String,
      default: "",
    },
    otherExpenses: {
      type: String,
      default: "",
    },

    // Legal Disclaimers
    signature: {
      type: String,
      default: "",
    },
    signatureDate: {
      type: String,
      default: "",
    },

    // Authorizations
    medicalAuthSignature: {
      type: String,
      default: "",
    },
    medicalAuthDate: {
      type: String,
      default: "",
    },
    wageAuthSignature: {
      type: String,
      default: "",
    },
    wageAuthDate: {
      type: String,
      default: "",
    },

    // OIR-B1-1571 Disclosure
    pipPatientName: {
      type: String,
      default: "",
    },
    pipPatientSignature: {
      type: String,
      default: "",
    },
    pipPatientDate: {
      type: String,
      default: "",
    },
    pipProviderName: {
      type: String,
      default: "",
    },
    pipProviderSignature: {
      type: String,
      default: "",
    },
    pipProviderDate: {
      type: String,
      default: "",
    },

    // Legacy fields for backward compatibility
    accidentDate: {
      type: Date,
      required: true,
    },
    accidentLocation: {
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
    injuries: {
      type: [
        {
          type: {
            type: String,
            required: true,
          },
          description: {
            type: String,
            required: true,
          },
          severity: {
            type: String,
            enum: ["minor", "moderate", "severe"],
            default: "minor",
          },
        },
      ],
      default: [],
    },
    propertyDamage: {
      type: String,
      default: "",
    },
    estimatedValue: {
      type: Number,
      default: 0,
    },
    settlementAmount: {
      type: Number,
      default: 0,
    },
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
