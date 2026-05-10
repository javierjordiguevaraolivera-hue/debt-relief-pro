"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import type { Locale } from "@/lib/i18n/locales";
import { forgetApplyStatus, rememberApplyStatus } from "@/lib/applyStatus";
import { getTranslations } from "@/lib/i18n/translations";
import { usStateOptions } from "@/lib/usStates";

type DebtOption = {
  label: string;
  value: string;
};

const debtOptions: Record<Locale, DebtOption[]> = {
  en: [
    { label: "$0 - $14,999", value: "0" },
    { label: "$15,000 - $24,999", value: "15000" },
    { label: "$25,000 - $49,999", value: "25000" },
    { label: "$50,000+", value: "50000" },
  ],
  es: [
    { label: "$0 - $10,000", value: "0" },
    { label: "$10,000 - $20,000", value: "10000" },
    { label: "$20,000 - $32,000", value: "20000" },
    { label: "$32,000+", value: "32000" },
  ],
};

const ineligibleStatesByLocale: Record<Locale, Set<string>> = {
  en: new Set(["NV", "PR", "GU"]),
  es: new Set(["CT", "OR", "VT", "WV", "WI"]),
};

export function ApplyForm({
  initialState,
  locale,
  resetStoredStatus = false,
}: {
  initialState?: string;
  locale: Locale;
  resetStoredStatus?: boolean;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = getTranslations(locale);
  const options = debtOptions[locale];
  const detectedState = normalizeState(initialState);
  const [amount, setAmount] = useState(locale === "es" ? "10000" : options[0]?.value || "");
  const [state, setState] = useState(detectedState);
  const shouldShowStateQuestion = !detectedState;

  useEffect(() => {
    if (resetStoredStatus) {
      forgetApplyStatus();
    }
  }, [resetStoredStatus]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (resetStoredStatus) {
      forgetApplyStatus();
    }

    if (locale === "es") {
      if (amount === "0") {
        rememberApplyStatus({ locale, reason: "debt", status: "rejected" });
        router.push(buildApplyPath(locale, "rechazo", searchParams, { reason: "debt" }));
        return;
      }

      if (ineligibleStatesByLocale.es.has(state)) {
        rememberApplyStatus({ locale, reason: "state", state, status: "rejected" });
        router.push(buildApplyPath(locale, "rechazo", searchParams, { reason: "state", state }));
        return;
      }

      const qualificationId = generateQualificationId();
      rememberApplyStatus({ id: qualificationId, locale, status: "qualified" });
      router.push(buildApplyPath(locale, "calificacion", searchParams, { id: qualificationId }));
      return;
    }

    if (amount === "0") {
      rememberApplyStatus({ locale, reason: "debt", status: "rejected" });
      router.push(buildApplyPath(locale, "rechazo", searchParams, { reason: "debt" }));
      return;
    }

    if (ineligibleStatesByLocale.en.has(state)) {
      rememberApplyStatus({ locale, reason: "state", state, status: "rejected" });
      router.push(buildApplyPath(locale, "rechazo", searchParams, { reason: "state", state }));
      return;
    }

    const qualificationId = generateQualificationId();
    rememberApplyStatus({ id: qualificationId, locale, status: "qualified" });
    router.push(buildApplyPath(locale, "calificacion", searchParams, { id: qualificationId }));
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-6 px-5 py-6 md:px-0 md:py-8"
    >
      <fieldset className="grid gap-4">
        <div className="text-center">
          <legend className="text-3xl font-bold leading-tight tracking-normal text-[#02163a]">
            {t.apply.amountQuestion}
          </legend>
        </div>
        <div className="grid gap-4">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              aria-pressed={amount === option.value}
              onClick={() => setAmount(option.value)}
              className={`flex min-h-16 items-center justify-center gap-3 rounded-2xl border bg-white px-5 py-4 text-base font-bold text-[#02163a] shadow-sm transition ${
                amount === option.value
                  ? "border-blue-500 ring-1 ring-blue-500"
                  : "border-slate-300 hover:border-blue-300"
              }`}
            >
              <ChoiceIcon />
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      </fieldset>
      {shouldShowStateQuestion ? (
        <label className="grid gap-2">
          <span className="text-sm font-bold text-slate-900">{t.apply.stateLabel}</span>
          <select
            required
            value={state}
            onChange={(event) => setState(event.target.value)}
            className="h-12 rounded-md border border-slate-300 bg-white px-3 text-slate-950 outline-none focus:border-emerald-600"
          >
            <option value="">{locale === "es" ? "Selecciona tu estado" : "Select your state"}</option>
            {usStateOptions.map((option) => (
              <option key={option.abbreviation} value={option.abbreviation}>
                {option.name}
              </option>
            ))}
          </select>
        </label>
      ) : null}
      <button
        type="submit"
        className="rounded-md bg-emerald-600 px-5 py-4 text-base font-bold uppercase text-white hover:bg-emerald-700"
      >
        {locale === "es" ? "Ver si Califico" : "Check My Eligibility"}
      </button>
    </form>
  );
}

function ChoiceIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-7 w-7 text-slate-500"
      fill="none"
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.5 9.5h19a2.5 2.5 0 0 1 2.5 2.5v11a2.5 2.5 0 0 1-2.5 2.5h-19A2.5 2.5 0 0 1 4 23V12a2.5 2.5 0 0 1 2.5-2.5Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M4 15h24M8.5 21.5h5M17 21.5h2.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function normalizeState(state?: string): string {
  if (!state) {
    return "";
  }

  const normalized = state.trim().toUpperCase();
  const match = usStateOptions.find(
    (option) => option.abbreviation === normalized || option.name.toUpperCase() === normalized,
  );

  return match?.abbreviation || "";
}

function generateQualificationId(): string {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let id = "";

  for (let index = 0; index < 6; index += 1) {
    id += letters[Math.floor(Math.random() * letters.length)];
  }

  return id;
}

function buildApplyPath(
  locale: Locale,
  step: "calificacion" | "rechazo",
  currentParams: URLSearchParams,
  nextParams: Record<string, string>,
): string {
  const params = new URLSearchParams(currentParams);

  Object.entries(nextParams).forEach(([key, value]) => {
    params.set(key, value);
  });

  return `/${locale}/apply/${step}?${params.toString()}`;
}
