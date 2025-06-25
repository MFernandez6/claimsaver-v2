require("dotenv").config();
const mongoose = require("mongoose");

// Define the User schema inline since we can't import ES modules
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
  },
  {
    timestamps: true,
  }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);

async function fixAdminUser() {
  try {
    console.log("🔧 Fixing admin user setup...\n");

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB\n");

    // Get your Clerk user ID from command line
    const clerkId = process.argv[2];

    if (!clerkId) {
      console.log("❌ Please provide your Clerk user ID");
      console.log("\n📋 How to get your Clerk user ID:");
      console.log("   1. Open your browser console (F12)");
      console.log("   2. Run: console.log(window.Clerk?.user?.id)");
      console.log('   3. Copy the user ID (starts with "user_")');
      console.log(
        "   4. Run this script with: node scripts/fix-admin-user.js <your-clerk-id>"
      );
      console.log(
        "\n   Example: node scripts/fix-admin-user.js user_2abc123def456"
      );
      return;
    }

    console.log(`🔍 Looking for user with Clerk ID: ${clerkId}`);

    // Check if user exists
    let user = await User.findOne({ clerkId });

    if (user) {
      console.log("✅ User found, updating to admin...");
      user.role = "admin";
      user.email = "claimsaverplus@gmail.com";
      user.firstName = "Admin";
      user.lastName = "User";
      await user.save();
      console.log("✅ User updated to admin successfully!");
    } else {
      console.log("❌ User not found, creating new admin user...");

      // Create new admin user
      user = new User({
        clerkId: clerkId,
        email: "claimsaverplus@gmail.com",
        firstName: "Admin",
        lastName: "User",
        role: "admin",
        isActive: true,
      });

      await user.save();
      console.log("✅ New admin user created successfully!");
    }

    console.log("\n📋 User details:");
    console.log(`   Email: ${user.email}`);
    console.log(`   Name: ${user.firstName} ${user.lastName}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Active: ${user.isActive ? "Yes" : "No"}`);

    console.log("\n🎉 You can now:");
    console.log("   1. Refresh your app");
    console.log("   2. Go to /admin");
    console.log("   3. Access the admin dashboard");
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("\n🔌 Disconnected from MongoDB");
  }
}

fixAdminUser();
