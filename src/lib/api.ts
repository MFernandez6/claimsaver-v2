// API service layer for admin functionality

export interface Claim {
  _id: string;
  claimNumber: string;
  status: string;
  priority: string;
  claimantName: string;
  claimantEmail: string;
  claimantPhone: string;
  accidentDate: string;
  accidentLocation: string;
  accidentDescription: string;
  insuranceCompany: string;
  policyNumber: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: string;
  licensePlate: string;
  estimatedValue: number;
  settlementAmount: number;
  assignedTo: string;
  notes: Array<{
    content: string;
    author: string;
    timestamp: string;
  }>;
  submittedAt: string;
  lastUpdated: string;
}

export interface User {
  _id: string;
  clerkId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  totalClaims: number;
  lastLogin: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Claims API
export const claimsApi = {
  async getClaims(params?: {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<Claim[]>> {
    try {
      const searchParams = new URLSearchParams();
      if (params?.status) searchParams.append("status", params.status);
      if (params?.search) searchParams.append("search", params.search);
      if (params?.page) searchParams.append("page", params.page.toString());
      if (params?.limit) searchParams.append("limit", params.limit.toString());

      const url = `/api/admin/claims?${searchParams}`;
      console.log("🔗 Fetching claims from:", url);

      const response = await fetch(url);
      const data = await response.json();

      console.log("📋 Raw API response:", data);
      console.log("📋 Response status:", response.status);

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch claims");
      }

      return data;
    } catch (error) {
      console.error("Error fetching claims:", error);
      return {
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },

  async getClaim(id: string): Promise<ApiResponse<Claim>> {
    try {
      const response = await fetch(`/api/admin/claims/${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch claim");
      }

      return data;
    } catch (error) {
      console.error("Error fetching claim:", error);
      return {
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },

  async createClaim(claimData: Partial<Claim>): Promise<ApiResponse<Claim>> {
    try {
      const response = await fetch("/api/admin/claims", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(claimData),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create claim");
      }

      return data;
    } catch (error) {
      console.error("Error creating claim:", error);
      return {
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },

  async updateClaim(
    id: string,
    claimData: Partial<Claim>
  ): Promise<ApiResponse<Claim>> {
    try {
      const response = await fetch(`/api/admin/claims/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(claimData),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update claim");
      }

      return data;
    } catch (error) {
      console.error("Error updating claim:", error);
      return {
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },

  async deleteClaim(id: string): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await fetch(`/api/admin/claims/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete claim");
      }

      return data;
    } catch (error) {
      console.error("Error deleting claim:", error);
      return {
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
};

// Users API
export const usersApi = {
  async getUsers(params?: {
    role?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<User[]>> {
    try {
      const searchParams = new URLSearchParams();
      if (params?.role) searchParams.append("role", params.role);
      if (params?.search) searchParams.append("search", params.search);
      if (params?.page) searchParams.append("page", params.page.toString());
      if (params?.limit) searchParams.append("limit", params.limit.toString());

      const url = `/api/admin/users?${searchParams}`;
      console.log("🔗 Fetching users from:", url);

      const response = await fetch(url);
      const data = await response.json();

      console.log("👥 Raw API response:", data);
      console.log("👥 Response status:", response.status);

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch users");
      }

      return data;
    } catch (error) {
      console.error("Error fetching users:", error);
      return {
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },

  async getUser(id: string): Promise<ApiResponse<User>> {
    try {
      const response = await fetch(`/api/admin/users/${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch user");
      }

      return data;
    } catch (error) {
      console.error("Error fetching user:", error);
      return {
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },

  async createUser(userData: Partial<User>): Promise<ApiResponse<User>> {
    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create user");
      }

      return data;
    } catch (error) {
      console.error("Error creating user:", error);
      return {
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },

  async updateUser(
    id: string,
    userData: Partial<User>
  ): Promise<ApiResponse<User>> {
    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update user");
      }

      return data;
    } catch (error) {
      console.error("Error updating user:", error);
      return {
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },

  async deleteUser(id: string): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete user");
      }

      return data;
    } catch (error) {
      console.error("Error deleting user:", error);
      return {
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
};
