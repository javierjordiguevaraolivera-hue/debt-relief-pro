import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CelebrationConfetti } from "./CelebrationConfetti";
import { SiteFooter, SiteHeader } from "../../components/SiteChrome";
import { getAffiliateUrl } from "@/lib/affiliate";
import { isLocale, type Locale } from "@/lib/i18n/locales";

type QualificationPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ id?: string }>;
};

export const metadata: Metadata = {
  title: "Felicidades | Debt Relief Pro",
};

export default async function QualificationPage({ params, searchParams }: QualificationPageProps) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();

  const locale: Locale = rawLocale;
  const { id } = await searchParams;
  const qualificationId = normalizeQualificationId(id);

  return (
    <div className="flex min-h-dvh flex-col bg-[#f4f8fb] text-slate-950">
      <CelebrationConfetti />
      <SiteHeader locale={locale} />
      <main className="mx-auto flex w-full max-w-3xl flex-1 items-center px-5 py-7">
        <section className="w-full text-center">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-emerald-700">
            Felicidades
          </p>
          <h1 className="mt-3 text-3xl font-bold leading-tight tracking-normal text-[#02163a] md:text-4xl">
            Tu caso sí aplica para los beneficios
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-700">
            Esta es una confirmación real. Solo tienes que reclamarlo. El primer paso es
            registrarte en el formulario con todos los detalles para:
          </p>
          <ul className="mx-auto mt-5 grid max-w-xs gap-3">
            <QualificationStep number={1} text="Poder contactarte" />
            <QualificationStep number={2} text="Diseñarte un plan de acción" />
            <QualificationStep number={3} text="Ayudarte con tu deuda" />
          </ul>
          <div className="mx-auto mt-6 max-w-sm rounded-md border border-slate-200 bg-white/70 p-3">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
              ID de Calificación
            </p>
            <p className="mt-1 text-3xl font-bold tracking-[0.2em] text-[#02163a]">
              {qualificationId}
            </p>
          </div>
          <a
            href={getAffiliateUrl(locale)}
            className="mt-6 inline-flex rounded-md bg-emerald-600 px-8 py-4 text-base font-bold uppercase text-white hover:bg-emerald-700"
          >
            Reclamar mi Beneficio
          </a>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            *Su precalificación expira en 2 horas
          </p>
        </section>
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}

function QualificationStep({ number, text }: { number: number; text: string }) {
  return (
    <li className="grid grid-cols-[2rem_1fr] items-center gap-3 text-left">
      <svg
        aria-hidden="true"
        className="h-8 w-8 shrink-0 text-emerald-600"
        fill="none"
        viewBox="0 0 44 44"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="22" cy="22" r="20" fill="currentColor" opacity="0.12" />
        <circle cx="22" cy="22" r="18" stroke="currentColor" strokeWidth="2" />
        <text
          fill="currentColor"
          fontSize="18"
          fontWeight="700"
          textAnchor="middle"
          x="22"
          y="28"
        >
          {number}
        </text>
      </svg>
      <span className="text-base font-bold text-[#02163a]">{text}</span>
    </li>
  );
}

function normalizeQualificationId(id?: string): string {
  return /^[A-Z]{6}$/.test(id || "") ? id! : "DRPPRO";
}
