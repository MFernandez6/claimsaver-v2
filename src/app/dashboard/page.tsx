"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  FileText,
  Plus,
  Clock,
  CheckCircle,
  AlertTriangle,
  DollarSign,
  Calendar,
  MapPin,
  Loader2,
  Upload,
  Download,
  Eye,
  Folder,
  Trash2,
  PlusCircle,
  Shield,
  MapPinIcon,
  Zap,
  Share2,
  Stethoscope,
  TrendingUp,
  ClipboardList,
} from "lucide-react";
import ClaimDetail from "@/components/ClaimDetail";
import { Modal } from "@/components/ui/modal";
import { generateClaimPDF } from "@/utils/pdfGenerator";
import DocumentUploadModal from "@/components/DocumentUploadModal";
import DocumentPreviewModal from "@/components/DocumentPreviewModal";
import DocumentShareModal from "@/components/DocumentShareModal";

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
  type: string;
  fileType: string;
  size: string;
  uploadDate: string;
  description: string;
  url: string;
  fileName: string;
  mimeType: string;
  createdAt: string;
  updatedAt: string;
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

interface UpcomingEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: "appointment" | "deadline" | "follow-up" | "payment" | "custom";
  description: string;
  priority: "low" | "medium" | "high";
  completed: boolean;
}

interface PolicyLimits {
  bodilyInjury: {
    perPerson: number;
    perAccident: number;
  };
  propertyDamage: number;
  personalInjuryProtection: number;
  uninsuredMotorist: {
    perPerson: number;
    perAccident: number;
  };
  collision: number;
  comprehensive: number;
}

