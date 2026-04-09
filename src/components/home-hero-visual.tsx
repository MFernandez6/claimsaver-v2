"use client";

import { CalendarClock, FileStack, ShieldCheck, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";

/**
 * Composed product-preview style visual for the homepage hero (no raster image).
 */
export function HomeHeroVisual() {
  const { t } = useTranslation();

  return (
    <div className="relative w-full max-w-lg mx-auto lg:max-w-none lg:ml-auto">
      {/* Ambient glow — same teal/emerald language as PageHeroBackdrop */}
      <div
        className="pointer-events-none absolute -left-8 -top-12 h-64 w-64 rounded-full bg-teal-400/25 blur-3xl dark:bg-teal-500/15"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-6 bottom-0 h-56 w-56 rounded-full bg-emerald-500/20 blur-3xl dark:bg-emerald-400/10"
        aria-hidden
      />

      <div className="relative">
        {/* Top label */}
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-200/80 bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-teal-800 shadow-sm backdrop-blur-sm dark:border-teal-500/30 dark:bg-slate-900/90 dark:text-teal-200">
            <Sparkles className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" aria-hidden />
            {t("home.hero.visualLabel")}
          </div>
          <span className="hidden sm:inline text-xs font-medium text-slate-500 dark:text-slate-400">
            {t("home.hero.visualLive")}
          </span>
        </div>

        {/* Primary panel — progress */}
        <div className="rounded-2xl border border-slate-200/90 bg-white/90 p-6 shadow-[0_24px_80px_-12px_rgba(15,23,42,0.12)] backdrop-blur-xl dark:border-slate-700/80 dark:bg-slate-900/85 dark:shadow-[0_24px_80px_-12px_rgba(0,0,0,0.45)]">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                {t("home.hero.visualProgressTitle")}
              </p>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                {t("home.hero.visualProgressSubtitle")}
              </p>
            </div>
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-600 to-emerald-800 text-white shadow-lg shadow-teal-900/20">
              <ShieldCheck className="h-6 w-6" aria-hidden />
            </div>
          </div>

          <div className="mb-2 flex items-end justify-between text-xs font-medium text-slate-600 dark:text-slate-300">
            <span>{t("home.hero.visualStepsDone")}</span>
            <span className="tabular-nums text-teal-700 dark:text-teal-400">
              {t("home.hero.visualStepsRatio")}
            </span>
          </div>
          <div
            className="h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
            role="progressbar"
            aria-valuenow={62}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={t("home.hero.visualProgressTitle")}
          >
            <div className="h-full w-[62%] rounded-full bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-600 shadow-[0_0_20px_rgba(20,184,166,0.45)]" />
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2 border-t border-slate-100 pt-5 dark:border-slate-800">
            {[
              t("home.hero.visualStat1"),
              t("home.hero.visualStat2"),
              t("home.hero.visualStat3"),
            ].map((label) => (
              <div
                key={label}
                className="rounded-lg bg-slate-50/90 px-2 py-2 text-center dark:bg-slate-800/60"
              >
                <p className="text-[10px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Secondary row — bento */}
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex gap-4 rounded-2xl border border-slate-200/90 bg-gradient-to-br from-white to-slate-50/90 p-4 shadow-lg backdrop-blur-sm dark:border-slate-700/80 dark:from-slate-900/90 dark:to-slate-900/60">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300">
              <CalendarClock className="h-5 w-5" aria-hidden />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-900 dark:text-white">
                {t("home.hero.visualDeadlineTitle")}
              </p>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                {t("home.hero.visualDeadlineHint")}
              </p>
            </div>
          </div>

          <div className="flex gap-4 rounded-2xl border border-slate-200/90 bg-gradient-to-br from-white to-emerald-50/40 p-4 shadow-lg backdrop-blur-sm dark:border-slate-700/80 dark:from-slate-900/90 dark:to-emerald-950/20">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
              <FileStack className="h-5 w-5" aria-hidden />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-900 dark:text-white">
                {t("home.hero.visualDocsTitle")}
              </p>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                {t("home.hero.visualDocsHint")}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
