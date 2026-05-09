"use client";

import { useState } from "react";

import type { Locale } from "@/lib/i18n/locales";
import { getAffiliateUrl } from "@/lib/affiliate";
import { getTranslations } from "@/lib/i18n/translations";
import { usStateOptions } from "@/lib/usStates";

type DebtOption = {
  label: string;
  value: string;
};

const debtOptions: Record<Locale, DebtOption[]> = {
  en: [
    { label: "$10,000-$14,999", value: "10000" },
    { label: "$15,000-$24,999", value: "15000" },
    { label: "$25,000-$49,999", value: "25000" },
    { label: "$50,000+", value: "50000" },
  ],
  es: [
    { label: "$0 - $10,000", value: "0" },
    { label: "$10,000 - $20,000", value: "10000" },
    { label: "$20,000 - $32,000", value: "20000" },
  ],
};

export function ApplyForm({
  initialState,
  locale,
}: {
  initialState?: string;
  locale: Locale;
}) {
  const t = getTranslations(locale);
  const options = debtOptions[locale];
  const [amount, setAmount] = useState(options[0]?.value || "");
  const [state, setState] = useState(normalizeState(initialState));

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    window.location.href = getAffiliateUrl(locale);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`grid gap-6 ${
        locale === "es"
          ? "px-5 py-6 md:px-0 md:py-8"
          : "rounded-lg border border-slate-200 bg-white p-5 shadow-xl md:p-7"
      }`}
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
      <button
        type="submit"
        className="rounded-md bg-emerald-600 px-5 py-4 text-sm font-bold uppercase text-white hover:bg-emerald-700"
      >
        {locale === "es" ? "Ver si Califico" : t.apply.button}
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
        d="M16 5v9.6m0 0 4.7 4.7M16 14.6l-4.7 4.7M8.3 11.4v6.1c0 3.6 2.8 6.5 6.3 6.5h2.8c3.5 0 6.3-2.9 6.3-6.5v-6.1"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M10 7.5h.01M13 7.5h.01M19 7.5h.01M22 7.5h.01M7 15h.01M25 15h.01"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2.5"
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
