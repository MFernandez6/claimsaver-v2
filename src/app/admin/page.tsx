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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  FileText,
  TrendingUp,
  Clock,
  DollarSign,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Plus,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { claimsApi, usersApi, type Claim, type User } from "@/lib/api";

export default function AdminPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [claims, setClaims] = useState<Claim[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [refreshing, setRefreshing] = useState(false);

  // Load data from API
  const loadData = async () => {
    try {
      setError(null);
      setRefreshing(true);

      // Load claims
      const claimsResponse = await claimsApi.getClaims({
        status: statusFilter === "all" ? undefined : statusFilter,
        search: searchTerm || undefined,
        limit: 50,
      });

      if (claimsResponse.error) {
        throw new Error(claimsResponse.error);
      }

      // Load users
      const usersResponse = await usersApi.getUsers({
        limit: 50,
      });

      if (usersResponse.error) {
        throw new Error(usersResponse.error);
      }

      setClaims(claimsResponse.data || []);
      setUsers(usersResponse.data || []);
    } catch (err) {
      console.error("Error loading data:", err);
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Handle claim deletion
  const handleDeleteClaim = async (claimId: string) => {
    if (!confirm("Are you sure you want to delete this claim?")) {
      return;
    }

    try {
      const response = await claimsApi.deleteClaim(claimId);
      if (response.error) {
        throw new Error(response.error);
      }

      // Refresh data
      await loadData();
    } catch (err) {
      console.error("Error deleting claim:", err);
      setError(err instanceof Error ? err.message : "Failed to delete claim");
    }
  };

  // Handle user deletion
  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      const response = await usersApi.deleteUser(userId);
      if (response.error) {
        throw new Error(response.error);
      }

      // Refresh data
      await loadData();
    } catch (err) {
      console.error("Error deleting user:", err);
      setError(err instanceof Error ? err.message : "Failed to delete user");
    }
  };

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/");
      return;
    }

    if (isLoaded && user) {
      loadData();
    }
  }, [isLoaded, user, router]);

  // Reload data when filters change
  useEffect(() => {
    if (isLoaded && user) {
      loadData();
    }
  }, [searchTerm, statusFilter]);

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

  const stats = {
    totalClaims: claims.length,
    pendingClaims: claims.filter((c) => c.status === "pending").length,
    approvedClaims: claims.filter((c) => c.status === "approved").length,
    totalValue: claims.reduce((sum, c) => sum + c.estimatedValue, 0),
    totalUsers: users.length,
    activeUsers: users.filter((u) => u.isActive).length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-950 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-32 bg-gray-200 dark:bg-gray-700 rounded"
                ></div>
              ))}
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
                Admin Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage claims, users, and monitor system performance
              </p>
            </div>
            <Button
              onClick={loadData}
              disabled={refreshing}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw
                className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span className="text-red-800 dark:text-red-200">{error}</span>
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
                Active Users
              </CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.activeUsers}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                of {stats.totalUsers} total users
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Approval Rate
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalClaims > 0
                  ? Math.round((stats.approvedClaims / stats.totalClaims) * 100)
                  : 0}
                %
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {stats.approvedClaims} approved
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="claims">Claims Management</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Claims */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Recent Claims
                  </CardTitle>
                  <CardDescription>
                    Latest claim submissions and updates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {claims.slice(0, 5).map((claim) => (
                      <div
                        key={claim._id}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">
                              {claim.claimNumber}
                            </span>
                            <Badge
                              className={`text-xs ${getStatusColor(
                                claim.status
                              )}`}
                            >
                              {claim.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {claim.claimantName} •{" "}
                            {new Date(claim.accidentDate).toLocaleDateString()}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            router.push(`/admin/claims/${claim._id}`)
                          }
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription>Common administrative tasks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <Button className="h-20 flex flex-col items-center justify-center gap-2">
                      <FileText className="h-5 w-5" />
                      <span className="text-xs">New Claim</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-20 flex flex-col items-center justify-center gap-2"
                    >
                      <Users className="h-5 w-5" />
                      <span className="text-xs">Add User</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-20 flex flex-col items-center justify-center gap-2"
                    >
                      <Download className="h-5 w-5" />
                      <span className="text-xs">Export Data</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-20 flex flex-col items-center justify-center gap-2"
                    >
                      <TrendingUp className="h-5 w-5" />
                      <span className="text-xs">Analytics</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="claims" className="space-y-6">
            {/* Claims Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Claims Management</CardTitle>
                <CardDescription>
                  View and manage all claim submissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search claims..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="reviewing">Reviewing</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button>
                    <Filter className="h-4 w-4 mr-2" />
                    Advanced
                  </Button>
                </div>

                {/* Claims Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                          Claim #
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                          Claimant
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                          Status
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                          Priority
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                          Value
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                          Date
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {claims.map((claim) => (
                        <tr
                          key={claim._id}
                          className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                        >
                          <td className="py-3 px-4">
                            <span className="font-mono text-sm">
                              {claim.claimNumber}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div>
                              <div className="font-medium">
                                {claim.claimantName}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {claim.claimantEmail}
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge className={getStatusColor(claim.status)}>
                              {claim.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Badge className={getPriorityColor(claim.priority)}>
                              {claim.priority}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-medium">
                              ${claim.estimatedValue.toLocaleString()}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {new Date(
                                claim.accidentDate
                              ).toLocaleDateString()}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  router.push(`/admin/claims/${claim._id}`)
                                }
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  router.push(`/admin/claims/${claim._id}`)
                                }
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700"
                                onClick={() => handleDeleteClaim(claim._id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Manage user accounts and permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                          User
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                          Role
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                          Status
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                          Claims
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                          Last Login
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr
                          key={user._id}
                          className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                        >
                          <td className="py-3 px-4">
                            <div>
                              <div className="font-medium">
                                {user.firstName} {user.lastName}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {user.email}
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge
                              variant={
                                user.role === "admin" ? "default" : "secondary"
                              }
                            >
                              {user.role}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Badge
                              className={
                                user.isActive
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                              }
                            >
                              {user.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-medium">
                              {user.totalClaims}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {new Date(user.lastLogin).toLocaleDateString()}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700"
                                onClick={() => handleDeleteUser(user._id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
