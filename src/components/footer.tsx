"use client";

import { useState } from "react";
import {
  X,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/brand-logo";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();
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
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-300"
        onClick={onClose}
      >
        <div
          className="bg-white dark:bg-gray-900 rounded-2xl max-w-4xl w-full min-w-0 max-h-[min(90dvh,90vh)] overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700 animate-in zoom-in-95 duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-teal-600 to-teal-800 p-6 text-white relative">
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-lg sm:text-2xl font-black tracking-tight min-w-0 pr-2 break-words">
                {title}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="shrink-0 text-white hover:bg-white/20 rounded-full w-10 h-10 p-0 transition-all duration-300 hover:scale-110"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-8 overflow-y-auto overscroll-contain max-h-[min(calc(90dvh-8rem),calc(90vh-8rem))] bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
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
      <footer className="relative bg-gradient-to-br from-gray-900 via-teal-900 to-gray-900 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <div
            className="absolute inset-0 saturate-0 brightness-200"
            style={{
              backgroundImage: `url('/images/logo-teal-black.png')`,
              backgroundSize: "400px 400px",
              backgroundRepeat: "repeat",
              backgroundPosition: "center",
            }}
          ></div>
        </div>

        {/* Main Footer Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
            {/* Branded Section */}
            <div className="lg:col-span-1 space-y-4">
              <div className="flex items-center">
                <BrandLogo variant="footer" />
              </div>
              <p className="text-teal-100/60 text-sm leading-relaxed max-w-full sm:max-w-[260px]">
                {t("footer.description")}
              </p>
              <p className="text-teal-100/50 text-xs leading-relaxed max-w-full sm:max-w-[260px]">
                {t("footer.optionalNotarization")}
              </p>
            </div>
            {/* Services */}
            <div className="space-y-4">
              <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">
                Services
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="/claim-form"
                    className="text-teal-100/60 hover:text-white transition-all duration-300 text-sm flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-[1px] bg-teal-400 transition-all duration-300"></span>
                    Claim Form
                  </a>
                </li>

                <li>
                  <a
                    href="/notarization"
                    className="text-teal-100/60 hover:text-white transition-all duration-300 text-sm flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-[1px] bg-teal-400 transition-all duration-300"></span>
                    Notarization
                  </a>
                </li>
                <li>
                  <a
                    href="/pricing"
                    className="text-teal-100/60 hover:text-white transition-all duration-300 text-sm flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-[1px] bg-teal-400 transition-all duration-300"></span>
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="/how-it-works"
                    className="text-teal-100/60 hover:text-white transition-all duration-300 text-sm flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-[1px] bg-teal-400 transition-all duration-300"></span>
                    How It Works
                  </a>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div className="space-y-4">
              <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">
                Company
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="/who-we-are"
                    className="text-teal-100/60 hover:text-white transition-all duration-300 text-sm flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-[1px] bg-teal-400 transition-all duration-300"></span>
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="/what-we-do"
                    className="text-teal-100/60 hover:text-white transition-all duration-300 text-sm flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-[1px] bg-teal-400 transition-all duration-300"></span>
                    What We Do
                  </a>
                </li>
                <li>
                  <a
                    href="/contact"
                    className="text-teal-100/60 hover:text-white transition-all duration-300 text-sm flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-[1px] bg-teal-400 transition-all duration-300"></span>
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="/learning-center"
                    className="text-teal-100/60 hover:text-white transition-all duration-300 text-sm flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-[1px] bg-teal-400 transition-all duration-300"></span>
                    Learning Center
                  </a>
                </li>
                <li>
                  <a
                    href="/when-to-call-an-attorney"
                    className="text-teal-100/60 hover:text-white transition-all duration-300 text-sm flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-[1px] bg-teal-400 transition-all duration-300"></span>
                    When to Call an Attorney
                  </a>
                </li>
                <li>
                  <a
                    href="/license-credentials"
                    className="text-teal-100/60 hover:text-white transition-all duration-300 text-sm flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-[1px] bg-teal-400 transition-all duration-300"></span>
                    License &amp; Credentials
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div className="space-y-4">
              <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">
                Legal
              </h3>
              <ul className="space-y-3">
                <li>
                  <button
                    onClick={() => setActiveModal("privacy")}
                    className="text-teal-100/60 hover:text-white transition-all duration-300 text-sm flex items-center gap-2 group text-left"
                  >
                    <span className="w-0 group-hover:w-2 h-[1px] bg-teal-400 transition-all duration-300"></span>
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveModal("terms")}
                    className="text-teal-100/60 hover:text-white transition-all duration-300 text-sm flex items-center gap-2 group text-left"
                  >
                    <span className="w-0 group-hover:w-2 h-[1px] bg-teal-400 transition-all duration-300"></span>
                    Terms of Service
                  </button>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div className="space-y-4">
              <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">
                Contact
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-teal-100/60 text-sm group">
                  <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-400 group-hover:bg-teal-500/20 transition-all duration-300">
                    <Mail className="w-4 h-4" />
                  </div>
                  <a href="mailto:support@claimsaverplus.com" className="hover:text-white transition-colors duration-300">
                    support@claimsaverplus.com
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-800 pt-6">
            <div className="text-center">
              <p className="text-teal-100/20 text-[10px] tracking-widest uppercase">
                © {new Date().getFullYear()} ClaimSaver+ • Guided claim platform • Serving Florida drivers
              </p>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="mt-4 pt-4 border-t border-gray-800">
            <p className="text-[10px] text-gray-500 leading-relaxed text-center opacity-70 max-w-4xl mx-auto">
              <strong className="text-gray-400 uppercase tracking-widest text-[9px]">Legal Disclaimer:</strong>{" "}
              ClaimSaver+ is a guided claim technology platform. We are not a law firm, not your representative with an insurance company, and we do not provide legal advice, claim evaluation, or negotiation on your behalf. You file your no-fault (PIP) claim using our tools—you are the filer, not ClaimSaver+. The $500 fee is for platform access (guided forms, storage, tracking, reminders, and educational content). We do not guarantee any outcome. For legal advice about your specific situation, consult a licensed Florida attorney.
            </p>
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
              <div className="w-8 h-8 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center">
                <span className="text-teal-600 dark:text-teal-400 font-semibold text-sm">
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
                <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>
                  Personal identification information (name, email address,
                  phone number)
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Accident details and claim information</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Documentation and evidence related to your case</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>
                  Communication history with our platform
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
                <span>
                  Store and display information you enter in your account for
                  your claim organization (we do not act as your
                  representative to insurers)
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>
                  Send transactional emails about your account and platform use
                  (not legal advice)
                </span>
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

          <div className="bg-gradient-to-r from-teal-50 to-teal-100 dark:from-teal-950/50 dark:to-teal-900/50 rounded-xl p-6 border border-teal-200 dark:border-teal-800">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-3">
              <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">3</span>
              </div>
              Contact Us
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              If you have questions about this Privacy Policy, please contact us
              at
              <a
                href="mailto:support@claimsaverplus.com"
                className="text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300 font-semibold ml-1 transition-colors duration-300"
              >
                support@claimsaverplus.com
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
              <div className="w-8 h-8 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center">
                <span className="text-teal-600 dark:text-teal-400 font-semibold text-sm">
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
              ClaimSaver+ is a guided claim technology platform for Florida motor
              vehicle no-fault (PIP) claims.
              <strong className="text-red-600 dark:text-red-400">
                {" "}
                We are NOT a law firm and do NOT provide legal advice,
                representation, or negotiation with insurers on your behalf.
              </strong>{" "}
              You prepare and submit your claim. The platform may include:
            </p>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>
                  Guided digital workflows and field validation for standardized
                  information you enter
                </span>
              </li>

              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Secure document storage and organization tools</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>
                  Reminders, expense tracking, and general educational content
                </span>
              </li>
            </ul>
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-800 dark:text-red-200">
                <strong>Important:</strong> We do not evaluate the merits of your
                claim, tell you whether to accept a settlement, or communicate
                with insurance companies as your representative. For legal
                advice, consult a licensed attorney.
              </p>
            </div>
            <div className="mt-4 p-4 bg-teal-50 dark:bg-teal-950/30 rounded-lg border border-teal-200 dark:border-teal-800">
              <p className="text-sm text-teal-800 dark:text-teal-200">
                <strong>Optional services:</strong> If separately offered in the
                future, licensed professional services (such as public adjusting)
                would be a distinct product with its own contract and
                disclosures—not part of the standard platform fee.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-950/50 dark:to-teal-950/50 rounded-xl p-6 border border-green-200 dark:border-green-800">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-3">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">3</span>
              </div>
              Fees and Payment
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Platform access is offered for a flat fee of{" "}
              <span className="font-bold text-green-600 dark:text-green-400">
                $500
              </span>{" "}
              unless otherwise stated at checkout. This fee covers use of the
              software and educational materials described at the time of
              purchase—not representation or legal services.
            </p>
          </div>

          <div className="bg-gradient-to-r from-teal-50 to-teal-100 dark:from-teal-950/50 dark:to-teal-900/50 rounded-xl p-6 border border-teal-200 dark:border-teal-800">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-3">
              <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">4</span>
              </div>
              Contact Information
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              For questions about these Terms of Service, please contact us at
              <a
                href="mailto:support@claimsaverplus.com"
                className="text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300 font-semibold ml-1 transition-colors duration-300"
              >
                support@claimsaverplus.com
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
              <div className="w-8 h-8 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center">
                <span className="text-teal-600 dark:text-teal-400 font-semibold text-sm">
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

          <div className="bg-gradient-to-r from-teal-50 to-teal-100 dark:from-teal-950/50 dark:to-teal-900/50 rounded-xl p-6 border border-teal-200 dark:border-teal-800">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-3">
              <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">3</span>
              </div>
              Contact Us
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              If you have questions about our use of cookies, please contact us
              at
              <a
                href="mailto:support@claimsaverplus.com"
                className="text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300 font-semibold ml-1 transition-colors duration-300"
              >
                support@claimsaverplus.com
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
