import type { Locale } from "./i18n/locales";

type AffiliateParams =
  | URLSearchParams
  | Record<string, string | string[] | undefined>
  | string;

const fallbackUrls: Record<Locale, string> = {
  en: "https://example.com/affiliate-en",
  es: "https://example.com/affiliate-es",
};

export function getAffiliateUrl(locale: Locale, params?: AffiliateParams) {
  const envUrl =
    locale === "es"
      ? process.env.NEXT_PUBLIC_AFFILIATE_URL_ES
      : process.env.NEXT_PUBLIC_AFFILIATE_URL_EN;

  return appendParamsToUrl(envUrl || fallbackUrls[locale], params);
}

function appendParamsToUrl(url: string, params?: AffiliateParams): string {
  if (!params) {
    return url;
  }

  const affiliateUrl = new URL(url);
  const sourceParams = normalizeParams(params);

  sourceParams.forEach((value, key) => {
    affiliateUrl.searchParams.set(key, value);
  });

  return affiliateUrl.toString();
}

function normalizeParams(params: AffiliateParams): URLSearchParams {
  if (params instanceof URLSearchParams) {
    return params;
  }

  if (typeof params === "string") {
    return new URLSearchParams(params);
  }

  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (typeof value === "undefined") {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item) => searchParams.append(key, item));
      return;
    }

    searchParams.set(key, value);
  });

  return searchParams;
}
