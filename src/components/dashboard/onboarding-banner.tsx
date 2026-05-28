"use client";

import { useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

type OnboardingBannerProps = {
  completedSteps: number;
  documentCount: number;
  onUploadClick: () => void;
  onAddMilestoneClick: () => void;
};

const STORAGE_KEY = "claimsaver_onboarding_dismissed";

export function OnboardingBanner({
  completedSteps,
  documentCount,
  onUploadClick,
  onAddMilestoneClick,
}: OnboardingBannerProps) {
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(STORAGE_KEY) === "true";
  });

  if (dismissed || completedSteps > 0 || documentCount > 0) {
    return null;
  }

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setDismissed(true);
  };

  return (
    <div className="mb-6 rounded-xl border border-teal-200 bg-teal-50 p-5 dark:border-teal-800 dark:bg-teal-950/40">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-lg font-semibold text-teal-900 dark:text-teal-100">
          Welcome to ClaimSaver+ — here&apos;s how to get started
        </h3>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={dismiss}
          className="shrink-0 text-teal-800 hover:bg-teal-100 dark:text-teal-200"
          aria-label="Dismiss welcome guide"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <p className="font-medium text-slate-900 dark:text-slate-100">
            1. Fill your claim worksheet
          </p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Eight guided steps with auto-save.
          </p>
          <Link
            href="/claim-form"
            className="mt-2 inline-block text-sm font-medium text-teal-700 hover:underline dark:text-teal-400"
          >
            Start Step 1 →
          </Link>
        </div>
        <div>
          <p className="font-medium text-slate-900 dark:text-slate-100">
            2. Upload your documents
          </p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Police report, medical records, insurance card.
          </p>
          <button
            type="button"
            onClick={onUploadClick}
            className="mt-2 text-sm font-medium text-teal-700 hover:underline dark:text-teal-400"
          >
            Upload a Document →
          </button>
        </div>
        <div>
          <p className="font-medium text-slate-900 dark:text-slate-100">
            3. Track your deadlines
          </p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Set reminders for rules like the 14-day window.
          </p>
          <button
            type="button"
            onClick={onAddMilestoneClick}
            className="mt-2 text-sm font-medium text-teal-700 hover:underline dark:text-teal-400"
          >
            Add a Milestone →
          </button>
        </div>
      </div>
    </div>
  );
}
