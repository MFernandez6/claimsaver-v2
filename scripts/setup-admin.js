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

async function setupAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Get admin details from command line arguments or use defaults
    const adminEmail = process.argv[2] || "admin@claimsaver.com";
    const adminFirstName = process.argv[3] || "Admin";
    const adminLastName = process.argv[4] || "User";
    const clerkId = process.argv[5] || "admin_clerk_id"; // You'll need to get this from Clerk

    console.log(`Setting up admin user: ${adminEmail}`);

    // Check if user already exists
    const existingUser = await User.findOne({ email: adminEmail });

    if (existingUser) {
      // Update existing user to admin
      existingUser.role = "admin";
      existingUser.adminPermissions = {
        canViewClaims: true,
        canEditClaims: true,
        canDeleteClaims: true,
        canManageUsers: true,
        canViewAnalytics: true,
      };
      await existingUser.save();
      console.log(`Updated existing user ${adminEmail} to admin role`);
    } else {
      // Create new admin user
      const adminUser = new User({
        clerkId,
        email: adminEmail,
        firstName: adminFirstName,
        lastName: adminLastName,
        role: "admin",
        isActive: true,
        adminPermissions: {
          canViewClaims: true,
          canEditClaims: true,
          canDeleteClaims: true,
          canManageUsers: true,
          canViewAnalytics: true,
        },
        stats: {
          totalClaims: 0,
          activeClaims: 0,
          completedClaims: 0,
          totalSettlements: 0,
        },
      });

      await adminUser.save();
      console.log(`Created new admin user: ${adminEmail}`);
    }

    console.log("Admin setup completed successfully!");
    console.log("\nTo use this admin account:");
    console.log("1. Sign up with the email:", adminEmail);
    console.log("2. The user will automatically have admin privileges");
    console.log("3. You can access the admin dashboard at /admin");
  } catch (error) {
    console.error("Error setting up admin:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

// Run the setup
setupAdmin();
