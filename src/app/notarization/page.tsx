"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Footer from "@/components/footer";
import FAQ from "@/components/faq";
import {
  FileText,
  Shield,
  Clock,
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
  Sparkles,
  Bell,
  Rocket,
} from "lucide-react";

export default function Notarization() {
  const { t } = useTranslation();
  const [isLearnMoreModalOpen, setIsLearnMoreModalOpen] = useState(false);

  const handleLearnMoreClick = () => {
    setIsLearnMoreModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsLearnMoreModalOpen(false);
  };

  const features = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: t("notarization.features.secure.title"),
      description: t("notarization.features.secure.description"),
      color: "blue",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: t("notarization.features.availability.title"),
      description: t("notarization.features.availability.description"),
      color: "green",
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: t("notarization.features.remote.title"),
      description: t("notarization.features.remote.description"),
      color: "purple",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: t("notarization.features.instant.title"),
      description: t("notarization.features.instant.description"),
      color: "orange",
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: t("notarization.features.security.title"),
      description: t("notarization.features.security.description"),
      color: "red",
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: t("notarization.features.certified.title"),
      description: t("notarization.features.certified.description"),
      color: "yellow",
    },
  ];

  const benefits = [
    {
      icon: <Calendar className="w-5 h-5" />,
      title: t("notarization.benefits.noAppointments.title"),
      description: t("notarization.benefits.noAppointments.description"),
    },
    {
      icon: <DollarSign className="w-5 h-5" />,
      title: t("notarization.benefits.affordable.title"),
      description: t("notarization.benefits.affordable.description"),
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: t("notarization.benefits.experts.title"),
      description: t("notarization.benefits.experts.description"),
    },
    {
      icon: <Star className="w-5 h-5" />,
      title: t("notarization.benefits.rated.title"),
      description: t("notarization.benefits.rated.description"),
    },
  ];

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

      {/* Features Section */}
      <section className="py-8 bg-white dark:bg-gray-950 relative overflow-hidden">
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
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t("notarization.features.title")}{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {t("notarization.features.subtitle")}
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {t("notarization.features.description")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 backdrop-blur-sm"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader className="pb-3">
                  <div
                    className={`w-10 h-10 bg-gradient-to-r from-${feature.color}-500 to-${feature.color}-600 rounded-xl flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform duration-300`}
                  >
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Document Upload Section */}
      <section
        id="notarization-section"
        className="pt-8 pb-6 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950/30 relative overflow-hidden"
      >
        {/* Background Image */}
        <div className="fixed inset-0 z-0">
          <Image
            src="/images/long-logo-ClaimSaver.jpg"
            alt="ClaimSaver+ Background"
            className="w-full h-full object-cover opacity-20"
            fill
          />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50/80 to-blue-50/80 dark:from-gray-900/80 dark:to-blue-950/80"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
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
          <div className="mb-6">
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
            {/* Blurred Background Card */}
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 shadow-2xl filter blur-sm opacity-50">
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
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                  <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                  <p className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Choose a PDF document to upload
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    or drag and drop here
                  </p>
                </div>
                <div className="space-y-3">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                    Signer Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
                        placeholder="Enter your full name"
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
                        placeholder="Enter your email address"
                        disabled
                      />
                    </div>
                  </div>
                </div>
                <Button
                  disabled
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Start Notarization Process
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>

            {/* Coming Soon Overlay */}
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/20 dark:border-gray-700/20 max-w-sm w-full mx-4 transform scale-105">
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
                      <Rocket className="w-8 h-8 text-white animate-bounce" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center animate-ping">
                      <Sparkles className="w-2 h-2 text-white" />
                    </div>
                    <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-pink-400 rounded-full flex items-center justify-center animate-ping delay-300">
                      <Star className="w-2 h-2 text-white" />
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
                    We&apos;re working hard to bring you the most advanced
                    digital notarization experience
                  </p>

                  {/* Features Preview */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                      <Shield className="w-3 h-3 text-green-500" />
                      <span>Bank-level security</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                      <Clock className="w-3 h-3 text-blue-500" />
                      <span>24/7 availability</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                      <Zap className="w-3 h-3 text-yellow-500" />
                      <span>Instant processing</span>
                    </div>
                  </div>

                  {/* Notification Button */}
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group text-sm">
                    <Bell className="w-3 h-3 mr-2 group-hover:animate-bounce" />
                    Get Notified When Live
                  </Button>

                  {/* Progress Indicator */}
                  <div className="mt-4">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse delay-150"></div>
                      <div className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-pulse delay-300"></div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Development in progress
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Document Types Section */}
      <section className="pb-8 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Documents We{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Notarize
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Professional notarization for all types of legal and business
              documents
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {documentTypes.map((docType, index) => (
              <Card
                key={index}
                className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800"
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

      {/* Benefits Section */}
      <section className="pb-12 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950/30 relative overflow-hidden">
        {/* Background Image */}
        <div className="fixed inset-0 z-0">
          <Image
            src="/images/long-logo-ClaimSaver.jpg"
            alt="ClaimSaver+ Background"
            className="w-full h-full object-cover opacity-20"
            fill
          />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50/80 to-blue-50/80 dark:from-gray-900/80 dark:to-blue-950/80"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                The{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Benefits
                </span>
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                Experience the convenience and security of online notarization
                with DocuSign integration.
              </p>

              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                      {benefit.icon}
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <Button
                  size="lg"
                  onClick={() =>
                    document
                      .getElementById("notarization-section")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  Start Notarization
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <Award className="w-6 h-6" />
                  <h3 className="text-xl font-bold">Service Highlights</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-base">Processing Time</span>
                    <span className="text-xl font-bold">5-10 minutes</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-base">Success Rate</span>
                    <span className="text-xl font-bold">99.9%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-base">Cost</span>
                    <span className="text-xl font-bold">$25.00</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-base">Security</span>
                    <span className="text-xl font-bold">Bank-Level</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FAQ
            title="Notarization FAQ"
            subtitle="Everything you need to know about our digital notarization service"
            items={faqItems}
          />
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Learn More Modal */}
      {isLearnMoreModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
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
    </div>
  );
}
