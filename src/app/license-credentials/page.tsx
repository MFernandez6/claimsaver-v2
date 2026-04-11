"use client";

import Link from "next/link";
import { PageHeroBackdrop } from "@/components/page-hero-backdrop";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

export default function LicenseCredentialsPage() {
  const { t } = useTranslation();
  const staffLicenseNumber =
    process.env.NEXT_PUBLIC_FL_STAFF_ADJUSTER_LICENSE?.trim();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <section className="relative overflow-hidden pt-28 pb-24 bg-gradient-to-br from-slate-50 via-white to-emerald-50 dark:from-slate-950 dark:via-gray-900 dark:to-slate-900">
        <div className="absolute inset-0 z-0">
          <PageHeroBackdrop />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Shield className="w-12 h-12 text-teal-600 mb-6" />
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t("pages.licenseCredentials.title")}
          </h1>
          <p className="text-lg text-teal-600 dark:text-teal-400 font-medium mb-6">
            {t("pages.licenseCredentials.subtitle")}
          </p>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
            {t("pages.licenseCredentials.body")}
          </p>

          <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-5 dark:border-slate-700 dark:bg-slate-900/50 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              {t("pages.licenseCredentials.staffLicenseHeading")}
            </h2>
            {staffLicenseNumber ? (
              <p className="text-gray-700 dark:text-gray-300 font-mono text-sm">
                {staffLicenseNumber}
              </p>
            ) : (
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                {t("pages.licenseCredentials.staffLicenseBody")}
              </p>
            )}
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 leading-relaxed">
              {t("pages.licenseCredentials.staffLicensePending")}
            </p>
          </div>

          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
            {t("pages.licenseCredentials.optionalPA")}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 italic mb-10">
            {t("pages.licenseCredentials.verify")}
          </p>
          <Button asChild>
            <Link href="/contact">Contact</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
