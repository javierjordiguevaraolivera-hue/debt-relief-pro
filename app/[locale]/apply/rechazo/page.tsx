import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SiteFooter, SiteHeader } from "../../components/SiteChrome";
import { isLocale, type Locale } from "@/lib/i18n/locales";
import { formatUsState } from "@/lib/usStates";

type RejectionPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ reason?: string; state?: string }>;
};

export const metadata: Metadata = {
  title: "No calificas | Debt Relief Pro",
};

export default async function RejectionPage({ params, searchParams }: RejectionPageProps) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();

  const locale: Locale = rawLocale;
  const { reason, state } = await searchParams;
  const stateName = formatUsState(state);
  const reasonText =
    reason === "state"
      ? `Por ahora, este beneficio no está disponible para residentes de ${stateName || "tu estado"}.`
      : "Para calificar, el monto total de tu deuda debe ser mayor a $10,000.";

  return (
    <div className="flex min-h-dvh flex-col bg-[#f4f8fb] text-slate-950">
      <SiteHeader locale={locale} />
      <main className="mx-auto flex w-full max-w-2xl flex-1 items-center px-5 py-12">
        <section className="w-full text-center">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-rose-600">
            Resultado de precalificación
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-normal text-[#02163a]">
            No calificas en este momento
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-700">{reasonText}</p>
          <Link
            href={`/${locale}/apply?restart=1`}
            className="mt-8 inline-flex rounded-md bg-emerald-600 px-7 py-4 text-base font-bold uppercase text-white hover:bg-emerald-700"
          >
            Intentarlo otra vez
          </Link>
        </section>
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}
