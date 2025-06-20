"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Footer from "@/components/footer";
import { useClerk } from "@clerk/nextjs";
import {
  Users,
  Search,
  Star,
  Shield,
  Clock,
  Award,
  CheckCircle,
  ArrowRight,
  Phone,
  GraduationCap,
  Scale,
  TrendingUp,
  Heart,
  X,
  FileText,
  Car,
  Briefcase,
  Stethoscope,
  HardHat,
  Globe,
  Gavel,
} from "lucide-react";

export default function AttorneyMatching() {
  const { openSignIn } = useClerk();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<"practice" | "details">(
    "practice"
  );
  const [selectedPractice, setSelectedPractice] = useState<string>("");

  const handleStartMatching = () => {
    openSignIn();
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setCurrentStep("practice");
    setSelectedPractice("");
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentStep("practice");
    setSelectedPractice("");
  };

  const handlePracticeSelect = (practice: string) => {
    setSelectedPractice(practice);
    setCurrentStep("details");
  };

  const handleBackToPractice = () => {
    setCurrentStep("practice");
    setSelectedPractice("");
  };

  const practiceAreas = [
    {
      id: "slip-falls",
      title: "Slip and Falls",
      description: "Premises liability and slip/trip accidents",
      icon: <FileText className="w-6 h-6" />,
      color: "blue",
    },
    {
      id: "automobile",
      title: "Automobile Accidents",
      description: "Car, truck, motorcycle, and pedestrian accidents",
      icon: <Car className="w-6 h-6" />,
      color: "green",
    },
    {
      id: "immigration",
      title: "Immigration",
      description: "Visa applications, citizenship, and deportation defense",
      icon: <Globe className="w-6 h-6" />,
      color: "purple",
    },
    {
      id: "wills-trusts",
      title: "Wills & Trusts",
      description: "Estate planning and probate matters",
      icon: <Gavel className="w-6 h-6" />,
      color: "orange",
    },
    {
      id: "construction",
      title: "Construction",
      description: "Construction accidents and liability",
      icon: <HardHat className="w-6 h-6" />,
      color: "yellow",
    },
    {
      id: "commercial",
      title: "Commercial",
      description: "Business law and commercial disputes",
      icon: <Briefcase className="w-6 h-6" />,
      color: "indigo",
    },
    {
      id: "medical-malpractice",
      title: "Medical Malpractice",
      description: "Medical negligence and healthcare errors",
      icon: <Stethoscope className="w-6 h-6" />,
      color: "red",
    },
    {
      id: "workers-compensation",
      title: "Workers' Compensation",
      description: "Workplace injuries and compensation claims",
      icon: <Shield className="w-6 h-6" />,
      color: "teal",
    },
  ];

  const getColorClasses = (color: string) => {
    const colorMap: { [key: string]: string } = {
      blue: "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400",
      green:
        "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400",
      purple:
        "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400",
      orange:
        "bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-400",
      yellow:
        "bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-400",
      indigo:
        "bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-400",
      red: "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400",
      teal: "bg-teal-100 text-teal-600 dark:bg-teal-900 dark:text-teal-400",
    };
    return colorMap[color] || colorMap.blue;
  };

  const matchingFeatures = [
    {
      icon: <Search className="w-8 h-8 text-blue-600" />,
      title: "Intelligent Matching",
      description:
        "Our advanced algorithm analyzes your case details and matches you with attorneys who specialize in your specific type of accident and jurisdiction.",
      color: "blue",
    },
    {
      icon: <Users className="w-8 h-8 text-green-600" />,
      title: "Nationwide Network",
      description:
        "Access to thousands of experienced attorneys across all 50 states, each vetted and verified for their expertise in accident law.",
      color: "green",
    },
    {
      icon: <Star className="w-8 h-8 text-purple-600" />,
      title: "Verified Reviews",
      description:
        "Read authentic reviews from previous clients and see attorney ratings, success rates, and specializations before making your choice.",
      color: "purple",
    },
    {
      icon: <Shield className="w-8 h-8 text-orange-600" />,
      title: "Quality Assurance",
      description:
        "Every attorney in our network undergoes rigorous screening, including background checks, license verification, and performance reviews.",
      color: "orange",
    },
  ];

  const matchingProcess = [
    {
      step: "01",
      title: "Submit Your Case",
      description:
        "Provide details about your accident, injuries, and location. Our system analyzes your specific needs.",
      icon: <Search className="w-6 h-6" />,
    },
    {
      step: "02",
      title: "Get Matched",
      description:
        "Our algorithm identifies the best attorneys for your case based on expertise, location, and success history.",
      icon: <Users className="w-6 h-6" />,
    },
    {
      step: "03",
      title: "Review Profiles",
      description:
        "Browse attorney profiles, read reviews, and compare their experience with cases similar to yours.",
      icon: <Star className="w-6 h-6" />,
    },
    {
      step: "04",
      title: "Connect & Consult",
      description:
        "Schedule free consultations with your matched attorneys and choose the one who best fits your needs.",
      icon: <Phone className="w-6 h-6" />,
    },
  ];

  const attorneyStats = [
    {
      number: "500+",
      label: "Attorneys Nationwide",
      icon: <Users className="w-6 h-6 text-blue-600" />,
    },
    {
      number: "95%",
      label: "Success Rate",
      icon: <TrendingUp className="w-6 h-6 text-green-600" />,
    },
    {
      number: "24hrs",
      label: "Average Response Time",
      icon: <Clock className="w-6 h-6 text-purple-600" />,
    },
    {
      number: "15+",
      label: "Years Average Experience",
      icon: <GraduationCap className="w-6 h-6 text-orange-600" />,
    },
  ];

  const attorneyTypes = [
    {
      title: "Auto Accident Specialists",
      description: "Experts in car, truck, and motorcycle accident cases",
      icon: <Scale className="w-6 h-6 text-blue-600" />,
      cases: [
        "Car accidents",
        "Truck accidents",
        "Motorcycle accidents",
        "Pedestrian injuries",
      ],
    },
    {
      title: "Medical Malpractice",
      description: "Attorneys specializing in medical negligence cases",
      icon: <Heart className="w-6 h-6 text-red-600" />,
      cases: [
        "Surgical errors",
        "Misdiagnosis",
        "Medication errors",
        "Hospital negligence",
      ],
    },
    {
      title: "Workplace Injuries",
      description: "Workers' compensation and workplace accident experts",
      icon: <Shield className="w-6 h-6 text-green-600" />,
      cases: [
        "Slip and falls",
        "Equipment accidents",
        "Repetitive stress",
        "Construction injuries",
      ],
    },
    {
      title: "Product Liability",
      description: "Specialists in defective product injury cases",
      icon: <Award className="w-6 h-6 text-purple-600" />,
      cases: [
        "Defective vehicles",
        "Dangerous drugs",
        "Faulty equipment",
        "Consumer injuries",
      ],
    },
  ];

  return (
    <div
      className="min-h-screen flex flex-col pt-24"
      style={{
        backgroundImage: "url('/images/long-logo-ClaimSaver.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Content with background overlay for better readability */}
      <div className="relative w-full flex-1">
        {/* Background overlay for better readability - only on content */}
        <div className="absolute inset-0 bg-white/90 dark:bg-gray-900/90 pointer-events-none"></div>

        {/* Content */}
        <div className="relative z-10 w-full">
          {/* Hero Section */}
          <section className="relative overflow-hidden animate-in fade-in duration-800">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
              <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-800 delay-200">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                  Find Your Perfect{" "}
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Legal Match
                  </span>
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
                  Connect with experienced attorneys who specialize in your type
                  of case. Our intelligent matching system ensures you get the
                  right legal expertise for maximum recovery.
                </p>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold hover:scale-105 transition-all duration-200 shadow-lg"
                  onClick={handleOpenModal}
                >
                  Start Attorney Matching
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="py-16 animate-in fade-in duration-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {attorneyStats.map((stat, index) => (
                  <div
                    key={index}
                    className="text-center animate-in fade-in slide-in-from-bottom-4 duration-600"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex justify-center mb-3">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        {stat.icon}
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                      {stat.number}
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-20 animate-in fade-in duration-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-600">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                  Why Choose Our Matching System?
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  Advanced technology meets human expertise to find your perfect
                  legal match
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {matchingFeatures.map((feature, index) => (
                  <div
                    key={index}
                    className="animate-in fade-in slide-in-from-bottom-4 duration-600"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <Card className="h-full shadow-lg border-blue-100 dark:border-blue-900 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                      <CardHeader className="pb-4">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-xl">
                            {feature.icon}
                          </div>
                          <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-white">
                            {feature.title}
                          </CardTitle>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                          {feature.description}
                        </p>
                      </CardHeader>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* How It Works */}
          <section className="py-20 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 animate-in fade-in duration-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-600">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                  How Attorney Matching Works
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  A simple, four-step process to connect you with the right
                  attorney
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {matchingProcess.map((step, index) => (
                  <div
                    key={index}
                    className="relative animate-in fade-in slide-in-from-bottom-4 duration-600"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <Card className="h-full shadow-lg border-blue-100 dark:border-blue-900 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                      <CardHeader className="text-center pb-4">
                        <div className="flex justify-center mb-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                            {step.step}
                          </div>
                        </div>
                        <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                          {step.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-center">
                        <div className="flex justify-center mb-4">
                          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                            {step.icon}
                          </div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                          {step.description}
                        </p>
                      </CardContent>
                    </Card>
                    {index < matchingProcess.length - 1 && (
                      <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                        <ArrowRight className="w-8 h-8 text-blue-400" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Attorney Types */}
          <section className="py-20 animate-in fade-in duration-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-600">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                  Specialized Attorney Types
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  Find attorneys who specialize in your specific type of case
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {attorneyTypes.map((type, index) => (
                  <div
                    key={index}
                    className="animate-in fade-in slide-in-from-bottom-4 duration-600"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <Card className="h-full shadow-lg border-blue-100 dark:border-blue-900 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                      <CardHeader className="pb-4">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-xl">
                            {type.icon}
                          </div>
                          <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                            {type.title}
                          </CardTitle>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                          {type.description}
                        </p>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                            Common Cases:
                          </h4>
                          <ul className="space-y-2">
                            {type.cases.map((caseType, caseIndex) => (
                              <li
                                key={caseIndex}
                                className="flex items-center gap-3"
                              >
                                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                <span className="text-gray-600 dark:text-gray-300 text-sm">
                                  {caseType}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 animate-in fade-in duration-800">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-600">
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                  Ready to Find Your Attorney?
                </h2>
                <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                  Join thousands of accident victims who have found their
                  perfect legal match through our intelligent matching system.
                  Get started today with a free consultation.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold hover:scale-105 transition-transform duration-200"
                    onClick={handleStartMatching}
                  >
                    Start Attorney Matching
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>
                <div className="mt-8 p-4 bg-white/10 rounded-lg">
                  <div className="flex items-center justify-center gap-2 text-blue-100">
                    <Award className="w-5 h-5" />
                    <span className="font-semibold">
                      Average matching time: 24 hours • Free consultations
                      available
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Footer */}
      <Footer />

      {/* Attorney Matching Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700 animate-in zoom-in-95 duration-300">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white relative">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black tracking-tight">
                  {currentStep === "practice"
                    ? "Select Practice Area"
                    : "Case Details"}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCloseModal}
                  className="text-white hover:bg-white/20 rounded-full w-10 h-10 p-0 transition-all duration-300 hover:scale-110"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              {currentStep === "details" && (
                <div className="mt-4 flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBackToPractice}
                    className="text-white hover:bg-white/20 text-sm"
                  >
                    ← Back to Practice Areas
                  </Button>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-8 overflow-y-auto max-h-[calc(90vh-120px)] bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
              {currentStep === "practice" ? (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      Choose Your Practice Area
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Select the area of law that best matches your case
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {practiceAreas.map((practice) => (
                      <div
                        key={practice.id}
                        className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-1"
                        onClick={() => handlePracticeSelect(practice.id)}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-lg ${getColorClasses(
                              practice.color
                            )}`}
                          >
                            {practice.icon}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {practice.title}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {practice.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      Case Details
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Please provide details about your case to help us match
                      you with the right attorney
                    </p>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className={`p-2 rounded-lg ${getColorClasses(
                          practiceAreas.find((p) => p.id === selectedPractice)
                            ?.color || "blue"
                        )}`}
                      >
                        {
                          practiceAreas.find((p) => p.id === selectedPractice)
                            ?.icon
                        }
                      </div>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {
                          practiceAreas.find((p) => p.id === selectedPractice)
                            ?.title
                        }
                      </span>
                    </div>
                  </div>

                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          First Name *
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Phone *
                        </label>
                        <input
                          type="tel"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Case Location (City, State) *
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                        placeholder="e.g., Miami, FL"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        When did the incident occur? *
                      </label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Brief description of your case *
                      </label>
                      <textarea
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                        placeholder="Please describe what happened, any injuries sustained, and what you're seeking..."
                        required
                      />
                    </div>

                    <div className="flex gap-4 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleBackToPractice}
                        className="flex-1"
                      >
                        Back
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                        onClick={handleStartMatching}
                      >
                        Submit & Find Attorneys
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
