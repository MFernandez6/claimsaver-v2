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

async function checkAuth() {
  try {
    console.log("🔍 Checking authentication and user setup...\n");

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB\n");

    // Check if admin user exists
    const adminUser = await User.findOne({
      role: { $in: ["admin", "super_admin"] },
    }).lean();

    if (adminUser) {
      console.log("👑 Admin user found:");
      console.log(`   Email: ${adminUser.email}`);
      console.log(`   Name: ${adminUser.firstName} ${adminUser.lastName}`);
      console.log(`   Role: ${adminUser.role}`);
      console.log(`   Clerk ID: ${adminUser.clerkId}`);
      console.log(`   Active: ${adminUser.isActive ? "Yes" : "No"}\n`);

      console.log("📋 To access admin dashboard:");
      console.log(`   1. Sign in with email: ${adminUser.email}`);
      console.log("   2. Go to /admin");
      console.log("   3. You should now have access to the admin panel\n");
    } else {
      console.log("❌ No admin user found in database\n");
      console.log("🔧 To create an admin user:");
      console.log("   1. Run: node scripts/setup-admin.js");
      console.log("   2. Sign up with email: claimsaverplus@gmail.com");
      console.log("   3. Access /admin\n");
    }

    // Check total users
    const totalUsers = await User.countDocuments();
    console.log(`📊 Total users in database: ${totalUsers}`);

    if (totalUsers > 0) {
      const users = await User.find()
        .select("email firstName lastName role isActive")
        .lean();
      console.log("\n👥 All users:");
      users.forEach((user, index) => {
        console.log(
          `   ${index + 1}. ${user.email} (${user.firstName} ${
            user.lastName
          }) - ${user.role} ${user.isActive ? "✅" : "❌"}`
        );
      });
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("\n🔌 Disconnected from MongoDB");
  }
}

checkAuth();
