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

async function updateAdminEmail() {
  try {
    console.log("🔄 Updating admin email...\n");

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB\n");

    // Find the existing admin user
    const adminUser = await User.findOne({
      role: { $in: ["admin", "super_admin"] },
    });

    if (!adminUser) {
      console.log("❌ No admin user found in database");
      return;
    }

    console.log(`📧 Current admin email: ${adminUser.email}`);
    console.log(`🔄 Updating to: claimsaverplus@gmail.com\n`);

    // Update the email
    adminUser.email = "claimsaverplus@gmail.com";
    await adminUser.save();

    console.log("✅ Admin email updated successfully!");
    console.log("\n📋 To access admin dashboard:");
    console.log("   1. Sign in with email: claimsaverplus@gmail.com");
    console.log("   2. Go to /admin");
    console.log("   3. You should now have access to the admin panel\n");
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
}

updateAdminEmail();
