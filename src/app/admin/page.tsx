"use client";

import { useState, useEffect, useCallback } from "react";
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
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  AlertCircle,
  RefreshCw,
  Activity,
  BarChart3,
  Calendar,
} from "lucide-react";
import { claimsApi, usersApi, type Claim, type User } from "@/lib/api";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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
  const [newClaimsCount, setNewClaimsCount] = useState(0);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // Load data from API
  const loadData = useCallback(async () => {
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

      const newClaims = claimsResponse.data || [];
      const previousCount = claims.length;

      setClaims(newClaims);
      setUsers(usersResponse.data || []);

      // Check for new claims
      if (newClaims.length > previousCount) {
        setNewClaimsCount(newClaims.length - previousCount);
        // Auto-clear notification after 5 seconds
        setTimeout(() => setNewClaimsCount(0), 5000);
      }

      setLastRefresh(new Date());
    } catch (err) {
      console.error("Error loading data:", err);
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [statusFilter, searchTerm, claims.length]);

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

  // Handle claim status update
  const handleStatusUpdate = async (claimId: string, newStatus: string) => {
    try {
      const response = await claimsApi.updateClaim(claimId, {
        status: newStatus,
      });
      if (response.error) {
        throw new Error(response.error);
      }

      // Refresh data
      await loadData();
    } catch (err) {
      console.error("Error updating claim status:", err);
      setError(
        err instanceof Error ? err.message : "Failed to update claim status"
      );
    }
  };

  // Handle claim download
  const handleDownloadClaim = async (claim: Claim) => {
    try {
      // 1. Create a hidden iframe
      const iframe = document.createElement("iframe");
      iframe.style.position = "fixed";
      iframe.style.left = "-9999px";
      iframe.style.top = "0";
      iframe.style.width = "900px";
      iframe.style.height = "1200px";
      iframe.style.visibility = "hidden";
      document.body.appendChild(iframe);

      // 2. Write the PDF HTML into the iframe
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!doc) throw new Error("Could not access iframe document");
      doc.open();
      doc.write(`
        <html><head>
        <style>
          html, body { background: #fff !important; color: #000 !important; font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; }
          * { background: #fff !important; color: #000 !important; box-sizing: border-box; }
        </style>
        </head><body>
        <div style="padding: 40px;">
          <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #2563eb; padding-bottom: 20px;">
            <h1 style="color: #2563eb; font-size: 28px; margin: 0; font-weight: bold;">ClaimSaver+</h1>
            <h2 style="color: #374151; font-size: 20px; margin: 10px 0 0 0;">APPLICATION FOR FLORIDA "NO FAULT" BENEFITS</h2>
          </div>
          <div style="margin-bottom: 25px;">
            <h3 style="color: #2563eb; font-size: 16px; margin: 0 0 15px 0; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px;">Claim Information</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="width: 200px; font-weight: bold; padding: 8px 0; border-bottom: 1px solid #f3f4f6;">Claim Number:</td><td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">${
                claim.claimNumber
              }</td></tr>
              <tr><td style="font-weight: bold; padding: 8px 0; border-bottom: 1px solid #f3f4f6;">Status:</td><td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">${claim.status
                .replace("_", " ")
                .toUpperCase()}</td></tr>
              <tr><td style="font-weight: bold; padding: 8px 0; border-bottom: 1px solid #f3f4f6;">Priority:</td><td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">${claim.priority.toUpperCase()}</td></tr>
              <tr><td style="font-weight: bold; padding: 8px 0; border-bottom: 1px solid #f3f4f6;">Submitted Date:</td><td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">${new Date(
                claim.submittedAt
              ).toLocaleDateString()}</td></tr>
              <tr><td style="font-weight: bold; padding: 8px 0; border-bottom: 1px solid #f3f4f6;">Estimated Value:</td><td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">$${
                claim.estimatedValue?.toLocaleString() || "0"
              }</td></tr>
            </table>
          </div>
          <div style="margin-bottom: 25px;">
            <h3 style="color: #2563eb; font-size: 16px; margin: 0 0 15px 0; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px;">Claimant Information</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="width: 200px; font-weight: bold; padding: 8px 0; border-bottom: 1px solid #f3f4f6;">Name:</td><td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">${
                claim.claimantName || "Not provided"
              }</td></tr>
              <tr><td style="font-weight: bold; padding: 8px 0; border-bottom: 1px solid #f3f4f6;">Address:</td><td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">${
                claim.claimantAddress || "Not provided"
              }</td></tr>
              <tr><td style="font-weight: bold; padding: 8px 0; border-bottom: 1px solid #f3f4f6;">Phone (Home):</td><td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">${
                claim.claimantPhoneHome || "Not provided"
              }</td></tr>
              <tr><td style="font-weight: bold; padding: 8px 0; border-bottom: 1px solid #f3f4f6;">Phone (Business):</td><td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">${
                claim.claimantPhoneBusiness || "Not provided"
              }</td></tr>
              <tr><td style="font-weight: bold; padding: 8px 0; border-bottom: 1px solid #f3f4f6;">Date of Birth:</td><td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">${
                claim.claimantDOB || "Not provided"
              }</td></tr>
              <tr><td style="font-weight: bold; padding: 8px 0; border-bottom: 1px solid #f3f4f6;">SSN:</td><td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">${
                claim.claimantSSN || "Not provided"
              }</td></tr>
            </table>
          </div>
          <div style="margin-bottom: 25px;">
            <h3 style="color: #2563eb; font-size: 16px; margin: 0 0 15px 0; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px;">Insurance Information</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="width: 200px; font-weight: bold; padding: 8px 0; border-bottom: 1px solid #f3f4f6;">Insurance Company:</td><td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">${
                claim.insuranceCompany || "Not provided"
              }</td></tr>
              <tr><td style="font-weight: bold; padding: 8px 0; border-bottom: 1px solid #f3f4f6;">Policy Number:</td><td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">${
                claim.policyNumber || "Not provided"
              }</td></tr>
              <tr><td style="font-weight: bold; padding: 8px 0; border-bottom: 1px solid #f3f4f6;">File Number:</td><td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">${
                claim.fileNumber || "Not provided"
              }</td></tr>
              <tr><td style="font-weight: bold; padding: 8px 0; border-bottom: 1px solid #f3f4f6;">Adjuster Name:</td><td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">${
                claim.adjusterName || "Not provided"
              }</td></tr>
              <tr><td style="font-weight: bold; padding: 8px 0; border-bottom: 1px solid #f3f4f6;">Adjuster Phone:</td><td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">${
                claim.adjusterPhone || "Not provided"
              }</td></tr>
            </table>
          </div>
          <div style="margin-bottom: 25px;">
            <h3 style="color: #2563eb; font-size: 16px; margin: 0 0 15px 0; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px;">Accident Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="width: 200px; font-weight: bold; padding: 8px 0; border-bottom: 1px solid #f3f4f6;">Accident Date:</td><td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">${new Date(
                claim.accidentDate
              ).toLocaleDateString()}</td></tr>
              <tr><td style="font-weight: bold; padding: 8px 0; border-bottom: 1px solid #f3f4f6;">Accident Place:</td><td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">${
                claim.accidentPlace || "Not provided"
              }</td></tr>
              <tr><td style="font-weight: bold; padding: 8px 0; border-bottom: 1px solid #f3f4f6;">Your Vehicle:</td><td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">${
                claim.yourVehicle || "Not provided"
              }</td></tr>
              <tr><td style="font-weight: bold; padding: 8px 0; border-bottom: 1px solid #f3f4f6;">Family Vehicle:</td><td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">${
                claim.familyVehicle || "Not provided"
              }</td></tr>
              <tr><td style="font-weight: bold; padding: 8px 0; border-bottom: 1px solid #f3f4f6;">Injured:</td><td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">${
                claim.injured ? "Yes" : "No"
              }</td></tr>
            </table>
          </div>
          ${
            claim.accidentDescription
              ? `<div style="margin-bottom: 25px;"><h3 style="color: #2563eb; font-size: 16px; margin: 0 0 15px 0; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px;">Accident Description</h3><p style="margin: 0; padding: 10px; background-color: #f9fafb; border-radius: 4px; border-left: 4px solid #2563eb;">${claim.accidentDescription}</p></div>`
              : ""
          }
          ${
            claim.injured && claim.injuryDescription
              ? `<div style="margin-bottom: 25px;"><h3 style="color: #2563eb; font-size: 16px; margin: 0 0 15px 0; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px;">Injury Description</h3><p style="margin: 0; padding: 10px; background-color: #f9fafb; border-radius: 4px; border-left: 4px solid #dc2626;">${claim.injuryDescription}</p></div>`
              : ""
          }
          <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #2563eb; text-align: center; color: #6b7280; font-size: 10px;"><p style="margin: 0;">Generated by ClaimSaver+ on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p><p style="margin: 5px 0 0 0;">This document contains confidential information and should be handled accordingly.</p></div>
        </div>
        </body></html>
      `);
      doc.close();

      // 3. Wait for the iframe to load
      await new Promise((resolve) => setTimeout(resolve, 100));

      // 4. Use html2canvas on the iframe's document body
      const canvas = await html2canvas(
        iframe.contentDocument?.body as HTMLElement,
        {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#ffffff",
        }
      );

      // 5. Remove the iframe
      document.body.removeChild(iframe);

      // 6. Create PDF
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Download the PDF
      pdf.save(
        `claim-${claim.claimNumber}-${
          new Date().toISOString().split("T")[0]
        }.pdf`
      );
    } catch (err) {
      console.error("Error generating PDF:", err);
      setError("Failed to generate PDF");
    }
  };

  // Handle view claim
  const handleViewClaim = (claimId: string) => {
    router.push(`/admin/claims/${claimId}`);
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

  // Handle user editing
  const handleEditUser = (userId: string) => {
    router.push(`/admin/users/${userId}?edit=true`);
  };

  // Handle user viewing
  const handleViewUser = (userId: string) => {
    router.push(`/admin/users/${userId}`);
  };

  // Handle data export
  const handleExportData = () => {
    try {
      // Create CSV content
      const csvHeaders = [
        "Claim Number",
        "Claimant Name",
        "Status",
        "Priority",
        "Accident Date",
        "Estimated Value",
        "Submitted At",
      ].join(",");

      const csvRows = claims.map((claim) =>
        [
          claim.claimNumber,
          claim.claimantName,
          claim.status,
          claim.priority,
          new Date(claim.accidentDate).toLocaleDateString(),
          claim.estimatedValue || 0,
          new Date(claim.submittedAt).toLocaleDateString(),
        ].join(",")
      );

      const csvContent = [csvHeaders, ...csvRows].join("\n");

      // Create and download file
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `claims-export-${
        new Date().toISOString().split("T")[0]
      }.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error exporting data:", err);
      setError("Failed to export data");
    }
  };

  // Handle quick actions
  const handleQuickAction = (action: string) => {
    switch (action) {
      case "view":
        setActiveTab("claims");
        break;
      case "status":
        setActiveTab("claims");
        // Focus on status filter
        setTimeout(() => {
          const statusFilter = document.querySelector(
            "[data-radix-collection-item]"
          );
          if (statusFilter) {
            (statusFilter as HTMLElement).focus();
          }
        }, 100);
        break;
      case "notes":
        // Navigate to first claim for adding notes
        if (claims.length > 0) {
          router.push(`/admin/claims/${claims[0]._id}?action=notes`);
        }
        break;
      case "progress":
        // Navigate to first claim for tracking progress
        if (claims.length > 0) {
          router.push(`/admin/claims/${claims[0]._id}?action=progress`);
        }
        break;
    }
  };

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/");
      return;
    }

    if (isLoaded && user) {
      loadData();

      // Set up auto-refresh every 30 seconds
      const interval = setInterval(() => {
        loadData();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [isLoaded, user, router, loadData]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 dark:from-yellow-900/30 dark:to-orange-900/30 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800";
      case "reviewing":
        return "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 dark:from-blue-900/30 dark:to-indigo-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800";
      case "approved":
        return "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 dark:from-green-900/30 dark:to-emerald-900/30 dark:text-green-300 border border-green-200 dark:border-green-800";
      case "rejected":
        return "bg-gradient-to-r from-red-100 to-pink-100 text-red-800 dark:from-red-900/30 dark:to-pink-900/30 dark:text-red-300 border border-red-200 dark:border-red-800";
      case "in_progress":
        return "bg-gradient-to-r from-purple-100 to-violet-100 text-purple-800 dark:from-purple-900/30 dark:to-violet-900/30 dark:text-purple-300 border border-purple-200 dark:border-purple-800";
      case "completed":
        return "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 dark:from-gray-900/30 dark:to-slate-900/30 dark:text-gray-300 border border-gray-200 dark:border-gray-800";
      default:
        return "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 dark:from-gray-900/30 dark:to-slate-900/30 dark:text-gray-300 border border-gray-200 dark:border-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-gradient-to-r from-red-100 to-pink-100 text-red-800 dark:from-red-900/30 dark:to-pink-900/30 dark:text-red-300 border border-red-200 dark:border-red-800";
      case "high":
        return "bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 dark:from-orange-900/30 dark:to-red-900/30 dark:text-orange-300 border border-orange-200 dark:border-orange-800";
      case "medium":
        return "bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 dark:from-yellow-900/30 dark:to-orange-900/30 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800";
      case "low":
        return "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 dark:from-green-900/30 dark:to-emerald-900/30 dark:text-green-300 border border-green-200 dark:border-green-800";
      default:
        return "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 dark:from-gray-900/30 dark:to-slate-900/30 dark:text-gray-300 border border-gray-200 dark:border-gray-800";
    }
  };

  const stats = {
    totalClaims: claims.length,
    pendingClaims: claims.filter((c) => c.status === "pending").length,
    approvedClaims: claims.filter((c) => c.status === "approved").length,
    totalUsers: users.length,
    totalValue: claims.reduce((sum, c) => sum + (c.estimatedValue || 0), 0),
  };

  // Show loading while checking authentication
  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-950 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8 pt-24">
          <div className="flex items-center justify-center min-h-[400px]">
            <RefreshCw className="h-8 w-8 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950">
        {/* Background Image */}
        <div className="fixed inset-0 z-0">
          <img
            src="/images/long-logo-ClaimSaver.jpg"
            alt="ClaimSaver+ Background"
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/70 via-white/80 to-indigo-50/70 dark:from-gray-950/70 dark:via-gray-900/80 dark:to-blue-950/70"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Admin{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Dashboard
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto">
              Manage claims, users, and monitor the platform performance
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                size="lg"
                onClick={loadData}
                disabled={refreshing}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <RefreshCw
                  className={`mr-2 w-5 h-5 ${refreshing ? "animate-spin" : ""}`}
                />
                Refresh Data
              </Button>
              <Button
                size="lg"
                onClick={() => setActiveTab("claims")}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <FileText className="mr-2 w-5 h-5" />
                View All Claims
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleExportData}
                className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 dark:text-gray-300 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Download className="mr-2 w-5 h-5" />
                Export Data
              </Button>
            </div>

            {/* New Claims Notification */}
            {newClaimsCount > 0 && (
              <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-xl p-4 mb-6 animate-pulse">
                <div className="flex items-center justify-center gap-2 text-green-800 dark:text-green-200">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-semibold">
                    {newClaimsCount} new claim{newClaimsCount > 1 ? "s" : ""}{" "}
                    received!
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-white dark:bg-gray-950 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="fixed inset-0 z-0 opacity-15">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url('/images/logo-blue-black.png')`,
              backgroundSize: "300px 300px",
              backgroundRepeat: "repeat",
              backgroundPosition: "center",
              opacity: 0.15,
            }}
          ></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Platform{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Overview
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Monitor key metrics and platform performance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-16">
            <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {stats.totalClaims}
                </div>
                <p className="text-gray-600 dark:text-gray-300">Total Claims</p>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center text-white mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-6 h-6" />
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {stats.pendingClaims}
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  Pending Claims
                </p>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-white mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {stats.approvedClaims}
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  Approved Claims
                </p>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl flex items-center justify-center text-white mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-6 h-6" />
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {stats.totalUsers}
                </div>
                <p className="text-gray-600 dark:text-gray-300">Total Users</p>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center text-white mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  ${stats.totalValue.toLocaleString()}
                </div>
                <p className="text-gray-600 dark:text-gray-300">Total Value</p>
              </CardContent>
            </Card>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-8">
              <p className="text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="overview" className="text-lg font-semibold">
                Overview
              </TabsTrigger>
              <TabsTrigger value="claims" className="text-lg font-semibold">
                Claims
              </TabsTrigger>
              <TabsTrigger value="users" className="text-lg font-semibold">
                Users
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 backdrop-blur-sm">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                      <Activity className="w-5 h-5" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {claims.slice(0, 5).map((claim) => (
                        <div
                          key={claim._id}
                          className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                          onClick={() =>
                            router.push(`/admin/claims/${claim._id}`)
                          }
                        >
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {claim.claimNumber}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {claim.claimantName}
                            </p>
                          </div>
                          <Badge className={getStatusColor(claim.status)}>
                            {claim.status}
                          </Badge>
                        </div>
                      ))}
                      {claims.length > 5 && (
                        <div className="text-center pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setActiveTab("claims")}
                            className="text-blue-600 hover:text-blue-700 border-blue-200 hover:border-blue-300"
                          >
                            View All Claims ({claims.length})
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 backdrop-blur-sm">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                      <BarChart3 className="w-5 h-5" />
                      Quick Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-300">
                          Last Refresh:
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {lastRefresh.toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-300">
                          Auto-refresh:
                        </span>
                        <span className="font-medium text-green-600">
                          Active
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-300">
                          Platform Status:
                        </span>
                        <span className="font-medium text-green-600">
                          Online
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="claims" className="space-y-6">
              {/* Claims Info */}
              <Card className="group relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                        Claims Management
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                        View and manage all submitted claims. Click the eye icon
                        to view detailed information, edit status, add notes,
                        and track progress.
                      </p>
                      <div className="flex flex-wrap gap-2 text-xs">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleQuickAction("view")}
                          className="text-blue-600 border-blue-200 hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:border-blue-300 dark:hover:border-blue-700"
                        >
                          View Details
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleQuickAction("status")}
                          className="text-green-600 border-green-200 hover:bg-green-50 dark:hover:bg-green-950/50 hover:border-green-300 dark:hover:border-green-700"
                        >
                          Update Status
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleQuickAction("notes")}
                          className="text-purple-600 border-purple-200 hover:bg-purple-50 dark:hover:bg-purple-950/50 hover:border-purple-300 dark:hover:border-purple-700"
                        >
                          Add Notes
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleQuickAction("progress")}
                          className="text-orange-600 border-orange-200 hover:bg-orange-50 dark:hover:bg-orange-950/50 hover:border-orange-300 dark:hover:border-orange-700"
                        >
                          Track Progress
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Claims Filters */}
              <Card className="group relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <Filter className="w-5 h-5" />
                    Filters
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <Input
                        placeholder="Search claims..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full"
                      />
                    </div>
                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
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
                  </div>
                </CardContent>
              </Card>

              {/* Claims List */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {claims.length === 0 ? (
                  <div className="col-span-full">
                    <Card className="group relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 backdrop-blur-sm">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <CardContent className="p-12 text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-4">
                          <FileText className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                          No Claims Found
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                          {searchTerm || statusFilter !== "all"
                            ? "No claims match your current filters. Try adjusting your search criteria."
                            : "No claims have been submitted yet. Claims will appear here once users start filing them."}
                        </p>
                        {(searchTerm || statusFilter !== "all") && (
                          <Button
                            onClick={() => {
                              setSearchTerm("");
                              setStatusFilter("all");
                            }}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                          >
                            Clear Filters
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  claims.map((claim) => (
                    <Card
                      key={claim._id}
                      className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 backdrop-blur-sm"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between mb-2">
                          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                            {claim.claimNumber}
                          </CardTitle>
                          <div className="flex gap-2">
                            <Badge className={getStatusColor(claim.status)}>
                              {claim.status}
                            </Badge>
                            <Badge className={getPriorityColor(claim.priority)}>
                              {claim.priority}
                            </Badge>
                          </div>
                        </div>
                        <CardDescription className="text-gray-600 dark:text-gray-300">
                          Filed on{" "}
                          {new Date(claim.submittedAt).toLocaleDateString()}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                            <Users className="w-4 h-4" />
                            <span>{claim.claimantName}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                            <Clock className="w-4 h-4" />
                            <span>
                              Accident:{" "}
                              {new Date(
                                claim.accidentDate
                              ).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                            <DollarSign className="w-4 h-4" />
                            <span>
                              ${claim.estimatedValue?.toLocaleString() || "0"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleViewClaim(claim._id)}
                                className="hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:border-blue-300 dark:hover:border-blue-700 cursor-pointer z-10 relative"
                                aria-label={`View claim ${claim.claimNumber}`}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDownloadClaim(claim)}
                                className="hover:bg-green-50 dark:hover:bg-green-950/50 hover:border-green-300 dark:hover:border-green-700 cursor-pointer z-10 relative"
                                aria-label={`Download claim ${claim.claimNumber}`}
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                            </div>
                            <div className="flex gap-2">
                              <Select
                                value={claim.status}
                                onValueChange={(value) =>
                                  handleStatusUpdate(claim._id, value)
                                }
                              >
                                <SelectTrigger className="w-32 h-8 text-xs cursor-pointer z-10 relative">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">
                                    Pending
                                  </SelectItem>
                                  <SelectItem value="reviewing">
                                    Reviewing
                                  </SelectItem>
                                  <SelectItem value="approved">
                                    Approved
                                  </SelectItem>
                                  <SelectItem value="rejected">
                                    Rejected
                                  </SelectItem>
                                  <SelectItem value="in_progress">
                                    In Progress
                                  </SelectItem>
                                  <SelectItem value="completed">
                                    Completed
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteClaim(claim._id)}
                                className="hover:bg-red-600 hover:text-white cursor-pointer z-10 relative"
                                aria-label={`Delete claim ${claim.claimNumber}`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              {/* Users List */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {users.map((user) => (
                  <Card
                    key={user._id}
                    className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 backdrop-blur-sm"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between mb-2">
                        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                          {user.firstName} {user.lastName}
                        </CardTitle>
                        <Badge
                          className={
                            user.role === "admin"
                              ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                              : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                          }
                        >
                          {user.role}
                        </Badge>
                      </div>
                      <CardDescription className="text-gray-600 dark:text-gray-300">
                        {user.email}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                          <Calendar className="w-4 h-4" />
                          <span>
                            Last Login:{" "}
                            {new Date(user.lastLogin).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewUser(user._id)}
                              className="hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:border-blue-300 dark:hover:border-blue-700"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditUser(user._id)}
                              className="hover:bg-green-50 dark:hover:bg-green-950/50 hover:border-green-300 dark:hover:border-green-700"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteUser(user._id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}
