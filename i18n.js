import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";

export const locales = ["en", "es"] as const;
export const defaultLocale = "en" as const;

export type Locale = (typeof locales)[number];

const i18nConfig = getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as Locale)) notFound();
  return {
    locale: locale as string,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});

export default i18nConfig;
