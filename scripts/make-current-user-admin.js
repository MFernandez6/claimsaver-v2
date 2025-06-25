const mongoose = require("mongoose");
require("dotenv").config({ path: ".env.local" });

// Define the User schema (simplified version for the script)
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
    lastLogin: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", UserSchema);

async function makeCurrentUserAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Get email from command line argument
    const userEmail = process.argv[2];

    if (!userEmail) {
      console.error("Please provide an email address as an argument");
      console.log("Usage: node scripts/make-current-user-admin.js <email>");
      process.exit(1);
    }

    console.log(`Looking for user with email: ${userEmail}`);

    // Find user by email
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      console.error(`User with email ${userEmail} not found`);
      console.log("Please make sure the user has signed up first");
      process.exit(1);
    }

    // Update user to admin role
    user.role = "admin";
    user.adminPermissions = {
      canViewClaims: true,
      canEditClaims: true,
      canDeleteClaims: true,
      canManageUsers: true,
      canViewAnalytics: true,
    };

    await user.save();
    console.log(`✅ Successfully updated ${userEmail} to admin role`);
    console.log(`User ID: ${user._id}`);
    console.log(`Clerk ID: ${user.clerkId}`);
    console.log(`Role: ${user.role}`);

    console.log("\nYou can now access the admin dashboard at /admin");
  } catch (error) {
    console.error("Error updating user to admin:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

// Run the script
makeCurrentUserAdmin();
