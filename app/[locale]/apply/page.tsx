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
import { getPhoneDisplay, getPhoneHref, getSupportHours } from "@/lib/ringba";

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ restart?: string }>;
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
  const t = getTranslations(locale);
  const { restart } = (await searchParams) || {};
  const resetStoredStatus = restart === "1";

  if (!resetStoredStatus) {
    const cookieStore = await cookies();
    const storedStatus = parseApplyStatusCookie(cookieStore.get(APPLY_STATUS_COOKIE)?.value);

    if (storedStatus) {
      redirect(getApplyStatusPath(storedStatus, locale));
    }
  }

  const requestHeaders = await headers();
  const detectedState = decodeGeoHeader(requestHeaders.get("x-vercel-ip-country-region"));

  return (
    <div className="flex min-h-dvh flex-col bg-[#f4f8fb] text-slate-950">
      <SiteHeader locale={locale} />
      <main className={`mx-auto grid w-full flex-1 gap-8 px-4 py-8 md:px-5 md:py-14 ${locale === "es" ? "max-w-2xl" : "max-w-7xl md:grid-cols-[0.9fr_1.1fr]"}`}>
        {locale === "en" ? (
          <section className="flex flex-col justify-center rounded-lg bg-white p-6 shadow-sm md:bg-transparent md:p-0 md:shadow-none">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700 md:text-sm">
              {t.nav.apply}
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-tight tracking-normal text-[#02163a] md:text-5xl">
              {t.apply.title}
            </h1>
            <p className="mt-5 text-base leading-7 text-slate-700 md:text-lg md:leading-8">
              {t.apply.description}
            </p>
            <div className="mt-8 rounded-lg bg-[#02163a] p-5 text-white">
              <p className="text-sm font-bold uppercase text-emerald-200">{getSupportHours()}</p>
              <a href={getPhoneHref()} className="mt-2 block text-2xl font-bold">
                {getPhoneDisplay()}
              </a>
              <p className="mt-4 text-sm leading-6 text-slate-100">{t.home.trustNote}</p>
            </div>
          </section>
        ) : null}
        <div>
          {locale === "es" ? (
            <div className="mb-2 flex justify-center">
              <Link
                href="/en/apply"
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
