import type { Locale } from "./i18n/locales";

const fallbackUrls: Record<Locale, string> = {
  en: "https://example.com/affiliate-en",
  es: "https://example.com/affiliate-es",
};

export function getAffiliateUrl(locale: Locale) {
  const envUrl =
    locale === "es"
      ? process.env.NEXT_PUBLIC_AFFILIATE_URL_ES
      : process.env.NEXT_PUBLIC_AFFILIATE_URL_EN;

  return envUrl || fallbackUrls[locale];
}
