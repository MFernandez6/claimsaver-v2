"use client";

import { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  User,
  Car,
  Calendar,
  Shield,
  DollarSign,
  FileText,
  Award,
  Zap,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Loader2,
} from "lucide-react";

interface FloridaNoFaultFormData {
  // Insurance Information
  insuranceCompany: string;
  policyNumber: string;
  adjusterName: string;
  adjusterPhone: string;
  fileNumber: string;
  policyHolder: string;
  dateOfAccident: string;

  // Medical Insurance
  medicalInsurance: string;
  medicalMemberId: string;

  // Claimant Information
  claimantName: string;
  claimantEmail: string;
  claimantPhone: string;
  claimantPhoneHome: string;
  claimantPhoneBusiness: string;
  claimantAddress: string;
  claimantDOB: string;
  claimantSSN: string;
  floridaResidencyDuration: string;
  permanentAddress: string;

  // Accident Details
  accidentDate: string;
  accidentLocation: string;
  accidentDescription: string;
  accidentDateTime: string;
  accidentPlace: string;
  yourVehicle: string;
  familyVehicle: string;
  injured: boolean;
  injuryDescription: string;

  // Medical Treatment
  treatedByDoctor: boolean;
  doctorName: string;
  doctorAddress: string;
  hospitalInpatient: boolean;
  hospitalOutpatient: boolean;
  hospitalName: string;
  hospitalAddress: string;
  medicalBillsToDate: string;
  moreMedicalExpense: boolean;

  // Employment & Wages
  inCourseOfEmployment: boolean;
  lostWages: boolean;
  wageLossToDate: string;
  averageWeeklyWage: string;
  disabilityStart: string;
  disabilityEnd: string;
  workersComp: boolean;
  workersCompAmount: string;
  otherExpenses: string;

  // Legal Disclaimers
  signature: string;
  signatureDate: string;

  // Authorizations
  medicalAuthSignature: string;
  medicalAuthDate: string;
  wageAuthSignature: string;
  wageAuthDate: string;

  // OIR-B1-1571 Disclosure
  pipPatientName: string;
  pipPatientSignature: string;
  pipPatientDate: string;
  pipProviderName: string;
  pipProviderSignature: string;
  pipProviderDate: string;

  // Legacy fields for backward compatibility
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: string;
  licensePlate: string;
  injuries: Array<{
    type: string;
    description: string;
    severity: string;
  }>;
  propertyDamage: string;
  estimatedValue: number;
}

