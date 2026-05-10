"use client";

import { PageHeroBackdrop } from "@/components/page-hero-backdrop";
import { useTranslation } from "react-i18next";
import { Shield } from "lucide-react";

const SECTION_KEYS = [
  { title: "section1Title", body: "section1Body" },
  { title: "section2Title", body: "section2Body" },
  { title: "section3Title", body: "section3Body" },
  { title: "section4Title", body: "section4Body" },
  { title: "section5Title", body: "section5Body" },
  { title: "section6Title", body: "section6Body" },
  { title: "section7Title", body: "section7Body" },
  { title: "section8Title", body: "section8Body" },
] as const;

export default function DataHandlingPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <section className="relative overflow-hidden pt-28 pb-12 bg-gradient-to-br from-slate-50 via-white to-emerald-50 dark:from-slate-950 dark:via-gray-900 dark:to-slate-900">
        <div className="absolute inset-0 z-0">
          <PageHeroBackdrop />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Shield className="w-12 h-12 mx-auto text-teal-600 mb-4" />
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {t("pages.dataHandling.title")}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            {t("pages.dataHandling.intro")}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
            {t("common.lastUpdated")}: {new Date().toLocaleDateString()}
          </p>
        </div>
      </section>

      <section className="py-12 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 pb-24">
        {SECTION_KEYS.map(({ title, body }) => (
          <article
            key={title}
            className="border-b border-gray-200 dark:border-gray-800 pb-10 last:border-0"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              {t(`pages.dataHandling.${title}`)}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
              {t(`pages.dataHandling.${body}`)}
            </p>
          </article>
        ))}
      </section>
    </div>
  );
}