const claimsJourneySteps = [
  {
    id: 1,
    title: "Get Your Police Report",
    description:
      "We'll help you obtain the official police report from your accident",
    icon: FileText,
    status: "pending" as const,
    estimatedDays: 7,
    required: true,
  },
  {
    id: 2,
    title: "Start Your Claim",
    description: "Let's file your initial claim with the insurance company",
    icon: Upload,
    status: "pending" as const,
    estimatedDays: 1,
    required: true,
  },
  {
    id: 3,
    title: "See Your Doctor",
    description: "Get your medical evaluation and treatment plan in place",
    icon: Stethoscope,
    status: "pending" as const,
    estimatedDays: 3,
    required: true,
  },
  {
    id: 4,
    title: "Begin Your Recovery",
    description: "Start your physical therapy and recovery journey",
    icon: TrendingUp,
    status: "pending" as const,
    estimatedDays: 30,
    required: false,
  },
  {
    id: 5,
    title: "Follow Your Treatment Plan",
    description:
      "Stay on track with your doctor's recommendations and medications",
    icon: CheckCircle,
    status: "pending" as const,
    estimatedDays: 60,
    required: true,
  },
  {
    id: 6,
    title: "Gather Your Documents",
    description:
      "We'll help you compile all your medical records and claims paperwork",
    icon: ClipboardList,
    status: "pending" as const,
    estimatedDays: 5,
    required: true,
  },
  {
    id: 7,
    title: "Get Your Settlement",
    description:
      "We'll work with the insurance company to get you the best possible outcome",
    icon: DollarSign,
    status: "pending" as const,
    estimatedDays: 45,
    required: true,
  },
];

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [claims, setClaims] = useState<UserClaim[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClaim, setSelectedClaim] = useState<ClaimData | null>(null);
  const [showClaimDetail, setShowClaimDetail] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null
  );
  const [checkingRole, setCheckingRole] = useState(true);
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([
    {
      id: "1",
      title: "Doctor's Follow-up Appointment",
      date: "2024-01-15",
      time: "10:00 AM",
      type: "appointment",
      description: "Follow-up with Dr. Smith regarding treatment progress",
      priority: "high",
      completed: false,
    },
    {
      id: "2",
      title: "Submit Medical Records Deadline",
      date: "2024-01-20",
      time: "5:00 PM",
      type: "deadline",
      description: "Deadline to submit all medical records to insurance",
      priority: "high",
      completed: false,
    },
    {
      id: "3",
      title: "Physical Therapy Session",
      date: "2024-01-12",
      time: "2:00 PM",
      type: "appointment",
      description: "Weekly physical therapy session",
      priority: "medium",
      completed: false,
    },
  ]);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    time: "",
    type: "appointment" as const,
    description: "",
    priority: "medium" as const,
  });
  const [policyLimits, setPolicyLimits] = useState<PolicyLimits>({
    bodilyInjury: {
      perPerson: 25000,
      perAccident: 50000,
    },
    propertyDamage: 10000,
    personalInjuryProtection: 10000,
    uninsuredMotorist: {
      perPerson: 25000,
      perAccident: 50000,
    },
    collision: 500,
    comprehensive: 500,
  });

  const [journeySteps, setJourneySteps] = useState(claimsJourneySteps);

  const toggleStepCompletion = (stepId: number) => {
    setJourneySteps((prevSteps) =>
      prevSteps.map((step) =>
        step.id === stepId
          ? {
              ...step,
              status: step.status === "completed" ? "pending" : "completed",
            }
          : step
      )
    );
  };

  useEffect(() => {
    if (isLoaded && user) {
      setCheckingRole(false);
    } else {
      setCheckingRole(false);
    }
  }, [isLoaded, user]);

  useEffect(() => {
    if (!isLoaded) return;

    if (!user) {
      router.push("/");
      return;
    }

    loadClaims();
    loadDocuments();
  }, [isLoaded, user, router]);

  const loadClaims = async () => {
    try {
      const response = await fetch("/api/claims");
      if (response.ok) {
        const data = await response.json();
        setClaims(data.claims || []);
      }
    } catch (error) {
      console.error("Error loading claims:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadDocuments = async () => {
    try {
      const response = await fetch("/api/documents");
      if (response.ok) {
        const data = await response.json();
        setDocuments(data || []);
      }
    } catch (error) {
      console.error("Error loading documents:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "in progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "overdue":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "in progress":
        return <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />;
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case "overdue":
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const handleViewClaim = async (claimId: string) => {
    try {
      const response = await fetch(`/api/claims/${claimId}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedClaim(data);
        setShowClaimDetail(true);
      }
    } catch (error) {
      console.error("Error loading claim details:", error);
    }
  };

  const handleDownloadClaim = async (claimId: string, claimNumber: string) => {
    try {
      const response = await fetch(`/api/claims/${claimId}`);
      if (response.ok) {
        const data = await response.json();
        const pdfBlob = await generateClaimPDF(data);
        const url = window.URL.createObjectURL(pdfBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `claim-${claimNumber}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Error downloading claim:", error);
    }
  };

  const handleViewDocument = (doc: Document) => {
    setSelectedDocument(doc);
    setShowPreviewModal(true);
  };

  const handleShareDocument = (doc: Document) => {
    setSelectedDocument(doc);
    setShowShareModal(true);
  };

  const handleDeleteDocument = async (documentId: string) => {
    if (!confirm("Are you sure you want to delete this document?")) return;

    try {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setDocuments(documents.filter((doc) => doc._id !== documentId));
      }
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  const handleUploadSuccess = () => {
    loadDocuments();
    setShowUploadModal(false);
  };

  const handleViewMostRecentClaim = async () => {
    if (claims.length > 0) {
      // Get the most recent claim (first in the array since they're sorted by date)
      const mostRecentClaim = claims[0];
      await handleViewClaim(mostRecentClaim._id);
    }
  };

  const addEvent = () => {
    if (!newEvent.title || !newEvent.date) return;

    const event: UpcomingEvent = {
      id: Date.now().toString(),
      title: newEvent.title,
      date: newEvent.date,
      time: newEvent.time,
      type: newEvent.type,
      description: newEvent.description,
      priority: newEvent.priority,
      completed: false,
    };

    setUpcomingEvents([...upcomingEvents, event]);
    setNewEvent({
      title: "",
      date: "",
      time: "",
      type: "appointment",
      description: "",
      priority: "medium",
    });
    setShowAddEvent(false);
  };

  const toggleEventComplete = (eventId: string) => {
    setUpcomingEvents(
      upcomingEvents.map((event) =>
        event.id === eventId ? { ...event, completed: !event.completed } : event
      )
    );
  };

  const deleteEvent = (eventId: string) => {
    setUpcomingEvents(upcomingEvents.filter((event) => event.id !== eventId));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (!isLoaded || checkingRole) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user.firstName || "User"}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your claims journey and stay organized with important events.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Claims Journey Steps */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-blue-950">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-900 dark:text-white">
                  <MapPinIcon className="w-6 h-6 text-blue-600" />
                  Your Claims Journey
                </CardTitle>
                <p className="text-gray-600 dark:text-gray-400">
                  Click the checkmarks to track your progress
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {journeySteps.map((step, index) => (
                    <div
                      key={step.id}
                      className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <button
                        onClick={() => toggleStepCompletion(step.id)}
                        className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-bold hover:scale-110 transition-transform duration-200 cursor-pointer"
                        title="Click to mark as complete"
                      >
                        {step.status === "completed" ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          step.id
                        )}
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <step.icon className="w-4 h-4 text-blue-600" />
                          <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                            {step.title}
                          </h3>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-xs">
                          {step.description}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <Badge
                          className={`text-xs ${getStatusColor(step.status)}`}
                        >
                          {step.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Existing Claims Section */}
            {claims.length > 0 && (
              <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
                    <Folder className="w-5 h-5 text-gray-600" />
                    Your Claims ({claims.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {claims.map((claim) => (
                      <div
                        key={claim._id}
                        className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-md transition-all duration-300"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              Claim #{claim.claimNumber}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {claim.claimantName}
                            </p>
                          </div>
                          <Badge className={getStatusColor(claim.status)}>
                            {claim.status}
                          </Badge>
                        </div>
                        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {new Date(
                                claim.accidentDate
                              ).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>{claim.accidentLocation}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4" />
                            <span>{formatCurrency(claim.estimatedValue)}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button
                            size="sm"
                            onClick={() => handleViewClaim(claim._id)}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleDownloadClaim(claim._id, claim.claimNumber)
                            }
                            className="border-blue-300 text-blue-600 hover:bg-blue-50 dark:border-blue-600 dark:text-blue-400 dark:hover:bg-blue-950/30"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Document Repository */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-orange-50 dark:from-gray-900 dark:to-orange-950 mt-6">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-lg font-bold text-gray-900 dark:text-white">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-orange-600" />
                    Document Repository ({documents.length})
                  </div>
                  <Button
                    size="sm"
                    onClick={() => setShowUploadModal(true)}
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    <Upload className="w-4 h-4 mr-1" />
                    Upload
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {documents.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      No documents uploaded yet
                    </p>
                    <Button
                      onClick={() => setShowUploadModal(true)}
                      className="bg-orange-600 hover:bg-orange-700 text-white"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Your First Document
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {documents.slice(0, 5).map((doc) => (
                      <div
                        key={doc._id}
                        className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-md transition-all duration-300"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-700 rounded-lg flex items-center justify-center text-white">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 dark:text-white text-sm truncate">
                              {doc.name}
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {doc.fileType} • {doc.size} •{" "}
                              {new Date(doc.uploadDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleViewDocument(doc)}
                            className="text-blue-600 hover:text-blue-700"
                            title="View document"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleShareDocument(doc)}
                            className="text-green-600 hover:text-green-700"
                            title="Share document"
                          >
                            <Share2 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteDocument(doc._id)}
                            className="text-red-600 hover:text-red-700"
                            title="Delete document"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {documents.length > 5 && (
                      <div className="text-center pt-2">
                        <Button
                          variant="outline"
                          className="text-orange-600 border-orange-300 hover:bg-orange-50 dark:border-orange-600 dark:text-orange-400 dark:hover:bg-orange-950/30"
                        >
                          View All {documents.length} Documents
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-indigo-50 dark:from-gray-900 dark:to-indigo-950">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
                  <Zap className="w-5 h-5 text-indigo-600" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button
                    onClick={() => setShowUploadModal(true)}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Document
                  </Button>
                  <Button
                    onClick={handleViewMostRecentClaim}
                    variant="outline"
                    className="w-full border-indigo-300 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-600 dark:text-indigo-400 dark:hover:bg-indigo-950/30"
                    disabled={claims.length === 0}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Claim
                  </Button>
                  <Button
                    onClick={() => router.push("/claim-form")}
                    variant="outline"
                    className="w-full border-indigo-300 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-600 dark:text-indigo-400 dark:hover:bg-indigo-950/30"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    New Claim
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-green-50 dark:from-gray-900 dark:to-green-950">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-lg font-bold text-gray-900 dark:text-white">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-green-600" />
                    Upcoming Events
                  </div>
                  <Button
                    size="sm"
                    onClick={() => setShowAddEvent(true)}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <PlusCircle className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingEvents
                    .filter((event) => !event.completed)
                    .slice(0, 5)
                    .map((event) => (
                      <div
                        key={event.id}
                        className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                                {event.title}
                              </h4>
                              <Badge
                                className={getPriorityColor(event.priority)}
                              >
                                {event.priority}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                              {new Date(event.date).toLocaleDateString()} at{" "}
                              {event.time}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-300">
                              {event.description}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => toggleEventComplete(event.id)}
                              className="text-green-600 hover:text-green-700"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteEvent(event.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Policy Limits */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-purple-50 dark:from-gray-900 dark:to-purple-950">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
                  <Shield className="w-5 h-5 text-purple-600" />
                  Policy Limits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700">
                    <h4 className="font-semibold text-purple-900 dark:text-purple-100 text-sm mb-2">
                      Bodily Injury
                    </h4>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-purple-700 dark:text-purple-300">
                          Per Person:
                        </span>
                        <span className="font-medium text-purple-900 dark:text-purple-100">
                          {formatCurrency(policyLimits.bodilyInjury.perPerson)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-700 dark:text-purple-300">
                          Per Accident:
                        </span>
                        <span className="font-medium text-purple-900 dark:text-purple-100">
                          {formatCurrency(
                            policyLimits.bodilyInjury.perAccident
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100 text-sm mb-2">
                      Property Damage
                    </h4>
                    <div className="text-xs">
                      <div className="flex justify-between">
                        <span className="text-blue-700 dark:text-blue-300">
                          Limit:
                        </span>
                        <span className="font-medium text-blue-900 dark:text-blue-100">
                          {formatCurrency(policyLimits.propertyDamage)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700">
                    <h4 className="font-semibold text-green-900 dark:text-green-100 text-sm mb-2">
                      Personal Injury Protection
                    </h4>
                    <div className="text-xs">
                      <div className="flex justify-between">
                        <span className="text-green-700 dark:text-green-300">
                          Limit:
                        </span>
                        <span className="font-medium text-green-900 dark:text-green-100">
                          {formatCurrency(
                            policyLimits.personalInjuryProtection
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700">
                    <h4 className="font-semibold text-orange-900 dark:text-orange-100 text-sm mb-2">
                      Deductibles
                    </h4>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-orange-700 dark:text-orange-300">
                          Collision:
                        </span>
                        <span className="font-medium text-orange-900 dark:text-orange-100">
                          {formatCurrency(policyLimits.collision)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-orange-700 dark:text-orange-300">
                          Comprehensive:
                        </span>
                        <span className="font-medium text-orange-900 dark:text-orange-100">
                          {formatCurrency(policyLimits.comprehensive)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Modals */}
        {showClaimDetail && selectedClaim && (
          <Modal
            isOpen={showClaimDetail}
            onClose={() => setShowClaimDetail(false)}
            title={`Claim #${selectedClaim.claimNumber}`}
            size="xl"
          >
            <ClaimDetail claim={selectedClaim} />
          </Modal>
        )}

        {showUploadModal && (
          <DocumentUploadModal
            isOpen={showUploadModal}
            onClose={() => setShowUploadModal(false)}
            onUploadSuccess={handleUploadSuccess}
          />
        )}

        {showPreviewModal && selectedDocument && (
          <DocumentPreviewModal
            isOpen={showPreviewModal}
            onClose={() => setShowPreviewModal(false)}
            document={selectedDocument}
            onDelete={() => handleDeleteDocument(selectedDocument._id)}
            onShare={() => handleShareDocument(selectedDocument)}
          />
        )}

        {showShareModal && selectedDocument && (
          <DocumentShareModal
            isOpen={showShareModal}
            onClose={() => setShowShareModal(false)}
            document={selectedDocument}
          />
        )}

        {/* Add Event Modal */}
        {showAddEvent && (
          <Modal
            isOpen={showAddEvent}
            onClose={() => setShowAddEvent(false)}
            title="Add New Event"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Event Title
                </label>
                <Input
                  value={newEvent.title}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, title: e.target.value })
                  }
                  placeholder="Enter event title"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Date
                  </label>
                  <Input
                    type="date"
                    value={newEvent.date}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, date: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Time
                  </label>
                  <Input
                    type="time"
                    value={newEvent.time}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, time: e.target.value })
                    }
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Type
                </label>
                <select
                  value={newEvent.type}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, type: e.target.value as any })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="appointment">Appointment</option>
                  <option value="deadline">Deadline</option>
                  <option value="follow-up">Follow-up</option>
                  <option value="payment">Payment</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Priority
                </label>
                <select
                  value={newEvent.priority}
                  onChange={(e) =>
                    setNewEvent({
                      ...newEvent,
                      priority: e.target.value as any,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <Textarea
                  value={newEvent.description}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, description: e.target.value })
                  }
                  placeholder="Enter event description"
                  rows={3}
                />
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={addEvent}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  Add Event
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowAddEvent(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}
