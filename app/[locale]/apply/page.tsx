import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import { ApplyForm } from "./ApplyForm";
import { isLocale, type Locale } from "@/lib/i18n/locales";
import { getTranslations } from "@/lib/i18n/translations";
import { getPhoneDisplay, getPhoneHref, getSupportHours } from "@/lib/ringba";

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

export default async function ApplyPage({ params }: PageProps) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();

  const locale: Locale = rawLocale;
  const t = getTranslations(locale);

  return (
    <div className="flex min-h-dvh flex-col bg-[#f4f8fb] text-slate-950">
      <SiteHeader locale={locale} />
      <main className="mx-auto grid w-full max-w-7xl flex-1 gap-8 px-4 py-8 md:grid-cols-[0.9fr_1.1fr] md:px-5 md:py-14">
        <section className="flex flex-col justify-center rounded-lg bg-white p-6 shadow-sm md:bg-transparent md:p-0 md:shadow-none">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700 md:text-sm">
            {t.nav.apply}
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-tight tracking-normal text-[#123b5d] md:text-5xl">
            {t.apply.title}
          </h1>
          <p className="mt-5 text-base leading-7 text-slate-700 md:text-lg md:leading-8">
            {t.apply.description}
          </p>
          <div className="mt-8 rounded-lg bg-[#113b5f] p-5 text-white">
            <p className="text-sm font-bold uppercase text-emerald-200">{getSupportHours()}</p>
            <a href={getPhoneHref()} className="mt-2 block text-2xl font-bold">
              {getPhoneDisplay()}
            </a>
            <p className="mt-4 text-sm leading-6 text-slate-100">{t.home.trustNote}</p>
          </div>
        </section>
        <ApplyForm locale={locale} />
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}
