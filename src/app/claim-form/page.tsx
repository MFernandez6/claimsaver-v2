"use client";

import { useState, useRef, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Loader2,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  FileText,
  Car,
  User,
  Calendar,
  DollarSign,
  Shield,
  Award,
  Zap,
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
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [signatureModalOpen, setSignatureModalOpen] = useState(false);
  const [currentSignatureType, setCurrentSignatureType] = useState<string>("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Form data state
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

    // Legacy fields
    vehicleMake: "",
    vehicleModel: "",
    vehicleYear: "",
    licensePlate: "",
    injuries: [],
    propertyDamage: "",
    estimatedValue: 0,
  });

  const totalSteps = 8;

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/");
      return;
    }
  }, [isLoaded, user, router]);

  const handleInputChange = (field: string, value: string | boolean) => {
    console.log("handleInputChange called:", field, value);
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
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
        return "Medical Information";
      case 5:
        return "Employment & Wages";
      case 6:
        return "Legal Disclaimers";
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-950 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8 pt-24">
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  if (success) {
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

          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Claim Submitted{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Successfully!
                </span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                Your claim has been submitted and is now under review.
                We&apos;ll contact you soon with updates.
              </p>
              <Button
                onClick={() => router.push("/dashboard")}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Go to Dashboard
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </section>
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

        <div className="relative z-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Florida{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                No-Fault Form
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Complete your accident claim with our step-by-step form
            </p>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-8">
              <div
                className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>

            {/* Step Indicator */}
            <div className="flex items-center justify-center gap-2 mb-8">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div
                  key={i + 1}
                  className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
                    i + 1 === currentStep
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                      : i + 1 < currentStep
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                  }`}
                >
                  {i + 1 < currentStep ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    getStepIcon(i + 1)
                  )}
                </div>
              ))}
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Step {currentStep}: {getStepTitle(currentStep)}
            </h2>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-8">
              <p className="text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          {/* Form Content */}
          <Card className="group relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 backdrop-blur-sm z-30">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardContent className="p-8">
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Full Name *
                      </label>
                      <Input
                        value={formData.claimantName}
                        onChange={(e) =>
                          handleInputChange("claimantName", e.target.value)
                        }
                        onClick={() => console.log("Input clicked")}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email Address *
                      </label>
                      <Input
                        type="email"
                        value={formData.claimantEmail}
                        onChange={(e) =>
                          handleInputChange("claimantEmail", e.target.value)
                        }
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Phone Number *
                      </label>
                      <Input
                        type="tel"
                        value={formData.claimantPhone}
                        onChange={(e) =>
                          handleInputChange("claimantPhone", e.target.value)
                        }
                        placeholder="Enter your phone number"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Date of Birth *
                      </label>
                      <Input
                        type="date"
                        value={formData.claimantDOB}
                        onChange={(e) =>
                          handleInputChange("claimantDOB", e.target.value)
                        }
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Current Address *
                    </label>
                    <Textarea
                      value={formData.claimantAddress}
                      onChange={(e) =>
                        handleInputChange("claimantAddress", e.target.value)
                      }
                      placeholder="Enter your current address"
                      rows={3}
                      required
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Vehicle Information */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                    Vehicle Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Vehicle Year *
                      </label>
                      <Input
                        value={formData.vehicleYear}
                        onChange={(e) =>
                          handleInputChange("vehicleYear", e.target.value)
                        }
                        placeholder="e.g., 2020"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Vehicle Make *
                      </label>
                      <Input
                        value={formData.vehicleMake}
                        onChange={(e) =>
                          handleInputChange("vehicleMake", e.target.value)
                        }
                        placeholder="e.g., Toyota"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Vehicle Model *
                      </label>
                      <Input
                        value={formData.vehicleModel}
                        onChange={(e) =>
                          handleInputChange("vehicleModel", e.target.value)
                        }
                        placeholder="e.g., Camry"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Accident Details */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                    Accident Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Date of Accident *
                      </label>
                      <Input
                        type="date"
                        value={formData.accidentDate}
                        onChange={(e) =>
                          handleInputChange("accidentDate", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Accident Location *
                      </label>
                      <Input
                        value={formData.accidentLocation}
                        onChange={(e) =>
                          handleInputChange("accidentLocation", e.target.value)
                        }
                        placeholder="City, State"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Accident Description *
                    </label>
                    <Textarea
                      value={formData.accidentDescription}
                      onChange={(e) =>
                        handleInputChange("accidentDescription", e.target.value)
                      }
                      placeholder="Describe what happened in the accident"
                      rows={4}
                      required
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Insurance Information */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                    Insurance Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Insurance Company *
                      </label>
                      <Input
                        value={formData.insuranceCompany}
                        onChange={(e) =>
                          handleInputChange("insuranceCompany", e.target.value)
                        }
                        placeholder="Enter insurance company name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Policy Number *
                      </label>
                      <Input
                        value={formData.policyNumber}
                        onChange={(e) =>
                          handleInputChange("policyNumber", e.target.value)
                        }
                        placeholder="Enter policy number"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Policy Holder *
                      </label>
                      <Input
                        value={formData.policyHolder}
                        onChange={(e) =>
                          handleInputChange("policyHolder", e.target.value)
                        }
                        placeholder="Enter policy holder name"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Medical Information */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                    Medical Information
                  </h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Medical Bills to Date
                    </label>
                    <Input
                      value={formData.medicalBillsToDate}
                      onChange={(e) =>
                        handleInputChange("medicalBillsToDate", e.target.value)
                      }
                      placeholder="Enter total medical bills amount"
                    />
                  </div>
                </div>
              )}

              {/* Step 6: Employment & Wages */}
              {currentStep === 6 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                    Employment & Wages
                  </h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Average Weekly Wage
                    </label>
                    <Input
                      value={formData.averageWeeklyWage}
                      onChange={(e) =>
                        handleInputChange("averageWeeklyWage", e.target.value)
                      }
                      placeholder="Enter your average weekly wage"
                    />
                  </div>
                </div>
              )}

              {/* Step 7: Authorizations */}
              {currentStep === 7 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                    Authorizations
                  </h3>
                  <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 mb-6">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      Please provide your digital signature for the following
                      authorizations.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        Medical Authorization
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
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

                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        Wage Authorization
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
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
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                    Review & Submit
                  </h3>
                  <div className="bg-yellow-50 dark:bg-yellow-950/30 rounded-lg p-4 mb-6">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      Please review all information carefully before submitting.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        Personal Information
                      </h4>
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

                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        Accident Details
                      </h4>
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

                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        Insurance Information
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <div>
                          <strong>Company:</strong> {formData.insuranceCompany}
                        </div>
                        <div>
                          <strong>Policy Number:</strong>{" "}
                          {formData.policyNumber}
                        </div>
                        <div>
                          <strong>Policy Holder:</strong>{" "}
                          {formData.policyHolder}
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
                  className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 dark:text-gray-300 px-6 py-3 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <ArrowLeft className="mr-2 w-5 h-5" />
                  Previous
                </Button>

                {currentStep === totalSteps ? (
                  <Button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
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
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    Next
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Signature Modal */}
      {signatureModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Digital Signature
            </h3>
            <canvas
              ref={canvasRef}
              className="w-full h-48 border border-gray-300 dark:border-gray-600 rounded-lg cursor-crosshair"
              onMouseDown={() => setIsDrawing(true)}
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
                    ctx.lineTo(x, y);
                    ctx.stroke();
                  }
                }
              }}
            />
            <div className="flex gap-2 mt-4">
              <Button
                onClick={clearSignature}
                variant="outline"
                className="flex-1"
              >
                Clear
              </Button>
              <Button
                onClick={saveSignature}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600"
              >
                Save
              </Button>
            </div>
            <Button
              onClick={closeSignatureModal}
              variant="ghost"
              className="w-full mt-2"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
