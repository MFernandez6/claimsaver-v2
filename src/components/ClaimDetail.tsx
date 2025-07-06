import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Calendar,
  Car,
  Shield,
  DollarSign,
  CheckCircle,
  AlertTriangle,
  Clock,
} from "lucide-react";

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

export function getStatusColor(status: string) {
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
}

export function getStatusIcon(status: string) {
  switch (status) {
    case "pending":
      return <Clock className="w-4 h-4" />;
    case "reviewing":
      return <AlertTriangle className="w-4 h-4" />;
    case "approved":
      return <CheckCircle className="w-4 h-4" />;
    case "rejected":
      return <AlertTriangle className="w-4 h-4" />;
    case "in_progress":
      return <Clock className="w-4 h-4" />;
    case "completed":
      return <CheckCircle className="w-4 h-4" />;
    default:
      return <Clock className="w-4 h-4" />;
  }
}

export function getPriorityColor(priority: string) {
  switch (priority) {
    case "low":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "medium":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "high":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
    case "urgent":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  }
}

export default function ClaimDetail({ claim }: { claim: ClaimData }) {
  if (!claim) return null;
  return (
    <div className="space-y-6">
      {/* Claim Header */}
      <Card className="bg-white dark:bg-gray-900 border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {claim.claimNumber || "N/A"}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Submitted on{" "}
                {claim.submittedAt
                  ? new Date(claim.submittedAt).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
            <div className="flex gap-2">
              <Badge className={getStatusColor(claim.status || "pending")}>
                {getStatusIcon(claim.status || "pending")}
                <span className="ml-1 capitalize">
                  {(claim.status || "pending").replace("_", " ")}
                </span>
              </Badge>
              <Badge className={getPriorityColor(claim.priority || "medium")}>
                {claim.priority || "medium"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Personal Information */}
      <Card className="bg-white dark:bg-gray-900 border-0 shadow-lg">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <User className="w-5 h-5" />
            Personal Information
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Full Name
              </label>
              <p className="text-gray-900 dark:text-white break-words">
                {claim.claimantName || "N/A"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Email
              </label>
              <p className="text-gray-900 dark:text-white break-words">
                {claim.claimantEmail || "N/A"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Phone
              </label>
              <p className="text-gray-900 dark:text-white break-words">
                {claim.claimantPhone || "N/A"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Date of Birth
              </label>
              <p className="text-gray-900 dark:text-white break-words">
                {claim.claimantDOB || "N/A"}
              </p>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Address
              </label>
              <p className="text-gray-900 dark:text-white break-words">
                {claim.claimantAddress || "N/A"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Accident Details */}
      <Card className="bg-white dark:bg-gray-900 border-0 shadow-lg">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Accident Details
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Date
              </label>
              <p className="text-gray-900 dark:text-white break-words">
                {claim.accidentDate
                  ? new Date(claim.accidentDate).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Location
              </label>
              <p className="text-gray-900 dark:text-white break-words">
                {claim.accidentLocation || "N/A"}
              </p>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Description
              </label>
              <p className="text-gray-900 dark:text-white break-words">
                {claim.accidentDescription || "N/A"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Injured
              </label>
              <p className="text-gray-900 dark:text-white break-words">
                {claim.injured ? "Yes" : "No"}
              </p>
            </div>
            {claim.injured && (
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Injury Description
                </label>
                <p className="text-gray-900 dark:text-white break-words">
                  {claim.injuryDescription || "N/A"}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      {/* Vehicle Information */}
      <Card className="bg-white dark:bg-gray-900 border-0 shadow-lg">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Car className="w-5 h-5" />
            Vehicle Information
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Year
              </label>
              <p className="text-gray-900 dark:text-white break-words">
                {claim.vehicleYear || "N/A"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Make
              </label>
              <p className="text-gray-900 dark:text-white break-words">
                {claim.vehicleMake || "N/A"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Model
              </label>
              <p className="text-gray-900 dark:text-white break-words">
                {claim.vehicleModel || "N/A"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                License Plate
              </label>
              <p className="text-gray-900 dark:text-white break-words">
                {claim.licensePlate || "N/A"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Insurance Information */}
      <Card className="bg-white dark:bg-gray-900 border-0 shadow-lg">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Insurance Information
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Company
              </label>
              <p className="text-gray-900 dark:text-white break-words">
                {claim.insuranceCompany || "N/A"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Policy Number
              </label>
              <p className="text-gray-900 dark:text-white break-words">
                {claim.policyNumber || "N/A"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Policy Holder
              </label>
              <p className="text-gray-900 dark:text-white break-words">
                {claim.policyHolder || "N/A"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                File Number
              </label>
              <p className="text-gray-900 dark:text-white break-words">
                {claim.fileNumber || "N/A"}
              </p>
            </div>
            {claim.adjusterName && (
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Adjuster Name
                </label>
                <p className="text-gray-900 dark:text-white break-words">
                  {claim.adjusterName}
                </p>
              </div>
            )}
            {claim.adjusterPhone && (
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Adjuster Phone
                </label>
                <p className="text-gray-900 dark:text-white break-words">
                  {claim.adjusterPhone}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      {/* Financial Information */}
      <Card className="bg-white dark:bg-gray-900 border-0 shadow-lg">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Financial Information
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Estimated Value
              </label>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${(claim.estimatedValue || 0).toLocaleString()}
              </p>
            </div>
            {claim.medicalBillsToDate && (
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Medical Bills to Date
                </label>
                <p className="text-gray-900 dark:text-white break-words">
                  {claim.medicalBillsToDate}
                </p>
              </div>
            )}
            {claim.wageLossToDate && (
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Wage Loss to Date
                </label>
                <p className="text-gray-900 dark:text-white break-words">
                  {claim.wageLossToDate}
                </p>
              </div>
            )}
            {claim.otherExpenses && (
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Other Expenses
                </label>
                <p className="text-gray-900 dark:text-white break-words">
                  {claim.otherExpenses}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      {/* Authorization Status */}
      <Card className="bg-white dark:bg-gray-900 border-0 shadow-lg">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Authorization Status
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Insurance Authorization
              </h4>
              <Badge
                className={
                  claim.insuranceAuthSignature
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }
              >
                {claim.insuranceAuthSignature ? "Signed" : "Not Signed"}
              </Badge>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-950/30 rounded-lg">
              <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                HIPAA Authorization
              </h4>
              <Badge
                className={
                  claim.hipaaSignature
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }
              >
                {claim.hipaaSignature ? "Signed" : "Not Signed"}
              </Badge>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
              <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">
                Main Claim
              </h4>
              <Badge
                className={
                  claim.signature
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }
              >
                {claim.signature ? "Signed" : "Not Signed"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
