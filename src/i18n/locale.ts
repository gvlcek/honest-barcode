import type { Locale } from "expo-localization";

export function resolveLocale(locales: Pick<Locale, "languageCode" | "languageTag">[]) {
  const locale = locales.find(({ languageCode }) =>
    languageCode === "en" || languageCode === "es"
  );

  return {
    language: locale?.languageCode ?? "en",
    languageTag: locale?.languageTag ?? "en",
  };
}
