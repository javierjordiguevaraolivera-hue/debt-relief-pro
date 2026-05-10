import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SiteFooter, SiteHeader } from "../../components/SiteChrome";
import { isLocale, type Locale } from "@/lib/i18n/locales";
import { formatUsState } from "@/lib/usStates";

type RejectionPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export const metadata: Metadata = {
  title: "Not Qualified | Debt Relief Pro",
};

const rejectionCopy: Record<
  Locale,
  {
    eyebrow: string;
    title: string;
    retry: string;
    defaultState: string;
    stateReason: (stateName?: string) => string;
    debtReason: string;
  }
> = {
  en: {
    eyebrow: "Prequalification result",
    title: "You do not qualify at this time",
    retry: "Try again",
    defaultState: "your state",
    stateReason: (stateName) =>
      `At this time, this benefit is not available to residents of ${stateName || "your state"}.`,
    debtReason: "To qualify, your total unsecured debt must be $15,000 or more.",
  },
  es: {
    eyebrow: "Resultado de precalificacion",
    title: "No calificas en este momento",
    retry: "Intentarlo otra vez",
    defaultState: "tu estado",
    stateReason: (stateName) =>
      `Por ahora, este beneficio no esta disponible para residentes de ${stateName || "tu estado"}.`,
    debtReason: "Para calificar, el monto total de tu deuda debe ser mayor a $10,000.",
  },
};

export default async function RejectionPage({ params, searchParams }: RejectionPageProps) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();

  const locale: Locale = rawLocale;
  const copy = rejectionCopy[locale];
  const resolvedSearchParams = await searchParams;
  const reason = Array.isArray(resolvedSearchParams.reason)
    ? resolvedSearchParams.reason[0]
    : resolvedSearchParams.reason;
  const state = Array.isArray(resolvedSearchParams.state)
    ? resolvedSearchParams.state[0]
    : resolvedSearchParams.state;
  const stateName = formatUsState(state) || copy.defaultState;
  const reasonText = reason === "state" ? copy.stateReason(stateName) : copy.debtReason;

  return (
    <div className="flex min-h-dvh flex-col bg-[#f4f8fb] text-slate-950">
      <SiteHeader locale={locale} />
      <main className="mx-auto flex w-full max-w-2xl flex-1 items-center px-5 py-12">
        <section className="w-full text-center">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-rose-600">
            {copy.eyebrow}
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-normal text-[#02163a]">
            {copy.title}
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-700">{reasonText}</p>
          <Link
            href={buildRetryPath(locale, resolvedSearchParams)}
            className="mt-8 inline-flex rounded-md bg-emerald-600 px-7 py-4 text-base font-bold uppercase text-white hover:bg-emerald-700"
          >
            {copy.retry}
          </Link>
        </section>
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}

function buildRetryPath(
  locale: Locale,
  params: Record<string, string | string[] | undefined>,
): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (key === "reason" || key === "state" || typeof value === "undefined") {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item) => searchParams.append(key, item));
      return;
    }

    searchParams.set(key, value);
  });

  searchParams.set("restart", "1");

  return `/${locale}/apply?${searchParams.toString()}`;
}
