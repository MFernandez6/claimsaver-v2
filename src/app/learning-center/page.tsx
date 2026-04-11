"use client";

import Link from "next/link";
import { PageHeroBackdrop } from "@/components/page-hero-backdrop";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

export default function LearningCenterPage() {
  const { t } = useTranslation();

  const articles = [
    "pipSteps",
    "fourteenDay",
    "needLawyer",
    "documents",
    "mistakes",
  ] as const;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <section className="relative overflow-hidden pt-28 pb-12 bg-gradient-to-br from-slate-50 via-white to-emerald-50 dark:from-slate-950 dark:via-gray-900 dark:to-slate-900">
        <div className="absolute inset-0 z-0">
          <PageHeroBackdrop />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <BookOpen className="w-12 h-12 mx-auto text-teal-600 mb-4" />
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {t("pages.learningCenter.title")}
          </h1>
          <p className="text-lg text-teal-600 dark:text-teal-400 font-medium mb-4">
            {t("pages.learningCenter.subtitle")}
          </p>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            {t("pages.learningCenter.intro")}
          </p>
        </div>
      </section>

      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {articles.map((key) => (
          <Card
            key={key}
            className="border border-gray-200 dark:border-gray-700 shadow-md"
          >
            <CardHeader>
              <CardTitle className="text-xl text-gray-900 dark:text-white">
                {t(`pages.learningCenter.articles.${key}.title`)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                {t(`pages.learningCenter.articles.${key}.summary`)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 italic">
                {t("pages.learningCenter.footerDisclaimer")}
              </p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="pb-20 max-w-3xl mx-auto px-4 text-center text-sm text-gray-500 space-y-4">
        <p>
          <Link
            href="/when-to-call-an-attorney"
            className="text-teal-600 dark:text-teal-400 font-medium hover:underline"
          >
            {t("pages.learningCenter.attorneyLink")}
          </Link>
        </p>
        <p>
          <Link href="/notarization" className="text-teal-600 dark:text-teal-400 font-medium hover:underline">
            {t("pages.learningCenter.notarizationLink")}
          </Link>
        </p>
      </section>
    </div>
  );
}
