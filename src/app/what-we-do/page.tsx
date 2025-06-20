"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Footer from "@/components/footer";
import Link from "next/link";
import { useClerk } from "@clerk/nextjs";
import {
  FileText,
  Users,
  Shield,
  DollarSign,
  Upload,
  CheckCircle,
  Star,
  Lock,
  Smartphone,
  TrendingUp,
  ArrowRight,
  Zap,
  Globe,
  Clock,
  Award,
} from "lucide-react";

export default function WhatWeDo() {
  const { openSignIn } = useClerk();

  const handleStartClaim = () => {
    openSignIn();
  };

  const services = [
    {
      icon: <FileText className="w-8 h-8 text-blue-600" />,
      title: "No-Fault Accident Form Filing",
      description:
        "Streamlined form submission with real-time validation and instant confirmation.",
      features: [
        "Easy-to-use form submission interface",
        "Secure document upload system",
        "Real-time form validation",
        "Automated error checking",
        "Instant submission confirmation",
      ],
      color: "blue",
    },
    {
      icon: <Users className="w-8 h-8 text-green-600" />,
      title: "Attorney Connection Service",
      description:
        "Connect with qualified attorneys nationwide through our referral system.",
      features: [
        "Nationwide network of qualified attorneys",
        "Specialized in accident cases",
        "Attorney profiles and ratings",
        "Free initial consultation",
        "Direct attorney contact",
      ],
      color: "green",
    },
    {
      icon: <Shield className="w-8 h-8 text-purple-600" />,
      title: "Secure Document Management",
      description:
        "Bank-level security for all your case documents with seamless access.",
      features: [
        "Cloud-based document storage",
        "End-to-end encryption",
        "Easy document sharing",
        "Version control and history",
        "Mobile access to documents",
      ],
      color: "purple",
    },
    {
      icon: <DollarSign className="w-8 h-8 text-orange-600" />,
      title: "Recovery Process Support",
      description:
        "Administrative support throughout your recovery and claims process.",
      features: [
        "Document organization assistance",
        "Medical expense tracking",
        "Wage loss documentation",
        "Property damage documentation",
        "Process guidance and support",
      ],
      color: "orange",
    },
  ];

  const processSteps = [
    {
      step: "01",
      title: "Submit Your Information",
      description:
        "Fill out our user-friendly forms and upload supporting documents securely.",
      icon: <Upload className="w-6 h-6" />,
    },
    {
      step: "02",
      title: "Begin Recovery Process",
      description:
        "Focus on physical therapy, pain relief methodologies, and following your medical treatment plan.",
      icon: <TrendingUp className="w-6 h-6" />,
    },
    {
      step: "03",
      title: "Follow Medical Guidance",
      description:
        "Continue following your doctors' and medical professionals' treatment plans and recommendations.",
      icon: <CheckCircle className="w-6 h-6" />,
    },
    {
      step: "04",
      title: "Submit Claim & Receive Compensation",
      description:
        "Submit your completed claim and receive compensation for your injuries and damages.",
      icon: <DollarSign className="w-6 h-6" />,
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
                  Comprehensive{" "}
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Accident Recovery Support
                  </span>
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
                  We provide administrative support and technology solutions to
                  help accident victims navigate the claims process. Our
                  platform connects you with qualified attorneys and streamlines
                  document management for your recovery journey.
                </p>
              </div>
            </div>
          </section>

          {/* Services Overview */}
          <section className="py-20 animate-in fade-in duration-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-600">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                  Our Core Services
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  Everything you need to navigate the complex world of accident
                  claims and recovery
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {services.map((service, index) => (
                  <div
                    key={index}
                    className="animate-in fade-in slide-in-from-bottom-4 duration-600"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <Card className="h-full shadow-lg border-blue-100 dark:border-blue-900 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                      <CardHeader className="pb-4">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-xl">
                            {service.icon}
                          </div>
                          <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-white">
                            {service.title}
                          </CardTitle>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                          {service.description}
                        </p>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          {service.features.map((feature, featureIndex) => (
                            <li
                              key={featureIndex}
                              className="flex items-start gap-3"
                            >
                              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700 dark:text-gray-300">
                                {feature}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
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
                  How It Works
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  A simple, four-step process to help you navigate your recovery
                  journey
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {processSteps.map((step, index: number) => (
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
                    {index < processSteps.length - 1 && (
                      <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                        <ArrowRight className="w-8 h-8 text-blue-400" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Technology & Security */}
          <section className="py-20 animate-in fade-in duration-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="animate-in fade-in slide-in-from-left-4 duration-600">
                  <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                    Powered by Advanced Technology
                  </h2>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                        <Zap className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                          Real-Time Processing
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          Instant form validation, automated error checking, and
                          immediate submission confirmation.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0">
                        <Lock className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                          Bank-Level Security
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          End-to-end encryption, secure document storage, and
                          HIPAA-compliant data protection.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center flex-shrink-0">
                        <Globe className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                          Nationwide Network
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          Access to qualified attorneys across all 50 states,
                          specialized in accident cases.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative animate-in fade-in slide-in-from-right-4 duration-600 delay-200">
                  <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
                    <div className="flex items-center gap-3 mb-6">
                      <Award className="w-8 h-8" />
                      <h3 className="text-2xl font-bold">
                        Why Choose ClaimSaver+?
                      </h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-300" />
                        <span>No upfront platform fees</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-300" />
                        <span>Free initial consultation</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-300" />
                        <span>24/7 platform access</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-300" />
                        <span>Transparent pricing</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-300" />
                        <span>Dedicated support team</span>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -bottom-6 -right-6 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold text-gray-900 dark:text-white">
                        Average Recovery Time: 3-6 months
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Mobile Access */}
          <section className="py-20 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950/30 animate-in fade-in duration-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-600">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                  Access Your Case Anywhere
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  Our mobile-optimized platform ensures you can manage your case
                  on any device
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-600 delay-100">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Smartphone className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Mobile Optimized
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Access all features on your smartphone or tablet with our
                    responsive design.
                  </p>
                </div>
                <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-600 delay-200">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Document Upload
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Easily upload photos, documents, and evidence directly from
                    your mobile device.
                  </p>
                </div>
                <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-600 delay-300">
                  <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Real-Time Updates
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Get instant notifications about case progress, attorney
                    messages, and important deadlines.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 animate-in fade-in duration-800">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-600">
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                  Ready to Start Your Recovery Journey?
                </h2>
                <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                  Join thousands of accident victims who have used ClaimSaver+
                  to navigate their recovery process. Get started today with our
                  free consultation.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold hover:scale-105 transition-transform duration-200"
                    onClick={handleStartClaim}
                  >
                    Start Your Claim
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                  <Link href="/pricing">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-white text-white bg-transparent hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold hover:scale-105 transition-transform duration-200 shadow-lg"
                    >
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
