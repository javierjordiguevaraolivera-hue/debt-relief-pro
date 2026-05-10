import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CelebrationConfetti } from "./CelebrationConfetti";
import { SiteFooter, SiteHeader } from "../../components/SiteChrome";
import { getAffiliateUrl } from "@/lib/affiliate";
import { isLocale, type Locale } from "@/lib/i18n/locales";

type QualificationPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export const metadata: Metadata = {
  title: "Qualification | Debt Relief Pro",
};

const qualificationCopy: Record<
  Locale,
  {
    eyebrow: string;
    title: string;
    description: string;
    steps: string[];
    idLabel: string;
    cta: string;
    expiration: string;
  }
> = {
  en: {
    eyebrow: "Congratulations",
    title: "Your case qualifies for debt relief benefits",
    description:
      "This is a real confirmation. All you need to do is claim it. The next step is to complete the form with your details so our partner can:",
    steps: ["Contact you", "Build your action plan", "Help you with your debt"],
    idLabel: "Qualification ID",
    cta: "Claim My Benefit",
    expiration: "*Your prequalification expires in 2 hours",
  },
  es: {
    eyebrow: "Felicidades",
    title: "Tu caso si aplica para los beneficios",
    description:
      "Esta es una confirmacion real. Solo tienes que reclamarlo. El primer paso es registrarte en el formulario con todos los detalles para:",
    steps: ["Poder contactarte", "Disenarte un plan de accion", "Ayudarte con tu deuda"],
    idLabel: "ID de Calificacion",
    cta: "Reclamar mi Beneficio",
    expiration: "*Su precalificacion expira en 2 horas",
  },
};

export default async function QualificationPage({ params, searchParams }: QualificationPageProps) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();

  const locale: Locale = rawLocale;
  const copy = qualificationCopy[locale];
  const resolvedSearchParams = await searchParams;
  const id = Array.isArray(resolvedSearchParams.id)
    ? resolvedSearchParams.id[0]
    : resolvedSearchParams.id;
  const qualificationId = normalizeQualificationId(id);

  return (
    <div className="flex min-h-dvh flex-col bg-[#f4f8fb] text-slate-950">
      <CelebrationConfetti />
      <SiteHeader locale={locale} />
      <main className="mx-auto flex w-full max-w-3xl flex-1 items-center px-5 py-7">
        <section className="w-full text-center">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-emerald-700">
            {copy.eyebrow}
          </p>
          <h1 className="mt-3 text-3xl font-bold leading-tight tracking-normal text-[#02163a] md:text-4xl">
            {copy.title}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-700">
            {copy.description}
          </p>
          <ul className="mx-auto mt-5 grid max-w-xs gap-3">
            {copy.steps.map((step, index) => (
              <QualificationStep key={step} number={index + 1} text={step} />
            ))}
          </ul>
          <div className="mx-auto mt-6 max-w-sm rounded-md border border-slate-200 bg-white/70 p-3">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
              {copy.idLabel}
            </p>
            <p className="mt-1 text-3xl font-bold tracking-[0.2em] text-[#02163a]">
              {qualificationId}
            </p>
          </div>
          <a
            href={getAffiliateUrl(locale, resolvedSearchParams)}
            className="mt-6 inline-flex rounded-md bg-emerald-600 px-8 py-4 text-base font-bold uppercase text-white hover:bg-emerald-700"
          >
            {copy.cta}
          </a>
          <p className="mt-4 text-sm leading-6 text-slate-600">{copy.expiration}</p>
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
