"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { SignInButton, SignUpButton, useUser } from "@clerk/nextjs";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  FileText,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  getInitialFloridaNoFaultFormData,
  type CompletionMethod,
  type FloridaNoFaultFormData,
} from "@/lib/claim-form/floridaNoFaultForm";
import { ClaimFormFinish } from "./ClaimFormFinish";
import { FormHelpCallout } from "./FormHelpCallout";
import { FormReplicaLayout } from "./FormReplicaLayout";
import { SignatureCaptureModal } from "./SignatureCaptureModal";
import { SupplementalFormsStep } from "./SupplementalFormsStep";

const TOTAL_STEPS = 8;

const FRAUD_NOTICE =
  "Any person who knowingly and with intent to injure, defraud or deceive any insurance company makes a statement of claim containing any false incomplete or misleading information, is guilty of a felony of the third degree.";

type SigModal = null | "insurance" | "hipaa" | "main";

export function ClaimFormWizard() {
  const { user, isLoaded } = useUser();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FloridaNoFaultFormData>(() =>
    getInitialFloridaNoFaultFormData(),
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sigModal, setSigModal] = useState<SigModal>(null);
  const [done, setDone] = useState<{
    claimId: string;
    claimNumber: string;
  } | null>(null);
  const [authGateOpen, setAuthGateOpen] = useState(false);
  const resumeHandled = useRef(false);

  useEffect(() => {
    if (isLoaded && user) {
      setAuthGateOpen(false);
      setFormData((prev) => ({
        ...prev,
        claimantName: user.fullName || prev.claimantName,
        claimantEmail:
          user.primaryEmailAddress?.emailAddress || prev.claimantEmail,
        claimantPhone:
          user.phoneNumbers?.[0]?.phoneNumber || prev.claimantPhone,
      }));
    }
  }, [isLoaded, user]);

  const submitClaim = useCallback(
    async (data: FloridaNoFaultFormData): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/claims", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const responseData = await res.json();
        if (!res.ok) {
          throw new Error(responseData.error || "Could not save");
        }
        const c = responseData.claim;
        const claimId = String(c?._id ?? c?.id ?? "");
        const claimNumber = String(c?.claimNumber ?? c?.claim_number ?? "");
        if (!claimId || !claimNumber) {
          throw new Error(
            "Could not read saved claim reference. Please try again.",
          );
        }
        setDone({ claimId, claimNumber });
        return true;
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not save");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    if (!isLoaded || !user) return;
    const raw = sessionStorage.getItem("pendingClaimForm");
    if (!raw) return;
    const sp = new URLSearchParams(window.location.search);
    const urlResume = sp.get("resume") === "1";
    const flagResume = sessionStorage.getItem("pendingClaimResume") === "1";
    if (!urlResume && !flagResume) return;
    if (resumeHandled.current) return;
    resumeHandled.current = true;

    let parsed: FloridaNoFaultFormData;
    try {
      parsed = JSON.parse(raw) as FloridaNoFaultFormData;
    } catch {
      resumeHandled.current = false;
      return;
    }

    setFormData(parsed);
    void submitClaim(parsed).then((ok) => {
      if (ok) {
        sessionStorage.removeItem("pendingClaimForm");
        sessionStorage.removeItem("pendingClaimResume");
        if (urlResume) {
          window.history.replaceState({}, "", "/claim-form");
        }
      } else {
        resumeHandled.current = false;
      }
    });
  }, [isLoaded, user, submitClaim]);

  const handleChange = (
    field: keyof FloridaNoFaultFormData,
    value: string | boolean | string[],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const today = () => new Date().toISOString().split("T")[0];

  const onSignatureSaved = (dataUrl: string) => {
    if (sigModal === "insurance") {
      setFormData((prev) => ({
        ...prev,
        insuranceAuthSignature: dataUrl,
        insuranceAuthSignatureDate: today(),
      }));
    } else if (sigModal === "hipaa") {
      setFormData((prev) => ({
        ...prev,
        hipaaSignature: dataUrl,
        hipaaSignatureDate: today(),
      }));
    } else if (sigModal === "main") {
      setFormData((prev) => ({
        ...prev,
        signature: dataUrl,
        signatureDate: today(),
      }));
    }
    setSigModal(null);
  };

  const nextStep = () => {
    if (currentStep < TOTAL_STEPS) setCurrentStep((s) => s + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep((s) => s - 1);
  };

  const handleSubmit = async () => {
    if (!isLoaded) return;
    if (!user) {
      try {
        sessionStorage.setItem("pendingClaimForm", JSON.stringify(formData));
        sessionStorage.setItem("pendingClaimResume", "1");
      } catch {
        setError(
          "Could not prepare save. Check browser storage and try again.",
        );
        return;
      }
      setAuthGateOpen(true);
      return;
    }
    await submitClaim(formData);
  };

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-slate-500" />
      </div>
    );
  }

  if (done?.claimId && done?.claimNumber) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 dark:from-slate-950 dark:to-slate-900">
        <div className="container mx-auto max-w-2xl px-4">
          <ClaimFormFinish
            claimId={done.claimId}
            claimNumber={done.claimNumber}
            formData={formData}
          />
        </div>
      </div>
    );
  }

  const stepTitle = (n: number) => {
    switch (n) {
      case 1:
        return "Before you start";
      case 2:
        return "Application header";
      case 3:
        return "Your name and contact";
      case 4:
        return "Accident and vehicles";
      case 5:
        return "Injury and treatment";
      case 6:
        return "Work, wages, and insurer info";
      case 7:
        return "Other pages in the packet";
      case 8:
        return "Review and save";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {!user && (
        <div
          id="claim-auth"
          className="border-b border-slate-200 bg-teal-50/90 px-4 py-4 dark:border-slate-800 dark:bg-teal-950/40"
        >
          <div className="container mx-auto max-w-3xl text-center">
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
              New here? Complete the worksheet below, then save—we&apos;ll
              create your account so you can use the dashboard.
            </p>
            <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
              If you clicked &quot;Sign in&quot; and don&apos;t have an account
              yet, you&apos;re in the right place: finish the form and save to
              register. Already registered?
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              <SignInButton
                mode="modal"
                forceRedirectUrl="/claim-form?resume=1"
              >
                <Button type="button" variant="outline" size="sm">
                  Sign in
                </Button>
              </SignInButton>
              <SignUpButton
                mode="modal"
                forceRedirectUrl="/claim-form?resume=1"
              >
                <Button type="button" size="sm">
                  Create account
                </Button>
              </SignUpButton>
            </div>
          </div>
        </div>
      )}

      <div className="border-b border-slate-200 bg-white/90 py-10 dark:border-slate-800 dark:bg-slate-900/90">
        <div className="container mx-auto max-w-3xl px-4 text-center">
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900">
            <FileText className="h-7 w-7" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Florida no-fault application worksheet
          </h1>
          <p className="mt-3 text-slate-600 dark:text-slate-300">
            Step-by-step fields that follow the layout of the common{" "}
            <a
              href="/docs/FL-Auto-No-Fault-Forms-Updated-07-29-2021.pdf"
              className="font-medium text-slate-900 underline dark:text-slate-100"
              target="_blank"
              rel="noopener noreferrer"
            >
              Florida auto no-fault forms (PDF)
            </a>
            . Draft answers for <em>your</em> insurer&apos;s paperwork—this
            screen is not a substitute for their official form.
          </p>
          <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-slate-800 transition-all dark:bg-slate-200"
              style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
            />
          </div>
          <p className="mt-4 text-sm font-medium text-slate-700 dark:text-slate-200">
            Step {currentStep} of {TOTAL_STEPS}: {stepTitle(currentStep)}
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-3xl px-4 py-10">
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/50 dark:text-red-200">
            {error}
          </div>
        )}

        <Card className="border-slate-200 shadow-lg dark:border-slate-800 dark:bg-slate-900/80">
          <CardContent className="p-6 md:p-8">
            {currentStep === 1 && (
              <div className="space-y-6">
                <FormHelpCallout title="What this is">
                  <p>
                    Many people use a worksheet like this to line up answers
                    before they copy them onto the paper or portal their insurer
                    gave them. Others print this summary only for their own
                    files.
                  </p>
                </FormHelpCallout>
                <div className="rounded-lg border border-slate-200 p-4 text-sm text-slate-700 dark:border-slate-700 dark:text-slate-200">
                  <p className="font-semibold text-slate-900 dark:text-slate-50">
                    Not legal advice
                  </p>
                  <p className="mt-2">
                    This tool does not tell you what to claim or what outcome
                    you should expect. It only helps you organize information in
                    a way that often matches the Florida packet structure.
                  </p>
                </div>
                <label className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-200">
                  <input
                    type="radio"
                    name="completionMethod"
                    checked={formData.completionMethod === "digital_worksheet"}
                    onChange={() =>
                      handleChange("completionMethod", "digital_worksheet")
                    }
                    className="mt-1"
                  />
                  <span>
                    I plan to transfer these answers onto my insurer&apos;s
                    official form (or their portal), or print this summary for
                    my records.
                  </span>
                </label>
                <label className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-200">
                  <input
                    type="radio"
                    name="completionMethod"
                    checked={formData.completionMethod === "paper_hand"}
                    onChange={() =>
                      handleChange("completionMethod", "paper_hand")
                    }
                    className="mt-1"
                  />
                  <span>
                    I expect to fill out the paper form my insurer sent by hand;
                    I may upload a scan later.
                  </span>
                </label>
                <FormHelpCallout title="Usually helpful">
                  <p>
                    Many people keep a copy of the insurer&apos;s letter or
                    claim number nearby while they work—those details often go
                    in the header of the application.
                  </p>
                </FormHelpCallout>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <FormReplicaLayout
                  sectionLabel="Page 1 of 3 (typical)"
                  title='Application for Florida "No-Fault" Benefits'
                  subtitle="To enable the insurer to determine if you may be entitled to benefits under the Florida Personal Injury Protection law, please complete the form your insurer provides and return it as directed."
                >
                  <p className="mb-4 text-xs font-bold uppercase text-red-800 dark:text-red-300">
                    {FRAUD_NOTICE}
                  </p>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-bold uppercase text-slate-800 dark:text-slate-200">
                        Date
                      </label>
                      <p className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-sm dark:border-slate-600 dark:bg-slate-900">
                        {new Date().toLocaleDateString()}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Many paper forms ask for the date you fill this out.
                      </p>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-bold uppercase text-slate-800 dark:text-slate-200">
                        Our policy holder
                      </label>
                      <Input
                        value={formData.policyHolder}
                        onChange={(e) =>
                          handleChange("policyHolder", e.target.value)
                        }
                        className="font-mono text-sm"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-bold uppercase text-slate-800 dark:text-slate-200">
                        Date of accident
                      </label>
                      <Input
                        type="date"
                        value={formData.dateOfAccident}
                        onChange={(e) => {
                          handleChange("dateOfAccident", e.target.value);
                          handleChange("accidentDate", e.target.value);
                        }}
                        className="font-mono text-sm"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-bold uppercase text-slate-800 dark:text-slate-200">
                        File number
                      </label>
                      <Input
                        value={formData.fileNumber}
                        onChange={(e) =>
                          handleChange("fileNumber", e.target.value)
                        }
                        className="font-mono text-sm"
                        placeholder="If assigned"
                      />
                    </div>
                  </div>
                </FormReplicaLayout>
                <FormHelpCallout title="Often people…">
                  <p>
                    Put the insurer&apos;s file or claim number in the header
                    when they already have one; it can help the office match
                    your paperwork.
                  </p>
                </FormHelpCallout>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <FormReplicaLayout
                  sectionLabel="Page 1 (continued)"
                  title="Your name and address"
                  subtitle="As usually shown on the Florida application"
                >
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <label className="mb-1 block text-xs font-bold uppercase text-slate-800 dark:text-slate-200">
                        Your name
                      </label>
                      <Input
                        value={formData.claimantName}
                        onChange={(e) =>
                          handleChange("claimantName", e.target.value)
                        }
                        className="font-mono text-sm"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-bold uppercase text-slate-800 dark:text-slate-200">
                        Phone (home)
                      </label>
                      <Input
                        value={formData.claimantPhoneHome}
                        onChange={(e) =>
                          handleChange("claimantPhoneHome", e.target.value)
                        }
                        className="font-mono text-sm"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-bold uppercase text-slate-800 dark:text-slate-200">
                        Phone (business)
                      </label>
                      <Input
                        value={formData.claimantPhoneBusiness}
                        onChange={(e) =>
                          handleChange("claimantPhoneBusiness", e.target.value)
                        }
                        className="font-mono text-sm"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-bold uppercase text-slate-800 dark:text-slate-200">
                        Phone (primary for this account)
                      </label>
                      <Input
                        value={formData.claimantPhone}
                        onChange={(e) =>
                          handleChange("claimantPhone", e.target.value)
                        }
                        className="font-mono text-sm"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-bold uppercase text-slate-800 dark:text-slate-200">
                        Email
                      </label>
                      <Input
                        type="email"
                        value={formData.claimantEmail}
                        onChange={(e) =>
                          handleChange("claimantEmail", e.target.value)
                        }
                        className="font-mono text-sm"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="mb-1 block text-xs font-bold uppercase text-slate-800 dark:text-slate-200">
                        Your address (no., street, city, state, ZIP)
                      </label>
                      <Textarea
                        value={formData.claimantAddress}
                        onChange={(e) =>
                          handleChange("claimantAddress", e.target.value)
                        }
                        rows={3}
                        className="font-mono text-sm"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-bold uppercase text-slate-800 dark:text-slate-200">
                        Date of birth
                      </label>
                      <Input
                        type="date"
                        value={formData.claimantDOB}
                        onChange={(e) =>
                          handleChange("claimantDOB", e.target.value)
                        }
                        className="font-mono text-sm"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-bold uppercase text-slate-800 dark:text-slate-200">
                        Social Security no.
                      </label>
                      <Input
                        value={formData.claimantSSN}
                        onChange={(e) =>
                          handleChange("claimantSSN", e.target.value)
                        }
                        className="font-mono text-sm"
                        placeholder="If you choose to include it"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="mb-1 block text-xs font-bold uppercase text-slate-800 dark:text-slate-200">
                        Permanent address, if different
                      </label>
                      <Textarea
                        value={formData.permanentAddress}
                        onChange={(e) =>
                          handleChange("permanentAddress", e.target.value)
                        }
                        rows={2}
                        className="font-mono text-sm"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="mb-1 block text-xs font-bold uppercase text-slate-800 dark:text-slate-200">
                        How long have you lived in Florida?
                      </label>
                      <Input
                        value={formData.floridaResidencyDuration}
                        onChange={(e) =>
                          handleChange(
                            "floridaResidencyDuration",
                            e.target.value,
                          )
                        }
                        className="font-mono text-sm"
                      />
                    </div>
                  </div>
                </FormReplicaLayout>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <FormReplicaLayout
                  sectionLabel="Page 1 (continued)"
                  title="Accident"
                  subtitle="Date, time, place, vehicles, and brief description"
                >
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-bold uppercase text-slate-800 dark:text-slate-200">
                        Date and time of accident
                      </label>
                      <Input
                        value={formData.accidentDateTime}
                        onChange={(e) =>
                          handleChange("accidentDateTime", e.target.value)
                        }
                        className="font-mono text-sm"
                        placeholder="e.g. 2024-03-15 4:30 PM"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-bold uppercase text-slate-800 dark:text-slate-200">
                        Place of accident
                      </label>
                      <Input
                        value={formData.accidentPlace}
                        onChange={(e) =>
                          handleChange("accidentPlace", e.target.value)
                        }
                        className="font-mono text-sm"
                        placeholder="Street, city, state"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="mb-1 block text-xs font-bold uppercase text-slate-800 dark:text-slate-200">
                        Brief description of accident and vehicles involved
                      </label>
                      <Textarea
                        value={formData.accidentDescription}
                        onChange={(e) =>
                          handleChange("accidentDescription", e.target.value)
                        }
                        rows={4}
                        className="font-mono text-sm"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="mb-1 block text-xs font-bold uppercase text-slate-800 dark:text-slate-200">
                        Describe motor vehicle you own
                      </label>
                      <Textarea
                        value={formData.yourVehicle}
                        onChange={(e) =>
                          handleChange("yourVehicle", e.target.value)
                        }
                        rows={2}
                        className="font-mono text-sm"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="mb-1 block text-xs font-bold uppercase text-slate-800 dark:text-slate-200">
                        Describe motor vehicle owned by any member of your
                        family
                      </label>
                      <Textarea
                        value={formData.familyVehicle}
                        onChange={(e) =>
                          handleChange("familyVehicle", e.target.value)
                        }
                        rows={2}
                        className="font-mono text-sm"
                      />
                    </div>
                  </div>
                </FormReplicaLayout>
                <FormHelpCallout title="Often people also…">
                  <p>
                    Note the same vehicle year / make / model in the short lines
                    if the insurer&apos;s form has separate boxes—many carriers
                    use both a narrative and a line for plate or VIN.
                  </p>
                </FormHelpCallout>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-bold uppercase text-slate-600 dark:text-slate-400">
                      Vehicle year (optional)
                    </label>
                    <Input
                      value={formData.vehicleYear}
                      onChange={(e) =>
                        handleChange("vehicleYear", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-bold uppercase text-slate-600 dark:text-slate-400">
                      Make / model (optional)
                    </label>
                    <Input
                      value={`${formData.vehicleMake} ${formData.vehicleModel}`.trim()}
                      onChange={(e) => {
                        const m = e.target.value.split(" ");
                        handleChange("vehicleMake", m[0] || "");
                        handleChange("vehicleModel", m.slice(1).join(" "));
                      }}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="mb-1 block text-xs font-bold uppercase text-slate-600 dark:text-slate-400">
                      License plate (optional)
                    </label>
                    <Input
                      value={formData.licensePlate}
                      onChange={(e) =>
                        handleChange("licensePlate", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div className="space-y-6">
                <FormReplicaLayout
                  sectionLabel="Page 1 (continued)"
                  title="Injury and medical treatment"
                  subtitle="If you were not injured, the paper form often asks you to sign and return early—follow that version."
                >
                  <label className="flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-200">
                    <input
                      type="checkbox"
                      checked={formData.injured}
                      onChange={(e) =>
                        handleChange("injured", e.target.checked)
                      }
                    />
                    As a result of this accident, were you injured?
                  </label>
                  {formData.injured && (
                    <>
                      <div className="mt-4">
                        <label className="mb-1 block text-xs font-bold uppercase text-slate-800 dark:text-slate-200">
                          Describe your injury
                        </label>
                        <Textarea
                          value={formData.injuryDescription}
                          onChange={(e) =>
                            handleChange("injuryDescription", e.target.value)
                          }
                          rows={3}
                          className="font-mono text-sm"
                        />
                      </div>
                      <label className="mt-4 flex items-center gap-3 text-sm">
                        <input
                          type="checkbox"
                          checked={formData.treatedByDoctor}
                          onChange={(e) =>
                            handleChange("treatedByDoctor", e.target.checked)
                          }
                        />
                        Were you treated by a doctor?
                      </label>
                      {formData.treatedByDoctor && (
                        <div className="mt-4 grid gap-4 md:grid-cols-2">
                          <div className="md:col-span-2">
                            <label className="mb-1 block text-xs font-bold uppercase text-slate-800 dark:text-slate-200">
                              Doctor&apos;s name and address
                            </label>
                            <Textarea
                              value={formData.doctorName}
                              onChange={(e) =>
                                handleChange("doctorName", e.target.value)
                              }
                              rows={2}
                              className="font-mono text-sm"
                            />
                          </div>
                        </div>
                      )}
                      <div className="mt-4 flex flex-wrap gap-4">
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={formData.hospitalInpatient}
                            onChange={(e) =>
                              handleChange(
                                "hospitalInpatient",
                                e.target.checked,
                              )
                            }
                          />
                          Hospital inpatient
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={formData.hospitalOutpatient}
                            onChange={(e) =>
                              handleChange(
                                "hospitalOutpatient",
                                e.target.checked,
                              )
                            }
                          />
                          Hospital outpatient
                        </label>
                      </div>
                      {(formData.hospitalInpatient ||
                        formData.hospitalOutpatient) && (
                        <div className="mt-4">
                          <label className="mb-1 block text-xs font-bold uppercase text-slate-800 dark:text-slate-200">
                            Hospital&apos;s name and address
                          </label>
                          <Textarea
                            value={formData.hospitalAddress}
                            onChange={(e) => {
                              handleChange("hospitalAddress", e.target.value);
                              handleChange("hospitalName", e.target.value);
                            }}
                            rows={2}
                            className="font-mono text-sm"
                          />
                        </div>
                      )}
                      <div className="mt-4 grid gap-4 md:grid-cols-2">
                        <div>
                          <label className="mb-1 block text-xs font-bold uppercase text-slate-800 dark:text-slate-200">
                            Amount of medical bills to date
                          </label>
                          <Input
                            value={formData.medicalBillsToDate}
                            onChange={(e) =>
                              handleChange("medicalBillsToDate", e.target.value)
                            }
                            className="font-mono text-sm"
                          />
                        </div>
                        <label className="flex items-center gap-2 text-sm md:mt-8">
                          <input
                            type="checkbox"
                            checked={formData.moreMedicalExpense}
                            onChange={(e) =>
                              handleChange(
                                "moreMedicalExpense",
                                e.target.checked,
                              )
                            }
                          />
                          Expect more medical expense
                        </label>
                      </div>
                    </>
                  )}
                </FormReplicaLayout>
              </div>
            )}

            {currentStep === 6 && (
              <div className="space-y-6">
                <FormReplicaLayout
                  sectionLabel="Page 1 (continued)"
                  title="Employment, wages, and other expenses"
                  subtitle="As usually shown on the Florida application"
                >
                  <label className="flex items-center gap-3 text-sm">
                    <input
                      type="checkbox"
                      checked={formData.inCourseOfEmployment}
                      onChange={(e) =>
                        handleChange("inCourseOfEmployment", e.target.checked)
                      }
                    />
                    At the time of the accident, were you in the course of your
                    employment?
                  </label>
                  <label className="mt-4 flex items-center gap-3 text-sm">
                    <input
                      type="checkbox"
                      checked={formData.lostWages}
                      onChange={(e) =>
                        handleChange("lostWages", e.target.checked)
                      }
                    />
                    Did you lose wages or salary as a result of your injury?
                  </label>
                  {formData.lostWages && (
                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-xs font-bold uppercase text-slate-800 dark:text-slate-200">
                          Amount of loss to date
                        </label>
                        <Input
                          value={formData.wageLossToDate}
                          onChange={(e) =>
                            handleChange("wageLossToDate", e.target.value)
                          }
                          className="font-mono text-sm"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-bold uppercase text-slate-800 dark:text-slate-200">
                          Average weekly wage or salary
                        </label>
                        <Input
                          value={formData.averageWeeklyWage}
                          onChange={(e) =>
                            handleChange("averageWeeklyWage", e.target.value)
                          }
                          className="font-mono text-sm"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-bold uppercase text-slate-800 dark:text-slate-200">
                          Date disability from work began
                        </label>
                        <Input
                          type="date"
                          value={formData.disabilityStart}
                          onChange={(e) =>
                            handleChange("disabilityStart", e.target.value)
                          }
                          className="font-mono text-sm"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-bold uppercase text-slate-800 dark:text-slate-200">
                          Date you returned to work
                        </label>
                        <Input
                          type="date"
                          value={formData.disabilityEnd}
                          onChange={(e) =>
                            handleChange("disabilityEnd", e.target.value)
                          }
                          className="font-mono text-sm"
                        />
                      </div>
                    </div>
                  )}
                  <label className="mt-4 flex items-center gap-3 text-sm">
                    <input
                      type="checkbox"
                      checked={formData.workersComp}
                      onChange={(e) =>
                        handleChange("workersComp", e.target.checked)
                      }
                    />
                    Have you received or are you eligible for payments under
                    workers&apos; compensation or another employment law?
                  </label>
                  {formData.workersComp && (
                    <div className="mt-2">
                      <label className="mb-1 block text-xs font-bold uppercase text-slate-800 dark:text-slate-200">
                        Amount per week / month
                      </label>
                      <Input
                        value={formData.workersCompAmount}
                        onChange={(e) =>
                          handleChange("workersCompAmount", e.target.value)
                        }
                        className="font-mono text-sm"
                      />
                    </div>
                  )}
                  <div className="mt-6">
                    <label className="mb-1 block text-xs font-bold uppercase text-slate-800 dark:text-slate-200">
                      Present employers, occupation, and dates (free text — like
                      the lined section on the paper form)
                    </label>
                    <Textarea
                      value={formData.employersList}
                      onChange={(e) =>
                        handleChange("employersList", e.target.value)
                      }
                      rows={5}
                      className="font-mono text-sm"
                      placeholder="Employer name, address, occupation, from / to — one block per job if you like"
                    />
                  </div>
                  <div className="mt-6">
                    <label className="mb-1 block text-xs font-bold uppercase text-slate-800 dark:text-slate-200">
                      Other expenses from the injury
                    </label>
                    <Textarea
                      value={formData.otherExpenses}
                      onChange={(e) =>
                        handleChange("otherExpenses", e.target.value)
                      }
                      rows={3}
                      className="font-mono text-sm"
                    />
                  </div>
                </FormReplicaLayout>

                <FormReplicaLayout
                  sectionLabel="Page 1 (bottom)"
                  title="Auto insurance and health plan lines"
                  subtitle="Often printed at the bottom of the first page"
                >
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <label className="mb-1 block text-xs font-bold uppercase text-slate-800 dark:text-slate-200">
                        Name of auto insurance company
                      </label>
                      <Input
                        value={formData.insuranceCompany}
                        onChange={(e) =>
                          handleChange("insuranceCompany", e.target.value)
                        }
                        className="font-mono text-sm"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-bold uppercase text-slate-800 dark:text-slate-200">
                        Policy number
                      </label>
                      <Input
                        value={formData.policyNumber}
                        onChange={(e) =>
                          handleChange("policyNumber", e.target.value)
                        }
                        className="font-mono text-sm"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-bold uppercase text-slate-800 dark:text-slate-200">
                        Claim number (if any)
                      </label>
                      <Input
                        value={formData.fileNumber}
                        onChange={(e) =>
                          handleChange("fileNumber", e.target.value)
                        }
                        className="font-mono text-sm"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-bold uppercase text-slate-800 dark:text-slate-200">
                        Auto adjuster name
                      </label>
                      <Input
                        value={formData.adjusterName}
                        onChange={(e) =>
                          handleChange("adjusterName", e.target.value)
                        }
                        className="font-mono text-sm"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-bold uppercase text-slate-800 dark:text-slate-200">
                        Phone for auto adjuster
                      </label>
                      <Input
                        value={formData.adjusterPhone}
                        onChange={(e) =>
                          handleChange("adjusterPhone", e.target.value)
                        }
                        className="font-mono text-sm"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-bold uppercase text-slate-800 dark:text-slate-200">
                        Name of medical insurance
                      </label>
                      <Input
                        value={formData.medicalInsurance}
                        onChange={(e) =>
                          handleChange("medicalInsurance", e.target.value)
                        }
                        className="font-mono text-sm"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-bold uppercase text-slate-800 dark:text-slate-200">
                        Member ID / subscriber number
                      </label>
                      <Input
                        value={formData.medicalMemberId}
                        onChange={(e) =>
                          handleChange("medicalMemberId", e.target.value)
                        }
                        className="font-mono text-sm"
                      />
                    </div>
                  </div>
                </FormReplicaLayout>
              </div>
            )}

            {currentStep === 7 && (
              <SupplementalFormsStep
                formData={formData}
                onChange={handleChange}
                onRequestInsuranceSignature={() => setSigModal("insurance")}
                onRequestHipaaSignature={() => setSigModal("hipaa")}
              />
            )}

            {currentStep === 8 && (
              <div className="space-y-6">
                <FormHelpCallout title="Before you save">
                  <p>
                    Read your answers once more against the insurer&apos;s
                    official form. Many people catch typos in dates or policy
                    numbers on this pass.
                  </p>
                </FormHelpCallout>
                <div className="rounded-lg border border-slate-200 p-4 text-sm dark:border-slate-700">
                  <p className="font-semibold text-slate-900 dark:text-slate-50">
                    Main application signature (optional on this worksheet)
                  </p>
                  <p className="mt-2 text-slate-600 dark:text-slate-400">
                    Often the paper form asks for a signature at the end. You
                    can add one here for your PDF copy, or sign only the paper
                    your insurer provides.
                  </p>
                  <div className="mt-4 rounded border-2 border-dashed border-slate-300 p-4 dark:border-slate-600">
                    {formData.signature ? (
                      <div className="flex items-center justify-between gap-4">
                        <Image
                          src={formData.signature}
                          alt=""
                          width={220}
                          height={70}
                          unoptimized
                          className="max-h-16 object-contain"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleChange("signature", "")}
                        >
                          Clear
                        </Button>
                      </div>
                    ) : (
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => setSigModal("main")}
                      >
                        Add signature
                      </Button>
                    )}
                  </div>
                  <Input
                    type="date"
                    className="mt-2 max-w-xs font-mono text-sm"
                    value={formData.signatureDate}
                    onChange={(e) =>
                      handleChange("signatureDate", e.target.value)
                    }
                  />
                </div>
                <div className="rounded-lg border border-slate-200 p-4 text-sm dark:border-slate-700">
                  <p className="font-semibold text-slate-900 dark:text-slate-50">
                    How you will complete the insurer&apos;s form
                  </p>
                  <label className="mt-3 flex items-start gap-3">
                    <input
                      type="radio"
                      name="completionMethod2"
                      checked={
                        formData.completionMethod === "digital_worksheet"
                      }
                      onChange={() =>
                        handleChange(
                          "completionMethod",
                          "digital_worksheet" as CompletionMethod,
                        )
                      }
                    />
                    <span>
                      I am using this worksheet to help fill out my
                      insurer&apos;s official form or portal.
                    </span>
                  </label>
                  <label className="mt-2 flex items-start gap-3">
                    <input
                      type="radio"
                      name="completionMethod2"
                      checked={formData.completionMethod === "paper_hand"}
                      onChange={() =>
                        handleChange(
                          "completionMethod",
                          "paper_hand" as CompletionMethod,
                        )
                      }
                    />
                    <span>
                      I am using the paper form by hand and may upload a scan
                      after saving.
                    </span>
                  </label>
                </div>
                <dl className="grid gap-2 text-sm text-slate-700 dark:text-slate-200">
                  <div className="flex justify-between gap-4 border-b border-slate-100 py-2 dark:border-slate-800">
                    <dt>Name</dt>
                    <dd className="font-mono text-right">
                      {formData.claimantName || "—"}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4 border-b border-slate-100 py-2 dark:border-slate-800">
                    <dt>Date of accident</dt>
                    <dd className="font-mono text-right">
                      {formData.accidentDate || formData.dateOfAccident || "—"}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4 border-b border-slate-100 py-2 dark:border-slate-800">
                    <dt>Auto insurer</dt>
                    <dd className="font-mono text-right">
                      {formData.insuranceCompany || "—"}
                    </dd>
                  </div>
                </dl>
              </div>
            )}

            <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-6 dark:border-slate-800">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              {currentStep < TOTAL_STEPS ? (
                <Button type="button" onClick={nextStep} className="gap-2">
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="gap-2"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle className="h-4 w-4" />
                  )}
                  Save to my account
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <SignatureCaptureModal
        open={sigModal !== null}
        title={
          sigModal === "insurance"
            ? "Insurance authorization"
            : sigModal === "hipaa"
              ? "Health information authorization"
              : "Application signature"
        }
        onClose={() => setSigModal(null)}
        onSave={onSignatureSaved}
      />

      {authGateOpen && !user && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-gate-title"
            className="max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-700 dark:bg-slate-900"
          >
            <h3
              id="auth-gate-title"
              className="text-lg font-semibold text-slate-900 dark:text-slate-50"
            >
              Create an account to save
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Saving your worksheet requires a free account. After you sign up
              or sign in, we&apos;ll finish saving and you can open your
              dashboard to upload documents and track your claim.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setAuthGateOpen(false);
                  sessionStorage.removeItem("pendingClaimResume");
                }}
              >
                Cancel
              </Button>
              <SignInButton
                mode="modal"
                forceRedirectUrl="/claim-form?resume=1"
              >
                <Button type="button" variant="outline">
                  Sign in
                </Button>
              </SignInButton>
              <SignUpButton
                mode="modal"
                forceRedirectUrl="/claim-form?resume=1"
              >
                <Button type="button">Create account</Button>
              </SignUpButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
