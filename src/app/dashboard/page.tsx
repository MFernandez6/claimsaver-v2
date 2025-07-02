"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
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
  Upload,
  Download,
  Eye,
  Folder,
  FileImage,
} from "lucide-react";
import ClaimDetail from "@/components/ClaimDetail";
import { Modal } from "@/components/ui/modal";
import { generateClaimPDF } from "@/utils/pdfGenerator";

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

interface Document {
  _id: string;
  name: string;
  category: string;
  subcategory: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
  claimId?: string;
  url: string;
  status: "pending" | "approved" | "rejected";
}

interface ClaimData {
  _id: string;
  claimNumber: string;
  status: string;
  priority: string;
  claimantName: string;
  claimantEmail: string;
  claimantPhone: string;
  claimantAddress: string;
  claimantDOB: string;
  accidentDate: string;
  accidentLocation: string;
  accidentDescription: string;
  estimatedValue: number;
  submittedAt: string;
  lastUpdated: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: string;
  licensePlate: string;
  insuranceCompany: string;
  policyNumber: string;
  policyHolder: string;
  adjusterName: string;
  adjusterPhone: string;
  fileNumber: string;
  injured: boolean;
  injuryDescription: string;
  treatedByDoctor: boolean;
  doctorName: string;
  doctorAddress: string;
  hospitalInpatient: boolean;
  hospitalOutpatient: boolean;
  hospitalName: string;
  hospitalAddress: string;
  medicalBillsToDate: string;
  inCourseOfEmployment: boolean;
  lostWages: boolean;
  wageLossToDate: string;
  averageWeeklyWage: string;
  disabilityStart: string;
  disabilityEnd: string;
  workersComp: boolean;
  workersCompAmount: string;
  otherExpenses: string;
  signature: string;
  signatureDate: string;
  // Insurance Authorization
  insuranceAuthInsuredName: string;
  insuranceAuthPolicyNumber: string;
  insuranceAuthInsuranceCompany: string;
  insuranceAuthDisclosureType: string;
  insuranceAuthExcludedInfo: string[];
  insuranceAuthDisclosureForm: string;
  insuranceAuthReasonForDisclosure: string;
  insuranceAuthRecipientName: string;
  insuranceAuthRecipientOrganization: string;
  insuranceAuthRecipientAddress: string;
  insuranceAuthDurationType: string;
  insuranceAuthStartDate: string;
  insuranceAuthEndDate: string;
  insuranceAuthEndEvent: string;
  insuranceAuthRevocationName: string;
  insuranceAuthRevocationOrganization: string;
  insuranceAuthRevocationAddress: string;
  insuranceAuthSignature: string;
  insuranceAuthSignatureDate: string;
  // HIPAA Authorization
  hipaaPatientName: string;
  hipaaHealthcareProvider: string;
  hipaaDisclosureType: string;
  hipaaExcludedInfo: string[];
  hipaaDisclosureForm: string;
  hipaaReasonForDisclosure: string;
  hipaaRecipientName: string;
  hipaaRecipientOrganization: string;
  hipaaRecipientAddress: string;
  hipaaDurationType: string;
  hipaaStartDate: string;
  hipaaEndDate: string;
  hipaaEndEvent: string;
  hipaaRevocationName: string;
  hipaaRevocationOrganization: string;
  hipaaRevocationAddress: string;
  hipaaSignature: string;
  hipaaSignatureDate: string;
  // OIR-B1-1571 Disclosure
  pipPatientName: string;
  pipPatientSignature: string;
  pipPatientDate: string;
  pipProviderName: string;
  pipProviderSignature: string;
  pipProviderDate: string;
}

const documentCategories = {
  medical: {
    label: "Medical Records",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    icon: FileText,
    subcategories: {
      bills: "Medical Bills",
      reports: "Medical Reports",
      prescriptions: "Prescriptions",
      therapy: "Physical Therapy",
    },
  },
  insurance: {
    label: "Insurance",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    icon: FileText,
    subcategories: {
      policy: "Insurance Policy",
      correspondence: "Correspondence",
      claims: "Claims Forms",
    },
  },
  accident: {
    label: "Accident Details",
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    icon: FileImage,
    subcategories: {
      photos: "Accident Photos",
      police: "Police Report",
      witness: "Witness Statements",
    },
  },
  vehicle: {
    label: "Vehicle",
    color:
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    icon: Car,
    subcategories: {
      damage: "Damage Photos",
      repair: "Repair Estimates",
      registration: "Registration",
    },
  },
  employment: {
    label: "Employment",
    color:
      "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    icon: FileText,
    subcategories: {
      wages: "Wage Loss",
      employment: "Employment Records",
      benefits: "Benefits Information",
    },
  },
  legal: {
    label: "Legal Documents",
    color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
    icon: FileText,
    subcategories: {
      contracts: "Contracts",
      agreements: "Agreements",
      correspondence: "Legal Correspondence",
    },
  },
};

