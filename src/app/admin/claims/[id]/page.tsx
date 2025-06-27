"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  AlertTriangle,
  DollarSign,
  User,
  Loader2,
  Edit,
  Shield,
  FileText,
} from "lucide-react";
import { claimsApi, type Claim } from "@/lib/api";

export default function ClaimDetailPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const params = useParams();
  const [claim, setClaim] = useState<Claim | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [error, setError] = useState<string | null>(null);

  const loadClaim = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await claimsApi.getClaim(params.id as string);

      if (response.error) {
        throw new Error(response.error);
      }

      if (response.data) {
        setClaim(response.data);
      } else {
        throw new Error("Claim not found");
      }
    } catch (err) {
      console.error("Error loading claim:", err);
      setError(err instanceof Error ? err.message : "Failed to load claim");
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/");
      return;
    }

    if (isLoaded && user && params.id) {
      loadClaim();
    }
  }, [isLoaded, user, router, params.id, loadClaim]);

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

  const handleSave = async () => {
    if (!claim) return;

    try {
      setSaving(true);
      setError(null);

      const response = await claimsApi.updateClaim(claim._id, claim);

      if (response.error) {
        throw new Error(response.error);
      }

      setEditing(false);
      // Optionally reload the claim to get the latest data
      await loadClaim();
    } catch (err) {
      console.error("Error saving claim:", err);
      setError(err instanceof Error ? err.message : "Failed to save claim");
    } finally {
      setSaving(false);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim() || !claim) return;

    try {
      const note = {
        content: newNote,
        author: user?.fullName || "Admin User",
        timestamp: new Date().toISOString(),
      };

      const updatedClaim = {
        ...claim,
        notes: [...claim.notes, note],
      };

      const response = await claimsApi.updateClaim(claim._id, updatedClaim);

      if (response.error) {
        throw new Error(response.error);
      }

      setClaim(updatedClaim);
      setNewNote("");
    } catch (err) {
      console.error("Error adding note:", err);
      setError(err instanceof Error ? err.message : "Failed to add note");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950">
        {/* Background Image */}
        <div className="fixed inset-0 z-0">
          <Image
            src="/images/long-logo-ClaimSaver.jpg"
            alt="ClaimSaver+ Background"
            className="w-full h-full object-cover opacity-25"
            fill
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/70 via-white/80 to-indigo-50/70 dark:from-gray-950/70 dark:via-gray-900/80 dark:to-blue-950/70"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-8 pt-24">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="text-gray-600 dark:text-gray-400">
                Loading claim...
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !claim) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950">
        {/* Background Image */}
        <div className="fixed inset-0 z-0">
          <Image
            src="/images/long-logo-ClaimSaver.jpg"
            alt="ClaimSaver+ Background"
            className="w-full h-full object-cover opacity-25"
            fill
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/70 via-white/80 to-indigo-50/70 dark:from-gray-950/70 dark:via-gray-900/80 dark:to-blue-950/70"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-8 pt-24">
          <div className="text-center">
            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Error Loading Claim
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <Button
              onClick={() => router.push("/admin")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Admin
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!claim) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950">
        {/* Background Image */}
        <div className="fixed inset-0 z-0">
          <Image
            src="/images/long-logo-ClaimSaver.jpg"
            alt="ClaimSaver+ Background"
            className="w-full h-full object-cover opacity-25"
            fill
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/70 via-white/80 to-indigo-50/70 dark:from-gray-950/70 dark:via-gray-900/80 dark:to-blue-950/70"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-8 pt-24">
          <div className="text-center">
            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Claim Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              The claim you&apos;re looking for doesn&apos;t exist or has been
              removed.
            </p>
            <Button
              onClick={() => router.push("/admin")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Admin
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/images/long-logo-ClaimSaver.jpg"
          alt="ClaimSaver+ Background"
          className="w-full h-full object-cover opacity-25"
          fill
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/70 via-white/80 to-indigo-50/70 dark:from-gray-950/70 dark:via-gray-900/80 dark:to-blue-950/70"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              onClick={() => router.push("/admin")}
              className="hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Admin
            </Button>
            <div className="flex-1">
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-2">
                Claim{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {claim.claimNumber}
                </span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                {claim.claimantName} •{" "}
                {new Date(claim.accidentDate).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                className={`${getStatusColor(
                  claim.status
                )} px-4 py-2 text-sm font-semibold`}
              >
                {claim.status.replace("_", " ")}
              </Badge>
              <Badge
                className={`${getPriorityColor(
                  claim.priority
                )} px-4 py-2 text-sm font-semibold`}
              >
                {claim.priority}
              </Badge>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span className="text-red-800 dark:text-red-200">{error}</span>
            </div>
          )}

          <div className="flex items-center gap-4">
            {editing ? (
              <>
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  {saving ? (
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  ) : (
                    <Edit className="h-5 w-5 mr-2" />
                  )}
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setEditing(false)}
                  disabled={saving}
                  className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 dark:text-gray-300 px-6 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={() => setEditing(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <Edit className="h-5 w-5 mr-2" />
                  Edit Claim
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Insurance Information */}
            <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <Shield className="h-6 w-6" />
                  Insurance Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">
                      Insurance Company
                    </label>
                    {editing ? (
                      <Input
                        value={claim.insuranceCompany || ""}
                        onChange={(e) =>
                          setClaim({
                            ...claim,
                            insuranceCompany: e.target.value,
                          })
                        }
                        className="border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white font-medium">
                        {claim.insuranceCompany || "Not provided"}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">
                      Policy Number
                    </label>
                    {editing ? (
                      <Input
                        value={claim.policyNumber || ""}
                        onChange={(e) =>
                          setClaim({ ...claim, policyNumber: e.target.value })
                        }
                        className="border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white font-medium">
                        {claim.policyNumber || "Not provided"}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">
                      Claim Number
                    </label>
                    {editing ? (
                      <Input
                        value={claim.claimNumber || ""}
                        onChange={(e) =>
                          setClaim({ ...claim, claimNumber: e.target.value })
                        }
                        className="border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white font-medium">
                        {claim.claimNumber || "Not provided"}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">
                      Adjuster Name
                    </label>
                    {editing ? (
                      <Input
                        value={claim.adjusterName || ""}
                        onChange={(e) =>
                          setClaim({ ...claim, adjusterName: e.target.value })
                        }
                        className="border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white font-medium">
                        {claim.adjusterName || "Not provided"}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">
                      Adjuster Phone
                    </label>
                    {editing ? (
                      <Input
                        value={claim.adjusterPhone || ""}
                        onChange={(e) =>
                          setClaim({ ...claim, adjusterPhone: e.target.value })
                        }
                        className="border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white font-medium">
                        {claim.adjusterPhone || "Not provided"}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">
                      File Number
                    </label>
                    {editing ? (
                      <Input
                        value={claim.fileNumber || ""}
                        onChange={(e) =>
                          setClaim({ ...claim, fileNumber: e.target.value })
                        }
                        className="border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white font-medium">
                        {claim.fileNumber || "Not provided"}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Medical Insurance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Medical Insurance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Medical Insurance
                    </label>
                    {editing ? (
                      <Input
                        value={claim.medicalInsurance || ""}
                        onChange={(e) =>
                          setClaim({
                            ...claim,
                            medicalInsurance: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">
                        {claim.medicalInsurance || "Not provided"}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Member ID
                    </label>
                    {editing ? (
                      <Input
                        value={claim.medicalMemberId || ""}
                        onChange={(e) =>
                          setClaim({
                            ...claim,
                            medicalMemberId: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">
                        {claim.medicalMemberId || "Not provided"}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Claimant Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Claimant Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Name
                    </label>
                    {editing ? (
                      <Input
                        value={claim.claimantName || ""}
                        onChange={(e) =>
                          setClaim({ ...claim, claimantName: e.target.value })
                        }
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">
                        {claim.claimantName || "Not provided"}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Phone (Home)
                    </label>
                    {editing ? (
                      <Input
                        value={claim.claimantPhoneHome || ""}
                        onChange={(e) =>
                          setClaim({
                            ...claim,
                            claimantPhoneHome: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">
                        {claim.claimantPhoneHome || "Not provided"}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Phone (Business)
                    </label>
                    {editing ? (
                      <Input
                        value={claim.claimantPhoneBusiness || ""}
                        onChange={(e) =>
                          setClaim({
                            ...claim,
                            claimantPhoneBusiness: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">
                        {claim.claimantPhoneBusiness || "Not provided"}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Date of Birth
                    </label>
                    {editing ? (
                      <Input
                        type="date"
                        value={claim.claimantDOB || ""}
                        onChange={(e) =>
                          setClaim({ ...claim, claimantDOB: e.target.value })
                        }
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">
                        {claim.claimantDOB || "Not provided"}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Address
                  </label>
                  {editing ? (
                    <Input
                      value={claim.claimantAddress || ""}
                      onChange={(e) =>
                        setClaim({ ...claim, claimantAddress: e.target.value })
                      }
                    />
                  ) : (
                    <p className="text-gray-900 dark:text-white">
                      {claim.claimantAddress || "Not provided"}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      SSN
                    </label>
                    {editing ? (
                      <Input
                        value={claim.claimantSSN || ""}
                        onChange={(e) =>
                          setClaim({ ...claim, claimantSSN: e.target.value })
                        }
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">
                        {claim.claimantSSN || "Not provided"}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Florida Residency Duration
                    </label>
                    {editing ? (
                      <Input
                        value={claim.floridaResidencyDuration || ""}
                        onChange={(e) =>
                          setClaim({
                            ...claim,
                            floridaResidencyDuration: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">
                        {claim.floridaResidencyDuration || "Not provided"}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Permanent Address (if different)
                  </label>
                  {editing ? (
                    <Input
                      value={claim.permanentAddress || ""}
                      onChange={(e) =>
                        setClaim({ ...claim, permanentAddress: e.target.value })
                      }
                    />
                  ) : (
                    <p className="text-gray-900 dark:text-white">
                      {claim.permanentAddress || "Not provided"}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Accident Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Accident Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Date & Time
                    </label>
                    {editing ? (
                      <Input
                        type="datetime-local"
                        value={claim.accidentDateTime || ""}
                        onChange={(e) =>
                          setClaim({
                            ...claim,
                            accidentDateTime: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">
                        {claim.accidentDateTime || "Not provided"}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Place
                    </label>
                    {editing ? (
                      <Input
                        value={claim.accidentPlace || ""}
                        onChange={(e) =>
                          setClaim({ ...claim, accidentPlace: e.target.value })
                        }
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">
                        {claim.accidentPlace || "Not provided"}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Description
                  </label>
                  {editing ? (
                    <Textarea
                      value={claim.accidentDescription || ""}
                      onChange={(e) =>
                        setClaim({
                          ...claim,
                          accidentDescription: e.target.value,
                        })
                      }
                      rows={3}
                    />
                  ) : (
                    <p className="text-gray-900 dark:text-white">
                      {claim.accidentDescription || "Not provided"}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Your Vehicle
                    </label>
                    {editing ? (
                      <Input
                        value={claim.yourVehicle || ""}
                        onChange={(e) =>
                          setClaim({ ...claim, yourVehicle: e.target.value })
                        }
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">
                        {claim.yourVehicle || "Not provided"}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Family Vehicle
                    </label>
                    {editing ? (
                      <Input
                        value={claim.familyVehicle || ""}
                        onChange={(e) =>
                          setClaim({ ...claim, familyVehicle: e.target.value })
                        }
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">
                        {claim.familyVehicle || "Not provided"}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Were you injured?
                  </label>
                  {editing ? (
                    <Select
                      value={claim.injured ? "yes" : "no"}
                      onValueChange={(value) =>
                        setClaim({ ...claim, injured: value === "yes" })
                      }
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge
                      className={
                        claim.injured
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }
                    >
                      {claim.injured ? "Yes" : "No"}
                    </Badge>
                  )}
                </div>
                {claim.injured && (
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Injury Description
                    </label>
                    {editing ? (
                      <Textarea
                        value={claim.injuryDescription || ""}
                        onChange={(e) =>
                          setClaim({
                            ...claim,
                            injuryDescription: e.target.value,
                          })
                        }
                        rows={3}
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">
                        {claim.injuryDescription || "Not provided"}
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Medical Treatment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Medical Treatment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Treated by Doctor?
                  </label>
                  {editing ? (
                    <Select
                      value={claim.treatedByDoctor ? "yes" : "no"}
                      onValueChange={(value) =>
                        setClaim({ ...claim, treatedByDoctor: value === "yes" })
                      }
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge
                      className={
                        claim.treatedByDoctor
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }
                    >
                      {claim.treatedByDoctor ? "Yes" : "No"}
                    </Badge>
                  )}
                </div>
                {claim.treatedByDoctor && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Doctor Name
                      </label>
                      {editing ? (
                        <Input
                          value={claim.doctorName || ""}
                          onChange={(e) =>
                            setClaim({ ...claim, doctorName: e.target.value })
                          }
                        />
                      ) : (
                        <p className="text-gray-900 dark:text-white">
                          {claim.doctorName || "Not provided"}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Doctor Address
                      </label>
                      {editing ? (
                        <Input
                          value={claim.doctorAddress || ""}
                          onChange={(e) =>
                            setClaim({
                              ...claim,
                              doctorAddress: e.target.value,
                            })
                          }
                        />
                      ) : (
                        <p className="text-gray-900 dark:text-white">
                          {claim.doctorAddress || "Not provided"}
                        </p>
                      )}
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Hospital Inpatient?
                    </label>
                    {editing ? (
                      <Select
                        value={claim.hospitalInpatient ? "yes" : "no"}
                        onValueChange={(value) =>
                          setClaim({
                            ...claim,
                            hospitalInpatient: value === "yes",
                          })
                        }
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge
                        className={
                          claim.hospitalInpatient
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }
                      >
                        {claim.hospitalInpatient ? "Yes" : "No"}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Hospital Outpatient?
                    </label>
                    {editing ? (
                      <Select
                        value={claim.hospitalOutpatient ? "yes" : "no"}
                        onValueChange={(value) =>
                          setClaim({
                            ...claim,
                            hospitalOutpatient: value === "yes",
                          })
                        }
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge
                        className={
                          claim.hospitalOutpatient
                            ? "bg-orange-100 text-orange-800"
                            : "bg-gray-100 text-gray-800"
                        }
                      >
                        {claim.hospitalOutpatient ? "Yes" : "No"}
                      </Badge>
                    )}
                  </div>
                </div>
                {(claim.hospitalInpatient || claim.hospitalOutpatient) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Hospital Name
                      </label>
                      {editing ? (
                        <Input
                          value={claim.hospitalName || ""}
                          onChange={(e) =>
                            setClaim({ ...claim, hospitalName: e.target.value })
                          }
                        />
                      ) : (
                        <p className="text-gray-900 dark:text-white">
                          {claim.hospitalName || "Not provided"}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Hospital Address
                      </label>
                      {editing ? (
                        <Input
                          value={claim.hospitalAddress || ""}
                          onChange={(e) =>
                            setClaim({
                              ...claim,
                              hospitalAddress: e.target.value,
                            })
                          }
                        />
                      ) : (
                        <p className="text-gray-900 dark:text-white">
                          {claim.hospitalAddress || "Not provided"}
                        </p>
                      )}
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Medical Bills to Date
                    </label>
                    {editing ? (
                      <Input
                        value={claim.medicalBillsToDate || ""}
                        onChange={(e) =>
                          setClaim({
                            ...claim,
                            medicalBillsToDate: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">
                        {claim.medicalBillsToDate || "Not provided"}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      More Medical Expense?
                    </label>
                    {editing ? (
                      <Select
                        value={claim.moreMedicalExpense ? "yes" : "no"}
                        onValueChange={(value) =>
                          setClaim({
                            ...claim,
                            moreMedicalExpense: value === "yes",
                          })
                        }
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge
                        className={
                          claim.moreMedicalExpense
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }
                      >
                        {claim.moreMedicalExpense ? "Yes" : "No"}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Employment & Wages */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Employment & Wages
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    In Course of Employment?
                  </label>
                  {editing ? (
                    <Select
                      value={claim.inCourseOfEmployment ? "yes" : "no"}
                      onValueChange={(value) =>
                        setClaim({
                          ...claim,
                          inCourseOfEmployment: value === "yes",
                        })
                      }
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge
                      className={
                        claim.inCourseOfEmployment
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }
                    >
                      {claim.inCourseOfEmployment ? "Yes" : "No"}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Lost Wages?
                  </label>
                  {editing ? (
                    <Select
                      value={claim.lostWages ? "yes" : "no"}
                      onValueChange={(value) =>
                        setClaim({ ...claim, lostWages: value === "yes" })
                      }
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge
                      className={
                        claim.lostWages
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }
                    >
                      {claim.lostWages ? "Yes" : "No"}
                    </Badge>
                  )}
                </div>
                {claim.lostWages && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Wage Loss to Date
                      </label>
                      {editing ? (
                        <Input
                          value={claim.wageLossToDate || ""}
                          onChange={(e) =>
                            setClaim({
                              ...claim,
                              wageLossToDate: e.target.value,
                            })
                          }
                        />
                      ) : (
                        <p className="text-gray-900 dark:text-white">
                          {claim.wageLossToDate || "Not provided"}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Average Weekly Wage
                      </label>
                      {editing ? (
                        <Input
                          value={claim.averageWeeklyWage || ""}
                          onChange={(e) =>
                            setClaim({
                              ...claim,
                              averageWeeklyWage: e.target.value,
                            })
                          }
                        />
                      ) : (
                        <p className="text-gray-900 dark:text-white">
                          {claim.averageWeeklyWage || "Not provided"}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Disability Start Date
                      </label>
                      {editing ? (
                        <Input
                          type="date"
                          value={claim.disabilityStart || ""}
                          onChange={(e) =>
                            setClaim({
                              ...claim,
                              disabilityStart: e.target.value,
                            })
                          }
                        />
                      ) : (
                        <p className="text-gray-900 dark:text-white">
                          {claim.disabilityStart || "Not provided"}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Disability End Date
                      </label>
                      {editing ? (
                        <Input
                          type="date"
                          value={claim.disabilityEnd || ""}
                          onChange={(e) =>
                            setClaim({
                              ...claim,
                              disabilityEnd: e.target.value,
                            })
                          }
                        />
                      ) : (
                        <p className="text-gray-900 dark:text-white">
                          {claim.disabilityEnd || "Not provided"}
                        </p>
                      )}
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Workers Comp?
                  </label>
                  {editing ? (
                    <Select
                      value={claim.workersComp ? "yes" : "no"}
                      onValueChange={(value) =>
                        setClaim({ ...claim, workersComp: value === "yes" })
                      }
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge
                      className={
                        claim.workersComp
                          ? "bg-purple-100 text-purple-800"
                          : "bg-gray-100 text-gray-800"
                      }
                    >
                      {claim.workersComp ? "Yes" : "No"}
                    </Badge>
                  )}
                </div>
                {claim.workersComp && (
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Workers Comp Amount
                    </label>
                    {editing ? (
                      <Input
                        value={claim.workersCompAmount || ""}
                        onChange={(e) =>
                          setClaim({
                            ...claim,
                            workersCompAmount: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">
                        {claim.workersCompAmount || "Not provided"}
                      </p>
                    )}
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Other Expenses
                  </label>
                  {editing ? (
                    <Textarea
                      value={claim.otherExpenses || ""}
                      onChange={(e) =>
                        setClaim({ ...claim, otherExpenses: e.target.value })
                      }
                      rows={3}
                    />
                  ) : (
                    <p className="text-gray-900 dark:text-white">
                      {claim.otherExpenses || "Not provided"}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Legal Disclaimers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Legal Disclaimers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200 font-semibold">
                    ANY PERSON WHO KNOWINGLY AND WITH INTENT TO INJURE, DEFRAUD
                    OR DECEIVE ANY INSURANCE COMPANY MAKES A STATEMENT OF CLAIM
                    CONTAINING ANY FALSE INCOMPLETE OR MISLEADING INFORMATION,
                    IS GUILTY OF A FELONY OF THE THIRD DEGREE.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Signature
                    </label>
                    {editing ? (
                      <Input
                        value={claim.signature || ""}
                        onChange={(e) =>
                          setClaim({ ...claim, signature: e.target.value })
                        }
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">
                        {claim.signature || "Not provided"}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Date
                    </label>
                    {editing ? (
                      <Input
                        type="date"
                        value={claim.signatureDate || ""}
                        onChange={(e) =>
                          setClaim({ ...claim, signatureDate: e.target.value })
                        }
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">
                        {claim.signatureDate || "Not provided"}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Authorizations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Authorizations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Medical Authorization:</strong> This authorization
                    will authorize you to furnish all information regarding my
                    condition while under your observation or treatment,
                    including history, x-ray and physical findings, diagnosis
                    and prognosis.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Medical Auth Signature
                    </label>
                    {editing ? (
                      <Input
                        value={claim.medicalAuthSignature || ""}
                        onChange={(e) =>
                          setClaim({
                            ...claim,
                            medicalAuthSignature: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">
                        {claim.medicalAuthSignature || "Not provided"}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Medical Auth Date
                    </label>
                    {editing ? (
                      <Input
                        type="date"
                        value={claim.medicalAuthDate || ""}
                        onChange={(e) =>
                          setClaim({
                            ...claim,
                            medicalAuthDate: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">
                        {claim.medicalAuthDate || "Not provided"}
                      </p>
                    )}
                  </div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <p className="text-sm text-green-800 dark:text-green-200">
                    <strong>Wage Authorization:</strong> This authorization will
                    authorize you to furnish all information regarding my wages
                    or salary while employed by you.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Wage Auth Signature
                    </label>
                    {editing ? (
                      <Input
                        value={claim.wageAuthSignature || ""}
                        onChange={(e) =>
                          setClaim({
                            ...claim,
                            wageAuthSignature: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">
                        {claim.wageAuthSignature || "Not provided"}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Wage Auth Date
                    </label>
                    {editing ? (
                      <Input
                        type="date"
                        value={claim.wageAuthDate || ""}
                        onChange={(e) =>
                          setClaim({ ...claim, wageAuthDate: e.target.value })
                        }
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">
                        {claim.wageAuthDate || "Not provided"}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* OIR-B1-1571 Disclosure */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  OIR-B1-1571 Disclosure & Acknowledgement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                  <p className="text-sm text-purple-800 dark:text-purple-200">
                    <strong>Standard Disclosure:</strong> The undersigned
                    insured person affirms that services were actually rendered,
                    they have the right to confirm services, were not solicited,
                    services were explained, and they may be entitled to a
                    portion of any billing error reduction.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Patient Name
                    </label>
                    {editing ? (
                      <Input
                        value={claim.pipPatientName || ""}
                        onChange={(e) =>
                          setClaim({ ...claim, pipPatientName: e.target.value })
                        }
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">
                        {claim.pipPatientName || "Not provided"}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Patient Signature
                    </label>
                    {editing ? (
                      <Input
                        value={claim.pipPatientSignature || ""}
                        onChange={(e) =>
                          setClaim({
                            ...claim,
                            pipPatientSignature: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">
                        {claim.pipPatientSignature || "Not provided"}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Patient Date
                    </label>
                    {editing ? (
                      <Input
                        type="date"
                        value={claim.pipPatientDate || ""}
                        onChange={(e) =>
                          setClaim({ ...claim, pipPatientDate: e.target.value })
                        }
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">
                        {claim.pipPatientDate || "Not provided"}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Provider Name
                    </label>
                    {editing ? (
                      <Input
                        value={claim.pipProviderName || ""}
                        onChange={(e) =>
                          setClaim({
                            ...claim,
                            pipProviderName: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">
                        {claim.pipProviderName || "Not provided"}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Provider Signature
                    </label>
                    {editing ? (
                      <Input
                        value={claim.pipProviderSignature || ""}
                        onChange={(e) =>
                          setClaim({
                            ...claim,
                            pipProviderSignature: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">
                        {claim.pipProviderSignature || "Not provided"}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Provider Date
                    </label>
                    {editing ? (
                      <Input
                        type="date"
                        value={claim.pipProviderDate || ""}
                        onChange={(e) =>
                          setClaim({
                            ...claim,
                            pipProviderDate: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">
                        {claim.pipProviderDate || "Not provided"}
                      </p>
                    )}
                  </div>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <p className="text-sm text-red-800 dark:text-red-200 font-semibold">
                    Any person who knowingly and with intent to injure, defraud,
                    or deceive any insurer files a statement of Claim or an
                    application containing any false, incomplete, or misleading
                    information is guilty of a felony of the third degree per
                    Section 817.234(1)(b), Florida Statutes.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Status & Priority */}
            <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">
                  Status & Priority
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">
                    Status
                  </label>
                  {editing ? (
                    <Select
                      value={claim.status}
                      onValueChange={(value) =>
                        setClaim({ ...claim, status: value })
                      }
                    >
                      <SelectTrigger className="border-2 border-gray-200 focus:border-blue-500 rounded-lg">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="reviewing">Reviewing</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge
                      className={`${getStatusColor(
                        claim.status
                      )} px-4 py-2 text-sm font-semibold`}
                    >
                      {claim.status.replace("_", " ")}
                    </Badge>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">
                    Priority
                  </label>
                  {editing ? (
                    <Select
                      value={claim.priority}
                      onValueChange={(value) =>
                        setClaim({ ...claim, priority: value })
                      }
                    >
                      <SelectTrigger className="border-2 border-gray-200 focus:border-blue-500 rounded-lg">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge
                      className={`${getPriorityColor(
                        claim.priority
                      )} px-4 py-2 text-sm font-semibold`}
                    >
                      {claim.priority}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Financial Information */}
            <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <DollarSign className="h-6 w-6" />
                  Financial Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">
                    Estimated Value
                  </label>
                  {editing ? (
                    <Input
                      type="number"
                      value={claim.estimatedValue}
                      onChange={(e) =>
                        setClaim({
                          ...claim,
                          estimatedValue: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                    />
                  ) : (
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      ${claim.estimatedValue.toLocaleString()}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">
                    Settlement Amount
                  </label>
                  {editing ? (
                    <Input
                      type="number"
                      value={claim.settlementAmount}
                      onChange={(e) =>
                        setClaim({
                          ...claim,
                          settlementAmount: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                    />
                  ) : (
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      ${claim.settlementAmount.toLocaleString()}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <FileText className="h-6 w-6" />
                  Notes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4 max-h-64 overflow-y-auto">
                  {claim.notes.map((note, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
                    >
                      <p className="text-sm text-gray-900 dark:text-white">
                        {note.content}
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                          {note.author}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(note.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-3">
                  <Textarea
                    placeholder="Add a note..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    rows={3}
                    className="border-2 border-gray-200 focus:border-blue-500 rounded-lg resize-none"
                  />
                  <Button
                    onClick={handleAddNote}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    Add Note
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
