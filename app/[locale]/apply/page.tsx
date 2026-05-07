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
    <div className="min-h-screen bg-stone-50 text-slate-950">
      <SiteHeader locale={locale} />
      <main className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-[0.9fr_1.1fr]">
        <section className="flex flex-col justify-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
            {t.nav.apply}
          </p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-normal md:text-5xl">
            {t.apply.title}
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-700">{t.apply.description}</p>
          <div className="mt-8 rounded-lg bg-slate-950 p-5 text-white">
            <p className="text-sm text-slate-300">{getSupportHours()}</p>
            <a href={getPhoneHref()} className="mt-2 block text-2xl font-semibold">
              {getPhoneDisplay()}
            </a>
          </div>
        </section>
        <ApplyForm locale={locale} />
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}
