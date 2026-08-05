import type { Metadata } from "next";
import { cookies } from "next/headers";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import { ApplyForm } from "./ApplyForm";
import {
  APPLY_STATUS_COOKIE,
  getApplyStatusPath,
  parseApplyStatusCookie,
} from "@/lib/applyStatus";
import { decodeGeoHeader } from "@/lib/geoHeadline";
import { isLocale, type Locale } from "@/lib/i18n/locales";
import { getTranslations } from "@/lib/i18n/translations";

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getTranslations(locale);

  return {
    title: t.apply.title,
    description: t.apply.description,
    alternates: {
      canonical: `/${locale}/apply`,
      languages: {
        en: "/en/apply",
        es: "/es/apply",
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

export default async function ApplyPage({ params, searchParams }: PageProps) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();

  const locale: Locale = rawLocale;
  const resolvedSearchParams = (await searchParams) || {};

  // The English funnel now lives at /en/apply2; keep old links and ads working.
  if (locale === "en") {
    redirect(buildApplyPath("en", resolvedSearchParams, "apply2"));
  }

  const restart = Array.isArray(resolvedSearchParams.restart)
    ? resolvedSearchParams.restart[0]
    : resolvedSearchParams.restart;
  const resetStoredStatus = restart === "1";

  if (locale === "es" && !resetStoredStatus) {
    const cookieStore = await cookies();
    const storedStatus = parseApplyStatusCookie(cookieStore.get(APPLY_STATUS_COOKIE)?.value);

    if (storedStatus) {
      redirect(getApplyStatusPath(storedStatus, locale));
    }
  }

  const requestHeaders = await headers();
  const detectedCountry = decodeGeoHeader(requestHeaders.get("x-vercel-ip-country"));
  const detectedState = getDetectedState(detectedCountry, requestHeaders.get("x-vercel-ip-country-region"));

  return (
    <div className="flex min-h-dvh flex-col bg-[#f4f8fb] text-slate-950">
      <SiteHeader locale={locale} />
      <main className="mx-auto grid w-full max-w-2xl flex-1 gap-8 px-4 py-8 md:px-5 md:py-14">
        <div>
          {locale === "es" ? (
            <div className="mb-2 flex justify-center">
              <Link
                href={buildApplyPath("en", resolvedSearchParams, "apply2")}
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-[#02163a] shadow-sm hover:border-emerald-600"
              >
                <Image
                  src="/media/flag-for-united-states.png"
                  alt=""
                  width={24}
                  height={24}
                  className="h-6 w-6 object-contain"
                />
                Apply in English
              </Link>
            </div>
          ) : null}
          <ApplyForm
            initialState={detectedState}
            locale={locale}
            resetStoredStatus={resetStoredStatus}
          />
        </div>
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

function buildApplyPath(
  locale: Locale,
  params: Record<string, string | string[] | undefined>,
  segment: "apply" | "apply2" = "apply",
): string {
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

  const queryString = searchParams.toString();

  return queryString ? `/${locale}/${segment}?${queryString}` : `/${locale}/${segment}`;
}
