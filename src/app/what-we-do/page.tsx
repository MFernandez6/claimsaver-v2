"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Footer from "@/components/footer";
import FAQ from "@/components/faq";
import { useClerk } from "@clerk/nextjs";
import {
  CheckCircle,
  FileText,
  Users,
  Shield,
  TrendingUp,
  DollarSign,
  ArrowRight,
  Upload,
} from "lucide-react";

export default function WhatWeDo() {
  const { openSignIn } = useClerk();

  const handleStartClaim = () => {
    openSignIn();
  };

  const faqItems = [
    {
      question: "What exactly does ClaimSaver+ do for me?",
      answer:
        "ClaimSaver+ provides comprehensive administrative support for accident victims. We help you file no-fault accident forms, connect you with qualified attorneys, manage your documents securely, and guide you through the recovery process. We handle the paperwork while you focus on your recovery.",
    },
    {
      question: "How does the attorney matching process work?",
      answer:
        "Our intelligent matching system analyzes your case details, location, and specific needs to connect you with attorneys who specialize in accident cases in your area. We consider factors like attorney experience, case success rates, and availability to ensure the best possible match for your situation.",
    },
    {
      question: "What documents do I need to provide?",
      answer:
        "You'll need to provide police reports, medical records, insurance information, photos of the accident scene, vehicle damage photos, medical bills, and any other evidence related to your case. Our platform makes it easy to upload and organize these documents securely.",
    },
    {
      question: "How secure is my personal information?",
      answer:
        "We use bank-level security with end-to-end encryption for all data. Our platform is HIPAA-compliant and follows strict security protocols to protect your personal information, medical records, and case documents. Your privacy and security are our top priorities.",
    },
    {
      question: "Can I access my case information on my phone?",
      answer:
        "Yes! Our platform is fully mobile-optimized. You can upload documents, check case status, communicate with your attorney, and receive real-time updates on any device. The platform works seamlessly on smartphones, tablets, and computers.",
    },
    {
      question: "What if I need help during the process?",
      answer:
        "Our dedicated support team is available to help you throughout the entire process. You can contact us via phone, email, or through the platform. We provide guidance on document requirements, answer questions about the process, and ensure you have everything you need for a successful claim.",
    },
    {
      question: "How long does the entire process take?",
      answer:
        "The timeline varies depending on the complexity of your case and the state where the accident occurred. Generally, the initial form filing and attorney matching happens within 24-48 hours. The overall recovery process typically takes 3-6 months, but we work to expedite your case as much as possible.",
    },
    {
      question: "Do you guarantee compensation?",
      answer:
        "While we cannot guarantee specific compensation amounts, our network of experienced attorneys works diligently to maximize your recovery. Success depends on various factors including the severity of injuries, available insurance coverage, and the specific circumstances of your accident.",
    },
  ];

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
        "Connect with qualified attorneys in Florida and New York through our referral system.",
      features: [
        "Regional network of qualified attorneys in Florida and New York",
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
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950">
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

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Comprehensive{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Accident Recovery Support
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto">
              We provide administrative support and technology solutions to help
              accident victims navigate the claims process. Our platform
              connects you with qualified attorneys and streamlines document
              management for your recovery journey.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
              <Button
                size="lg"
                onClick={handleStartClaim}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Start Your Recovery
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 dark:text-gray-300 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Link href="/claim-form">File a Claim</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-12 bg-white dark:bg-gray-950 relative overflow-hidden">
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
              Our{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Services
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Comprehensive tools and support to streamline your accident
              recovery process
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <Card
                key={index}
                className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 backdrop-blur-sm"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                      {service.icon}
                    </div>
                    <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {service.title}
                    </CardTitle>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {service.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950/30 relative overflow-hidden">
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
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Your Recovery{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Journey
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              A simple, step-by-step process designed to get you back on track
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="relative group">
                <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 backdrop-blur-sm">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <span className="text-xl font-bold">{step.step}</span>
                    </div>
                    <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {step.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQ
        title="Frequently Asked Questions"
        subtitle="Get answers to the most common questions about our services"
        items={faqItems}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
