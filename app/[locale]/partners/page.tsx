import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import { isLocale, type Locale } from "@/lib/i18n/locales";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return {
    title: "Marketing Partners",
    description:
      "Marketing partners and licensed debt relief providers that may contact you about debt relief programs and related services.",
    alternates: {
      canonical: `/${locale}/partners`,
      languages: {
        en: "/en/partners",
        es: "/es/partners",
      },
    },
  };
}

export default async function PartnersPage({ params }: PageProps) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();

  const locale: Locale = rawLocale;

  return (
    <div className="flex min-h-dvh flex-col bg-[#f4f8fb] text-slate-950">
      <SiteHeader hideActions={locale === "en"} locale={locale} />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 md:px-5 md:py-14">
        <h1 className="text-[32px] font-bold leading-tight tracking-[-0.04em] text-[#02163a]">
          Marketing Partners
        </h1>
        <p className="mt-5 text-base leading-7 text-slate-600">
          Debt Relief Pro, operated by Ecomfy Lead LLC, may connect your request with trusted
          marketing partners and licensed debt relief providers to offer information about debt
          relief programs and related services, including:
        </p>
        <ul className="mt-4 list-disc pl-6 text-base leading-7 text-slate-600">
          <li>National Debt Relief, LLC</li>
        </ul>
        <p className="mt-4 text-base leading-7 text-slate-600">
          This page will be updated with the list of participating partners as new business
          relationships are added.
        </p>
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}
