"use client";

import { useTranslation } from "react-i18next";
import { DashboardOverviewPanels } from "@/components/dashboard-overview-panels";

/**
 * Homepage hero — same panels as the real dashboard (sample numbers).
 */
export function HomeHeroVisual() {
  const { t } = useTranslation();

  return (
    <div className="relative mx-auto w-full max-w-lg lg:ml-auto lg:max-w-none">
      <DashboardOverviewPanels
        completedSteps={5}
        totalSteps={8}
        documentsCount={3}
        nextEvent={{
          title: t("home.hero.visualPreviewEventTitle"),
          dateLabel: t("home.hero.visualPreviewEventDate"),
        }}
      />
    </div>
  );
}
