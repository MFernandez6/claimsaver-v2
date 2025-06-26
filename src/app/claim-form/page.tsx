"use client";

import { useState, useRef, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Shield,
  User,
  AlertTriangle,
  FileText,
  CheckCircle,
  Loader2,
  DollarSign,
  FileSignature,
  PenTool,
  X,
  RotateCcw,
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
  accidentDateTime: string;
  accidentPlace: string;
  accidentDescription: string;
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
  accidentDate: string;
  accidentLocation: string;
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
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [claimNumber, setClaimNumber] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [currentSignatureField, setCurrentSignatureField] =
    useState<string>("");
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

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
    accidentDateTime: "",
    accidentPlace: "",
    accidentDescription: "",
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
    accidentDate: "",
    accidentLocation: "",
    vehicleMake: "",
    vehicleModel: "",
    vehicleYear: "",
    licensePlate: "",
    injuries: [],
    propertyDamage: "",
    estimatedValue: 0,
  });

  const steps = [
    { number: 1, title: "Insurance Information", icon: Shield },
    { number: 2, title: "Personal Information", icon: User },
    { number: 3, title: "Accident Details", icon: AlertTriangle },
    { number: 4, title: "Medical Information", icon: FileText },
    { number: 5, title: "Employment & Wages", icon: DollarSign },
    { number: 6, title: "Authorizations", icon: FileSignature },
    { number: 7, title: "Review & Submit", icon: CheckCircle },
  ];

  // Signature functionality
  useEffect(() => {
    if (showSignatureModal && canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      if (context) {
        context.lineCap = "round";
        context.strokeStyle = "#1f2937";
        context.lineWidth = 2;
        contextRef.current = context;
      }
    }
  }, [showSignatureModal]);

  const startDrawing = (event: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const { offsetX, offsetY } = event.nativeEvent;
    contextRef.current?.beginPath();
    contextRef.current?.moveTo(offsetX, offsetY);
  };

  const draw = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = event.nativeEvent;
    contextRef.current?.lineTo(offsetX, offsetY);
    contextRef.current?.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    if (canvasRef.current && contextRef.current) {
      contextRef.current.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
    }
  };

  const saveSignature = () => {
    if (canvasRef.current) {
      const signatureDataUrl = canvasRef.current.toDataURL();
      setFormData((prev) => ({
        ...prev,
        [currentSignatureField]: signatureDataUrl,
        [`${currentSignatureField}Date`]: new Date()
          .toISOString()
          .split("T")[0],
      }));

      setShowSignatureModal(false);
      setCurrentSignatureField("");
    }
  };

  const openSignatureModal = (fieldName: string) => {
    setCurrentSignatureField(fieldName);
    setShowSignatureModal(true);
  };

  const handleInputChange = (
    field: keyof FloridaNoFaultFormData,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      setError("You must be signed in to submit a claim");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      // Set legacy fields for backward compatibility
      const submissionData = {
        // Required fields for API
        claimantName: formData.claimantName,
        claimantEmail: user.emailAddresses[0]?.emailAddress || "",
        claimantPhone:
          formData.claimantPhoneHome || formData.claimantPhone || "",
        claimantAddress: formData.claimantAddress || "",

        // Accident details
        accidentDate:
          formData.dateOfAccident ||
          formData.accidentDateTime ||
          new Date().toISOString(),
        accidentLocation: formData.accidentPlace || "",
        accidentDescription: formData.accidentDescription || "",

        // Insurance information
        insuranceCompany: formData.insuranceCompany || "",
        policyNumber: formData.policyNumber || "",

        // Vehicle information
        vehicleMake: formData.yourVehicle || "Not specified",
        vehicleModel: "Not specified",
        vehicleYear: "Not specified",
        licensePlate: "Not specified",

        // Injuries
        injuries: formData.injured
          ? [
              {
                type: "General",
                description:
                  formData.injuryDescription || "Injury from accident",
                severity: "moderate",
              },
            ]
          : [],

        // Additional fields
        propertyDamage: "",
        estimatedValue: 0,
      };

      const response = await fetch("/api/claims", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit claim");
      }

      setClaimNumber(data.claim?.claimNumber || "Pending");
      setSubmitted(true);
    } catch (err) {
      console.error("Error submitting claim:", err);
      setError(err instanceof Error ? err.message : "Failed to submit claim");
    } finally {
      setSubmitting(false);
    }
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.insuranceCompany && formData.policyNumber;
      case 2:
        return formData.claimantName && formData.claimantPhoneHome;
      case 3:
        return (
          formData.accidentDateTime &&
          formData.accidentPlace &&
          formData.accidentDescription
        );
      case 4:
        return true; // Medical info is optional
      case 5:
        return true; // Employment info is optional
      case 6:
        return true; // Authorizations are optional
      default:
        return true;
    }
  };

  const getStepValidationErrors = (step: number) => {
    const errors: string[] = [];

    switch (step) {
      case 1:
        if (!formData.insuranceCompany)
          errors.push("Auto Insurance Company is required");
        if (!formData.policyNumber) errors.push("Policy Number is required");
        break;
      case 2:
        if (!formData.claimantName) errors.push("Full Name is required");
        if (!formData.claimantPhoneHome) errors.push("Home Phone is required");
        break;
      case 3:
        if (!formData.accidentDateTime)
          errors.push("Date & Time of Accident is required");
        if (!formData.accidentPlace)
          errors.push("Place of Accident is required");
        if (!formData.accidentDescription)
          errors.push("Accident Description is required");
        break;
    }

    return errors;
  };

  const getFieldValidationState = (field: keyof FloridaNoFaultFormData) => {
    const currentErrors = getStepValidationErrors(currentStep);
    const fieldName =
      field === "insuranceCompany"
        ? "Auto Insurance Company"
        : field === "policyNumber"
        ? "Policy Number"
        : field === "claimantName"
        ? "Full Name"
        : field === "claimantPhoneHome"
        ? "Home Phone"
        : field === "accidentDateTime"
        ? "Date & Time of Accident"
        : field === "accidentPlace"
        ? "Place of Accident"
        : field === "accidentDescription"
        ? "Accident Description"
        : "";

    return {
      isInvalid: currentErrors.includes(fieldName),
      errorMessage: currentErrors.includes(fieldName)
        ? fieldName + " is required"
        : "",
    };
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-950 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="text-gray-600 dark:text-gray-400">
                Loading...
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    router.push("/");
    return null;
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 pt-24 pb-12">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card className="text-center shadow-2xl border-0 bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
              <CardContent className="pt-8 pb-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-blue-400/20 rounded-t-lg"></div>
                  <CheckCircle className="h-20 w-20 text-emerald-500 mx-auto mb-6 relative z-10 drop-shadow-lg" />
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-4">
                  Claim Submitted Successfully!
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
                  Your Florida No-Fault claim has been submitted and is being
                  processed.
                </p>
                <div className="bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-6 mb-8 shadow-lg">
                  <p className="text-emerald-800 dark:text-emerald-200 text-lg font-semibold">
                    <strong>Claim Number:</strong> {claimNumber}
                  </p>
                </div>
                <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400 mb-8">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <p>You will receive a confirmation email shortly</p>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <p>Our team will review your claim within 24-48 hours</p>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                    <p>You can track your claim status in your dashboard</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => router.push("/dashboard")}
                    className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    Go to Dashboard
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.location.reload()}
                    className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 dark:text-gray-300 px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    Submit Another Claim
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 pt-24 pb-12">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full mb-6 shadow-lg">
              <FileSignature className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-4">
              Florida No-Fault Claim Form
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-xl max-w-2xl mx-auto">
              Complete this form to file your Florida Personal Injury Protection
              (PIP) claim
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-12">
            <div className="flex items-center justify-between max-w-4xl mx-auto">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                      currentStep >= step.number
                        ? "bg-gradient-to-r from-emerald-500 to-blue-500 border-transparent text-white shadow-lg scale-110"
                        : "border-gray-300 text-gray-500 bg-white dark:bg-gray-800"
                    }`}
                  >
                    {currentStep > step.number ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <step.icon className="w-6 h-6" />
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-20 h-1 mx-4 rounded-full transition-all duration-300 ${
                        currentStep > step.number
                          ? "bg-gradient-to-r from-emerald-500 to-blue-500"
                          : "bg-gray-300"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 max-w-4xl mx-auto">
              {steps.map((step) => (
                <div key={step.number} className="text-center">
                  <span
                    className={`text-sm font-medium transition-all duration-300 ${
                      currentStep >= step.number
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-gray-500"
                    }`}
                  >
                    {step.title}
                  </span>
                  {currentStep === step.number && (
                    <div className="mt-2">
                      <span
                        className={`text-xs px-3 py-1 rounded-full ${
                          isStepValid(step.number)
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                            : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
                        }`}
                      >
                        {isStepValid(step.number)
                          ? "✓ Complete"
                          : "⚠ Required fields missing"}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-8 p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl shadow-lg">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <p className="text-red-800 dark:text-red-200 font-medium">
                  {error}
                </p>
              </div>
            </div>
          )}

          {/* Step Validation Errors */}
          {getStepValidationErrors(currentStep).length > 0 && (
            <div className="mb-8 p-6 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl shadow-lg">
              <h3 className="text-orange-800 dark:text-orange-200 font-semibold mb-3 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Please complete the following required fields to continue:
              </h3>
              <ul className="space-y-2">
                {getStepValidationErrors(currentStep).map((error, index) => (
                  <li
                    key={index}
                    className="text-orange-700 dark:text-orange-300 text-sm flex items-center gap-2"
                  >
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Form Content */}
          <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm dark:bg-gray-900/90">
            <CardContent className="pt-8 pb-8">
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      Insurance Information
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Please provide your auto insurance information.
                    </p>
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4">
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        <strong>Required:</strong> Auto Insurance Company,
                        Policy Number
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Auto Insurance Company{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <Input
                        value={formData.insuranceCompany}
                        onChange={(e) =>
                          handleInputChange("insuranceCompany", e.target.value)
                        }
                        placeholder="e.g., State Farm, Allstate"
                        required
                        className={
                          getFieldValidationState("insuranceCompany").isInvalid
                            ? "border-red-500 focus:border-red-500"
                            : ""
                        }
                      />
                      {getFieldValidationState("insuranceCompany")
                        .isInvalid && (
                        <p className="text-red-500 text-xs mt-1">
                          Auto Insurance Company is required
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Policy Number <span className="text-red-500">*</span>
                      </label>
                      <Input
                        value={formData.policyNumber}
                        onChange={(e) =>
                          handleInputChange("policyNumber", e.target.value)
                        }
                        placeholder="Enter your policy number"
                        required
                        className={
                          getFieldValidationState("policyNumber").isInvalid
                            ? "border-red-500 focus:border-red-500"
                            : ""
                        }
                      />
                      {getFieldValidationState("policyNumber").isInvalid && (
                        <p className="text-red-500 text-xs mt-1">
                          Policy Number is required
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Adjuster Name
                      </label>
                      <Input
                        value={formData.adjusterName}
                        onChange={(e) =>
                          handleInputChange("adjusterName", e.target.value)
                        }
                        placeholder="Name of your adjuster"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Adjuster Phone
                      </label>
                      <Input
                        value={formData.adjusterPhone}
                        onChange={(e) =>
                          handleInputChange("adjusterPhone", e.target.value)
                        }
                        placeholder="Phone number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        File Number
                      </label>
                      <Input
                        value={formData.fileNumber}
                        onChange={(e) =>
                          handleInputChange("fileNumber", e.target.value)
                        }
                        placeholder="Insurance file number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Policy Holder
                      </label>
                      <Input
                        value={formData.policyHolder}
                        onChange={(e) =>
                          handleInputChange("policyHolder", e.target.value)
                        }
                        placeholder="Name of policy holder"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Date of Accident
                      </label>
                      <Input
                        type="date"
                        value={formData.dateOfAccident}
                        onChange={(e) =>
                          handleInputChange("dateOfAccident", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Medical Insurance
                      </label>
                      <Input
                        value={formData.medicalInsurance}
                        onChange={(e) =>
                          handleInputChange("medicalInsurance", e.target.value)
                        }
                        placeholder="Medical insurance company"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Member ID
                      </label>
                      <Input
                        value={formData.medicalMemberId}
                        onChange={(e) =>
                          handleInputChange("medicalMemberId", e.target.value)
                        }
                        placeholder="Medical insurance member ID"
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      Personal Information
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Please provide your personal information.
                    </p>
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4">
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        <strong>Required:</strong> Full Name, Home Phone
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <Input
                        value={formData.claimantName}
                        onChange={(e) =>
                          handleInputChange("claimantName", e.target.value)
                        }
                        placeholder="Your full name"
                        required
                        className={
                          getFieldValidationState("claimantName").isInvalid
                            ? "border-red-500 focus:border-red-500"
                            : ""
                        }
                      />
                      {getFieldValidationState("claimantName").isInvalid && (
                        <p className="text-red-500 text-xs mt-1">
                          Full Name is required
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Home Phone <span className="text-red-500">*</span>
                      </label>
                      <Input
                        value={formData.claimantPhoneHome}
                        onChange={(e) =>
                          handleInputChange("claimantPhoneHome", e.target.value)
                        }
                        placeholder="Home phone number"
                        required
                        className={
                          getFieldValidationState("claimantPhoneHome").isInvalid
                            ? "border-red-500 focus:border-red-500"
                            : ""
                        }
                      />
                      {getFieldValidationState("claimantPhoneHome")
                        .isInvalid && (
                        <p className="text-red-500 text-xs mt-1">
                          Home Phone is required
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Business Phone
                      </label>
                      <Input
                        value={formData.claimantPhoneBusiness}
                        onChange={(e) =>
                          handleInputChange(
                            "claimantPhoneBusiness",
                            e.target.value
                          )
                        }
                        placeholder="Business phone number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Date of Birth
                      </label>
                      <Input
                        type="date"
                        value={formData.claimantDOB}
                        onChange={(e) =>
                          handleInputChange("claimantDOB", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Social Security Number
                      </label>
                      <Input
                        value={formData.claimantSSN}
                        onChange={(e) =>
                          handleInputChange("claimantSSN", e.target.value)
                        }
                        placeholder="XXX-XX-XXXX"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Florida Residency Duration
                      </label>
                      <Input
                        value={formData.floridaResidencyDuration}
                        onChange={(e) =>
                          handleInputChange(
                            "floridaResidencyDuration",
                            e.target.value
                          )
                        }
                        placeholder="e.g., 5 years"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Address
                    </label>
                    <Input
                      value={formData.claimantAddress}
                      onChange={(e) =>
                        handleInputChange("claimantAddress", e.target.value)
                      }
                      placeholder="Street, City, State, ZIP"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Permanent Address (if different)
                    </label>
                    <Input
                      value={formData.permanentAddress}
                      onChange={(e) =>
                        handleInputChange("permanentAddress", e.target.value)
                      }
                      placeholder="Permanent address if different from above"
                    />
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      Accident Details
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Please provide details about the accident.
                    </p>
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4">
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        <strong>Required:</strong> Date & Time of Accident,
                        Place of Accident, Accident Description
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Date & Time of Accident{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="datetime-local"
                        value={formData.accidentDateTime}
                        onChange={(e) =>
                          handleInputChange("accidentDateTime", e.target.value)
                        }
                        required
                        className={
                          getFieldValidationState("accidentDateTime").isInvalid
                            ? "border-red-500 focus:border-red-500"
                            : ""
                        }
                      />
                      {getFieldValidationState("accidentDateTime")
                        .isInvalid && (
                        <p className="text-red-500 text-xs mt-1">
                          Date & Time of Accident is required
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Place of Accident{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <Input
                        value={formData.accidentPlace}
                        onChange={(e) =>
                          handleInputChange("accidentPlace", e.target.value)
                        }
                        placeholder="Street, City, State"
                        required
                        className={
                          getFieldValidationState("accidentPlace").isInvalid
                            ? "border-red-500 focus:border-red-500"
                            : ""
                        }
                      />
                      {getFieldValidationState("accidentPlace").isInvalid && (
                        <p className="text-red-500 text-xs mt-1">
                          Place of Accident is required
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Brief Description of Accident{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <Textarea
                      value={formData.accidentDescription}
                      onChange={(e) =>
                        handleInputChange("accidentDescription", e.target.value)
                      }
                      placeholder="Describe what happened in the accident..."
                      rows={4}
                      required
                      className={
                        getFieldValidationState("accidentDescription").isInvalid
                          ? "border-red-500 focus:border-red-500"
                          : ""
                      }
                    />
                    {getFieldValidationState("accidentDescription")
                      .isInvalid && (
                      <p className="text-red-500 text-xs mt-1">
                        Accident Description is required
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Your Vehicle
                      </label>
                      <Input
                        value={formData.yourVehicle}
                        onChange={(e) =>
                          handleInputChange("yourVehicle", e.target.value)
                        }
                        placeholder="Make, model, year"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Family Vehicle
                      </label>
                      <Input
                        value={formData.familyVehicle}
                        onChange={(e) =>
                          handleInputChange("familyVehicle", e.target.value)
                        }
                        placeholder="Family vehicle details"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="injured"
                      checked={formData.injured}
                      onChange={(e) =>
                        handleInputChange(
                          "injured",
                          e.target.checked as boolean
                        )
                      }
                    />
                    <label
                      htmlFor="injured"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Were you injured as a result of this accident?
                    </label>
                  </div>

                  {formData.injured && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Describe Your Injury
                      </label>
                      <Textarea
                        value={formData.injuryDescription}
                        onChange={(e) =>
                          handleInputChange("injuryDescription", e.target.value)
                        }
                        placeholder="Describe your injuries..."
                        rows={3}
                      />
                    </div>
                  )}
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      Medical Information
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Please provide information about any medical treatment
                      received.
                    </p>
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 mb-4">
                      <p className="text-sm text-green-800 dark:text-green-200">
                        <strong>Optional:</strong> All medical information
                        fields are optional but recommended if you received
                        treatment
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="treatedByDoctor"
                      checked={formData.treatedByDoctor}
                      onChange={(e) =>
                        handleInputChange(
                          "treatedByDoctor",
                          e.target.checked as boolean
                        )
                      }
                    />
                    <label
                      htmlFor="treatedByDoctor"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Were you treated by a doctor?
                    </label>
                  </div>

                  {formData.treatedByDoctor && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Doctor&apos;s Name
                        </label>
                        <Input
                          value={formData.doctorName}
                          onChange={(e) =>
                            handleInputChange("doctorName", e.target.value)
                          }
                          placeholder="Doctor's name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Doctor&apos;s Address
                        </label>
                        <Input
                          value={formData.doctorAddress}
                          onChange={(e) =>
                            handleInputChange("doctorAddress", e.target.value)
                          }
                          placeholder="Doctor's address"
                        />
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="hospitalInpatient"
                        checked={formData.hospitalInpatient}
                        onChange={(e) =>
                          handleInputChange(
                            "hospitalInpatient",
                            e.target.checked as boolean
                          )
                        }
                      />
                      <label
                        htmlFor="hospitalInpatient"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Hospital Inpatient
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
                            e.target.checked as boolean
                          )
                        }
                      />
                      <label
                        htmlFor="hospitalOutpatient"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Hospital Outpatient
                      </label>
                    </div>
                  </div>

                  {(formData.hospitalInpatient ||
                    formData.hospitalOutpatient) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Hospital Name
                        </label>
                        <Input
                          value={formData.hospitalName}
                          onChange={(e) =>
                            handleInputChange("hospitalName", e.target.value)
                          }
                          placeholder="Hospital name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Hospital Address
                        </label>
                        <Input
                          value={formData.hospitalAddress}
                          onChange={(e) =>
                            handleInputChange("hospitalAddress", e.target.value)
                          }
                          placeholder="Hospital address"
                        />
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Medical Bills to Date
                      </label>
                      <Input
                        value={formData.medicalBillsToDate}
                        onChange={(e) =>
                          handleInputChange(
                            "medicalBillsToDate",
                            e.target.value
                          )
                        }
                        placeholder="Total medical bills amount"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="moreMedicalExpense"
                        checked={formData.moreMedicalExpense}
                        onChange={(e) =>
                          handleInputChange(
                            "moreMedicalExpense",
                            e.target.checked as boolean
                          )
                        }
                      />
                      <label
                        htmlFor="moreMedicalExpense"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Will you have more medical expenses?
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 5 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      Employment & Wages
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Please provide information about your employment and any
                      lost wages.
                    </p>
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 mb-4">
                      <p className="text-sm text-green-800 dark:text-green-200">
                        <strong>Optional:</strong> All employment fields are
                        optional but required if you lost wages due to the
                        accident
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="inCourseOfEmployment"
                      checked={formData.inCourseOfEmployment}
                      onChange={(e) =>
                        handleInputChange(
                          "inCourseOfEmployment",
                          e.target.checked as boolean
                        )
                      }
                    />
                    <label
                      htmlFor="inCourseOfEmployment"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      At the time of your accident, were you in the course of
                      your employment?
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="lostWages"
                      checked={formData.lostWages}
                      onChange={(e) =>
                        handleInputChange(
                          "lostWages",
                          e.target.checked as boolean
                        )
                      }
                    />
                    <label
                      htmlFor="lostWages"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Did you lose wages or salary as a result of your injury?
                    </label>
                  </div>

                  {formData.lostWages && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Amount of Loss to Date
                        </label>
                        <Input
                          value={formData.wageLossToDate}
                          onChange={(e) =>
                            handleInputChange("wageLossToDate", e.target.value)
                          }
                          placeholder="Total wage loss amount"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                          placeholder="Your average weekly wage"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Date Disability from Work Began
                        </label>
                        <Input
                          type="date"
                          value={formData.disabilityStart}
                          onChange={(e) =>
                            handleInputChange("disabilityStart", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Date You Returned to Work
                        </label>
                        <Input
                          type="date"
                          value={formData.disabilityEnd}
                          onChange={(e) =>
                            handleInputChange("disabilityEnd", e.target.value)
                          }
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
                        handleInputChange(
                          "workersComp",
                          e.target.checked as boolean
                        )
                      }
                    />
                    <label
                      htmlFor="workersComp"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Have you received, or are you eligible for, payments under
                      any workmen&apos;s compensation or employment law?
                    </label>
                  </div>

                  {formData.workersComp && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Workers Comp Amount
                      </label>
                      <Input
                        value={formData.workersCompAmount}
                        onChange={(e) =>
                          handleInputChange("workersCompAmount", e.target.value)
                        }
                        placeholder="Workers compensation amount"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Other Expenses
                    </label>
                    <Textarea
                      value={formData.otherExpenses}
                      onChange={(e) =>
                        handleInputChange("otherExpenses", e.target.value)
                      }
                      placeholder="Describe any other expenses related to the accident..."
                      rows={3}
                    />
                  </div>
                </div>
              )}

              {currentStep === 6 && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-4">
                      Authorizations & Legal Disclaimers
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
                      Please review and complete the required authorizations.
                    </p>
                    <div className="bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 mb-6">
                      <p className="text-emerald-800 dark:text-emerald-200 text-sm">
                        <strong>Optional:</strong> Signatures are optional but
                        recommended for faster claim processing
                      </p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6 shadow-lg">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-6 w-6 text-yellow-600 mt-1 flex-shrink-0" />
                      <p className="text-yellow-800 dark:text-yellow-200 font-semibold text-sm leading-relaxed">
                        ANY PERSON WHO KNOWINGLY AND WITH INTENT TO INJURE,
                        DEFRAUD OR DECEIVE ANY INSURANCE COMPANY MAKES A
                        STATEMENT OF CLAIM CONTAINING ANY FALSE INCOMPLETE OR
                        MISLEADING INFORMATION, IS GUILTY OF A FELONY OF THE
                        THIRD DEGREE.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
                        <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-3 flex items-center gap-2">
                          <FileSignature className="h-5 w-5" />
                          General Authorization
                        </h3>
                        <p className="text-blue-700 dark:text-blue-300 text-sm mb-4">
                          I authorize the release of any information necessary
                          to process this claim.
                        </p>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Signature
                            </label>
                            <div className="flex gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => openSignatureModal("signature")}
                                className="flex-1 border-2 border-dashed border-gray-300 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all duration-300"
                              >
                                <PenTool className="h-4 w-4 mr-2" />
                                {formData.signature
                                  ? "View Signature"
                                  : "Sign Here"}
                              </Button>
                              {formData.signature && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() =>
                                    openSignatureModal("signature")
                                  }
                                  className="px-3 border-red-300 hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                                >
                                  <RotateCcw className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Date
                            </label>
                            <Input
                              type="date"
                              value={formData.signatureDate}
                              onChange={(e) =>
                                handleInputChange(
                                  "signatureDate",
                                  e.target.value
                                )
                              }
                              className="border-2 focus:border-emerald-500 focus:ring-emerald-500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6">
                        <h3 className="font-semibold text-green-800 dark:text-green-200 mb-3 flex items-center gap-2">
                          <FileText className="h-5 w-5" />
                          Medical Authorization
                        </h3>
                        <p className="text-green-700 dark:text-green-300 text-sm mb-4">
                          This authorization will authorize you to furnish all
                          information regarding my condition while under your
                          observation or treatment, including history, x-ray and
                          physical findings, diagnosis and prognosis.
                        </p>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Signature
                            </label>
                            <div className="flex gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() =>
                                  openSignatureModal("medicalAuthSignature")
                                }
                                className="flex-1 border-2 border-dashed border-gray-300 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all duration-300"
                              >
                                <PenTool className="h-4 w-4 mr-2" />
                                {formData.medicalAuthSignature
                                  ? "View Signature"
                                  : "Sign Here"}
                              </Button>
                              {formData.medicalAuthSignature && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() =>
                                    openSignatureModal("medicalAuthSignature")
                                  }
                                  className="px-3 border-red-300 hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                                >
                                  <RotateCcw className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Date
                            </label>
                            <Input
                              type="date"
                              value={formData.medicalAuthDate}
                              onChange={(e) =>
                                handleInputChange(
                                  "medicalAuthDate",
                                  e.target.value
                                )
                              }
                              className="border-2 focus:border-emerald-500 focus:ring-emerald-500"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-6">
                        <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-3 flex items-center gap-2">
                          <DollarSign className="h-5 w-5" />
                          Wage Authorization
                        </h3>
                        <p className="text-purple-700 dark:text-purple-300 text-sm mb-4">
                          This authorization will authorize you to furnish all
                          information regarding my wages or salary while
                          employed by you.
                        </p>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Signature
                            </label>
                            <div className="flex gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() =>
                                  openSignatureModal("wageAuthSignature")
                                }
                                className="flex-1 border-2 border-dashed border-gray-300 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all duration-300"
                              >
                                <PenTool className="h-4 w-4 mr-2" />
                                {formData.wageAuthSignature
                                  ? "View Signature"
                                  : "Sign Here"}
                              </Button>
                              {formData.wageAuthSignature && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() =>
                                    openSignatureModal("wageAuthSignature")
                                  }
                                  className="px-3 border-red-300 hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                                >
                                  <RotateCcw className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Date
                            </label>
                            <Input
                              type="date"
                              value={formData.wageAuthDate}
                              onChange={(e) =>
                                handleInputChange(
                                  "wageAuthDate",
                                  e.target.value
                                )
                              }
                              className="border-2 focus:border-emerald-500 focus:ring-emerald-500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-12">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="px-8 py-3 rounded-xl border-2 hover:border-gray-400 transition-all duration-300"
                >
                  Previous
                </Button>

                {currentStep < steps.length ? (
                  <div className="flex flex-col items-end space-y-3">
                    <Button
                      onClick={nextStep}
                      disabled={!isStepValid(currentStep)}
                      className={`px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                        !isStepValid(currentStep)
                          ? "opacity-50 cursor-not-allowed bg-gray-400"
                          : "bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl"
                      }`}
                    >
                      Next
                    </Button>
                    {!isStepValid(currentStep) && (
                      <p className="text-red-500 text-xs text-right max-w-xs">
                        Please complete all required fields (marked with{" "}
                        <span className="text-red-500">*</span>) to continue
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-end space-y-3">
                    <Button
                      onClick={handleSubmit}
                      disabled={submitting || !isStepValid(currentStep)}
                      className={`px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                        submitting || !isStepValid(currentStep)
                          ? "opacity-50 cursor-not-allowed bg-gray-400"
                          : "bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl"
                      }`}
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Submit Claim"
                      )}
                    </Button>
                    {!isStepValid(currentStep) && (
                      <p className="text-red-500 text-xs text-right max-w-xs">
                        Please complete all required fields to submit your claim
                      </p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Signature Modal */}
          {showSignatureModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Digital Signature
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSignatureModal(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <div className="mb-6">
                  <canvas
                    ref={canvasRef}
                    width={400}
                    height={200}
                    className="border-2 border-gray-300 rounded-lg cursor-crosshair bg-white"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={clearSignature}
                    className="flex-1"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                  <Button
                    onClick={saveSignature}
                    className="flex-1 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white"
                  >
                    Save Signature
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
