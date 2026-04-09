"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FAQ from "@/components/faq";
import { PageHeroBackdrop } from "@/components/page-hero-backdrop";
import { HomeHeroVisual } from "@/components/home-hero-visual";
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
  Scale,
  BadgeCheck,
  Lock,
} from "lucide-react";

export default function Home() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const { t } = useTranslation();
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(true);

  const handleGetStarted = () => {
    router.push("/claim-form");
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
      {isLoaded && user && showWelcomeBanner && (
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

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 lg:pb-28">
          <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] gap-14 lg:gap-20 items-center">
            <div className="text-center lg:text-left order-2 lg:order-1">
              <p className="mb-5 inline-flex items-center justify-center gap-2 rounded-full border border-teal-200/90 bg-white/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-teal-800 shadow-sm backdrop-blur-sm dark:border-teal-500/25 dark:bg-slate-900/70 dark:text-teal-200 lg:justify-start">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-500 shadow-[0_0_12px_rgba(20,184,166,0.9)]" />
                {t("home.hero.eyebrow")}
              </p>

              <h1 className="text-[2.125rem] sm:text-5xl lg:text-[3.25rem] font-bold tracking-tight text-slate-900 dark:text-white mb-5 leading-[1.1]">
                <span className="block">{t("home.hero.title")}</span>
                <span className="mt-2 block bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-800 bg-clip-text text-transparent">
                  {t("home.hero.subtitle")}
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 mb-9 leading-relaxed max-w-xl mx-auto lg:mx-0 text-pretty">
                {t("home.hero.description")}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start mb-8">
                {!isLoaded || !user ? (
                  <>
                    <Button
                      size="lg"
                      asChild
                      className="h-14 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-800 px-8 text-base font-semibold text-white shadow-[0_12px_40px_-8px_rgba(13,148,136,0.55)] hover:from-emerald-700 hover:to-teal-900 hover:shadow-[0_16px_48px_-8px_rgba(13,148,136,0.6)] transition-all duration-300"
                    >
                      <Link href="/how-it-works" className="inline-flex items-center gap-2">
                        {t("home.hero.cta")}
                        <ArrowRight className="h-5 w-5 shrink-0" />
                      </Link>
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={handleGetStarted}
                      className="h-14 rounded-xl border-2 border-slate-200 bg-white/90 px-8 text-base font-semibold text-slate-900 shadow-sm backdrop-blur-sm hover:border-teal-400/80 hover:bg-white dark:border-slate-600 dark:bg-slate-900/90 dark:text-slate-100 dark:hover:border-teal-500/50"
                    >
                      {t("home.hero.ctaSecondary")}
                    </Button>
                  </>
                ) : (
                  <Button
                    size="lg"
                    onClick={handleGoToDashboard}
                    className="h-14 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-800 px-8 text-base font-semibold text-white shadow-[0_12px_40px_-8px_rgba(13,148,136,0.55)] hover:from-emerald-700 hover:to-teal-900"
                  >
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                )}
              </div>

              <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 lg:justify-start text-sm text-slate-600 dark:text-slate-400">
                <li className="inline-flex items-center gap-2">
                  <Scale className="h-4 w-4 shrink-0 text-teal-600 dark:text-teal-400" aria-hidden />
                  <span>{t("home.hero.trust1")}</span>
                </li>
                <li className="inline-flex items-center gap-2">
                  <BadgeCheck className="h-4 w-4 shrink-0 text-teal-600 dark:text-teal-400" aria-hidden />
                  <span>{t("home.hero.trust2")}</span>
                </li>
                <li className="inline-flex items-center gap-2">
                  <Lock className="h-4 w-4 shrink-0 text-teal-600 dark:text-teal-400" aria-hidden />
                  <span>{t("home.hero.trust3")}</span>
                </li>
              </ul>
            </div>

            <div className="relative order-1 lg:order-2">
              <HomeHeroVisual />
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
                      <div className="relative z-10">{feature.icon}</div>
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
