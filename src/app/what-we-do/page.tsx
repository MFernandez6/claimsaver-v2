"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import FAQ from "@/components/faq";
import { useClerk } from "@clerk/nextjs";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();

  const handleStartClaim = () => {
    openSignIn();
  };

  const faqItems = [
    {
      question: t("whatWeDo.faq.whatDoWeDo.question"),
      answer: t("whatWeDo.faq.whatDoWeDo.answer"),
    },
    {
      question: t("whatWeDo.faq.attorneyMatching.question"),
      answer: t("whatWeDo.faq.attorneyMatching.answer"),
    },
    {
      question: t("whatWeDo.faq.documents.question"),
      answer: t("whatWeDo.faq.documents.answer"),
    },
    {
      question: t("whatWeDo.faq.security.question"),
      answer: t("whatWeDo.faq.security.answer"),
    },
    {
      question: t("whatWeDo.faq.mobile.question"),
      answer: t("whatWeDo.faq.mobile.answer"),
    },
    {
      question: t("whatWeDo.faq.help.question"),
      answer: t("whatWeDo.faq.help.answer"),
    },
    {
      question: t("whatWeDo.faq.timeline.question"),
      answer: t("whatWeDo.faq.timeline.answer"),
    },
    {
      question: t("whatWeDo.faq.guarantee.question"),
      answer: t("whatWeDo.faq.guarantee.answer"),
    },
  ];

  const services = [
    {
      icon: <FileText className="w-8 h-8 text-blue-600" />,
      title: t("whatWeDo.services.noFault.title"),
      description: t("whatWeDo.services.noFault.description"),
      features: [
        t("whatWeDo.services.noFault.features.interface"),
        t("whatWeDo.services.noFault.features.upload"),
        t("whatWeDo.services.noFault.features.validation"),
        t("whatWeDo.services.noFault.features.errorChecking"),
        t("whatWeDo.services.noFault.features.confirmation"),
      ],
      color: "blue",
    },
    {
      icon: <Users className="w-8 h-8 text-green-600" />,
      title: t("whatWeDo.services.attorney.title"),
      description: t("whatWeDo.services.attorney.description"),
      features: [
        t("whatWeDo.services.attorney.features.network"),
        t("whatWeDo.services.attorney.features.specialized"),
        t("whatWeDo.services.attorney.features.profiles"),
        t("whatWeDo.services.attorney.features.consultation"),
        t("whatWeDo.services.attorney.features.contact"),
      ],
      color: "green",
    },
    {
      icon: <Shield className="w-8 h-8 text-purple-600" />,
      title: t("whatWeDo.services.documents.title"),
      description: t("whatWeDo.services.documents.description"),
      features: [
        t("whatWeDo.services.documents.features.storage"),
        t("whatWeDo.services.documents.features.encryption"),
        t("whatWeDo.services.documents.features.sharing"),
        t("whatWeDo.services.documents.features.version"),
        t("whatWeDo.services.documents.features.mobile"),
      ],
      color: "purple",
    },
    {
      icon: <DollarSign className="w-8 h-8 text-orange-600" />,
      title: t("whatWeDo.services.recovery.title"),
      description: t("whatWeDo.services.recovery.description"),
      features: [
        t("whatWeDo.services.recovery.features.organization"),
        t("whatWeDo.services.recovery.features.tracking"),
        t("whatWeDo.services.recovery.features.wageLoss"),
        t("whatWeDo.services.recovery.features.property"),
        t("whatWeDo.services.recovery.features.guidance"),
      ],
      color: "orange",
    },
  ];

  const processSteps = [
    {
      step: "01",
      title: t("whatWeDo.process.step1.title"),
      description: t("whatWeDo.process.step1.description"),
      icon: <Upload className="w-6 h-6" />,
    },
    {
      step: "02",
      title: t("whatWeDo.process.step2.title"),
      description: t("whatWeDo.process.step2.description"),
      icon: <TrendingUp className="w-6 h-6" />,
    },
    {
      step: "03",
      title: t("whatWeDo.process.step3.title"),
      description: t("whatWeDo.process.step3.description"),
      icon: <CheckCircle className="w-6 h-6" />,
    },
    {
      step: "04",
      title: t("whatWeDo.process.step4.title"),
      description: t("whatWeDo.process.step4.description"),
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
            alt={t("whatWeDo.hero.imageAlt")}
            className="w-full h-full object-cover opacity-25"
            fill
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/70 via-white/80 to-indigo-50/70 dark:from-gray-950/70 dark:via-gray-900/80 dark:to-blue-950/70"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              {t("whatWeDo.hero.title")}{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {t("whatWeDo.hero.subtitle")}
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto">
              {t("whatWeDo.hero.description")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
              <Button
                size="lg"
                onClick={handleStartClaim}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                {t("whatWeDo.hero.startRecovery")}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 dark:text-gray-300 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Link href="/claim-form">{t("whatWeDo.hero.fileClaim")}</Link>
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
              {t("whatWeDo.services.title")}{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {t("whatWeDo.services.subtitle")}
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {t("whatWeDo.services.description")}
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
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300 border border-blue-200 dark:border-blue-700">
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
            alt={t("whatWeDo.process.imageAlt")}
            className="w-full h-full object-cover opacity-20"
            fill
          />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50/80 to-blue-50/80 dark:from-gray-900/80 dark:to-blue-950/80"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {t("whatWeDo.process.title")}{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {t("whatWeDo.process.subtitle")}
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {t("whatWeDo.process.description")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="relative group">
                <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 backdrop-blur-sm">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 border border-blue-200 dark:border-blue-700">
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
        title={t("whatWeDo.faq.title")}
        subtitle={t("whatWeDo.faq.subtitle")}
        items={faqItems}
      />
    </div>
  );
}
