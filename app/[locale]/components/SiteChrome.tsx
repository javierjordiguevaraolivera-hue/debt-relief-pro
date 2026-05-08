import Link from "next/link";
import Image from "next/image";

import type { Locale } from "@/lib/i18n/locales";
import { alternateLocale } from "@/lib/i18n/locales";
import { getTranslations } from "@/lib/i18n/translations";
import { getPhoneDisplay, getPhoneHref, getSupportHours } from "@/lib/ringba";

export function SiteHeader({ locale }: { locale: Locale }) {
  const t = getTranslations(locale);
  const brand = process.env.NEXT_PUBLIC_BRAND_NAME || "Debt Relief Pro";
  const otherLocale = alternateLocale(locale);

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4">
        <Link href={`/${locale}`} className="font-semibold tracking-tight text-slate-950">
          <Image
            src="/media/debt%20relief%20pro%20logo.svg"
            alt={brand}
            width={2400}
            height={600}
            priority
            className="h-10 w-auto"
          />
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-700 md:flex">
          <a href={`/${locale}#benefits`}>{t.nav.benefits}</a>
          <a href={`/${locale}#process`}>{t.nav.process}</a>
          <Link href={`/${locale}/blog`}>{t.nav.blog}</Link>
        </nav>
        <div className="flex items-center gap-2">
          <a
            href={getPhoneHref()}
            className="hidden rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 sm:inline-flex"
          >
            {getPhoneDisplay()}
          </a>
          <Link
            href={`/${otherLocale}`}
            className="rounded-md px-3 py-2 text-sm font-semibold uppercase text-slate-600 hover:bg-slate-100"
          >
            {otherLocale}
          </Link>
          <Link
            href={`/${locale}/apply`}
            className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-800"
          >
            {t.nav.apply}
          </Link>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter({ locale }: { locale: Locale }) {
  const t = getTranslations(locale);
  const brand = process.env.NEXT_PUBLIC_BRAND_NAME || "Debt Relief Pro";

  return (
    <footer className="border-t border-stone-200 bg-stone-50">
      <div className="mx-auto grid max-w-7xl gap-6 px-5 py-10 text-sm text-slate-600 md:grid-cols-[1fr_auto]">
        <div>
          <Image
            src="/media/debt%20relief%20pro%20logo.svg"
            alt={brand}
            width={2400}
            height={600}
            className="h-9 w-auto"
          />
          <p className="mt-3 max-w-3xl leading-6">{t.footer.disclosure}</p>
        </div>
        <div className="md:text-right">
          <a href={getPhoneHref()} className="font-semibold text-slate-950">
            {getPhoneDisplay()}
          </a>
          <p className="mt-2">{getSupportHours()}</p>
        </div>
      </div>
    </footer>
  );
}
