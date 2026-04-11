"use client";

import Link from "next/link";
import { PageHeroBackdrop } from "@/components/page-hero-backdrop";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, PenLine } from "lucide-react";

export default function HowItWorksPage() {
  const { t } = useTranslation();

  const steps = [
    { n: 1, titleKey: "pages.howItWorks.step1Title", bodyKey: "pages.howItWorks.step1Body" },
    { n: 2, titleKey: "pages.howItWorks.step2Title", bodyKey: "pages.howItWorks.step2Body" },
    { n: 3, titleKey: "pages.howItWorks.step3Title", bodyKey: "pages.howItWorks.step3Body" },
    { n: 4, titleKey: "pages.howItWorks.step4Title", bodyKey: "pages.howItWorks.step4Body" },
    { n: 5, titleKey: "pages.howItWorks.step5Title", bodyKey: "pages.howItWorks.step5Body" },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <section className="relative overflow-hidden pt-28 pb-16 bg-gradient-to-br from-slate-50 via-white to-emerald-50 dark:from-slate-950 dark:via-gray-900 dark:to-slate-900">
        <div className="absolute inset-0 z-0">
          <PageHeroBackdrop />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {t("pages.howItWorks.title")}
          </h1>
          <p className="text-xl text-teal-600 dark:text-teal-400 font-medium mb-4">
            {t("pages.howItWorks.subtitle")}
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            {t("pages.howItWorks.intro")}
          </p>
        </div>
      </section>

      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {steps.map((s) => (
          <Card
            key={s.n}
            className="border-0 shadow-lg bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800"
          >
            <CardContent className="p-6 sm:p-8 flex gap-4 sm:gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-lg">
                {s.n}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {t(s.titleKey)}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {t(s.bodyKey)}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="pb-24 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-teal-200/90 dark:border-teal-800/80 bg-teal-50/70 dark:bg-teal-950/25 p-6 flex gap-3">
          <PenLine
            className="w-6 h-6 text-teal-700 dark:text-teal-300 flex-shrink-0 mt-0.5"
            aria-hidden
          />
          <div className="space-y-3">
            <p className="text-sm text-teal-950 dark:text-teal-50/95 leading-relaxed">
              {t("pages.howItWorks.notarizationNote")}
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm font-medium">
              <Link
                href="/notarization"
                className="text-teal-800 dark:text-teal-200 hover:underline inline-flex items-center"
              >
                {t("navigation.notarization")}
                <ArrowRight className="ml-1 w-4 h-4" aria-hidden />
              </Link>
              <Link
                href="/pricing"
                className="text-teal-800 dark:text-teal-200 hover:underline inline-flex items-center"
              >
                {t("navigation.pricing")}
                <ArrowRight className="ml-1 w-4 h-4" aria-hidden />
              </Link>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
          <Button asChild size="lg" className="bg-gradient-to-r from-teal-600 to-teal-700">
            <Link href="/pricing" className="inline-flex items-center justify-center">
              View pricing
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/claim-form">Start filing your claim</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
