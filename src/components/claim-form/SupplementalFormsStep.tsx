"use client";

import Image from "next/image";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { FloridaNoFaultFormData } from "@/lib/claim-form/floridaNoFaultForm";
import { FormHelpCallout } from "./FormHelpCallout";
import { FormReplicaLayout } from "./FormReplicaLayout";

type Props = {
  formData: FloridaNoFaultFormData;
  onChange: (
    field: keyof FloridaNoFaultFormData,
    value: string | boolean | string[]
  ) => void;
  onRequestInsuranceSignature: () => void;
  onRequestHipaaSignature: () => void;
};

/**
 * Pages 2–3 of the common Florida packet: authorizations and OIR disclosure.
 * Copy is educational; follow your insurer’s exact pages when you file.
 */
export function SupplementalFormsStep({
  formData,
  onChange,
  onRequestInsuranceSignature,
  onRequestHipaaSignature,
}: Props) {
  return (
    <div className="space-y-8">
      <FormHelpCallout title="How this usually works">
        <p>
          Insurers often ask for medical- and wage-related releases separate
          from the main application. Many people complete whatever pages their
          carrier attached to the packet—use the same titles when you file.
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          This tool does not provide legal advice. If you are unsure which page
          to sign, your insurer’s instructions or a licensed professional can
          help.
        </p>
      </FormHelpCallout>

      <FormReplicaLayout
        sectionLabel="Packet pages 2–3 (typical)"
        title="Insurance information disclosure authorization"
        subtitle="Authorization for release of insurance information — pattern used in many Florida packets"
      >
        <div className="space-y-6">
          <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-950 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
            This section is for organizing information in your account. It does
            not send anything to your insurer by itself—you choose what to
            submit and how.
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-bold uppercase text-slate-800 dark:text-slate-200">
                Insured name
              </label>
              <Input
                value={formData.insuranceAuthInsuredName}
                onChange={(e) =>
                  onChange("insuranceAuthInsuredName", e.target.value)
                }
                className="font-mono text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold uppercase text-slate-800 dark:text-slate-200">
                Policy number
              </label>
              <Input
                value={formData.insuranceAuthPolicyNumber}
                onChange={(e) =>
                  onChange("insuranceAuthPolicyNumber", e.target.value)
                }
                className="font-mono text-sm"
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-xs font-bold uppercase text-slate-800 dark:text-slate-200">
                Insurance company
              </label>
              <Input
                value={formData.insuranceAuthInsuranceCompany}
                onChange={(e) =>
                  onChange("insuranceAuthInsuranceCompany", e.target.value)
                }
                className="font-mono text-sm"
              />
            </div>
          </div>

          <div>
            <span className="mb-2 block text-xs font-bold uppercase text-slate-800 dark:text-slate-200">
              Scope
            </span>
            <div className="flex flex-col gap-2">
              <label className="flex items-start gap-2 text-sm">
                <input
                  type="radio"
                  name="insuranceAuthDisclosureType"
                  checked={formData.insuranceAuthDisclosureType === "complete"}
                  onChange={() =>
                    onChange("insuranceAuthDisclosureType", "complete")
                  }
                  className="mt-1"
                />
                <span>
                  Complete claim file (common when people want the recipient to
                  see the same materials the insurer has on file)
                </span>
              </label>
              <label className="flex items-start gap-2 text-sm">
                <input
                  type="radio"
                  name="insuranceAuthDisclosureType"
                  checked={formData.insuranceAuthDisclosureType === "partial"}
                  onChange={() =>
                    onChange("insuranceAuthDisclosureType", "partial")
                  }
                  className="mt-1"
                />
                <span>Limited / except as listed on the insurer’s form</span>
              </label>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold uppercase text-slate-800 dark:text-slate-200">
              Reason (plain language)
            </label>
            <Textarea
              value={formData.insuranceAuthReasonForDisclosure}
              onChange={(e) =>
                onChange("insuranceAuthReasonForDisclosure", e.target.value)
              }
              rows={3}
              className="font-mono text-sm"
              placeholder="Example: “At my request, to organize documents related to my claim.”"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-bold uppercase text-slate-800 dark:text-slate-200">
                Recipient name
              </label>
              <Input
                value={formData.insuranceAuthRecipientName}
                onChange={(e) =>
                  onChange("insuranceAuthRecipientName", e.target.value)
                }
                className="font-mono text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold uppercase text-slate-800 dark:text-slate-200">
                Recipient organization
              </label>
              <Input
                value={formData.insuranceAuthRecipientOrganization}
                onChange={(e) =>
                  onChange("insuranceAuthRecipientOrganization", e.target.value)
                }
                className="font-mono text-sm"
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-xs font-bold uppercase text-slate-800 dark:text-slate-200">
                Recipient address
              </label>
              <Input
                value={formData.insuranceAuthRecipientAddress}
                onChange={(e) =>
                  onChange("insuranceAuthRecipientAddress", e.target.value)
                }
                className="font-mono text-sm"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold uppercase text-slate-800 dark:text-slate-200">
              Signature
            </label>
            <div className="rounded border-2 border-dashed border-slate-300 p-4 dark:border-slate-600">
              {formData.insuranceAuthSignature ? (
                <div className="flex items-center justify-between gap-4">
                  <Image
                    src={formData.insuranceAuthSignature}
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
                    onClick={() => onChange("insuranceAuthSignature", "")}
                  >
                    Clear
                  </Button>
                </div>
              ) : (
                <Button type="button" variant="secondary" onClick={onRequestInsuranceSignature}>
                  <Shield className="mr-2 h-4 w-4" />
                  Add signature
                </Button>
              )}
            </div>
            <Input
              type="date"
              className="mt-2 max-w-xs font-mono text-sm"
              value={formData.insuranceAuthSignatureDate}
              onChange={(e) =>
                onChange("insuranceAuthSignatureDate", e.target.value)
              }
            />
          </div>
        </div>
      </FormReplicaLayout>

      <FormReplicaLayout
        sectionLabel="OIR-B1-1571 (typical)"
        title="Standard disclosure — initial treatment or service"
        subtitle="Office of Insurance Regulation form often included in PIP packets"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-bold uppercase text-slate-800 dark:text-slate-200">
              Insured / patient (print)
            </label>
            <Input
              value={formData.pipPatientName}
              onChange={(e) => onChange("pipPatientName", e.target.value)}
              className="font-mono text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold uppercase text-slate-800 dark:text-slate-200">
              Patient date
            </label>
            <Input
              type="date"
              value={formData.pipPatientDate}
              onChange={(e) => onChange("pipPatientDate", e.target.value)}
              className="font-mono text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold uppercase text-slate-800 dark:text-slate-200">
              Provider (print)
            </label>
            <Input
              value={formData.pipProviderName}
              onChange={(e) => onChange("pipProviderName", e.target.value)}
              className="font-mono text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold uppercase text-slate-800 dark:text-slate-200">
              Provider date
            </label>
            <Input
              type="date"
              value={formData.pipProviderDate}
              onChange={(e) => onChange("pipProviderDate", e.target.value)}
              className="font-mono text-sm"
            />
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-600 dark:text-slate-400">
          Original signatures are often required on the insurer’s version of
          this page. Many people sign the paper the office gives them and keep
          a copy.
        </p>
      </FormReplicaLayout>

      <FormReplicaLayout
        sectionLabel="Health information"
        title="Authorization to use or disclose health information"
        subtitle="Pattern similar to HIPAA authorizations — follow your provider’s form when you file"
      >
        <div className="space-y-4">
          <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-950 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
            Use the wording your healthcare provider or insurer supplies when
            that matters. This worksheet is only for your own drafts.
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-bold uppercase text-slate-800 dark:text-slate-200">
                Patient name
              </label>
              <Input
                value={formData.hipaaPatientName}
                onChange={(e) => onChange("hipaaPatientName", e.target.value)}
                className="font-mono text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold uppercase text-slate-800 dark:text-slate-200">
                Provider / organization
              </label>
              <Input
                value={formData.hipaaHealthcareProvider}
                onChange={(e) =>
                  onChange("hipaaHealthcareProvider", e.target.value)
                }
                className="font-mono text-sm"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold uppercase text-slate-800 dark:text-slate-200">
              Reason (plain language)
            </label>
            <Textarea
              value={formData.hipaaReasonForDisclosure}
              onChange={(e) =>
                onChange("hipaaReasonForDisclosure", e.target.value)
              }
              rows={3}
              className="font-mono text-sm"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-bold uppercase text-slate-800 dark:text-slate-200">
                Recipient name
              </label>
              <Input
                value={formData.hipaaRecipientName}
                onChange={(e) => onChange("hipaaRecipientName", e.target.value)}
                className="font-mono text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold uppercase text-slate-800 dark:text-slate-200">
                Recipient organization
              </label>
              <Input
                value={formData.hipaaRecipientOrganization}
                onChange={(e) =>
                  onChange("hipaaRecipientOrganization", e.target.value)
                }
                className="font-mono text-sm"
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-xs font-bold uppercase text-slate-800 dark:text-slate-200">
                Recipient address
              </label>
              <Input
                value={formData.hipaaRecipientAddress}
                onChange={(e) =>
                  onChange("hipaaRecipientAddress", e.target.value)
                }
                className="font-mono text-sm"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold uppercase text-slate-800 dark:text-slate-200">
              Signature
            </label>
            <div className="rounded border-2 border-dashed border-slate-300 p-4 dark:border-slate-600">
              {formData.hipaaSignature ? (
                <div className="flex items-center justify-between gap-4">
                  <Image
                    src={formData.hipaaSignature}
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
                    onClick={() => onChange("hipaaSignature", "")}
                  >
                    Clear
                  </Button>
                </div>
              ) : (
                <Button type="button" variant="secondary" onClick={onRequestHipaaSignature}>
                  <Shield className="mr-2 h-4 w-4" />
                  Add signature
                </Button>
              )}
            </div>
            <Input
              type="date"
              className="mt-2 max-w-xs font-mono text-sm"
              value={formData.hipaaSignatureDate}
              onChange={(e) =>
                onChange("hipaaSignatureDate", e.target.value)
              }
            />
          </div>
        </div>
      </FormReplicaLayout>
    </div>
  );
}
