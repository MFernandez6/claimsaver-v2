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

async function updateClerkId() {
  try {
    console.log("🔄 Updating admin user Clerk ID...\n");

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB\n");

    const newClerkId = process.argv[2];

    if (!newClerkId) {
      console.log("❌ Please provide your new Clerk user ID");
      console.log("   Usage: node scripts/update-clerk-id.js <new-clerk-id>");
      return;
    }

    // Find the existing admin user
    const existingUser = await User.findOne({
      email: "claimsaverplus@gmail.com",
    });

    if (!existingUser) {
      console.log("❌ No admin user found with email claimsaverplus@gmail.com");
      return;
    }

    console.log(`📧 Found admin user: ${existingUser.email}`);
    console.log(`🔄 Current Clerk ID: ${existingUser.clerkId}`);
    console.log(`🔄 New Clerk ID: ${newClerkId}\n`);

    // Update the Clerk ID
    existingUser.clerkId = newClerkId;
    await existingUser.save();

    console.log("✅ Admin user Clerk ID updated successfully!");
    console.log("\n📋 User details:");
    console.log(`   Email: ${existingUser.email}`);
    console.log(`   Name: ${existingUser.firstName} ${existingUser.lastName}`);
    console.log(`   Role: ${existingUser.role}`);
    console.log(`   Clerk ID: ${existingUser.clerkId}`);
    console.log(`   Active: ${existingUser.isActive ? "Yes" : "No"}`);

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

updateClerkId();
