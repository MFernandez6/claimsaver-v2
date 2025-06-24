import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["user", "admin", "super_admin"],
      default: "user",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // Profile Information
    phone: {
      type: String,
      default: "",
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: {
        type: String,
        default: "USA",
      },
    },
    // Preferences
    preferences: {
      notifications: {
        email: {
          type: Boolean,
          default: true,
        },
        sms: {
          type: Boolean,
          default: false,
        },
        push: {
          type: Boolean,
          default: true,
        },
      },
      theme: {
        type: String,
        enum: ["light", "dark", "system"],
        default: "system",
      },
    },
    // Admin specific fields
    adminPermissions: {
      canViewClaims: {
        type: Boolean,
        default: false,
      },
      canEditClaims: {
        type: Boolean,
        default: false,
      },
      canDeleteClaims: {
        type: Boolean,
        default: false,
      },
      canManageUsers: {
        type: Boolean,
        default: false,
      },
      canViewAnalytics: {
        type: Boolean,
        default: false,
      },
    },
    // Statistics
    stats: {
      totalClaims: {
        type: Number,
        default: 0,
      },
      activeClaims: {
        type: Number,
        default: 0,
      },
      completedClaims: {
        type: Number,
        default: 0,
      },
      totalSettlements: {
        type: Number,
        default: 0,
      },
    },
    // Timestamps
    lastLogin: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Update last login
UserSchema.methods.updateLastLogin = function () {
  this.lastLogin = new Date();
  return this.save();
};

// Get full name
UserSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Ensure virtual fields are serialized
UserSchema.set("toJSON", { virtuals: true });
UserSchema.set("toObject", { virtuals: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);
