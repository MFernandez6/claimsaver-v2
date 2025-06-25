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

async function createCurrentUser() {
  try {
    console.log("🔍 Creating user record for current user...\n");

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB\n");

    // Get user details from command line arguments
    const clerkId = process.argv[2];
    const email = process.argv[3] || "claimsaverplus@gmail.com";
    const firstName = process.argv[4] || "Admin";
    const lastName = process.argv[5] || "User";
    const role = process.argv[6] || "admin";

    if (!clerkId) {
      console.log("❌ Please provide your Clerk user ID as the first argument");
      console.log(
        "   Usage: node scripts/create-current-user.js <clerk-id> [email] [firstName] [lastName] [role]"
      );
      console.log(
        "   Example: node scripts/create-current-user.js user_2abc123 claimsaverplus@gmail.com Admin User admin"
      );
      return;
    }

    console.log(`📝 Creating user with details:`);
    console.log(`   Clerk ID: ${clerkId}`);
    console.log(`   Email: ${email}`);
    console.log(`   Name: ${firstName} ${lastName}`);
    console.log(`   Role: ${role}\n`);

    // Check if user already exists
    const existingUser = await User.findOne({ clerkId });

    if (existingUser) {
      console.log("⚠️  User already exists, updating...");
      existingUser.email = email;
      existingUser.firstName = firstName;
      existingUser.lastName = lastName;
      existingUser.role = role;
      await existingUser.save();
      console.log("✅ User updated successfully!");
    } else {
      // Create new user
      const user = new User({
        clerkId,
        email,
        firstName,
        lastName,
        role,
        isActive: true,
      });

      await user.save();
      console.log("✅ User created successfully!");
    }

    console.log("\n📋 You can now:");
    console.log("   1. Sign in to your app");
    console.log("   2. Access the admin dashboard at /admin");
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("\n🔌 Disconnected from MongoDB");
  }
}

createCurrentUser();
