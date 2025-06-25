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
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", UserSchema);

async function updateClerkId() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    const email = "miguelfernandez023@gmail.com";
    const correctClerkId = "user_2yvryZyRrb2baqquAMltUUBQlv7";

    console.log(`Updating Clerk ID for user: ${email}`);

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      console.log(`User with email ${email} not found`);
      return;
    }

    console.log(`Found user: ${user.firstName} ${user.lastName}`);
    console.log(`Current Clerk ID: ${user.clerkId}`);
    console.log(`New Clerk ID: ${correctClerkId}`);

    // Update the Clerk ID
    user.clerkId = correctClerkId;
    await user.save();

    console.log(`Successfully updated Clerk ID for ${email}`);
  } catch (error) {
    console.error("Error updating Clerk ID:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

// Run the update
updateClerkId();
