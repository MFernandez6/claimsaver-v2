"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FAQ from "@/components/faq";
import { useClerk } from "@clerk/nextjs";
import { useTranslation } from "react-i18next";
import {
  Play,
  Shield,
  FileText,
  Smartphone,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Zap,
  Globe,
  Award,
  X,
  Home as HomeIcon,
} from "lucide-react";

export default function Home() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const { openSignIn } = useClerk();
  const { t } = useTranslation();
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(true);

  const handleGetStarted = () => {
    openSignIn();
  };

  const handleGoToDashboard = () => {
    router.push("/dashboard");
  };

  const handleDismissBanner = () => {
    setShowWelcomeBanner(false);
  };

  const faqItems = [
    {
      question: t("home.faq.legal.question"),
      answer: t("home.faq.legal.answer"),
    },
    {
      question: t("home.faq.matching.question"),
      answer: t("home.faq.matching.answer"),
    },
    {
      question: t("home.faq.accidents.question"),
      answer: t("home.faq.accidents.answer"),
    },
    {
      question: t("home.faq.documents.question"),
      answer: t("home.faq.documents.answer"),
    },
    {
      question: t("home.faq.states.question"),
      answer: t("home.faq.states.answer"),
    },
    {
      question: t("home.faq.satisfaction.question"),
      answer: t("home.faq.satisfaction.answer"),
    },
  ];

  const features = [
    {
      icon: <FileText className="w-6 h-6" />,
      title: t("home.features.feature1.title"),
      description: t("home.features.feature1.description"),
      color: "blue",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: t("home.features.feature3.title"),
      description: t("home.features.feature3.description"),
      color: "purple",
    },
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: t("home.features.feature4.title"),
      description: t("home.features.feature4.description"),
      color: "orange",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: t("home.features.feature5.title"),
      description: t("home.features.feature5.description"),
      color: "red",
    },
  ];

  const benefits = [
    {
      icon: <Zap className="w-5 h-5" />,
      title: t("home.benefits.benefit1.title"),
      description: t("home.benefits.benefit1.description"),
    },
    {
      icon: <Globe className="w-5 h-5" />,
      title: t("home.benefits.benefit2.title"),
      description: t("home.benefits.benefit2.description"),
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Welcome Banner for Authenticated Users */}
      {isLoaded && user && showWelcomeBanner && (
        <div className="fixed top-16 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 shadow-lg">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <HomeIcon className="w-5 h-5" />
              <span className="font-medium">
                Welcome back,{" "}
                {user.firstName || user.emailAddresses[0]?.emailAddress}! Ready
                to manage your claims?
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={handleGoToDashboard}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                Go to Dashboard
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleDismissBanner}
                className="text-white hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950">
        {/* Background Image */}
        <div className="fixed inset-0 z-0">
          <Image
            src="/images/long-logo-ClaimSaver.jpg"
            alt={t("home.hero.imageAlt")}
            className="w-full h-full object-cover opacity-25"
            fill
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/70 via-white/80 to-indigo-50/70 dark:from-gray-950/70 dark:via-gray-900/80 dark:to-blue-950/70"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-12">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-black text-2xl">C+</span>
                </div>
                <span className="text-4xl sm:text-5xl lg:text-6xl font-black bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent tracking-tight">
                  ClaimSaver+
                </span>
              </div>
            </div>

            {/* Cool Decorative Line */}
            <div className="flex justify-center items-center mb-12">
              <div className="flex items-center gap-4 w-full max-w-md">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-blue-400 to-blue-600"></div>
                <div className="w-3 h-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-lg"></div>
                <div className="flex-1 h-px bg-gradient-to-l from-transparent via-purple-400 to-purple-600"></div>
              </div>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              {t("home.hero.title")}
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {t("home.hero.subtitle")}
              </span>
            </h1>

            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto">
              {t("home.hero.description")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              {!isLoaded || !user ? (
                <>
                  <Button
                    size="lg"
                    onClick={handleGetStarted}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    {t("home.hero.cta")}
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 dark:text-gray-300 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    {t("home.hero.watchDemo")}
                    <Play className="ml-2 w-5 h-5" />
                  </Button>
                </>
              ) : (
                <Button
                  size="lg"
                  onClick={handleGoToDashboard}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  Go to Dashboard
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              )}
            </div>

            {/* Video Section */}
            <div className="relative max-w-5xl mx-auto">
              <video
                autoPlay
                loop
                playsInline
                controls
                className="w-full h-auto rounded-2xl shadow-2xl"
                style={{ aspectRatio: "16/9" }}
              >
                <source src="/video/Whiteboard.mp4" type="video/mp4" />
                {t("home.video.notSupported")}
              </video>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white dark:bg-gray-950 relative overflow-hidden">
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
              {t("home.features.title")}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {t("home.features.subtitle")}
            </p>
          </div>

          <div className="flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl">
              {/* First 3 cards */}
              {features.slice(0, 3).map((feature, index) => (
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

              {/* Last 2 cards centered */}
              <div className="lg:col-span-3 flex justify-center">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
                  {features.slice(3, 5).map((feature, index) => (
                    <Card
                      key={index + 3}
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
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950/30 relative overflow-hidden">
        {/* Background Image */}
        <div className="fixed inset-0 z-0">
          <Image
            src="/images/long-logo-ClaimSaver.jpg"
            alt={t("home.whyChoose.imageAlt")}
            className="w-full h-full object-cover opacity-20"
            fill
          />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50/80 to-blue-50/80 dark:from-gray-900/80 dark:to-blue-950/80"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                {t("home.whyChoose.title")}{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {t("home.whyChoose.brand")}?
                </span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                {t("home.whyChoose.description")}
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

              <div className="mt-8 flex items-center gap-6">
                <Button
                  size="lg"
                  onClick={handleGetStarted}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  {t("home.whyChoose.getStarted")}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>{t("home.whyChoose.flatFee")}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>{t("home.whyChoose.freeConsultation")}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-8 text-white shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <Award className="w-8 h-8" />
                  <h3 className="text-2xl font-bold">
                    {t("home.stats.title")}
                  </h3>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-lg">
                      {t("home.stats.recoveryTime")}
                    </span>
                    <span className="text-2xl font-bold">
                      {t("home.stats.recoveryTimeValue")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg">
                      {t("home.stats.successRate")}
                    </span>
                    <span className="text-2xl font-bold">
                      {t("home.stats.successRateValue")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg">
                      {t("home.stats.attorneyNetwork")}
                    </span>
                    <span className="text-2xl font-bold">
                      {t("home.stats.attorneyNetworkValue")}
                    </span>
                  </div>
                  {/* Empty space to maintain layout */}
                  <div className="h-6"></div>
                </div>
              </div>

              {/* Flat Fee Card - Repositioned to middle lower part */}
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">
                      {t("home.stats.flatFeeLabel")}
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {t("home.stats.flatFeeValue")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQ
        title={t("home.faq.title")}
        subtitle={t("home.faq.subtitle")}
        items={faqItems}
      />
    </div>
  );
}
