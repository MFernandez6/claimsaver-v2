"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Download, Loader2, Printer, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { FloridaNoFaultFormData } from "@/lib/claim-form/floridaNoFaultForm";
import { generateClaimPDF } from "@/utils/pdfGenerator";

type Props = {
  claimId: string;
  claimNumber: string;
  formData: FloridaNoFaultFormData;
};

export function ClaimFormFinish({ claimId, claimNumber, formData }: Props) {
  const router = useRouter();
  const [pdfLoading, setPdfLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleDownloadPdf = async () => {
    setPdfLoading(true);
    try {
      const blob = await generateClaimPDF({
        claimNumber,
        status: "saved",
        submittedAt: new Date().toISOString(),
        claimantName: formData.claimantName,
        claimantDOB: formData.claimantDOB,
        claimantAddress: formData.claimantAddress,
        claimantPhone: formData.claimantPhone,
        claimantEmail: formData.claimantEmail,
        accidentDate: formData.accidentDate,
        accidentLocation: formData.accidentLocation,
        accidentDescription: formData.accidentDescription,
        vehicleYear: formData.vehicleYear,
        vehicleMake: formData.vehicleMake,
        vehicleModel: formData.vehicleModel,
        licensePlate: formData.licensePlate,
        insuranceCompany: formData.insuranceCompany,
        policyNumber: formData.policyNumber,
        policyHolder: formData.policyHolder,
        adjusterName: formData.adjusterName,
        adjusterPhone: formData.adjusterPhone,
        fileNumber: formData.fileNumber,
        injured: formData.injured,
        injuryDescription: formData.injuryDescription,
        treatedByDoctor: formData.treatedByDoctor,
        doctorName: formData.doctorName,
        hospitalName: formData.hospitalName,
        medicalBillsToDate: formData.medicalBillsToDate,
        inCourseOfEmployment: formData.inCourseOfEmployment,
        lostWages: formData.lostWages,
        wageLossToDate: formData.wageLossToDate,
        averageWeeklyWage: formData.averageWeeklyWage,
        workersComp: formData.workersComp,
        workersCompAmount: formData.workersCompAmount,
        otherExpenses: formData.otherExpenses,
        insuranceAuthSignature: formData.insuranceAuthSignature,
        insuranceAuthSignatureDate: formData.insuranceAuthSignatureDate,
        hipaaSignature: formData.hipaaSignature,
        hipaaSignatureDate: formData.hipaaSignatureDate,
        signature: formData.signature,
        signatureDate: formData.signatureDate,
        insuranceAuthInsuredName: formData.insuranceAuthInsuredName,
        insuranceAuthPolicyNumber: formData.insuranceAuthPolicyNumber,
        insuranceAuthInsuranceCompany: formData.insuranceAuthInsuranceCompany,
        insuranceAuthDisclosureType: formData.insuranceAuthDisclosureType,
        insuranceAuthDisclosureForm: formData.insuranceAuthDisclosureForm,
        insuranceAuthRecipientName: formData.insuranceAuthRecipientName,
        insuranceAuthRecipientOrganization:
          formData.insuranceAuthRecipientOrganization,
        insuranceAuthRecipientAddress: formData.insuranceAuthRecipientAddress,
        insuranceAuthDurationType: formData.insuranceAuthDurationType,
        insuranceAuthRevocationName: formData.insuranceAuthRevocationName,
        hipaaPatientName: formData.hipaaPatientName,
        hipaaHealthcareProvider: formData.hipaaHealthcareProvider,
        hipaaDisclosureType: formData.hipaaDisclosureType,
        hipaaDisclosureForm: formData.hipaaDisclosureForm,
        hipaaRecipientName: formData.hipaaRecipientName,
        hipaaRecipientOrganization: formData.hipaaRecipientOrganization,
        hipaaRecipientAddress: formData.hipaaRecipientAddress,
        hipaaDurationType: formData.hipaaDurationType,
        hipaaRevocationName: formData.hipaaRevocationName,
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `no-fault-worksheet-${claimNumber}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setPdfLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleUploadScan = async (file: File | null) => {
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    setUploadMessage(null);
    try {
      const fd = new FormData();
      fd.append("name", file.name || "Scanned no-fault application");
      fd.append("type", "insurance");
      fd.append(
        "description",
        "Scanned or photographed completed no-fault application (from user’s insurer form)."
      );
      fd.append("claimId", claimId);
      fd.append("file", file);

      const res = await fetch("/api/documents", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }
      setUploadMessage("Upload saved. You can view it in your dashboard.");
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center print:hidden dark:border-emerald-900 dark:bg-emerald-950/40">
        <h2 className="text-2xl font-semibold text-emerald-950 dark:text-emerald-100">
          Saved to your account
        </h2>
        <p className="mt-2 text-emerald-900/90 dark:text-emerald-200">
          Reference: <span className="font-mono font-semibold">{claimNumber}</span>
        </p>
        <p className="mt-3 text-sm text-emerald-900/80 dark:text-emerald-300/90">
          You can print or download your worksheet for your records. If you
          completed your carrier&apos;s paper form instead, you can upload a
          scan or photo when you are ready.
        </p>
        <p className="mt-4 text-sm font-medium text-emerald-950 dark:text-emerald-100">
          Next: open your dashboard to monitor this claim, upload documents, and
          keep everything in one place.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 print:hidden">
        <Button
          type="button"
          variant="outline"
          className="gap-2"
          onClick={handlePrint}
        >
          <Printer className="h-4 w-4" />
          Print worksheet
        </Button>
        <Button
          type="button"
          className="gap-2"
          onClick={handleDownloadPdf}
          disabled={pdfLoading}
        >
          {pdfLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          Download PDF
        </Button>
      </div>

      <div className="rounded-lg border border-slate-200 p-4 print:hidden dark:border-slate-700">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100">
          Upload a scan of your insurer&apos;s paper form
        </h3>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Many people photograph or scan the pages their insurer provided and
          keep a copy for themselves. PDF or image files usually work best.
        </p>
        <label className="mt-4 flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-6 dark:border-slate-600 dark:bg-slate-900/50">
          <Upload className="h-8 w-8 text-slate-400" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Choose file
          </span>
          <input
            type="file"
            accept="image/*,application/pdf"
            className="hidden"
            disabled={uploading}
            onChange={(e) => {
              const f = e.target.files?.[0];
              void handleUploadScan(f ?? null);
              e.target.value = "";
            }}
          />
        </label>
        {uploading && (
          <p className="mt-2 flex items-center gap-2 text-sm text-slate-600">
            <Loader2 className="h-4 w-4 animate-spin" /> Uploading…
          </p>
        )}
        {uploadMessage && (
          <p className="mt-2 text-sm text-emerald-700 dark:text-emerald-400">
            {uploadMessage}
          </p>
        )}
        {uploadError && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">
            {uploadError}
          </p>
        )}
      </div>

      <div className="flex flex-col items-center gap-3 print:hidden">
        <Button
          type="button"
          className="min-w-[220px] bg-gradient-to-r from-teal-600 to-teal-800 text-white hover:from-teal-700 hover:to-teal-900"
          onClick={() => router.push("/dashboard")}
        >
          Go to dashboard
        </Button>
        <p className="max-w-md text-center text-xs text-slate-500 dark:text-slate-400">
          Your account is ready—use the dashboard any time to add files and track
          your claim.
        </p>
      </div>

      {/* Print-only summary */}
      <div
        id="worksheet-print"
        className="hidden print:block print:bg-white"
      >
        <h1 className="font-serif text-xl font-bold uppercase">
          Florida No-Fault — Application worksheet
        </h1>
        <p className="font-mono text-sm">Reference {claimNumber}</p>
        <hr className="my-4" />
        <dl className="grid grid-cols-2 gap-2 text-sm">
          <dt className="font-semibold">Name</dt>
          <dd>{formData.claimantName}</dd>
          <dt className="font-semibold">Date of accident</dt>
          <dd>{formData.accidentDate || formData.dateOfAccident}</dd>
          <dt className="font-semibold">Insurer</dt>
          <dd>{formData.insuranceCompany}</dd>
        </dl>
      </div>
    </div>
  );
}
