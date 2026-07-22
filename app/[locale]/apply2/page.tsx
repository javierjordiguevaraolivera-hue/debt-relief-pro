import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import { Apply2Funnel } from "./Apply2Funnel";
import { decodeGeoHeader } from "@/lib/geoHeadline";
import { isLocale, type Locale } from "@/lib/i18n/locales";
import { getTranslations } from "@/lib/i18n/translations";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getTranslations(locale);

  return {
    title: t.apply.title,
    description: t.apply.description,
    alternates: {
      canonical: `/${locale}/apply2`,
      languages: {
        en: "/en/apply2",
        es: "/es/apply2",
      },
    },
    openGraph: {
      title: t.apply.title,
      description: t.apply.description,
      type: "website",
      locale: locale === "es" ? "es_US" : "en_US",
    },
  };
}

export default async function Apply2Page({ params }: PageProps) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();

  const locale: Locale = rawLocale;

  const requestHeaders = await headers();
  const detectedCountry = decodeGeoHeader(requestHeaders.get("x-vercel-ip-country"));
  const detectedState = getDetectedState(detectedCountry, requestHeaders.get("x-vercel-ip-country-region"));

  return (
    <div className="flex min-h-dvh flex-col bg-[#f4f8fb] text-slate-950">
      <SiteHeader hideActions={locale === "en"} locale={locale} />
      <main className="mx-auto grid w-full max-w-2xl flex-1 gap-8 px-4 py-8 md:px-5 md:py-14">
        <Apply2Funnel initialState={detectedState} />
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}

function getDetectedState(country: string | undefined, region: string | null): string | undefined {
  const countryCode = country?.trim().toUpperCase();

  if (countryCode === "US") {
    return decodeGeoHeader(region);
  }

  if (countryCode === "PR" || countryCode === "GU") {
    return countryCode;
  }

  return undefined;
}
