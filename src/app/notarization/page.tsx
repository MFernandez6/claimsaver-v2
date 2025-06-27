"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Footer from "@/components/footer";
import FAQ from "@/components/faq";
import {
  FileText,
  Shield,
  Clock,
  CheckCircle,
  Upload,
  ArrowRight,
  Award,
  Users,
  Globe,
  Zap,
  Star,
  Lock,
  Calendar,
  DollarSign,
  X,
} from "lucide-react";

export default function Notarization() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLearnMoreModalOpen, setIsLearnMoreModalOpen] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleNotarizeDocument = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);

    // Simulate DocuSign integration
    setTimeout(() => {
      setIsProcessing(false);
      alert(
        "Document sent to DocuSign for notarization. You will receive an email with the notarized document."
      );
    }, 2000);
  };

  const handleLearnMoreClick = () => {
    setIsLearnMoreModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsLearnMoreModalOpen(false);
  };

  const features = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure & Legal",
      description:
        "Fully compliant with state notarization laws and regulations",
      color: "blue",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "24/7 Availability",
      description: "Get your documents notarized anytime, anywhere",
      color: "green",
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Remote Notarization",
      description: "Connect with licensed notaries via video conference",
      color: "purple",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Instant Processing",
      description: "Receive your notarized document within minutes",
      color: "orange",
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Bank-Level Security",
      description: "End-to-end encryption and secure document handling",
      color: "red",
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Certified Notaries",
      description: "All notaries are licensed and background-checked",
      color: "yellow",
    },
  ];

  const benefits = [
    {
      icon: <Calendar className="w-5 h-5" />,
      title: "No Appointments Needed",
      description: "Skip the hassle of scheduling and travel time",
    },
    {
      icon: <DollarSign className="w-5 h-5" />,
      title: "Affordable Pricing",
      description: "Competitive rates starting at $25 per document",
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "Expert Notaries",
      description: "Experienced professionals for all document types",
    },
    {
      icon: <Star className="w-5 h-5" />,
      title: "5-Star Service",
      description: "Rated excellent by thousands of satisfied customers",
    },
  ];

  const documentTypes = [
    "Real Estate Documents",
    "Legal Contracts",
    "Power of Attorney",
    "Wills & Trusts",
    "Business Agreements",
    "Loan Documents",
    "Affidavits",
    "Deeds & Titles",
  ];

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

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Online{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Notarization
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto">
              Get your documents notarized securely and legally from anywhere.
              Powered by DocuSign for the most trusted digital notarization
              experience.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Start Notarization
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleLearnMoreClick}
                className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 dark:text-gray-300 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Learn More
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-gray-950 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="fixed inset-0 z-0 opacity-15">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url('/images/logo-blue-black.png')`,
              backgroundSize: "300px 300px",
              backgroundRepeat: "repeat",
              backgroundPosition: "center",
              opacity: 0.15,
            }}
          ></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Why Choose Our{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Notarization Service?
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Professional, secure, and convenient notarization powered by
              DocuSign
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 backdrop-blur-sm"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader className="pb-4">
                  <div
                    className={`w-12 h-12 bg-gradient-to-r from-${feature.color}-500 to-${feature.color}-600 rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Document Upload Section */}
      <section className="pt-12 pb-8 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950/30 relative overflow-hidden">
        {/* Background Image */}
        <div className="fixed inset-0 z-0">
          <img
            src="/images/long-logo-ClaimSaver.jpg"
            alt="ClaimSaver+ Background"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50/80 to-blue-50/80 dark:from-gray-900/80 dark:to-blue-950/80"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Get Started with{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Notarization
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Upload your document and we&apos;ll connect you with a licensed
              notary via DocuSign
            </p>
          </div>

          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 shadow-2xl">
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                Upload Your Document
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-300">
                Supported formats: PDF, DOC, DOCX (Max 10MB)
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors duration-300">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="document-upload"
                />
                <label
                  htmlFor="document-upload"
                  className="cursor-pointer block"
                >
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    {selectedFile
                      ? selectedFile.name
                      : "Choose a document to upload"}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400">
                    {selectedFile
                      ? "Click to change file"
                      : "or drag and drop here"}
                  </p>
                </label>
              </div>

              {selectedFile && (
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-semibold text-green-800 dark:text-green-200">
                        Document Selected
                      </p>
                      <p className="text-sm text-green-600 dark:text-green-300">
                        {selectedFile.name} (
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <Button
                onClick={handleNotarizeDocument}
                disabled={!selectedFile || isProcessing}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </div>
                ) : (
                  <>
                    Start Notarization Process
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Document Types Section */}
      <section className="py-12 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Documents We{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Notarize
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Professional notarization for all types of legal and business
              documents
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {documentTypes.map((docType, index) => (
              <Card
                key={index}
                className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800"
              >
                <CardContent className="p-6">
                  <FileText className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {docType}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="pt-8 pb-16 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950/30 relative overflow-hidden">
        {/* Background Image */}
        <div className="fixed inset-0 z-0">
          <img
            src="/images/long-logo-ClaimSaver.jpg"
            alt="ClaimSaver+ Background"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50/80 to-blue-50/80 dark:from-gray-900/80 dark:to-blue-950/80"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                The{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Benefits
                </span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                Experience the convenience and security of online notarization
                with DocuSign integration.
              </p>

              <div className="space-y-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                      {benefit.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  Start Notarization
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-8 text-white shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <Award className="w-8 h-8" />
                  <h3 className="text-2xl font-bold">Service Highlights</h3>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-lg">Processing Time</span>
                    <span className="text-2xl font-bold">5-10 minutes</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg">Success Rate</span>
                    <span className="text-2xl font-bold">99.9%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg">Starting Price</span>
                    <span className="text-2xl font-bold">$25</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg">Customer Rating</span>
                    <span className="text-2xl font-bold">4.9/5</span>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      DocuSign Verified
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Secure & Legal
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Learn More Modal */}
      {isLearnMoreModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    How Online Notarization Works
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Understanding the secure and legal process of remote
                    notarization
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCloseModal}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-8">
                {/* Process Overview */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-600" />
                    The Notarization Process
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-blue-600 text-sm font-semibold">
                            1
                          </span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            Document Upload
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Upload your document securely through our platform.
                            We support PDF, DOC, and DOCX formats.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-blue-600 text-sm font-semibold">
                            2
                          </span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            Identity Verification
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Verify your identity using government-issued ID and
                            knowledge-based authentication questions.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-blue-600 text-sm font-semibold">
                            3
                          </span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            Video Conference
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Connect with a licensed notary via secure video
                            conference for real-time notarization.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-blue-600 text-sm font-semibold">
                            4
                          </span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            Digital Completion
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Sign and receive your notarized document
                            electronically with full legal validity.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Legal Compliance */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-green-600" />
                    Legal Compliance & Security
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            State Compliant
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            All notarizations comply with state-specific laws
                            and regulations.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            Bank-Level Security
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            End-to-end encryption and secure document handling
                            protocols.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            Audit Trail
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Complete digital record of the notarization process
                            for legal purposes.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            Licensed Notaries
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            All notaries are licensed, background-checked, and
                            certified for remote notarization.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Document Types */}
                <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-orange-600" />
                    Supported Document Types
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {documentTypes.map((docType, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {docType}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Requirements */}
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-600" />
                    What You Need
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        Technical Requirements
                      </h4>
                      <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span>
                            Computer, tablet, or smartphone with camera
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span>Stable internet connection</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span>Valid government-issued photo ID</span>
                        </li>
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        Document Requirements
                      </h4>
                      <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span>
                            Document must be complete and ready for signature
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span>
                            All parties must be present during notarization
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span>
                            Document must be in English or have certified
                            translation
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Call to Action */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-center">
                  <h3 className="text-xl font-semibold text-white mb-3">
                    Ready to Get Started?
                  </h3>
                  <p className="text-blue-100 mb-6">
                    Experience the convenience of online notarization with our
                    secure, legal, and efficient platform.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      onClick={handleCloseModal}
                      className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Start Notarization
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleCloseModal}
                      className="border-white text-white bg-transparent hover:bg-white hover:text-blue-600 px-6 py-3 font-semibold rounded-xl"
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FAQ Section */}
      <FAQ
        title="Notarization FAQ"
        subtitle="Everything you need to know about online notarization"
        items={[
          {
            question: "Is online notarization legal and valid?",
            answer:
              "Yes, online notarization is fully legal and valid in most states. It's governed by state laws and regulations, and our platform ensures compliance with all legal requirements. The notarized documents have the same legal validity as traditional in-person notarizations.",
          },
          {
            question: "What documents can I get notarized online?",
            answer:
              "You can notarize most legal and business documents including real estate documents, legal contracts, power of attorney, wills & trusts, business agreements, loan documents, affidavits, and deeds & titles. Some documents may have specific requirements depending on your state.",
          },
          {
            question: "How does the online notarization process work?",
            answer:
              "The process is simple: 1) Upload your document, 2) Verify your identity with government-issued ID, 3) Connect with a licensed notary via video conference, 4) Sign and receive your notarized document electronically. The entire process typically takes 5-10 minutes.",
          },
          {
            question: "What do I need for online notarization?",
            answer:
              "You'll need a computer, tablet, or smartphone with a camera, stable internet connection, valid government-issued photo ID, and your document ready for signature. All parties must be present during the notarization session.",
          },
          {
            question: "How much does online notarization cost?",
            answer:
              "Our online notarization service starts at $25 per document, which is competitive with traditional notary services. We offer transparent pricing with no hidden fees, and you can pay securely through our platform.",
          },
          {
            question: "How secure is the online notarization process?",
            answer:
              "Our platform uses bank-level security with end-to-end encryption, secure document handling, and complete audit trails. All notaries are licensed, background-checked professionals, and we maintain full compliance with state security requirements.",
          },
          {
            question: "Can I get notarized outside of business hours?",
            answer:
              "Yes! Our online notarization service is available 24/7, so you can get your documents notarized anytime, anywhere. No need to schedule appointments or travel to a notary office.",
          },
          {
            question: "What if I have technical issues during notarization?",
            answer:
              "Our support team is available to help with any technical issues. If problems persist, we can reschedule your session at no additional cost. We also provide detailed troubleshooting guides and live chat support.",
          },
        ]}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
