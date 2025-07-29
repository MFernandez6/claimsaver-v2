"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FAQ from "@/components/faq";
import { useTranslation } from "react-i18next";
import {
  ArrowRight,
  Clock,
  FileText,
  Upload,
  Shield,
  Zap,
  X,
  Star,
  Award,
  Bell,
} from "lucide-react";

export default function Notarization() {
  const { t } = useTranslation();
  const [isLearnMoreModalOpen, setIsLearnMoreModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);

  const handleLearnMoreClick = () => {
    setIsLearnMoreModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsLearnMoreModalOpen(false);
  };

  const handleDocumentClick = (docType: string) => {
    setSelectedDocument(docType);
  };

  const handleCloseDocumentModal = () => {
    setSelectedDocument(null);
  };

  const documentTypes = [
    t("notarization.documents.realEstate"),
    t("notarization.documents.legalContracts"),
    t("notarization.documents.powerOfAttorney"),
    t("notarization.documents.willsTrusts"),
    t("notarization.documents.businessAgreements"),
    t("notarization.documents.loanDocuments"),
    t("notarization.documents.affidavits"),
    t("notarization.documents.deedsTitles"),
  ];

  const documentDetails = {
    [t("notarization.documents.realEstate")]: {
      title: "Real Estate Documents",
      description:
        "Deeds, mortgages, property transfers, and real estate contracts require notarization to ensure legal validity and prevent fraud.",
      examples: [
        "Property Deeds",
        "Mortgage Documents",
        "Lease Agreements",
        "Property Transfers",
      ],
      requirements: "Valid government-issued ID required",
    },
    [t("notarization.documents.legalContracts")]: {
      title: "Legal Contracts",
      description:
        "Business contracts, service agreements, and legal documents need notarization to establish authenticity and enforceability.",
      examples: [
        "Service Agreements",
        "Partnership Contracts",
        "Employment Contracts",
        "Non-Disclosure Agreements",
      ],
      requirements: "All parties must be present with valid ID",
    },
    [t("notarization.documents.powerOfAttorney")]: {
      title: "Power of Attorney",
      description:
        "Legal documents granting authority to act on behalf of another person require notarization for legal recognition.",
      examples: [
        "General Power of Attorney",
        "Healthcare Power of Attorney",
        "Financial Power of Attorney",
        "Limited Power of Attorney",
      ],
      requirements: "Principal must be mentally competent and present",
    },
    [t("notarization.documents.willsTrusts")]: {
      title: "Wills & Trusts",
      description:
        "Estate planning documents require notarization to ensure they meet legal requirements and are properly executed.",
      examples: [
        "Last Will and Testament",
        "Living Trusts",
        "Codicils",
        "Estate Planning Documents",
      ],
      requirements: "Testator must be of sound mind and present",
    },
    [t("notarization.documents.businessAgreements")]: {
      title: "Business Agreements",
      description:
        "Corporate documents and business contracts need notarization to establish legal validity and prevent disputes.",
      examples: [
        "Articles of Incorporation",
        "Operating Agreements",
        "Business Contracts",
        "Corporate Resolutions",
      ],
      requirements: "Authorized signatories must be present",
    },
    [t("notarization.documents.loanDocuments")]: {
      title: "Loan Documents",
      description:
        "Financial agreements and loan documents require notarization to ensure legal enforceability and prevent fraud.",
      examples: [
        "Promissory Notes",
        "Loan Agreements",
        "Refinancing Documents",
        "Mortgage Modifications",
      ],
      requirements: "Borrower must be present with valid ID",
    },
    [t("notarization.documents.affidavits")]: {
      title: "Affidavits",
      description:
        "Sworn statements and affidavits require notarization to verify the identity of the person making the statement.",
      examples: [
        "Sworn Statements",
        "Identity Affidavits",
        "Financial Affidavits",
        "Legal Declarations",
      ],
      requirements: "Affiant must swear under oath",
    },
    [t("notarization.documents.deedsTitles")]: {
      title: "Deeds & Titles",
      description:
        "Property ownership documents and vehicle titles require notarization to transfer ownership legally.",
      examples: [
        "Vehicle Titles",
        "Property Deeds",
        "Transfer Documents",
        "Ownership Certificates",
      ],
      requirements: "Current owner must be present with valid ID",
    },
  };

  const faqItems = [
    {
      question: t("notarization.faq.whatIs.question"),
      answer: t("notarization.faq.whatIs.answer"),
    },
    {
      question: t("notarization.faq.legal.question"),
      answer: t("notarization.faq.legal.answer"),
    },
    {
      question: t("notarization.faq.documents.question"),
      answer: t("notarization.faq.documents.answer"),
    },
    {
      question: t("notarization.faq.duration.question"),
      answer: t("notarization.faq.duration.answer"),
    },
    {
      question: t("notarization.faq.requirements.question"),
      answer: t("notarization.faq.requirements.answer"),
    },
    {
      question: t("notarization.faq.security.question"),
      answer: t("notarization.faq.security.answer"),
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950">
        {/* Background Image */}
        <div className="fixed inset-0 z-0">
          <Image
            src="/images/long-logo-ClaimSaver.jpg"
            alt={t("notarization.hero.imageAlt")}
            className="w-full h-full object-cover opacity-25"
            fill
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/70 via-white/80 to-indigo-50/70 dark:from-gray-950/70 dark:via-gray-900/80 dark:to-blue-950/70"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              {t("notarization.hero.title")}{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {t("notarization.hero.subtitle")}
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto">
              {t("notarization.hero.description")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button
                size="lg"
                onClick={() =>
                  document
                    .getElementById("notarization-section")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                {t("notarization.hero.startNotarization")}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleLearnMoreClick}
                className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 dark:text-gray-300 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                {t("notarization.hero.learnMore")}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Document Upload Section */}
      <section
        id="notarization-section"
        className="pt-4 pb-8 relative overflow-hidden"
      >
        {/* Coming Soon Overlay */}
        <div className="absolute inset-0 backdrop-blur-sm flex items-center justify-center z-20">
          <div className="bg-white/98 dark:bg-gray-900/98 backdrop-blur-2xl rounded-2xl p-6 shadow-2xl border border-white/20 dark:border-gray-700/20 max-w-sm w-full mx-4 transform scale-105">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl">
              <div className="absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl animate-pulse"></div>
              <div className="absolute -bottom-8 -left-8 w-12 h-12 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-2xl animate-pulse delay-500"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 text-center">
              {/* Icon with Animation */}
              <div className="relative mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto shadow-2xl animate-pulse">
                  <Clock className="w-8 h-8 text-white animate-bounce" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center animate-ping">
                  <Star className="w-2 h-2 text-white" />
                </div>
                <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-pink-400 rounded-full flex items-center justify-center animate-ping delay-300">
                  <Award className="w-2 h-2 text-white" />
                </div>
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Coming{" "}
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse">
                  Soon
                </span>
              </h3>

              {/* Subtitle */}
              <p className="text-base text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                Our digital notarization service is currently in development and
                awaiting final licensing approval. We&apos;re working to bring
                you secure, convenient, and legally compliant remote
                notarization.
              </p>

              {/* Features Preview */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                  <Shield className="w-3 h-3 text-green-500" />
                  <span>Bank-Level Security</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                  <Clock className="w-3 h-3 text-blue-500" />
                  <span>24/7 Availability</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                  <Zap className="w-3 h-3 text-yellow-500" />
                  <span>Instant Processing</span>
                </div>
              </div>

              {/* Notification Button */}
              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group text-sm">
                <Bell className="w-3 h-3 mr-2 group-hover:animate-bounce" />
                Get Notified When Available
              </Button>

              {/* Progress Indicator */}
              <div className="mt-4">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse delay-150"></div>
                  <div className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-pulse delay-300"></div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Service development in progress
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Get Started with{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Notarization
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Upload your document and we&apos;ll connect you with a licensed
              notary via DocuSign
            </p>
          </div>

          {/* Notarization Steps */}
          <div className="mb-2">
            <div className="flex justify-center mb-4">
              <div className="flex items-center space-x-3">
                {[1, 2, 3, 4].map((step) => (
                  <div key={step} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                        step === 1
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-500"
                      }`}
                    >
                      {step}
                    </div>
                    {step < 4 && (
                      <div
                        className={`w-12 h-1 mx-2 ${
                          step === 1
                            ? "bg-blue-600"
                            : "bg-gray-200 dark:bg-gray-700"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Upload Document & Enter Details
              </p>
            </div>
          </div>

          {/* Main Notarization Card with Blur Effect */}
          <div className="relative">
            {/* Main Notarization Card */}
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 shadow-2xl">
              <CardHeader className="text-center pb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Upload className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                  Upload Your Document
                </CardTitle>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Supported formats: PDF (Max 10MB)
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Document Upload Section */}
                <div className="space-y-4">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                    Document Upload *
                  </h3>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                    <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                    <p className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Choose a PDF document to upload
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">
                      Maximum file size: 10MB | Supported format: PDF only
                    </p>
                    <input
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      id="document-upload"
                      required
                    />
                    <label
                      htmlFor="document-upload"
                      className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors"
                    >
                      Browse Files
                    </label>
                  </div>
                </div>

                {/* Primary Signer Information */}
                <div className="space-y-4">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                    Primary Signer Information *
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Full Legal Name *
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={100}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
                        placeholder="Enter your full legal name as it appears on ID"
                        title="Enter your full legal name exactly as it appears on your government-issued identification"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
                        placeholder="Enter your email address"
                        title="This email will be used for DocuSign envelope delivery"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        pattern="[0-9]{10,}"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
                        placeholder="Enter your phone number"
                        title="Phone number for identity verification during notarization"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Date of Birth *
                      </label>
                      <input
                        type="date"
                        required
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
                        title="Date of birth for identity verification"
                      />
                    </div>
                  </div>
                </div>

                {/* Identity Verification */}
                <div className="space-y-4">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                    Identity Verification *
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Government ID Type *
                      </label>
                      <select
                        required
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
                        title="Select the type of government-issued identification you will present"
                      >
                        <option value="">Select ID Type</option>
                        <option value="driver-license">
                          Driver&apos;s License
                        </option>
                        <option value="state-id">State ID Card</option>
                        <option value="passport">U.S. Passport</option>
                        <option value="military-id">Military ID</option>
                        <option value="permanent-resident">
                          Permanent Resident Card
                        </option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        ID Number (Last 4 digits) *
                      </label>
                      <input
                        type="password"
                        required
                        maxLength={4}
                        pattern="[0-9]{4}"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
                        placeholder="Last 4 digits only"
                        title="Enter only the last 4 digits of your ID number for verification"
                      />
                    </div>
                  </div>
                </div>

                {/* Notarization Details */}
                <div className="space-y-4">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                    Notarization Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Notarization Type *
                      </label>
                      <select
                        required
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
                        title="Select the type of notarization you require"
                      >
                        <option value="">Select Notarization Type</option>
                        <option value="acknowledgment">Acknowledgment</option>
                        <option value="jurat">Jurat (Oath/Affirmation)</option>
                        <option value="copy-certification">
                          Copy Certification
                        </option>
                        <option value="signature-witness">
                          Signature Witnessing
                        </option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Document Title
                      </label>
                      <input
                        type="text"
                        maxLength={200}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
                        placeholder="e.g., Power of Attorney, Affidavit"
                        title="Optional: Provide a title for your document"
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Recipients (Optional) */}
                <div className="space-y-4">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                    Additional Recipients (Optional)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Additional Email
                      </label>
                      <input
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
                        placeholder="Optional: Additional recipient email"
                        title="Optional: Add another email to receive the notarized document"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Special Instructions
                      </label>
                      <textarea
                        maxLength={500}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
                        placeholder="Any special instructions for the notary"
                        title="Optional: Provide any special instructions for the notarization process"
                      />
                    </div>
                  </div>
                </div>

                {/* Consent and Agreement */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      required
                      id="consent-agreement"
                      className="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                      htmlFor="consent-agreement"
                      className="text-sm text-gray-700 dark:text-gray-300"
                    >
                      I consent to electronic notarization and agree to the
                      terms of service. I understand that I will be required to
                      present valid government-issued identification during the
                      notarization session. *
                    </label>
                  </div>
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      required
                      id="identity-verification"
                      className="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                      htmlFor="identity-verification"
                      className="text-sm text-gray-700 dark:text-gray-300"
                    >
                      I agree to identity verification procedures and understand
                      that my session may be recorded for compliance purposes. *
                    </label>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  Start Notarization Process
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Online Notarization Hero Section */}
      <section className="py-12 bg-gradient-to-br from-blue-50/60 to-purple-50/60 dark:from-blue-950/40 dark:to-purple-950/40 relative overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Secure{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Online Notarization
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed max-w-2xl mx-auto">
            Experience the convenience of remote notarization with bank-level
            security, 24/7 availability, and instant processing through our
            DocuSign-powered platform.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-3">
                <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                Bank-Level Security
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
                256-bit encryption & secure document storage
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-3">
                <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                24/7 Availability
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
                Get notarized anytime, anywhere
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-3">
                <Zap className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                Instant Processing
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
                Complete notarization in under 10 minutes
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Document Types Section */}
      <section className="relative overflow-hidden py-12">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/60 via-white/70 to-indigo-50/60 dark:from-gray-950/60 dark:via-gray-900/70 dark:to-blue-950/60"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4 border-b-2 border-blue-600 pb-2">
              Documents We{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Notarize
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-medium">
              Professional notarization for all types of legal and business
              documents
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {documentTypes.map((docType, index) => (
              <Card
                key={index}
                className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 cursor-pointer hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-950/50 dark:hover:to-indigo-950/50"
                onClick={() => handleDocumentClick(docType)}
              >
                <CardContent className="p-4">
                  <FileText className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-gray-900 dark:text-white">
                    {docType}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-8 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FAQ
            title="Notarization FAQ"
            subtitle="Everything you need to know about our digital notarization service"
            items={faqItems}
          />
        </div>
      </section>

      {/* Learn More Modal */}
      {isLearnMoreModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={handleCloseModal}></div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto relative z-10">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                About Our Notarization Service
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Secure Digital Notarization
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Our notarization service uses DocuSign&apos;s industry-leading
                  platform to provide secure, legally compliant digital
                  notarization. All documents are encrypted and stored securely,
                  meeting the highest standards for digital security.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    Traditional Notarization
                  </h4>
                  <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                    <li>• Requires in-person meeting</li>
                    <li>• Limited availability</li>
                    <li>• Travel time and costs</li>
                    <li>• Paper-based process</li>
                  </ul>
                </div>
                <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                    Our Digital Service
                  </h4>
                  <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
                    <li>• Remote notarization</li>
                    <li>• 24/7 availability</li>
                    <li>• No travel required</li>
                    <li>• Secure digital process</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  How It Works
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        Upload Document
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Upload your PDF document and provide signer information
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        DocuSign Processing
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        We create a DocuSign envelope and send it for
                        notarization
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                      3
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        Receive Notarized Document
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Download your legally notarized document within minutes
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Legal Compliance
                </h3>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>
                    • <strong>State Approved:</strong> Compliant with all state
                    notarization laws
                  </li>
                  <li>
                    • <strong>Digital Security:</strong> Bank-level encryption
                    and security
                  </li>
                  <li>
                    • <strong>Audit Trail:</strong> Complete digital record of
                    the notarization process
                  </li>
                  <li>
                    • <strong>Legal Recognition:</strong> Accepted by courts,
                    government agencies, and businesses
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <Button
                onClick={handleCloseModal}
                variant="outline"
                className="flex-1"
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  handleCloseModal();
                  document
                    .getElementById("notarization-section")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Start Notarization
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Document Details Modal */}
      {selectedDocument && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div
            className="absolute inset-0"
            onClick={handleCloseDocumentModal}
          ></div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto relative z-10">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {documentDetails[selectedDocument]?.title}
              </h2>
              <button
                onClick={handleCloseDocumentModal}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {documentDetails[selectedDocument]?.description}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Common Examples
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {documentDetails[selectedDocument]?.examples.map(
                    (example, index) => (
                      <div
                        key={index}
                        className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg"
                      >
                        <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                          {example}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/30 dark:to-blue-950/30 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Notarization Requirements
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {documentDetails[selectedDocument]?.requirements}
                </p>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Why Notarization is Required
                </h3>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Legal validity and enforceability</li>
                  <li>• Identity verification and fraud prevention</li>
                  <li>• Compliance with state and federal laws</li>
                  <li>• Protection against legal challenges</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <Button
                onClick={handleCloseDocumentModal}
                variant="outline"
                className="flex-1"
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  handleCloseDocumentModal();
                  document
                    .getElementById("notarization-section")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Start Notarization
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
