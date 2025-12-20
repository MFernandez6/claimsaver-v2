import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";

// Import translation files
import enTranslations from "../locales/en.json";
import esTranslations from "../locales/es.json";
import frTranslations from "../locales/fr.json";


const resources = {
  en: {
    translation: enTranslations,
  },
  es: {
    translation: esTranslations,
  },
  fr: {
    translation: frTranslations,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", // Force default language to 'en' initially to prevent hydration mismatch
    fallbackLng: "en",
    supportedLngs: ["en", "es", "fr"],
    load: "languageOnly", // This ensures en-US becomes en
    debug: process.env.NODE_ENV === "development",

    interpolation: {
      escapeValue: false, // React already escapes values
    },

    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
    },
  });

export default i18n;

// Export supported languages
export const supportedLanguages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
];

export const getLanguageName = (code: string) => {
  const lang = supportedLanguages.find((l) => l.code === code);
  return lang ? lang.name : "English";
};

export const getLanguageFlag = (code: string) => {
  const lang = supportedLanguages.find((l) => l.code === code);
  return lang ? lang.flag : "🇺🇸";
};
