"use client";

import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Car,
  User,
  Shield,
  AlertTriangle,
  FileText,
  CheckCircle,
  Loader2,
} from "lucide-react";

interface ClaimFormData {
  // Personal Information
  claimantName: string;
  claimantEmail: string;
  claimantPhone: string;
  claimantAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };

  // Accident Details
  accidentDate: string;
  accidentLocation: string;
  accidentDescription: string;

  // Insurance Information
  insuranceCompany: string;
  policyNumber: string;

  // Vehicle Information
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: string;
  licensePlate: string;

  // Additional Information
  estimatedValue: number;
  injuries: Array<{
    type: string;
    description: string;
    severity: "minor" | "moderate" | "severe";
  }>;
  propertyDamage: string;
}

export default function ClaimFormPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [claimNumber, setClaimNumber] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<ClaimFormData>({
    claimantName: "",
    claimantEmail: "",
    claimantPhone: "",
    claimantAddress: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
    },
    accidentDate: "",
    accidentLocation: "",
    accidentDescription: "",
    insuranceCompany: "",
    policyNumber: "",
    vehicleMake: "",
    vehicleModel: "",
    vehicleYear: "",
    licensePlate: "",
    estimatedValue: 0,
    injuries: [],
    propertyDamage: "",
  });

  const [newInjury, setNewInjury] = useState({
    type: "",
    description: "",
    severity: "minor" as "minor" | "moderate" | "severe",
  });

  const steps = [
    { number: 1, title: "Personal Information", icon: User },
    { number: 2, title: "Accident Details", icon: AlertTriangle },
    { number: 3, title: "Vehicle Information", icon: Car },
    { number: 4, title: "Insurance Information", icon: Shield },
    { number: 5, title: "Review & Submit", icon: FileText },
  ];

  const handleInputChange = (field: string, value: string | number) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof ClaimFormData] as Record<string, unknown>),
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const addInjury = () => {
    if (newInjury.type && newInjury.description) {
      setFormData((prev) => ({
        ...prev,
        injuries: [...prev.injuries, { ...newInjury }],
      }));
      setNewInjury({ type: "", description: "", severity: "minor" });
    }
  };

  const removeInjury = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      injuries: prev.injuries.filter((_, i) => i !== index),
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

      const response = await fetch("/api/claims", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userId: user.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit claim");
      }

      setClaimNumber(data.claim.claimNumber);
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
        return (
          formData.claimantName &&
          formData.claimantEmail &&
          formData.claimantPhone
        );
      case 2:
        return (
          formData.accidentDate &&
          formData.accidentLocation &&
          formData.accidentDescription
        );
      case 3:
        return (
          formData.vehicleMake &&
          formData.vehicleModel &&
          formData.vehicleYear &&
          formData.licensePlate
        );
      case 4:
        return formData.insuranceCompany && formData.policyNumber;
      default:
        return true;
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-950 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-950 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card className="text-center">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <CheckCircle className="h-16 w-16 text-green-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                  Claim Submitted Successfully!
                </CardTitle>
                <CardDescription className="text-lg">
                  Your claim has been submitted and is being reviewed by our
                  team.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Claim Number:
                  </p>
                  <p className="text-xl font-mono font-bold text-gray-900 dark:text-white">
                    {claimNumber}
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    What happens next?
                  </h3>
                  <div className="space-y-2 text-left">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Our team will review your claim within 24-48 hours
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        You&apos;ll receive email updates on your claim status
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Our team may contact you for additional information
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={() => router.push("/dashboard")}
                    className="flex-1"
                  >
                    Go to Dashboard
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSubmitted(false);
                      setCurrentStep(1);
                      setFormData({
                        claimantName: "",
                        claimantEmail: "",
                        claimantPhone: "",
                        claimantAddress: {
                          street: "",
                          city: "",
                          state: "",
                          zipCode: "",
                        },
                        accidentDate: "",
                        accidentLocation: "",
                        accidentDescription: "",
                        insuranceCompany: "",
                        policyNumber: "",
                        vehicleMake: "",
                        vehicleModel: "",
                        vehicleYear: "",
                        licensePlate: "",
                        estimatedValue: 0,
                        injuries: [],
                        propertyDamage: "",
                      });
                    }}
                    className="flex-1"
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-950 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Submit Your Claim
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Please provide all the necessary information about your accident
              claim
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep === step.number;
                const isCompleted = currentStep > step.number;

                return (
                  <div key={step.number} className="flex items-center">
                    <div
                      className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                        isActive
                          ? "border-blue-600 bg-blue-600 text-white"
                          : isCompleted
                          ? "border-green-600 bg-green-600 text-white"
                          : "border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="h-6 w-6" />
                      ) : (
                        <Icon className="h-6 w-6" />
                      )}
                    </div>
                    <div className="ml-3">
                      <p
                        className={`text-sm font-medium ${
                          isActive
                            ? "text-blue-600 dark:text-blue-400"
                            : isCompleted
                            ? "text-green-600 dark:text-green-400"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        {step.title}
                      </p>
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`w-16 h-0.5 mx-4 ${
                          isCompleted
                            ? "bg-green-600"
                            : "bg-gray-300 dark:bg-gray-600"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          {/* Form Content */}
          <Card>
            <CardContent className="p-6">
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      Personal Information
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Please provide your contact information
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Full Name *
                      </label>
                      <Input
                        value={formData.claimantName}
                        onChange={(e) =>
                          handleInputChange("claimantName", e.target.value)
                        }
                        placeholder="Enter your full name"
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
                        placeholder="Enter your email address"
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
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Address Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Street Address
                        </label>
                        <Input
                          value={formData.claimantAddress.street}
                          onChange={(e) =>
                            handleInputChange(
                              "claimantAddress.street",
                              e.target.value
                            )
                          }
                          placeholder="Enter your street address"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          City
                        </label>
                        <Input
                          value={formData.claimantAddress.city}
                          onChange={(e) =>
                            handleInputChange(
                              "claimantAddress.city",
                              e.target.value
                            )
                          }
                          placeholder="Enter your city"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          State
                        </label>
                        <Input
                          value={formData.claimantAddress.state}
                          onChange={(e) =>
                            handleInputChange(
                              "claimantAddress.state",
                              e.target.value
                            )
                          }
                          placeholder="Enter your state"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          ZIP Code
                        </label>
                        <Input
                          value={formData.claimantAddress.zipCode}
                          onChange={(e) =>
                            handleInputChange(
                              "claimantAddress.zipCode",
                              e.target.value
                            )
                          }
                          placeholder="Enter your ZIP code"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      Accident Details
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Please provide information about the accident
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Accident Date *
                      </label>
                      <Input
                        type="date"
                        value={formData.accidentDate}
                        onChange={(e) =>
                          handleInputChange("accidentDate", e.target.value)
                        }
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
                        placeholder="e.g., Los Angeles, CA"
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
                      placeholder="Please describe what happened during the accident..."
                      rows={4}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Estimated Value of Claim
                    </label>
                    <Input
                      type="number"
                      value={formData.estimatedValue}
                      onChange={(e) =>
                        handleInputChange(
                          "estimatedValue",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      placeholder="Enter estimated value in dollars"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Property Damage Description
                    </label>
                    <Textarea
                      value={formData.propertyDamage}
                      onChange={(e) =>
                        handleInputChange("propertyDamage", e.target.value)
                      }
                      placeholder="Describe any property damage..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Injuries
                    </h3>
                    <div className="space-y-4">
                      {formData.injuries.map((injury, index) => (
                        <div
                          key={index}
                          className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <Badge variant="outline">{injury.type}</Badge>
                            <Badge
                              className={
                                injury.severity === "severe"
                                  ? "bg-red-100 text-red-800"
                                  : injury.severity === "moderate"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-green-100 text-green-800"
                              }
                            >
                              {injury.severity}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {injury.description}
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeInjury(index)}
                            className="mt-2 text-red-600 hover:text-red-700"
                          >
                            Remove
                          </Button>
                        </div>
                      ))}

                      <div className="border border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <Input
                            value={newInjury.type}
                            onChange={(e) =>
                              setNewInjury((prev) => ({
                                ...prev,
                                type: e.target.value,
                              }))
                            }
                            placeholder="Injury type"
                          />
                          <Select
                            value={newInjury.severity}
                            onValueChange={(
                              value: "minor" | "moderate" | "severe"
                            ) =>
                              setNewInjury((prev) => ({
                                ...prev,
                                severity: value,
                              }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Severity" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="minor">Minor</SelectItem>
                              <SelectItem value="moderate">Moderate</SelectItem>
                              <SelectItem value="severe">Severe</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            onClick={addInjury}
                            disabled={!newInjury.type || !newInjury.description}
                          >
                            Add Injury
                          </Button>
                        </div>
                        <Textarea
                          value={newInjury.description}
                          onChange={(e) =>
                            setNewInjury((prev) => ({
                              ...prev,
                              description: e.target.value,
                            }))
                          }
                          placeholder="Describe the injury..."
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      Vehicle Information
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Please provide details about the vehicle involved in the
                      accident
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      />
                    </div>
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
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        License Plate *
                      </label>
                      <Input
                        value={formData.licensePlate}
                        onChange={(e) =>
                          handleInputChange("licensePlate", e.target.value)
                        }
                        placeholder="Enter license plate number"
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      Insurance Information
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Please provide your insurance details
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Insurance Company *
                      </label>
                      <Input
                        value={formData.insuranceCompany}
                        onChange={(e) =>
                          handleInputChange("insuranceCompany", e.target.value)
                        }
                        placeholder="e.g., State Farm"
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
                        placeholder="Enter your policy number"
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 5 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      Review Your Claim
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Please review all information before submitting
                    </p>
                  </div>

                  <div className="space-y-6">
                    {/* Personal Information Review */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <User className="h-5 w-5" />
                          Personal Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Name
                            </p>
                            <p className="font-medium">
                              {formData.claimantName}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Email
                            </p>
                            <p className="font-medium">
                              {formData.claimantEmail}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Phone
                            </p>
                            <p className="font-medium">
                              {formData.claimantPhone}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Address
                            </p>
                            <p className="font-medium">
                              {formData.claimantAddress.street},{" "}
                              {formData.claimantAddress.city},{" "}
                              {formData.claimantAddress.state}{" "}
                              {formData.claimantAddress.zipCode}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Accident Details Review */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5" />
                          Accident Details
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Date
                            </p>
                            <p className="font-medium">
                              {new Date(
                                formData.accidentDate
                              ).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Location
                            </p>
                            <p className="font-medium">
                              {formData.accidentLocation}
                            </p>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Description
                          </p>
                          <p className="font-medium">
                            {formData.accidentDescription}
                          </p>
                        </div>
                        {formData.estimatedValue > 0 && (
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Estimated Value
                            </p>
                            <p className="font-medium">
                              ${formData.estimatedValue.toLocaleString()}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Vehicle Information Review */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Car className="h-5 w-5" />
                          Vehicle Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Make
                            </p>
                            <p className="font-medium">
                              {formData.vehicleMake}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Model
                            </p>
                            <p className="font-medium">
                              {formData.vehicleModel}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Year
                            </p>
                            <p className="font-medium">
                              {formData.vehicleYear}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              License Plate
                            </p>
                            <p className="font-medium">
                              {formData.licensePlate}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Insurance Information Review */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Shield className="h-5 w-5" />
                          Insurance Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Insurance Company
                            </p>
                            <p className="font-medium">
                              {formData.insuranceCompany}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Policy Number
                            </p>
                            <p className="font-medium">
                              {formData.policyNumber}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                >
                  Previous
                </Button>

                <div className="flex gap-2">
                  {currentStep < steps.length ? (
                    <Button
                      onClick={nextStep}
                      disabled={!isStepValid(currentStep)}
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      disabled={submitting || !isStepValid(currentStep)}
                      className="flex items-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <FileText className="h-4 w-4" />
                          Submit Claim
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
