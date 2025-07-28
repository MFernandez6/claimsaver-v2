"use client";

import { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  X,
  Shield,
  FileText,
  Users,
  Award,
  Clock,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const closeModal = () => {
    setActiveModal(null);
  };

  const Modal = ({
    isOpen,
    onClose,
    title,
    children,
  }: {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
  }) => {
    if (!isOpen) return null;

    return (
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300"
        onClick={onClose}
      >
        <div
          className="bg-white dark:bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700 animate-in zoom-in-95 duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white relative">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black tracking-tight">{title}</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white hover:bg-white/20 rounded-full w-10 h-10 p-0 transition-all duration-300 hover:scale-110"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
          </div>

          {/* Content */}
          <div className="p-8 overflow-y-auto max-h-[calc(90vh-120px)] bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <div className="space-y-8">{children}</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <footer className="relative bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url('/images/logo-blue-black.png')`,
              backgroundSize: "200px 200px",
              backgroundRepeat: "repeat",
              backgroundPosition: "center",
            }}
          ></div>
        </div>

        {/* Main Footer Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
          {/* Top Section - Brand & Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 mb-12 lg:mb-16">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-4 lg:mb-6">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-black text-base lg:text-lg">
                    C+
                  </span>
                </div>
                <span className="text-xl lg:text-2xl font-black bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent">
                  ClaimSaver+
                </span>
              </div>
              <p className="text-blue-100 text-base lg:text-lg leading-relaxed mb-4 lg:mb-6">
                Revolutionizing accident claims with transparent pricing and
                professional service. Keep 95% of your settlement with our
                flat-rate structure.
              </p>
              <div className="flex flex-wrap items-center gap-2 lg:gap-4">
                <div className="flex items-center gap-2 bg-blue-800/50 rounded-lg px-2 lg:px-3 py-1 lg:py-2">
                  <Award className="w-3 h-3 lg:w-4 lg:h-4 text-yellow-400" />
                  <span className="text-xs lg:text-sm font-medium">
                    Award Winning
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-blue-800/50 rounded-lg px-2 lg:px-3 py-1 lg:py-2">
                  <Shield className="w-3 h-3 lg:w-4 lg:h-4 text-green-400" />
                  <span className="text-xs lg:text-sm font-medium">
                    Trusted
                  </span>
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-3 gap-4 lg:gap-8">
                <div className="text-center">
                  <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl lg:rounded-2xl flex items-center justify-center mx-auto mb-2 lg:mb-4 shadow-lg">
                    <Clock className="w-5 h-5 lg:w-8 lg:h-8 text-white" />
                  </div>
                  <div className="text-xl lg:text-3xl font-bold text-white mb-1 lg:mb-2">
                    24/7
                  </div>
                  <div className="text-blue-200 text-xs lg:text-sm">
                    Support Available
                  </div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-green-500 to-green-700 rounded-xl lg:rounded-2xl flex items-center justify-center mx-auto mb-2 lg:mb-4 shadow-lg">
                    <CheckCircle className="w-5 h-5 lg:w-8 lg:h-8 text-white" />
                  </div>
                  <div className="text-xl lg:text-3xl font-bold text-white mb-1 lg:mb-2">
                    95%
                  </div>
                  <div className="text-blue-200 text-xs lg:text-sm">
                    Settlement Kept
                  </div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl lg:rounded-2xl flex items-center justify-center mx-auto mb-2 lg:mb-4 shadow-lg">
                    <Users className="w-5 h-5 lg:w-8 lg:h-8 text-white" />
                  </div>
                  <div className="text-xl lg:text-3xl font-bold text-white mb-1 lg:mb-2">
                    500+
                  </div>
                  <div className="text-blue-200 text-xs lg:text-sm">
                    Happy Clients
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Section - Links & Contact */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-8 lg:mb-12">
            {/* Services */}
            <div className="space-y-3 lg:space-y-4">
              <h3 className="text-base lg:text-lg font-bold text-white mb-3 lg:mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4 lg:w-5 lg:h-5 text-blue-400" />
                Services
              </h3>
              <ul className="space-y-2 lg:space-y-3">
                <li>
                  <a
                    href="/claim-form"
                    className="text-blue-200 hover:text-white transition-colors duration-300 flex items-center gap-2 group text-sm lg:text-base"
                  >
                    <div className="w-1 h-1 bg-blue-400 rounded-full group-hover:bg-white transition-colors"></div>
                    Claim Form
                  </a>
                </li>
                <li>
                  <a
                    href="/attorney-matching"
                    className="text-blue-200 hover:text-white transition-colors duration-300 flex items-center gap-2 group text-sm lg:text-base"
                  >
                    <div className="w-1 h-1 bg-blue-400 rounded-full group-hover:bg-white transition-colors"></div>
                    Legal Recommendations
                  </a>
                </li>
                <li>
                  <a
                    href="/notarization"
                    className="text-blue-200 hover:text-white transition-colors duration-300 flex items-center gap-2 group text-sm lg:text-base"
                  >
                    <div className="w-1 h-1 bg-blue-400 rounded-full group-hover:bg-white transition-colors"></div>
                    Notarization
                  </a>
                </li>
                <li>
                  <a
                    href="/pricing"
                    className="text-blue-200 hover:text-white transition-colors duration-300 flex items-center gap-2 group text-sm lg:text-base"
                  >
                    <div className="w-1 h-1 bg-blue-400 rounded-full group-hover:bg-white transition-colors"></div>
                    Pricing
                  </a>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div className="space-y-3 lg:space-y-4">
              <h3 className="text-base lg:text-lg font-bold text-white mb-3 lg:mb-4 flex items-center gap-2">
                <Users className="w-4 h-4 lg:w-5 lg:h-5 text-blue-400" />
                Company
              </h3>
              <ul className="space-y-2 lg:space-y-3">
                <li>
                  <a
                    href="/who-we-are"
                    className="text-blue-200 hover:text-white transition-colors duration-300 flex items-center gap-2 group text-sm lg:text-base"
                  >
                    <div className="w-1 h-1 bg-blue-400 rounded-full group-hover:bg-white transition-colors"></div>
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="/what-we-do"
                    className="text-blue-200 hover:text-white transition-colors duration-300 flex items-center gap-2 group text-sm lg:text-base"
                  >
                    <div className="w-1 h-1 bg-blue-400 rounded-full group-hover:bg-white transition-colors"></div>
                    What We Do
                  </a>
                </li>
                <li>
                  <a
                    href="/pricing"
                    className="text-blue-200 hover:text-white transition-colors duration-300 flex items-center gap-2 group text-sm lg:text-base"
                  >
                    <div className="w-1 h-1 bg-blue-400 rounded-full group-hover:bg-white transition-colors"></div>
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="/contact"
                    className="text-blue-200 hover:text-white transition-colors duration-300 flex items-center gap-2 group text-sm lg:text-base"
                  >
                    <div className="w-1 h-1 bg-blue-400 rounded-full group-hover:bg-white transition-colors"></div>
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div className="space-y-3 lg:space-y-4">
              <h3 className="text-base lg:text-lg font-bold text-white mb-3 lg:mb-4 flex items-center gap-2">
                <Shield className="w-4 h-4 lg:w-5 lg:h-5 text-blue-400" />
                Support
              </h3>
              <ul className="space-y-2 lg:space-y-3">
                <li>
                  <a
                    href="/faq"
                    className="text-blue-200 hover:text-white transition-colors duration-300 flex items-center gap-2 group text-sm lg:text-base"
                  >
                    <div className="w-1 h-1 bg-blue-400 rounded-full group-hover:bg-white transition-colors"></div>
                    FAQ
                  </a>
                </li>
                <li>
                  <a
                    href="/help"
                    className="text-blue-200 hover:text-white transition-colors duration-300 flex items-center gap-2 group text-sm lg:text-base"
                  >
                    <div className="w-1 h-1 bg-blue-400 rounded-full group-hover:bg-white transition-colors"></div>
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="/contact"
                    className="text-blue-200 hover:text-white transition-colors duration-300 flex items-center gap-2 group text-sm lg:text-base"
                  >
                    <div className="w-1 h-1 bg-blue-400 rounded-full group-hover:bg-white transition-colors"></div>
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-3 lg:space-y-4">
              <h3 className="text-base lg:text-lg font-bold text-white mb-3 lg:mb-4 flex items-center gap-2">
                <Mail className="w-4 h-4 lg:w-5 lg:h-5 text-blue-400" />
                Contact Info
              </h3>
              <div className="space-y-2 lg:space-y-3">
                <div className="flex items-center gap-2 lg:gap-3">
                  <Phone className="w-3 h-3 lg:w-4 lg:h-4 text-blue-400 flex-shrink-0" />
                  <a
                    href="tel:+17864173869"
                    className="text-blue-200 hover:text-white transition-colors duration-300 text-sm lg:text-base"
                  >
                    (786) 417-3869
                  </a>
                </div>
                <div className="flex items-center gap-2 lg:gap-3">
                  <Mail className="w-3 h-3 lg:w-4 lg:h-4 text-blue-400 flex-shrink-0" />
                  <a
                    href="mailto:ClaimSaverPlus@gmail.com"
                    className="text-blue-200 hover:text-white transition-colors duration-300 text-sm lg:text-base"
                  >
                    ClaimSaverPlus@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-2 lg:gap-3">
                  <MapPin className="w-3 h-3 lg:w-4 lg:h-4 text-blue-400 flex-shrink-0" />
                  <span className="text-blue-200 text-sm lg:text-base">
                    Miami, FL
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-blue-800 pt-6 lg:pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-center md:text-left">
                <p className="text-blue-200 text-xs lg:text-sm">
                  © 2023 ClaimSaver+
                </p>
                <p className="text-blue-200 text-xs opacity-75">
                  All rights reserved.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-4 lg:gap-6 text-xs lg:text-sm">
                <button
                  onClick={() => setActiveModal("privacy")}
                  className="text-blue-200 hover:text-white transition-colors duration-300"
                >
                  Privacy Policy
                </button>
                <button
                  onClick={() => setActiveModal("terms")}
                  className="text-blue-200 hover:text-white transition-colors duration-300"
                >
                  Terms of Service
                </button>
                <button
                  onClick={() => setActiveModal("cookies")}
                  className="text-blue-200 hover:text-white transition-colors duration-300"
                >
                  Cookie Policy
                </button>
              </div>
            </div>

            {/* Legal Disclaimer */}
            <div className="mt-4 lg:mt-6 pt-4 lg:pt-6 border-t border-blue-800/50">
              <div className="bg-blue-950/50 rounded-lg p-3 lg:p-4 border border-blue-800/50">
                <p className="text-xs text-blue-200 leading-relaxed text-center">
                  <strong className="text-red-400">LEGAL DISCLAIMER:</strong>{" "}
                  ClaimSaver+ is a technology platform providing administrative
                  support and legal recommendation services. We are NOT a law
                  firm and do NOT provide legal advice, case evaluation, or
                  legal representation. Our services include administrative
                  support for no-fault accident form filing, legal
                  recommendations, document management, and case tracking. For
                  legal services, you must consult with qualified attorneys or
                  other qualified legal professionals. Our flat-rate fee of $500
                  covers platform services and administrative support only.
                  Additional fees may apply for legal services provided by
                  attorneys. Results may vary. Past performance does not
                  guarantee future outcomes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Privacy Policy Modal */}
      <Modal
        isOpen={activeModal === "privacy"}
        onClose={closeModal}
        title="Privacy Policy"
      >
        <div className="space-y-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">
                  1
                </span>
              </div>
              Information We Collect
            </h3>
            <p className="mb-4 text-gray-600 dark:text-gray-300 leading-relaxed">
              We collect information you provide directly to us, such as when
              you create an account, submit a claim, or contact us for support.
              This may include:
            </p>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>
                  Personal identification information (name, email address,
                  phone number)
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Accident details and claim information</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Documentation and evidence related to your case</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>
                  Communication history with our platform and attorneys
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <span className="text-green-600 dark:text-green-400 font-semibold text-sm">
                  2
                </span>
              </div>
              How We Use Your Information
            </h3>
            <p className="mb-4 text-gray-600 dark:text-gray-300 leading-relaxed">
              We use the information we collect to:
            </p>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Provide and maintain our services</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Connect you with appropriate attorneys</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Process and manage your claims</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Communicate with you about your case</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Improve our platform and services</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Comply with legal obligations</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">3</span>
              </div>
              Contact Us
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              If you have questions about this Privacy Policy, please contact us
              at
              <a
                href="mailto:ClaimSaverPlus@gmail.com"
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-semibold ml-1 transition-colors duration-300"
              >
                ClaimSaverPlus@gmail.com
              </a>
            </p>
          </div>

          <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </Modal>

      {/* Terms of Service Modal */}
      <Modal
        isOpen={activeModal === "terms"}
        onClose={closeModal}
        title="Terms of Service"
      >
        <div className="space-y-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">
                  1
                </span>
              </div>
              Acceptance of Terms
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              By accessing and using ClaimSaver+, you accept and agree to be
              bound by the terms and provision of this agreement. If you do not
              agree to abide by the above, please do not use this service.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <span className="text-green-600 dark:text-green-400 font-semibold text-sm">
                  2
                </span>
              </div>
              Description of Service
            </h3>
            <p className="mb-4 text-gray-600 dark:text-gray-300 leading-relaxed">
              ClaimSaver+ is a technology platform that provides administrative
              support and connects accident victims with attorneys.
              <strong className="text-red-600 dark:text-red-400">
                We are NOT a law firm and do NOT provide legal advice or
                representation.
              </strong>{" "}
              Our services include:
            </p>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>
                  Administrative support for no-fault accident form filing
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Legal recommendation services</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Document management and storage</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Case tracking and communication tools</span>
              </li>
            </ul>
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-800 dark:text-red-200">
                <strong>Important:</strong> We do not provide legal advice, case
                evaluation, or legal representation. For legal services, you
                must consult with qualified attorneys or other qualified legal
                professionals.
              </p>
            </div>
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Regulatory Update:</strong> We are currently in the
                process of obtaining our Public Adjuster license to provide
                enhanced claim adjustment services. This will allow us to offer
                more comprehensive support for insurance claims while
                maintaining full compliance with state regulations. Expected
                completion: Q1 2024.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/50 dark:to-blue-950/50 rounded-xl p-6 border border-green-200 dark:border-green-800">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-3">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">3</span>
              </div>
              Fees and Payment
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Our services are provided for a flat fee of{" "}
              <span className="font-bold text-green-600 dark:text-green-400">
                $500
              </span>
              . This fee covers our platform services and administrative
              support. Additional fees may apply for legal services provided by
              attorneys.
            </p>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">4</span>
              </div>
              Contact Information
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              For questions about these Terms of Service, please contact us at
              <a
                href="mailto:ClaimSaverPlus@gmail.com"
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-semibold ml-1 transition-colors duration-300"
              >
                ClaimSaverPlus@gmail.com
              </a>
            </p>
          </div>

          <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </Modal>

      {/* Cookie Policy Modal */}
      <Modal
        isOpen={activeModal === "cookies"}
        onClose={closeModal}
        title="Cookie Policy"
      >
        <div className="space-y-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">
                  1
                </span>
              </div>
              What Are Cookies
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Cookies are small text files that are placed on your device when
              you visit our website. They help us provide you with a better
              experience and understand how you use our platform.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <span className="text-green-600 dark:text-green-400 font-semibold text-sm">
                  2
                </span>
              </div>
              How We Use Cookies
            </h3>
            <p className="mb-4 text-gray-600 dark:text-gray-300 leading-relaxed">
              We use cookies for the following purposes:
            </p>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>
                  <strong>Essential Cookies:</strong> Required for the website
                  to function properly
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>
                  <strong>Authentication Cookies:</strong> To keep you signed in
                  and secure
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>
                  <strong>Preference Cookies:</strong> To remember your settings
                  and preferences
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>
                  <strong>Analytics Cookies:</strong> To understand how visitors
                  use our website
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">3</span>
              </div>
              Contact Us
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              If you have questions about our use of cookies, please contact us
              at
              <a
                href="mailto:ClaimSaverPlus@gmail.com"
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-semibold ml-1 transition-colors duration-300"
              >
                ClaimSaverPlus@gmail.com
              </a>
            </p>
          </div>

          <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
}
