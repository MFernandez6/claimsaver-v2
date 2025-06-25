import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function createUserIfMissing() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return null;
    }

    await dbConnect();

    // Check if user exists in our database
    const user = await User.findOne({ clerkId: userId }).lean();

    if (!user) {
      // User doesn't exist in our database, create them
      // We'll need to get user info from Clerk
      const clerkUser = await fetch(
        `https://api.clerk.com/v1/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
        }
      ).then((res) => res.json());

      if (clerkUser.id) {
        const email = clerkUser.email_addresses?.[0]?.email_address;
        const firstName = clerkUser.first_name || "Unknown";
        const lastName = clerkUser.last_name || "User";

        if (email) {
          // Create new user
          const newUser = new User({
            clerkId: userId,
            email: email,
            firstName: firstName,
            lastName: lastName,
            role: "user", // Default role
            isActive: true,
          });

          await newUser.save();
          console.log("Created missing user:", email);

          // Return the created user
          return newUser.toObject();
        }
      }
    }

    return user;
  } catch (error) {
    console.error("Error creating user if missing:", error);
    return null;
  }
}
