"use client";

import { useState, useEffect } from "react";
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
  Save,
  Edit,
  Download,
  MessageSquare,
  Car,
  Shield,
  User,
  DollarSign,
  AlertTriangle,
  Loader2,
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

  // Load claim data
  const loadClaim = async () => {
    try {
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
  };

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/");
      return;
    }

    if (isLoaded && user && params.id) {
      loadClaim();
    }
  }, [isLoaded, user, router, params.id]);

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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-950 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8">
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-950 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Error Loading Claim
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <Button onClick={() => router.push("/admin")}>
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-950 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Claim Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              The claim you&apos;re looking for doesn&apos;t exist or has been
              removed.
            </p>
            <Button onClick={() => router.push("/admin")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Admin
            </Button>
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
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" onClick={() => router.push("/admin")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Admin
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Claim {claim.claimNumber}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {claim.claimantName} •{" "}
                {new Date(claim.accidentDate).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(claim.status)}>
                {claim.status}
              </Badge>
              <Badge className={getPriorityColor(claim.priority)}>
                {claim.priority}
              </Badge>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span className="text-red-800 dark:text-red-200">{error}</span>
            </div>
          )}

          <div className="flex items-center gap-4">
            {editing ? (
              <>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setEditing(false)}
                  disabled={saving}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button onClick={() => setEditing(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Claim
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
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
                        value={claim.claimantName}
                        onChange={(e) =>
                          setClaim({ ...claim, claimantName: e.target.value })
                        }
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">
                        {claim.claimantName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Email
                    </label>
                    {editing ? (
                      <Input
                        value={claim.claimantEmail}
                        onChange={(e) =>
                          setClaim({ ...claim, claimantEmail: e.target.value })
                        }
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">
                        {claim.claimantEmail}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Phone
                    </label>
                    {editing ? (
                      <Input
                        value={claim.claimantPhone}
                        onChange={(e) =>
                          setClaim({ ...claim, claimantPhone: e.target.value })
                        }
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">
                        {claim.claimantPhone}
                      </p>
                    )}
                  </div>
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
                      Date
                    </label>
                    {editing ? (
                      <Input
                        type="date"
                        value={claim.accidentDate.split("T")[0]}
                        onChange={(e) =>
                          setClaim({ ...claim, accidentDate: e.target.value })
                        }
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">
                        {new Date(claim.accidentDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Location
                    </label>
                    {editing ? (
                      <Input
                        value={claim.accidentLocation}
                        onChange={(e) =>
                          setClaim({
                            ...claim,
                            accidentLocation: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">
                        {claim.accidentLocation}
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
                      value={claim.accidentDescription}
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
                      {claim.accidentDescription}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Vehicle Information */}
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
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Make
                    </label>
                    {editing ? (
                      <Input
                        value={claim.vehicleMake}
                        onChange={(e) =>
                          setClaim({ ...claim, vehicleMake: e.target.value })
                        }
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">
                        {claim.vehicleMake}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Model
                    </label>
                    {editing ? (
                      <Input
                        value={claim.vehicleModel}
                        onChange={(e) =>
                          setClaim({ ...claim, vehicleModel: e.target.value })
                        }
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">
                        {claim.vehicleModel}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Year
                    </label>
                    {editing ? (
                      <Input
                        value={claim.vehicleYear}
                        onChange={(e) =>
                          setClaim({ ...claim, vehicleYear: e.target.value })
                        }
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">
                        {claim.vehicleYear}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      License Plate
                    </label>
                    {editing ? (
                      <Input
                        value={claim.licensePlate}
                        onChange={(e) =>
                          setClaim({ ...claim, licensePlate: e.target.value })
                        }
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">
                        {claim.licensePlate}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Insurance Information */}
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
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Insurance Company
                    </label>
                    {editing ? (
                      <Input
                        value={claim.insuranceCompany}
                        onChange={(e) =>
                          setClaim({
                            ...claim,
                            insuranceCompany: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">
                        {claim.insuranceCompany}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Policy Number
                    </label>
                    {editing ? (
                      <Input
                        value={claim.policyNumber}
                        onChange={(e) =>
                          setClaim({ ...claim, policyNumber: e.target.value })
                        }
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">
                        {claim.policyNumber}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status & Priority */}
            <Card>
              <CardHeader>
                <CardTitle>Status & Priority</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Status
                  </label>
                  {editing ? (
                    <Select
                      value={claim.status}
                      onValueChange={(value) =>
                        setClaim({ ...claim, status: value })
                      }
                    >
                      <SelectTrigger>
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
                    <Badge className={getStatusColor(claim.status)}>
                      {claim.status}
                    </Badge>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Priority
                  </label>
                  {editing ? (
                    <Select
                      value={claim.priority}
                      onValueChange={(value) =>
                        setClaim({ ...claim, priority: value })
                      }
                    >
                      <SelectTrigger>
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
                    <Badge className={getPriorityColor(claim.priority)}>
                      {claim.priority}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Financial Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Financial Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
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
                    />
                  ) : (
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      ${claim.estimatedValue.toLocaleString()}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
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
                    />
                  ) : (
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      ${claim.settlementAmount.toLocaleString()}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Notes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {claim.notes.map((note, index) => (
                    <div
                      key={index}
                      className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <p className="text-sm text-gray-900 dark:text-white">
                        {note.content}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {note.author}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(note.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <Textarea
                    placeholder="Add a note..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    rows={3}
                  />
                  <Button onClick={handleAddNote} className="w-full">
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
