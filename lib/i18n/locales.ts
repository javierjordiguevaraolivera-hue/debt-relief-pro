export const locales = ["en", "es"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";
export const localeCookieName = "NEXT_LOCALE";

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function detectLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) {
    return defaultLocale;
  }

  return acceptLanguage.toLowerCase().split(",").some((part) => {
    const language = part.trim().split(";")[0];
    return language === "es" || language.startsWith("es-");
  })
    ? "es"
    : defaultLocale;
}

export function alternateLocale(locale: Locale): Locale {
  return locale === "es" ? "en" : "es";
}