export default function ClaimFormPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [signatureModalOpen, setSignatureModalOpen] = useState(false);
  const [currentSignatureType, setCurrentSignatureType] = useState("");
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastX, setLastX] = useState(0);
  const [lastY, setLastY] = useState(0);

  const totalSteps = 8;

  // Initialize form data with proper defaults
  const [formData, setFormData] = useState<FloridaNoFaultFormData>({
    // Insurance Information
    insuranceCompany: "",
    policyNumber: "",
    adjusterName: "",
    adjusterPhone: "",
    fileNumber: "",
    policyHolder: "",
    dateOfAccident: "",

    // Medical Insurance
    medicalInsurance: "",
    medicalMemberId: "",

    // Claimant Information
    claimantName: "",
    claimantEmail: "",
    claimantPhone: "",
    claimantPhoneHome: "",
    claimantPhoneBusiness: "",
    claimantAddress: "",
    claimantDOB: "",
    claimantSSN: "",
    floridaResidencyDuration: "",
    permanentAddress: "",

    // Accident Details
    accidentDate: "",
    accidentLocation: "",
    accidentDescription: "",
    accidentDateTime: "",
    accidentPlace: "",
    yourVehicle: "",
    familyVehicle: "",
    injured: false,
    injuryDescription: "",

    // Medical Treatment
    treatedByDoctor: false,
    doctorName: "",
    doctorAddress: "",
    hospitalInpatient: false,
    hospitalOutpatient: false,
    hospitalName: "",
    hospitalAddress: "",
    medicalBillsToDate: "",
    moreMedicalExpense: false,

    // Employment & Wages
    inCourseOfEmployment: false,
    lostWages: false,
    wageLossToDate: "",
    averageWeeklyWage: "",
    disabilityStart: "",
    disabilityEnd: "",
    workersComp: false,
    workersCompAmount: "",
    otherExpenses: "",

    // Legal Disclaimers
    signature: "",
    signatureDate: "",

    // Authorizations
    medicalAuthSignature: "",
    medicalAuthDate: "",
    wageAuthSignature: "",
    wageAuthDate: "",

    // OIR-B1-1571 Disclosure
    pipPatientName: "",
    pipPatientSignature: "",
    pipPatientDate: "",
    pipProviderName: "",
    pipProviderSignature: "",
    pipProviderDate: "",

    // Legacy fields for backward compatibility
    vehicleMake: "",
    vehicleModel: "",
    vehicleYear: "",
    licensePlate: "",
    injuries: [],
    propertyDamage: "",
    estimatedValue: 0,
  });

  // Debug logging
  useEffect(() => {
    console.log("Form component mounted");
    console.log("Clerk loaded:", isLoaded);
    console.log("User:", user);
    console.log("Form data:", formData);
  }, [isLoaded, user, formData]);

  useEffect(() => {
    if (isLoaded && user) {
      console.log("User authenticated, pre-filling form data");
      // Pre-fill form with user data if available
      setFormData((prev) => ({
        ...prev,
        claimantName: user.fullName || "",
        claimantEmail: user.primaryEmailAddress?.emailAddress || "",
        claimantPhone: user.phoneNumbers?.[0]?.phoneNumber || "",
      }));
    }
  }, [isLoaded, user]);

  const handleInputChange = (field: string, value: string | boolean) => {
    console.log("handleInputChange called:", field, value);
    setFormData((prev) => {
      const newData = {
        ...prev,
        [field]: value,
      };
      console.log("Updated form data:", newData);
      return newData;
    });
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const openSignatureModal = (type: string) => {
    setCurrentSignatureType(type);
    setSignatureModalOpen(true);
  };

  const closeSignatureModal = () => {
    setSignatureModalOpen(false);
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const signatureData = canvas.toDataURL();
      const fieldName = `${currentSignatureType}Signature`;
      const dateFieldName = `${currentSignatureType}Date`;

      setFormData((prev) => ({
        ...prev,
        [fieldName]: signatureData,
        [dateFieldName]: new Date().toISOString().split("T")[0],
      }));
    }
    closeSignatureModal();
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/claims", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit claim");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 3000);
    } catch (err) {
      console.error("Error submitting claim:", err);
      setError(err instanceof Error ? err.message : "Failed to submit claim");
    } finally {
      setLoading(false);
    }
  };

  const getStepIcon = (step: number) => {
    switch (step) {
      case 1:
        return <User className="w-5 h-5" />;
      case 2:
        return <Car className="w-5 h-5" />;
      case 3:
        return <Calendar className="w-5 h-5" />;
      case 4:
        return <Shield className="w-5 h-5" />;
      case 5:
        return <DollarSign className="w-5 h-5" />;
      case 6:
        return <FileText className="w-5 h-5" />;
      case 7:
        return <Award className="w-5 h-5" />;
      case 8:
        return <Zap className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getStepTitle = (step: number) => {
    switch (step) {
      case 1:
        return "Personal Information";
      case 2:
        return "Vehicle Information";
      case 3:
        return "Accident Details";
      case 4:
        return "Insurance Information";
      case 5:
        return "Medical Information";
      case 6:
        return "Employment & Wages";
      case 7:
        return "Authorizations";
      case 8:
        return "Review & Submit";
      default:
        return "Step";
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-4">
            Claim Submitted Successfully!
          </h1>
          <p className="text-gray-600 mb-6">
            Your claim has been submitted and is now under review.
          </p>
          <Button onClick={() => router.push("/dashboard")}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/images/logo-pattern.png')] opacity-5 dark:opacity-10"></div>

      {/* Header Section */}
      <div className="relative z-10 pt-24 pb-8">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            {/* Logo */}
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg mb-4">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                Florida No-Fault Form
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                Complete your accident claim with our step-by-step form
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-full h-4 mb-8 shadow-inner">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-4 rounded-full transition-all duration-700 ease-out shadow-lg"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>

            {/* Step Indicator */}
            <div className="flex items-center justify-center gap-3 mb-8">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div
                  key={i + 1}
                  className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-500 ${
                    i + 1 === currentStep
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-110"
                      : i + 1 < currentStep
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md"
                      : "bg-white/70 dark:bg-gray-700/70 text-gray-500 dark:text-gray-400 shadow-sm"
                  }`}
                >
                  {i + 1 < currentStep ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    getStepIcon(i + 1)
                  )}
                </div>
              ))}
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Step {currentStep}: {getStepTitle(currentStep)}
              </h2>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="container mx-auto px-4 mb-6">
          <div className="bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center mr-3">
                <svg
                  className="w-4 h-4 text-red-600 dark:text-red-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="text-red-800 dark:text-red-200 font-medium">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 pb-12">
        <Card className="group relative overflow-hidden border-0 shadow-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <CardContent className="p-8 relative z-10">
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 rounded-xl mb-4">
                    <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Personal Information
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Tell us about yourself
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      Full Name *
                    </label>
                    <Input
                      value={formData.claimantName}
                      onChange={(e) =>
                        handleInputChange("claimantName", e.target.value)
                      }
                      placeholder="Enter your full name"
                      className="w-full border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all duration-200 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm"
                    />
                  </div>
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      Email Address *
                    </label>
                    <Input
                      type="email"
                      value={formData.claimantEmail}
                      onChange={(e) =>
                        handleInputChange("claimantEmail", e.target.value)
                      }
                      placeholder="Enter your email"
                      className="w-full border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all duration-200 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm"
                    />
                  </div>
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      Phone Number *
                    </label>
                    <Input
                      type="tel"
                      value={formData.claimantPhone}
                      onChange={(e) =>
                        handleInputChange("claimantPhone", e.target.value)
                      }
                      placeholder="Enter your phone number"
                      className="w-full border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all duration-200 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm"
                    />
                  </div>
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      Date of Birth *
                    </label>
                    <Input
                      type="date"
                      value={formData.claimantDOB}
                      onChange={(e) =>
                        handleInputChange("claimantDOB", e.target.value)
                      }
                      className="w-full border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all duration-200 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm"
                    />
                  </div>
                </div>
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    Current Address *
                  </label>
                  <Textarea
                    value={formData.claimantAddress}
                    onChange={(e) =>
                      handleInputChange("claimantAddress", e.target.value)
                    }
                    placeholder="Enter your current address"
                    rows={3}
                    className="w-full border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all duration-200 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm resize-none"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Vehicle Information */}
            {currentStep === 2 && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 rounded-xl mb-4">
                    <Car className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Vehicle Information
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Tell us about your vehicle
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                      Vehicle Year *
                    </label>
                    <Input
                      value={formData.vehicleYear}
                      onChange={(e) =>
                        handleInputChange("vehicleYear", e.target.value)
                      }
                      placeholder="e.g., 2020"
                      className="w-full border-2 border-gray-200 dark:border-gray-600 focus:border-green-500 dark:focus:border-green-400 focus:ring-2 focus:ring-green-500/20 dark:focus:ring-green-400/20 transition-all duration-200 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm"
                    />
                  </div>
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                      Vehicle Make *
                    </label>
                    <Input
                      value={formData.vehicleMake}
                      onChange={(e) =>
                        handleInputChange("vehicleMake", e.target.value)
                      }
                      placeholder="e.g., Toyota"
                      className="w-full border-2 border-gray-200 dark:border-gray-600 focus:border-green-500 dark:focus:border-green-400 focus:ring-2 focus:ring-green-500/20 dark:focus:ring-green-400/20 transition-all duration-200 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm"
                    />
                  </div>
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                      Vehicle Model *
                    </label>
                    <Input
                      value={formData.vehicleModel}
                      onChange={(e) =>
                        handleInputChange("vehicleModel", e.target.value)
                      }
                      placeholder="e.g., Camry"
                      className="w-full border-2 border-gray-200 dark:border-gray-600 focus:border-green-500 dark:focus:border-green-400 focus:ring-2 focus:ring-green-500/20 dark:focus:ring-green-400/20 transition-all duration-200 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm"
                    />
                  </div>
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                      License Plate
                    </label>
                    <Input
                      value={formData.licensePlate}
                      onChange={(e) =>
                        handleInputChange("licensePlate", e.target.value)
                      }
                      placeholder="Enter license plate number"
                      className="w-full border-2 border-gray-200 dark:border-gray-600 focus:border-green-500 dark:focus:border-green-400 focus:ring-2 focus:ring-green-500/20 dark:focus:ring-green-400/20 transition-all duration-200 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Accident Details */}
            {currentStep === 3 && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/50 dark:to-red-900/50 rounded-xl mb-4">
                    <Calendar className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Accident Details
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Tell us about the accident
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                      Date of Accident *
                    </label>
                    <Input
                      type="date"
                      value={formData.accidentDate}
                      onChange={(e) =>
                        handleInputChange("accidentDate", e.target.value)
                      }
                      className="w-full border-2 border-gray-200 dark:border-gray-600 focus:border-orange-500 dark:focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20 dark:focus:ring-orange-400/20 transition-all duration-200 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm"
                    />
                  </div>
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                      Accident Location *
                    </label>
                    <Input
                      value={formData.accidentLocation}
                      onChange={(e) =>
                        handleInputChange("accidentLocation", e.target.value)
                      }
                      placeholder="City, State"
                      className="w-full border-2 border-gray-200 dark:border-gray-600 focus:border-orange-500 dark:focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20 dark:focus:ring-orange-400/20 transition-all duration-200 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm"
                    />
                  </div>
                </div>
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                    Accident Description *
                  </label>
                  <Textarea
                    value={formData.accidentDescription}
                    onChange={(e) =>
                      handleInputChange("accidentDescription", e.target.value)
                    }
                    placeholder="Describe what happened in the accident"
                    rows={4}
                    className="w-full border-2 border-gray-200 dark:border-gray-600 focus:border-orange-500 dark:focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20 dark:focus:ring-orange-400/20 transition-all duration-200 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm resize-none"
                  />
                </div>
                <div className="flex items-center space-x-3 p-4 bg-orange-50 dark:bg-orange-950/30 rounded-xl border border-orange-200 dark:border-orange-800">
                  <input
                    type="checkbox"
                    id="injured"
                    checked={formData.injured}
                    onChange={(e) =>
                      handleInputChange("injured", e.target.checked)
                    }
                    className="w-5 h-5 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 dark:focus:ring-orange-400 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor="injured"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Were you injured in the accident?
                  </label>
                </div>
                {formData.injured && (
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                      Injury Description
                    </label>
                    <Textarea
                      value={formData.injuryDescription}
                      onChange={(e) =>
                        handleInputChange("injuryDescription", e.target.value)
                      }
                      placeholder="Describe your injuries"
                      rows={3}
                      className="w-full border-2 border-gray-200 dark:border-gray-600 focus:border-orange-500 dark:focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20 dark:focus:ring-orange-400/20 transition-all duration-200 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm resize-none"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Insurance Information */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold mb-6">
                  Insurance Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Insurance Company *
                    </label>
                    <Input
                      value={formData.insuranceCompany}
                      onChange={(e) =>
                        handleInputChange("insuranceCompany", e.target.value)
                      }
                      placeholder="Enter insurance company name"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Policy Number *
                    </label>
                    <Input
                      value={formData.policyNumber}
                      onChange={(e) =>
                        handleInputChange("policyNumber", e.target.value)
                      }
                      placeholder="Enter policy number"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Policy Holder *
                    </label>
                    <Input
                      value={formData.policyHolder}
                      onChange={(e) =>
                        handleInputChange("policyHolder", e.target.value)
                      }
                      placeholder="Enter policy holder name"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Adjuster Name
                    </label>
                    <Input
                      value={formData.adjusterName}
                      onChange={(e) =>
                        handleInputChange("adjusterName", e.target.value)
                      }
                      placeholder="Enter adjuster name"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Adjuster Phone
                    </label>
                    <Input
                      value={formData.adjusterPhone}
                      onChange={(e) =>
                        handleInputChange("adjusterPhone", e.target.value)
                      }
                      placeholder="Enter adjuster phone"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      File Number
                    </label>
                    <Input
                      value={formData.fileNumber}
                      onChange={(e) =>
                        handleInputChange("fileNumber", e.target.value)
                      }
                      placeholder="Enter file number"
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Medical Information */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold mb-6">
                  Medical Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="treatedByDoctor"
                      checked={formData.treatedByDoctor}
                      onChange={(e) =>
                        handleInputChange("treatedByDoctor", e.target.checked)
                      }
                      className="rounded"
                    />
                    <label htmlFor="treatedByDoctor">
                      Were you treated by a doctor?
                    </label>
                  </div>
                  {formData.treatedByDoctor && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Doctor Name
                        </label>
                        <Input
                          value={formData.doctorName}
                          onChange={(e) =>
                            handleInputChange("doctorName", e.target.value)
                          }
                          placeholder="Enter doctor name"
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Doctor Address
                        </label>
                        <Input
                          value={formData.doctorAddress}
                          onChange={(e) =>
                            handleInputChange("doctorAddress", e.target.value)
                          }
                          placeholder="Enter doctor address"
                          className="w-full"
                        />
                      </div>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="hospitalInpatient"
                      checked={formData.hospitalInpatient}
                      onChange={(e) =>
                        handleInputChange("hospitalInpatient", e.target.checked)
                      }
                      className="rounded"
                    />
                    <label htmlFor="hospitalInpatient">
                      Hospital inpatient treatment?
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="hospitalOutpatient"
                      checked={formData.hospitalOutpatient}
                      onChange={(e) =>
                        handleInputChange(
                          "hospitalOutpatient",
                          e.target.checked
                        )
                      }
                      className="rounded"
                    />
                    <label htmlFor="hospitalOutpatient">
                      Hospital outpatient treatment?
                    </label>
                  </div>
                  {(formData.hospitalInpatient ||
                    formData.hospitalOutpatient) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Hospital Name
                        </label>
                        <Input
                          value={formData.hospitalName}
                          onChange={(e) =>
                            handleInputChange("hospitalName", e.target.value)
                          }
                          placeholder="Enter hospital name"
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Hospital Address
                        </label>
                        <Input
                          value={formData.hospitalAddress}
                          onChange={(e) =>
                            handleInputChange("hospitalAddress", e.target.value)
                          }
                          placeholder="Enter hospital address"
                          className="w-full"
                        />
                      </div>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Medical Bills to Date
                    </label>
                    <Input
                      value={formData.medicalBillsToDate}
                      onChange={(e) =>
                        handleInputChange("medicalBillsToDate", e.target.value)
                      }
                      placeholder="Enter total medical bills amount"
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: Employment & Wages */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold mb-6">
                  Employment & Wages
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="inCourseOfEmployment"
                      checked={formData.inCourseOfEmployment}
                      onChange={(e) =>
                        handleInputChange(
                          "inCourseOfEmployment",
                          e.target.checked
                        )
                      }
                      className="rounded"
                    />
                    <label htmlFor="inCourseOfEmployment">
                      Accident occurred in course of employment?
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="lostWages"
                      checked={formData.lostWages}
                      onChange={(e) =>
                        handleInputChange("lostWages", e.target.checked)
                      }
                      className="rounded"
                    />
                    <label htmlFor="lostWages">
                      Did you lose wages due to the accident?
                    </label>
                  </div>
                  {formData.lostWages && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Wage Loss to Date
                        </label>
                        <Input
                          value={formData.wageLossToDate}
                          onChange={(e) =>
                            handleInputChange("wageLossToDate", e.target.value)
                          }
                          placeholder="Enter wage loss amount"
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Average Weekly Wage
                        </label>
                        <Input
                          value={formData.averageWeeklyWage}
                          onChange={(e) =>
                            handleInputChange(
                              "averageWeeklyWage",
                              e.target.value
                            )
                          }
                          placeholder="Enter average weekly wage"
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Disability Start Date
                        </label>
                        <Input
                          type="date"
                          value={formData.disabilityStart}
                          onChange={(e) =>
                            handleInputChange("disabilityStart", e.target.value)
                          }
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Disability End Date
                        </label>
                        <Input
                          type="date"
                          value={formData.disabilityEnd}
                          onChange={(e) =>
                            handleInputChange("disabilityEnd", e.target.value)
                          }
                          className="w-full"
                        />
                      </div>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="workersComp"
                      checked={formData.workersComp}
                      onChange={(e) =>
                        handleInputChange("workersComp", e.target.checked)
                      }
                      className="rounded"
                    />
                    <label htmlFor="workersComp">
                      Workers&apos; compensation claim filed?
                    </label>
                  </div>
                  {formData.workersComp && (
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Workers&apos; Comp Amount
                      </label>
                      <Input
                        value={formData.workersCompAmount}
                        onChange={(e) =>
                          handleInputChange("workersCompAmount", e.target.value)
                        }
                        placeholder="Enter workers' comp amount"
                        className="w-full"
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Other Expenses
                    </label>
                    <Input
                      value={formData.otherExpenses}
                      onChange={(e) =>
                        handleInputChange("otherExpenses", e.target.value)
                      }
                      placeholder="Enter other expenses"
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 7: Authorizations */}
            {currentStep === 7 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold mb-6">Authorizations</h3>
                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-blue-800">
                    Please provide your digital signature for the following
                    authorizations.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">
                      Medical Authorization
                    </h4>
                    <p className="text-sm text-gray-600 mb-3">
                      I authorize the release of my medical information to the
                      insurance company.
                    </p>
                    <Button
                      onClick={() => openSignatureModal("medicalAuth")}
                      variant="outline"
                      className="w-full"
                    >
                      {formData.medicalAuthSignature
                        ? "✓ Signed"
                        : "Sign Medical Authorization"}
                    </Button>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Wage Authorization</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      I authorize the release of my employment and wage
                      information.
                    </p>
                    <Button
                      onClick={() => openSignatureModal("wageAuth")}
                      variant="outline"
                      className="w-full"
                    >
                      {formData.wageAuthSignature
                        ? "✓ Signed"
                        : "Sign Wage Authorization"}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 8: Review & Submit */}
            {currentStep === 8 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold mb-6">Review & Submit</h3>
                <div className="bg-yellow-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-yellow-800">
                    Please review all information carefully before submitting.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Personal Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div>
                        <strong>Name:</strong> {formData.claimantName}
                      </div>
                      <div>
                        <strong>Email:</strong> {formData.claimantEmail}
                      </div>
                      <div>
                        <strong>Phone:</strong> {formData.claimantPhone}
                      </div>
                      <div>
                        <strong>DOB:</strong> {formData.claimantDOB}
                      </div>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Accident Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div>
                        <strong>Date:</strong> {formData.accidentDate}
                      </div>
                      <div>
                        <strong>Location:</strong> {formData.accidentLocation}
                      </div>
                      <div>
                        <strong>Vehicle:</strong> {formData.vehicleYear}{" "}
                        {formData.vehicleMake} {formData.vehicleModel}
                      </div>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">
                      Insurance Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div>
                        <strong>Company:</strong> {formData.insuranceCompany}
                      </div>
                      <div>
                        <strong>Policy Number:</strong> {formData.policyNumber}
                      </div>
                      <div>
                        <strong>Policy Holder:</strong> {formData.policyHolder}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center pt-8 border-t border-gray-200 dark:border-gray-700">
              <Button
                onClick={prevStep}
                disabled={currentStep === 1}
                variant="outline"
                className="px-8 py-3 border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="mr-2 w-5 h-5" />
                Previous
              </Button>

              {currentStep === totalSteps ? (
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Claim
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={nextStep}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  Next
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Signature Modal */}
      {signatureModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">
                  Digital Signature
                </h3>
                <button
                  onClick={closeSignatureModal}
                  className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  Please sign in the box below using your mouse or touch screen.
                </p>
                <canvas
                  ref={canvasRef}
                  className="w-full h-48 border-2 border-gray-300 dark:border-gray-600 rounded-xl cursor-crosshair bg-white dark:bg-gray-700 shadow-inner"
                  onMouseDown={(e) => {
                    setIsDrawing(true);
                    setLastX(e.clientX - canvasRef.current!.offsetLeft);
                    setLastY(e.clientY - canvasRef.current!.offsetTop);
                  }}
                  onMouseUp={() => setIsDrawing(false)}
                  onMouseLeave={() => setIsDrawing(false)}
                  onMouseMove={(e) => {
                    if (isDrawing && canvasRef.current) {
                      const canvas = canvasRef.current;
                      const ctx = canvas.getContext("2d");
                      if (ctx) {
                        const rect = canvas.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
                        ctx.beginPath();
                        ctx.moveTo(lastX, lastY);
                        ctx.lineTo(x, y);
                        ctx.stroke();
                        setLastX(x);
                        setLastY(y);
                      }
                    }
                  }}
                  onTouchStart={(e) => {
                    if (canvasRef.current) {
                      const touch = e.touches[0];
                      const rect = canvasRef.current.getBoundingClientRect();
                      setIsDrawing(true);
                      setLastX(touch.clientX - rect.left);
                      setLastY(touch.clientY - rect.top);
                    }
                  }}
                  onTouchEnd={() => setIsDrawing(false)}
                  onTouchCancel={() => setIsDrawing(false)}
                  onTouchMove={(e) => {
                    if (isDrawing && canvasRef.current) {
                      const touch = e.touches[0];
                      const canvas = canvasRef.current;
                      const ctx = canvas.getContext("2d");
                      if (ctx) {
                        const rect = canvas.getBoundingClientRect();
                        const x = touch.clientX - rect.left;
                        const y = touch.clientY - rect.top;
                        ctx.beginPath();
                        ctx.moveTo(lastX, lastY);
                        ctx.lineTo(x, y);
                        ctx.stroke();
                        setLastX(x);
                        setLastY(y);
                      }
                    }
                  }}
                />
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={clearSignature}
                  variant="outline"
                  className="flex-1 border-2 border-gray-300 dark:border-gray-600 hover:border-red-500 dark:hover:border-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 transition-all duration-200"
                >
                  Clear
                </Button>
                <Button
                  onClick={saveSignature}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Save Signature
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
