"use client";

import { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Footer() {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const openModal = (modalType: string) => {
    setActiveModal(modalType);
  };

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
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
        <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700 animate-in zoom-in-95 duration-300">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white relative">
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
      <footer className="w-full bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">C+</span>
                </div>
                <h3 className="text-2xl font-black bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                  ClaimSaver+
                </h3>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed mb-6 max-w-md">
                Simplifying accident form filing and recovery nationwide.
                Connect with experienced attorneys and get the compensation you
                deserve with our innovative platform.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-12 h-12 bg-blue-700 hover:bg-blue-800 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-12 h-12 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
                >
                  <Youtube className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-xl font-bold mb-6 text-blue-300">
                Quick Links
              </h4>
              <ul className="space-y-4">
                <li>
                  <Link
                    href="/who-we-are"
                    className="text-gray-300 hover:text-blue-400 transition-colors duration-300 hover:translate-x-1 inline-block"
                  >
                    Who We Are
                  </Link>
                </li>
                <li>
                  <Link
                    href="/what-we-do"
                    className="text-gray-300 hover:text-blue-400 transition-colors duration-300 hover:translate-x-1 inline-block"
                  >
                    What We Do
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pricing"
                    className="text-gray-300 hover:text-blue-400 transition-colors duration-300 hover:translate-x-1 inline-block"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-blue-400 transition-colors duration-300 hover:translate-x-1 inline-block"
                  >
                    Support
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Information */}
            <div>
              <h4 className="text-xl font-bold mb-6 text-blue-300">
                Contact Us
              </h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-300 font-medium">Phone</p>
                    <a
                      href="tel:+17864173869"
                      className="text-blue-400 hover:text-blue-300 transition-colors duration-300"
                    >
                      (786) 417-3869
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-300 font-medium">Email</p>
                    <a
                      href="mailto:Info@ClaimSaverPlus.com"
                      className="text-blue-400 hover:text-blue-300 transition-colors duration-300"
                    >
                      Info@ClaimSaverPlus.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-300 font-medium">Location</p>
                    <p className="text-blue-400">Headquartered in Miami, FL</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-700 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-gray-400 text-sm">
                &copy; {new Date().getFullYear()} ClaimSaver+. All rights
                reserved.
              </div>
              <div className="flex space-x-6 text-sm">
                <button
                  onClick={() => openModal("privacy")}
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-300"
                >
                  Privacy Policy
                </button>
                <button
                  onClick={() => openModal("terms")}
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-300"
                >
                  Terms of Service
                </button>
                <button
                  onClick={() => openModal("cookies")}
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-300"
                >
                  Cookie Policy
                </button>
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

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                <span className="text-purple-600 dark:text-purple-400 font-semibold text-sm">
                  3
                </span>
              </div>
              Information Sharing
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              We may share your information with attorneys in our network who
              are handling your case, as well as with service providers who
              assist us in operating our platform. We do not sell your personal
              information to third parties.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                <span className="text-orange-600 dark:text-orange-400 font-semibold text-sm">
                  4
                </span>
              </div>
              Data Security
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              We implement appropriate security measures to protect your
              personal information against unauthorized access, alteration,
              disclosure, or destruction.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-3">
              <div className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                <span className="text-red-600 dark:text-red-400 font-semibold text-sm">
                  5
                </span>
              </div>
              Your Rights
            </h3>
            <p className="mb-4 text-gray-600 dark:text-gray-300 leading-relaxed">
              You have the right to:
            </p>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Access and review your personal information</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Request corrections to your information</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Request deletion of your information</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Opt out of certain communications</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">6</span>
              </div>
              Contact Us
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              If you have questions about this Privacy Policy, please contact us
              at
              <a
                href="mailto:Info@ClaimSaverPlus.com"
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-semibold ml-1 transition-colors duration-300"
              >
                Info@ClaimSaverPlus.com
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
              ClaimSaver+ is a platform that connects accident victims with
              attorneys and provides tools for managing accident claims. Our
              services include:
            </p>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>No-fault accident form filing assistance</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Attorney matching and referral services</span>
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
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                <span className="text-purple-600 dark:text-purple-400 font-semibold text-sm">
                  3
                </span>
              </div>
              User Responsibilities
            </h3>
            <p className="mb-4 text-gray-600 dark:text-gray-300 leading-relaxed">
              As a user of ClaimSaver+, you agree to:
            </p>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Provide accurate and complete information</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Maintain the security of your account</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Use the service only for lawful purposes</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Not interfere with the operation of the platform</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Comply with all applicable laws and regulations</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/50 dark:to-blue-950/50 rounded-xl p-6 border border-green-200 dark:border-green-800">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-3">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">4</span>
              </div>
              Fees and Payment
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Our services are provided for a flat fee of{" "}
              <span className="font-bold text-green-600 dark:text-green-400">
                $500
              </span>
              . This fee covers our platform services and attorney matching.
              Additional fees may apply for legal services provided by attorneys
              in our network.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                <span className="text-orange-600 dark:text-orange-400 font-semibold text-sm">
                  5
                </span>
              </div>
              Limitation of Liability
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              ClaimSaver+ is not a law firm and does not provide legal advice.
              We connect you with attorneys but are not responsible for the
              legal services they provide. Our liability is limited to the
              amount of fees paid for our services.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-3">
              <div className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                <span className="text-red-600 dark:text-red-400 font-semibold text-sm">
                  6
                </span>
              </div>
              Termination
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              We may terminate or suspend your account and access to our
              services at any time, with or without cause, with or without
              notice.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
                <span className="text-indigo-600 dark:text-indigo-400 font-semibold text-sm">
                  7
                </span>
              </div>
              Governing Law
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              These terms shall be governed by and construed in accordance with
              the laws of the State of Florida, without regard to its conflict
              of law provisions.
            </p>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">8</span>
              </div>
              Contact Information
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              For questions about these Terms of Service, please contact us at
              <a
                href="mailto:Info@ClaimSaverPlus.com"
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-semibold ml-1 transition-colors duration-300"
              >
                Info@ClaimSaverPlus.com
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
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>
                  <strong>Functional Cookies:</strong> To provide enhanced
                  functionality
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                <span className="text-purple-600 dark:text-purple-400 font-semibold text-sm">
                  3
                </span>
              </div>
              Types of Cookies We Use
            </h3>
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-2">
                  Session Cookies
                </h4>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Temporary cookies that are deleted when you close your
                  browser. These are essential for the website to function
                  properly.
                </p>
              </div>
              <div className="bg-green-50 dark:bg-green-950/30 rounded-lg p-4 border border-green-200 dark:border-green-800">
                <h4 className="font-bold text-green-900 dark:text-green-300 mb-2">
                  Persistent Cookies
                </h4>
                <p className="text-sm text-green-800 dark:text-green-200">
                  Cookies that remain on your device for a set period or until
                  you delete them. These help us remember your preferences and
                  provide a better experience.
                </p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-950/30 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                <h4 className="font-bold text-purple-900 dark:text-purple-300 mb-2">
                  Third-Party Cookies
                </h4>
                <p className="text-sm text-purple-800 dark:text-purple-200">
                  Cookies set by third-party services we use, such as analytics
                  providers and authentication services.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                <span className="text-orange-600 dark:text-orange-400 font-semibold text-sm">
                  4
                </span>
              </div>
              Managing Cookies
            </h3>
            <p className="mb-4 text-gray-600 dark:text-gray-300 leading-relaxed">
              You can control and manage cookies in several ways:
            </p>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300 mb-4">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>
                  Browser settings: Most browsers allow you to refuse or delete
                  cookies
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>
                  Device settings: You can manage cookies through your device
                  settings
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>
                  Third-party opt-outs: Some third-party services provide
                  opt-out mechanisms
                </span>
              </li>
            </ul>
            <div className="bg-orange-50 dark:bg-orange-950/30 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
              <p className="text-sm text-orange-800 dark:text-orange-200">
                <strong>Note:</strong> Please note that disabling certain
                cookies may affect the functionality of our website.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-3">
              <div className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                <span className="text-red-600 dark:text-red-400 font-semibold text-sm">
                  5
                </span>
              </div>
              Updates to This Policy
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              We may update this Cookie Policy from time to time. We will notify
              you of any changes by posting the new policy on this page and
              updating the &ldquo;Last updated&rdquo; date.
            </p>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">6</span>
              </div>
              Contact Us
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              If you have questions about our use of cookies, please contact us
              at
              <a
                href="mailto:Info@ClaimSaverPlus.com"
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-semibold ml-1 transition-colors duration-300"
              >
                Info@ClaimSaverPlus.com
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