export default function DashboardPage() {
  const { t } = useTranslation();
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [claims, setClaims] = useState<UserClaim[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingRole, setCheckingRole] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedClaimFull, setSelectedClaimFull] = useState<ClaimData | null>(
    null
  );
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Mock documents data for demonstration
  const mockDocuments: Document[] = [
    {
      _id: "1",
      name: "Medical Bill - Emergency Room",
      category: "medical",
      subcategory: "bills",
      fileType: "pdf",
      fileSize: 245760,
      uploadedAt: "2024-01-15T10:30:00Z",
      claimId: "claim-001",
      url: "#",
      status: "approved",
    },
    {
      _id: "2",
      name: "Police Report",
      category: "accident",
      subcategory: "police",
      fileType: "pdf",
      fileSize: 512000,
      uploadedAt: "2024-01-14T15:45:00Z",
      claimId: "claim-001",
      url: "#",
      status: "approved",
    },
    {
      _id: "3",
      name: "Vehicle Damage Photos",
      category: "vehicle",
      subcategory: "damage",
      fileType: "jpg",
      fileSize: 1024000,
      uploadedAt: "2024-01-13T09:20:00Z",
      claimId: "claim-001",
      url: "#",
      status: "pending",
    },
    {
      _id: "4",
      name: "Insurance Policy",
      category: "insurance",
      subcategory: "policy",
      fileType: "pdf",
      fileSize: 1536000,
      uploadedAt: "2024-01-12T14:15:00Z",
      claimId: "claim-001",
      url: "#",
      status: "approved",
    },
    {
      _id: "5",
      name: "Wage Loss Statement",
      category: "employment",
      subcategory: "wages",
      fileType: "pdf",
      fileSize: 307200,
      uploadedAt: "2024-01-11T11:30:00Z",
      claimId: "claim-001",
      url: "#",
      status: "pending",
    },
  ];

  // Load mock documents on component mount
  useEffect(() => {
    setDocuments(mockDocuments);
  }, []);

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
        throw new Error(data.error || t("dashboard.errors.loadFailed"));
      }

      setClaims(data.claims || []);
    } catch (err) {
      console.error("Error loading claims:", err);
      setError(
        err instanceof Error ? err.message : t("dashboard.errors.loadFailed")
      );
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

  const stats = {
    totalClaims: claims.length,
    pendingClaims: claims.filter((c) => c.status === "pending").length,
    approvedClaims: claims.filter((c) => c.status === "approved").length,
    totalValue: claims.reduce((sum, c) => sum + c.estimatedValue, 0),
  };

  // Document management functions
  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case "pdf":
        return <FileText className="w-4 h-4" />;
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return <FileImage className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

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

  // Fetch full claim for modal
  const handleViewClaim = async (claimId: string) => {
    setModalOpen(true);
    setModalLoading(true);
    setModalError(null);
    setSelectedClaimFull(null);
    try {
      const response = await fetch(`/api/claims/${claimId}`);
      if (!response.ok) {
        let errorMessage = "Failed to load claim details";

        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.details || errorMessage;
        } catch {
          // If we can't parse JSON, it might be an HTML error page
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
        }

        setModalError(errorMessage);
        return;
      }
      const data = await response.json();
      setSelectedClaimFull(data);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load claim details";
      setModalError(errorMessage);
    } finally {
      setModalLoading(false);
    }
  };

  // Download claim document
  const handleDownloadClaim = async (claimId: string, claimNumber: string) => {
    setDownloadingId(claimId);
    try {
      const response = await fetch(`/api/claims/${claimId}`);

      if (!response.ok) {
        let errorMessage = "Failed to download claim";

        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.details || errorMessage;
        } catch {
          // If we can't parse JSON, it might be an HTML error page
          console.error(
            "Response is not JSON:",
            response.status,
            response.statusText
          );
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
        }

        console.error("Download error:", errorMessage);
        alert(errorMessage);
        return;
      }

      const claim = await response.json();

      // Generate PDF
      const pdfBlob = await generateClaimPDF(claim);

      // Create download link
      const url = window.URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `claim-${claimNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      alert(`Failed to download claim PDF: ${errorMessage}`);
    } finally {
      setDownloadingId(null);
    }
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
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-20">
      {/* Modal for claim view */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Claim Details"
      >
        {modalLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : modalError ? (
          <div className="text-red-600 text-center py-8">{modalError}</div>
        ) : selectedClaimFull ? (
          <ClaimDetail claim={selectedClaimFull} />
        ) : null}
      </Modal>
      {/* Compact Header */}
      <section className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {t("dashboard.hero.title")}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Welcome back,{" "}
                  {user?.firstName || user?.emailAddresses[0]?.emailAddress}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => router.push("/claim-form")}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                <Plus className="mr-2 w-4 h-4" />
                {t("dashboard.hero.newClaim")}
              </Button>
              <Button
                variant="outline"
                onClick={loadClaims}
                disabled={refreshing}
                className="border-gray-300 hover:border-gray-400"
              >
                <RefreshCw
                  className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
                />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Real-time Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="bg-white dark:bg-gray-900 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    {t("dashboard.stats.totalClaims")}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.totalClaims}
                  </p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-900 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    {t("dashboard.stats.pendingClaims")}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.pendingClaims}
                  </p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-900 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    {t("dashboard.stats.approvedClaims")}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.approvedClaims}
                  </p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-900 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    {t("dashboard.stats.totalValue")}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${stats.totalValue.toLocaleString()}
                  </p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-violet-500 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Claims Section - Left Column */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border-0">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {t("dashboard.claims.title")}
                </h2>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <span>Last updated:</span>
                  <span>{new Date().toLocaleTimeString()}</span>
                </div>
              </div>
            </div>

            <div className="p-6">
              {error && (
                <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
                  <p className="text-red-800 dark:text-red-200">{error}</p>
                </div>
              )}

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="flex items-center gap-3">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span className="text-gray-600 dark:text-gray-400">
                      Loading claims...
                    </span>
                  </div>
                </div>
              ) : claims.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {t("dashboard.claims.noClaims.title")}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">
                    {t("dashboard.claims.noClaims.description")}
                  </p>
                  <Button
                    onClick={() => router.push("/claim-form")}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Plus className="mr-2 w-4 h-4" />
                    {t("dashboard.claims.noClaims.button")}
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {claims.map((claim) => (
                    <Card
                      key={claim._id}
                      className="border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-200 hover:shadow-sm"
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-md flex items-center justify-center flex-shrink-0">
                              <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {claim.claimNumber}
                              </h4>
                              <div className="flex items-center gap-2 mt-0.5">
                                <Badge className={getStatusColor(claim.status)}>
                                  {getStatusIcon(claim.status)}
                                  <span className="ml-1 capitalize text-xs">
                                    {claim.status.replace("_", " ")}
                                  </span>
                                </Badge>
                                <Badge
                                  className={getPriorityColor(claim.priority)}
                                >
                                  <span className="text-xs">
                                    {claim.priority}
                                  </span>
                                </Badge>
                              </div>
                              <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                                <span className="flex items-center gap-1">
                                  <User className="w-3 h-3" />
                                  {claim.claimantName}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {new Date(
                                    claim.accidentDate
                                  ).toLocaleDateString()}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {claim.accidentLocation}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-xs text-gray-600 dark:text-gray-400">
                                  Est. Value:
                                </span>
                                <span className="text-xs font-semibold text-gray-900 dark:text-white">
                                  ${claim.estimatedValue.toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewClaim(claim._id)}
                              className="h-7 w-7 p-0"
                              title="View Claim"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleDownloadClaim(
                                  claim._id,
                                  claim.claimNumber
                                )
                              }
                              className="h-7 w-7 p-0"
                              title="Download Claim"
                              disabled={downloadingId === claim._id}
                            >
                              {downloadingId === claim._id ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Download className="w-3.5 h-3.5" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Document Repository - Right Column */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border-0">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Document Repository
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-300 hover:border-gray-400"
                >
                  <Upload className="mr-2 w-4 h-4" />
                  Upload Document
                </Button>
              </div>
            </div>

            <div className="p-6">
              {/* Category Filter */}
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  <Badge
                    className={`cursor-pointer ${
                      selectedCategory === "all"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                        : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                    }`}
                    onClick={() => setSelectedCategory("all")}
                  >
                    All Documents
                  </Badge>
                  {Object.entries(documentCategories).map(([key, category]) => (
                    <Badge
                      key={key}
                      className={`cursor-pointer ${
                        selectedCategory === key
                          ? category.color
                          : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                      }`}
                      onClick={() => setSelectedCategory(key)}
                    >
                      {category.label}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Documents List */}
              <div className="space-y-2">
                {documents
                  .filter(
                    (doc) =>
                      selectedCategory === "all" ||
                      doc.category === selectedCategory
                  )
                  .map((document) => {
                    const category =
                      documentCategories[
                        document.category as keyof typeof documentCategories
                      ];
                    const subcategory =
                      category?.subcategories[
                        document.subcategory as keyof typeof category.subcategories
                      ];

                    return (
                      <Card
                        key={document._id}
                        className="border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-200 hover:shadow-sm"
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center flex-shrink-0">
                                {getFileIcon(document.fileType)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                  {document.name}
                                </h4>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <Badge
                                    className={`text-xs px-2 py-0.5 ${
                                      category?.color ||
                                      "bg-gray-100 text-gray-600"
                                    }`}
                                  >
                                    {category?.label}
                                  </Badge>
                                  {subcategory && (
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                      {subcategory}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                                  <span>
                                    {formatFileSize(document.fileSize)}
                                  </span>
                                  <span>
                                    {new Date(
                                      document.uploadedAt
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0"
                                title="View Document"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0"
                                title="Download Document"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
              </div>

              {documents.filter(
                (doc) =>
                  selectedCategory === "all" ||
                  doc.category === selectedCategory
              ).length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Folder className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No Documents Found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">
                    Upload your first document to get started with your claim.
                  </p>
                  <Button
                    variant="outline"
                    className="border-gray-300 hover:border-gray-400"
                  >
                    <Upload className="mr-2 w-4 h-4" />
                    Upload Document
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
