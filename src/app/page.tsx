"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FAQ from "@/components/faq";
import { BrandLogo } from "@/components/brand-logo";
import { PageHeroBackdrop } from "@/components/page-hero-backdrop";
import { useClerk } from "@clerk/nextjs";
import { useTranslation } from "react-i18next";
import {
  Shield,
  FileText,
  Smartphone,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Zap,
  Calculator,
  X,
  Home as HomeIcon,
} from "lucide-react";

export default function Home() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const { openSignIn } = useClerk();
  const { t } = useTranslation();
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(true);

  // Check if user has an active session
  const hasActiveSession =
    typeof window !== "undefined" &&
    sessionStorage.getItem("claimsaver-active-session") === "true";

  // Clear Clerk state if user is signed in but no active session
  useEffect(() => {
    if (isLoaded && user && !hasActiveSession) {
      // Add a delay to avoid interfering with sign-in process
      const timer = setTimeout(() => {
        signOut();
      }, 3000); // 3 second delay

      return () => clearTimeout(timer);
    }
  }, [isLoaded, user, hasActiveSession, signOut]);

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

  ];

  const features = [
    {
      icon: <FileText className="w-6 h-6" />,
      title: t("home.features.feature1.title"),
      description: t("home.features.feature1.description"),
      gradientClass: "from-teal-600 to-emerald-700",
    },

    {
      icon: <Shield className="w-6 h-6" />,
      title: t("home.features.feature3.title"),
      description: t("home.features.feature3.description"),
      gradientClass: "from-slate-600 to-slate-800",
    },
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: t("home.features.feature4.title"),
      description: t("home.features.feature4.description"),
      gradientClass: "from-teal-600 to-emerald-700",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: t("home.features.feature5.title"),
      description: t("home.features.feature5.description"),
      gradientClass: "from-teal-700 to-emerald-800",
    },
  ];

  const benefits = [
    {
      icon: <Zap className="w-5 h-5" />,
      title: t("home.benefits.benefit1.title"),
      description: t("home.benefits.benefit1.description"),
    },

  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Welcome Banner for Authenticated Users */}
      {isLoaded && user && showWelcomeBanner && hasActiveSession && (
        <div className="fixed top-16 left-0 right-0 z-50 bg-gradient-to-r from-emerald-600 to-teal-900 text-white px-4 py-3 shadow-lg">
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
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-emerald-50 dark:from-slate-950 dark:via-gray-900 dark:to-slate-900">
        <PageHeroBackdrop />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 lg:pb-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="text-center lg:text-left order-2 lg:order-1">
              <div className="flex justify-center lg:justify-start mb-8">
                <BrandLogo variant="navbar" />
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                {t("home.hero.title")}
                <span className="block bg-gradient-to-r from-emerald-600 to-teal-800 bg-clip-text text-transparent mt-1">
                  {t("home.hero.subtitle")}
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
                {t("home.hero.description")}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-0">
                {!isLoaded || !user ? (
                  <>
                    <Button
                      size="lg"
                      asChild
                      className="bg-gradient-to-r from-emerald-600 to-teal-800 hover:from-emerald-700 hover:to-teal-900 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Link href="/how-it-works">
                        {t("home.hero.cta")}
                        <ArrowRight className="ml-2 w-5 h-5 inline" />
                      </Link>
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={handleGetStarted}
                      className="border-2 border-slate-300 hover:border-emerald-400 text-gray-800 dark:text-gray-200 px-8 py-4 text-lg font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm"
                    >
                      {t("home.hero.ctaSecondary")}
                    </Button>
                  </>
                ) : (
                  <Button
                    size="lg"
                    onClick={handleGoToDashboard}
                    className="bg-gradient-to-r from-emerald-600 to-teal-800 hover:from-emerald-700 hover:to-teal-900 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Go to Dashboard
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                )}
              </div>
            </div>

            <div className="relative max-w-2xl mx-auto lg:max-w-none order-1 lg:order-2">
              <div className="rounded-2xl overflow-hidden shadow-2xl ring-1 ring-slate-200/90 dark:ring-slate-700/90 bg-white dark:bg-slate-900">
                <Image
                  src="/images/brand/claimsaver-hero-banner-concept-01.png"
                  alt={t("home.story.heroBannerAlt")}
                  width={1200}
                  height={800}
                  className="w-full h-auto object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white dark:bg-gray-950 relative overflow-hidden border-y border-slate-100 dark:border-slate-800/80">
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(13,148,136,0.04)_50%,transparent_100%)] pointer-events-none" />

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 backdrop-blur-sm"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <CardHeader className="pb-4">
                    <div
                      className={`w-12 h-12 bg-gradient-to-r ${feature.gradientClass} rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300 relative overflow-hidden`}
                    >
                      {/* Icon */}
                      <div className="relative z-10">
                        {feature.icon}
                      </div>
                      {/* White fade overlay on the right */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white/60 pointer-events-none"></div>
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
      </section>

      {/* Brand visuals — PIP journey, value prop, before/after (graphics + PR themes) */}
      <section className="py-20 bg-slate-50/90 dark:bg-slate-950/40 border-y border-slate-200/70 dark:border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          <div>
            <div className="text-center max-w-3xl mx-auto mb-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                {t("home.story.pipStepsTitle")}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                {t("home.story.pipStepsSubtitle")}
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-xl border border-slate-200/90 dark:border-slate-700 bg-white dark:bg-slate-900">
              <Image
                src="/images/social/week1-wed-pip-5-steps.png"
                alt={t("home.story.pipStepsAlt")}
                width={1600}
                height={900}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-10 lg:gap-12 items-stretch">
            <div className="flex flex-col rounded-2xl overflow-hidden shadow-xl border border-slate-200/90 dark:border-slate-700 bg-white dark:bg-slate-900">
              <div className="p-6 pb-0">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {t("home.story.whatYouGetTitle")}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  {t("home.story.whatYouGetSubtitle")}
                </p>
              </div>
              <div className="p-4 pt-4 mt-auto">
                <Image
                  src="/images/social/week4-thu-what-you-get.png"
                  alt={t("home.story.whatYouGetAlt")}
                  width={1200}
                  height={900}
                  className="w-full h-auto object-cover rounded-lg"
                />
              </div>
            </div>
            <div className="flex flex-col rounded-2xl overflow-hidden shadow-xl border border-slate-200/90 dark:border-slate-700 bg-white dark:bg-slate-900">
              <div className="p-6 pb-0">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {t("home.story.beforeAfterTitle")}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  {t("home.story.beforeAfterSubtitle")}
                </p>
              </div>
              <div className="p-4 pt-4 mt-auto">
                <Image
                  src="/images/social/week3-mon-before-after.png"
                  alt={t("home.story.beforeAfterAlt")}
                  width={1200}
                  height={900}
                  className="w-full h-auto object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-24 bg-gradient-to-br from-slate-50 to-emerald-50/50 dark:from-gray-900 dark:to-slate-900/80 relative overflow-hidden">
        <PageHeroBackdrop />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                {t("home.whyChoose.title")}{" "}
                <span className="bg-gradient-to-r from-emerald-600 to-teal-800 bg-clip-text text-transparent">
                  {t("home.whyChoose.brand")}?
                </span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                {t("home.whyChoose.description")}
              </p>

              <div className="space-y-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-teal-800 rounded-lg flex items-center justify-center text-white flex-shrink-0">
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
                  className="bg-gradient-to-r from-emerald-600 to-teal-800 hover:from-emerald-700 hover:to-teal-900 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
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
              <div className="bg-gradient-to-br from-emerald-600 to-teal-900 rounded-3xl p-8 text-white shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <Calculator className="w-8 h-8" />
                  <h3 className="text-2xl font-bold">
                    {t("home.stats.title")}
                  </h3>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-lg">
                      {t("home.stats.recoveryTime")}
                    </span>
                    <span className="text-2xl font-bold text-right">
                      {t("home.stats.recoveryTimeValue")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-lg">
                      {t("home.stats.successRate")}
                    </span>
                    <span className="text-2xl font-bold text-right">
                      {t("home.stats.successRateValue")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-lg">
                      {t("home.stats.satisfaction")}
                    </span>
                    <span className="text-2xl font-bold text-right">
                      {t("home.stats.satisfactionValue")}
                    </span>
                  </div>
                  <p className="text-xs text-teal-100/90 leading-snug pt-2 border-t border-white/20">
                    {t("home.stats.statsNote")}
                  </p>
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
