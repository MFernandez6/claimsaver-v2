"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Plus,
  Clock,
  CheckCircle,
  AlertTriangle,
  DollarSign,
  User,
  Calendar,
  MapPin,
  Car,
  Loader2,
  RefreshCw,
} from "lucide-react";

interface UserClaim {
  _id: string;
  claimNumber: string;
  status: string;
  priority: string;
  claimantName: string;
  accidentDate: string;
  accidentLocation: string;
  estimatedValue: number;
  submittedAt: string;
  lastUpdated: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: string;
}

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [claims, setClaims] = useState<UserClaim[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingRole, setCheckingRole] = useState(true);

  // Check if user is admin
  useEffect(() => {
    async function checkAdminRole() {
      if (isLoaded && user) {
        try {
          // Check if the user's email is in the admin emails list
          const adminEmails = [
            "claimsaverplus@gmail.com",
            // Add more admin emails as needed
          ];

          const userEmail = user.primaryEmailAddress?.emailAddress;
          const adminStatus = adminEmails.includes(userEmail || "");
          setIsAdmin(adminStatus);

          // If user is admin, redirect to admin page
          if (adminStatus) {
            router.push("/admin");
            return;
          }
        } catch (error) {
          console.error("Error checking admin role:", error);
          setIsAdmin(false);
        } finally {
          setCheckingRole(false);
        }
      } else {
        setCheckingRole(false);
      }
    }

    checkAdminRole();
  }, [isLoaded, user, router]);

  const loadClaims = async () => {
    try {
      setError(null);
      setRefreshing(true);

      const response = await fetch("/api/claims");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load claims");
      }

      setClaims(data.claims || []);
    } catch (err) {
      console.error("Error loading claims:", err);
      setError(err instanceof Error ? err.message : "Failed to load claims");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/");
      return;
    }

    if (isLoaded && user && !isAdmin && !checkingRole) {
      loadClaims();
    }
  }, [isLoaded, user, router, isAdmin, checkingRole]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "reviewing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "in_progress":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "completed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "high":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "reviewing":
        return <AlertTriangle className="h-4 w-4" />;
      case "approved":
        return <CheckCircle className="h-4 w-4" />;
      case "rejected":
        return <AlertTriangle className="h-4 w-4" />;
      case "in_progress":
        return <Clock className="h-4 w-4" />;
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const stats = {
    totalClaims: claims.length,
    pendingClaims: claims.filter((c) => c.status === "pending").length,
    approvedClaims: claims.filter((c) => c.status === "approved").length,
    totalValue: claims.reduce((sum, c) => sum + c.estimatedValue, 0),
  };

  // Show loading while checking admin role or loading data
  if (!isLoaded || checkingRole || (isAdmin && loading)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-950 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8 pt-24">
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  // If user is admin, they should be redirected to admin page
  // This is a fallback in case the redirect didn't work
  if (isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-950 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8 pt-24">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                Redirecting to admin dashboard...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-950 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome back, {user?.firstName || "User"}!
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Track your claims and manage your accident recovery process
              </p>
            </div>
            <div className="flex gap-4">
              <Button
                onClick={loadClaims}
                disabled={refreshing}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RefreshCw
                  className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
              <Button
                onClick={() => router.push("/claim-form")}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Submit New Claim
              </Button>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Claims
              </CardTitle>
              <FileText className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalClaims}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                +{stats.pendingClaims} pending
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Value
              </CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                ${stats.totalValue.toLocaleString()}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Average: $
                {stats.totalClaims > 0
                  ? Math.round(
                      stats.totalValue / stats.totalClaims
                    ).toLocaleString()
                  : 0}
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Pending Claims
              </CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.pendingClaims}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Under review
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Approved Claims
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.approvedClaims}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Successfully processed
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Claims List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Your Claims
            </CardTitle>
            <CardDescription>
              Track the status of all your submitted claims
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : claims.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No claims yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Submit your first claim to get started with your accident
                  recovery process.
                </p>
                <Button onClick={() => router.push("/claim-form")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Submit Your First Claim
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {claims.map((claim) => (
                  <div
                    key={claim._id}
                    className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(claim.status)}
                          <span className="font-mono text-lg font-bold text-gray-900 dark:text-white">
                            {claim.claimNumber}
                          </span>
                        </div>
                        <Badge className={getStatusColor(claim.status)}>
                          {claim.status.replace("_", " ")}
                        </Badge>
                        <Badge className={getPriorityColor(claim.priority)}>
                          {claim.priority}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Submitted
                        </p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {new Date(claim.submittedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Accident Date
                          </p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {new Date(claim.accidentDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Location
                          </p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {claim.accidentLocation}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Car className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Vehicle
                          </p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {claim.vehicleYear} {claim.vehicleMake}{" "}
                            {claim.vehicleModel}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Estimated Value
                          </p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            ${claim.estimatedValue.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Last updated:{" "}
                        {new Date(claim.lastUpdated).toLocaleDateString()}
                      </p>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common actions for managing your claims
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  onClick={() => router.push("/claim-form")}
                  className="h-20 flex flex-col items-center justify-center gap-2"
                >
                  <Plus className="h-5 w-5" />
                  <span className="text-sm">Submit New Claim</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center gap-2"
                >
                  <FileText className="h-5 w-5" />
                  <span className="text-sm">Download Documents</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center gap-2"
                >
                  <User className="h-5 w-5" />
                  <span className="text-sm">Contact Support</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
