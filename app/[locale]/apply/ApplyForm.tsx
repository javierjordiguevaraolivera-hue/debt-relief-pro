"use client";

import { useState } from "react";

import type { Locale } from "@/lib/i18n/locales";
import { getAffiliateUrl } from "@/lib/affiliate";
import { getTranslations } from "@/lib/i18n/translations";

export function ApplyForm({ locale }: { locale: Locale }) {
  const t = getTranslations(locale);
  const [amount, setAmount] = useState("15000");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    window.location.href = getAffiliateUrl(locale);
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 grid gap-5 rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
      <label className="grid gap-2">
        <span className="text-sm font-semibold text-slate-800">{t.apply.amountLabel}</span>
        <select
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          className="rounded-md border border-slate-300 px-3 py-3 text-slate-950 outline-none focus:border-emerald-700"
        >
          <option value="10000">$10,000-$14,999</option>
          <option value="15000">$15,000-$24,999</option>
          <option value="25000">$25,000-$49,999</option>
          <option value="50000">$50,000+</option>
        </select>
      </label>
      <label className="grid gap-2">
        <span className="text-sm font-semibold text-slate-800">{t.apply.stateLabel}</span>
        <input
          required
          maxLength={2}
          placeholder="CA"
          className="rounded-md border border-slate-300 px-3 py-3 uppercase text-slate-950 outline-none focus:border-emerald-700"
        />
      </label>
      <label className="grid gap-2">
        <span className="text-sm font-semibold text-slate-800">{t.apply.hardshipLabel}</span>
        <textarea
          rows={4}
          placeholder={t.apply.hardshipPlaceholder}
          className="rounded-md border border-slate-300 px-3 py-3 text-slate-950 outline-none focus:border-emerald-700"
        />
      </label>
      <button
        type="submit"
        className="rounded-md bg-emerald-700 px-5 py-3 font-semibold text-white hover:bg-emerald-800"
      >
        {t.apply.button}
      </button>
      <p className="text-sm leading-6 text-slate-600">{t.apply.disclosure}</p>
    </form>
  );
}
