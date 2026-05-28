import type { MetadataRoute } from "next";
import { getPublicSiteUrl } from "@/lib/site-url";
import { ARTICLE_SLUGS } from "@/data/learningCenter/slugs";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getPublicSiteUrl();
  const now = new Date();

  const staticRoutes = [
    "",
    "/how-it-works",
    "/pricing",
    "/who-we-are",
    "/what-we-do",
    "/contact",
    "/learning-center",
    "/when-to-call-an-attorney",
    "/data-handling",
    "/license-credentials",
    "/notarization",
    "/login",
    "/signup",
    "/privacy-policy",
    "/terms-of-service",
  ];

  const articleRoutes = Object.values(ARTICLE_SLUGS).map(
    (slug) => `/learning-center/${slug}`,
  );

  return [...staticRoutes, ...articleRoutes].map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : ("monthly" as const),
    priority: path === "" ? 1 : path.startsWith("/learning-center") ? 0.8 : 0.7,
  }));
}
