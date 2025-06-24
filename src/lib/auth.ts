import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";

interface UserDocument {
  _id: string;
  clerkId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  adminPermissions?: Record<string, boolean>;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  lastLogin?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export async function getCurrentUser(): Promise<UserDocument | null> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return null;
    }

    await dbConnect();

    const user = await User.findOne({ clerkId: userId }).lean();
    return user as UserDocument | null;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

export async function isAdmin(): Promise<boolean> {
  try {
    const user = await getCurrentUser();
    return user?.role === "admin" || user?.role === "super_admin";
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}

export async function hasPermission(permission: string): Promise<boolean> {
  try {
    const user = await getCurrentUser();

    if (!user) return false;

    // Super admin has all permissions
    if (user.role === "super_admin") return true;

    // Check specific permission
    return user.adminPermissions?.[permission] || false;
  } catch (error) {
    console.error("Error checking permission:", error);
    return false;
  }
}

interface UserData {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
}

export async function createOrUpdateUser(clerkId: string, userData: UserData) {
  try {
    await dbConnect();

    const existingUser = await User.findOne({ clerkId });

    if (existingUser) {
      // Update existing user
      const updatedUser = await User.findOneAndUpdate(
        { clerkId },
        { ...userData, lastLogin: new Date() },
        { new: true }
      );
      return updatedUser;
    } else {
      // Create new user
      const newUser = new User({
        clerkId,
        ...userData,
        role: "user", // Default role
        isActive: true,
        adminPermissions: {
          canViewClaims: false,
          canEditClaims: false,
          canDeleteClaims: false,
          canManageUsers: false,
          canViewAnalytics: false,
        },
        stats: {
          totalClaims: 0,
          activeClaims: 0,
          completedClaims: 0,
          totalSettlements: 0,
        },
      });

      await newUser.save();
      return newUser;
    }
  } catch (error) {
    console.error("Error creating/updating user:", error);
    throw error;
  }
}
