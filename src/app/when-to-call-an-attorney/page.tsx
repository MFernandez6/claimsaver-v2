"use client";

import Link from "next/link";
import { PageHeroBackdrop } from "@/components/page-hero-backdrop";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowLeft } from "lucide-react";

export default function WhenToCallAttorneyPage() {
  const { t } = useTranslation();

  const bullets = ["serious", "denied", "multi", "advice"] as const;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <section className="relative overflow-hidden pt-28 pb-20 bg-gradient-to-br from-amber-50/90 via-white to-emerald-50/80 dark:from-gray-950 dark:via-gray-900 dark:to-slate-900">
        <div className="absolute inset-0 z-0">
          <PageHeroBackdrop />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 text-amber-600 mb-6">
            <AlertTriangle className="w-10 h-10" />
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              {t("pages.needProfessionalHelp.title")}
            </h1>
          </div>
          <p className="text-xl text-teal-700 dark:text-teal-300 font-medium mb-6">
            {t("pages.needProfessionalHelp.subtitle")}
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
            {t("pages.needProfessionalHelp.body")}
          </p>
          <ul className="space-y-3 mb-8">
            {bullets.map((b) => (
              <li
                key={b}
                className="flex gap-3 text-gray-700 dark:text-gray-300"
              >
                <span className="text-teal-600 font-bold">•</span>
                <span>{t(`pages.needProfessionalHelp.bullets.${b}`)}</span>
              </li>
            ))}
          </ul>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-10 border-l-4 border-teal-500 pl-4">
            {t("pages.needProfessionalHelp.closing")}
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild variant="outline">
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2 inline" />
                {t("pages.needProfessionalHelp.ctaHome")}
              </Link>
            </Button>
            <Button asChild>
              <Link href="/how-it-works">
                {t("pages.needProfessionalHelp.ctaHowItWorks")}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
