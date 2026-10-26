import { createInstance } from "i18next";
import { initReactI18next } from "react-i18next";
import { getLocales } from "expo-localization";
import en from "@/locales/en.json";
import es from "@/locales/es.json";
import { resolveLocale } from "./locale";

const i18n = createInstance();

void i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, es: { translation: es } },
  lng: resolveLocale(getLocales()).language,
  supportedLngs: ["en", "es"],
  fallbackLng: "en",
  initAsync: false,
  interpolation: { escapeValue: false },
});

export default i18n;
