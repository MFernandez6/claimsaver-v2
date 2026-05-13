"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Home, ArrowLeft } from "lucide-react";

/**
 * App Router: do not render `<html>` / `<body>` here — they come from `layout.tsx`.
 * A full document in `not-found` breaks the layout tree and can fail prerender.
 */
export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 py-16 text-center">
      <p className="text-6xl font-bold text-blue-600 dark:text-blue-400">404</p>
      <h1 className="mt-4 text-2xl font-semibold text-gray-900 dark:text-white">
        {t("notFound.subtitle")}
      </h1>
      <p className="mt-2 max-w-md text-gray-600 dark:text-gray-400">
        {t("notFound.message")}
      </p>
      <div className="mt-8 flex w-full max-w-sm flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Home className="h-4 w-4" />
          {t("notFound.goHome")}
        </Link>
        <Link
          href="/who-we-are"
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-800 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("notFound.learnAboutUs")}
        </Link>
      </div>
    </div>
  );
}
