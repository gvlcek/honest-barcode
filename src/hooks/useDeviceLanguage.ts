import { useEffect } from "react";
import { useLocales } from "expo-localization";
import i18n from "@/i18n";
import { resolveLocale } from "@/i18n/locale";

export function useDeviceLanguage() {
  const locales = useLocales();
  const { language } = resolveLocale(locales);

  useEffect(() => {
    if (i18n.language !== language) {
      void i18n.changeLanguage(language);
    }
  }, [language]);
}
