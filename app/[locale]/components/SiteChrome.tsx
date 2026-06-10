import Link from "next/link";
import Image from "next/image";

import type { Locale } from "@/lib/i18n/locales";
import { alternateLocale } from "@/lib/i18n/locales";
import { getTranslations } from "@/lib/i18n/translations";

export function SiteHeader({
  hideActions = false,
  locale,
}: {
  hideActions?: boolean;
  locale: Locale;
}) {
  const t = getTranslations(locale);
  const brand = process.env.NEXT_PUBLIC_BRAND_NAME || "Debt Relief Pro";
  const otherLocale = alternateLocale(locale);
  const languageFlag =
    otherLocale === "en" ? "/media/flag-for-united-states.png" : "/media/flag-for-mexico.png";
  const languageLabel = otherLocale === "en" ? "English" : "Español";

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 md:px-5">
        <Link href={`/${locale}`} className="shrink-0 font-semibold tracking-tight text-slate-950">
          <Image
            src="/media/debt%20relief%20pro%20logo%20-%20v2.png"
            alt={brand}
            width={2400}
            height={600}
            priority
            className="h-9 w-auto md:h-10"
          />
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-semibold uppercase text-slate-700 lg:flex">
          <a href={`/${locale}#benefits`}>{t.nav.benefits}</a>
          <a href={`/${locale}#process`}>{t.nav.process}</a>
          <Link href={`/${locale}/client-stories`}>{t.nav.testimonials}</Link>
          <Link href={`/${locale}/blog`}>{t.nav.blog}</Link>
        </nav>
        {hideActions ? null : (
          <div className="flex min-w-0 items-center gap-2">
            <Link
              href={`/${otherLocale}`}
              aria-label={`Switch to ${languageLabel}`}
              className="rounded-md p-2 hover:bg-slate-100"
            >
              <Image
                src={languageFlag}
                alt=""
                width={24}
                height={24}
                className="h-6 w-6 object-contain"
              />
            </Link>
            <Link
              href={`/${locale}/apply`}
              className="rounded-md bg-emerald-600 px-3 py-2 text-center text-xs font-bold uppercase text-white shadow-sm hover:bg-emerald-700 sm:px-4 sm:text-sm"
            >
              {t.nav.apply}
            </Link>
          </div>
        )}
      </div>
      <nav className="scrollbar-hidden mx-auto flex max-w-7xl gap-4 overflow-x-auto whitespace-nowrap border-t border-slate-100 px-4 py-2 text-xs font-bold uppercase text-slate-700 lg:hidden">
        <a className="shrink-0" href={`/${locale}#benefits`}>
          {t.nav.benefits}
        </a>
        <a className="shrink-0" href={`/${locale}#process`}>
          {t.nav.process}
        </a>
        <Link className="shrink-0" href={`/${locale}/client-stories`}>
          {t.nav.testimonials}
        </Link>
        <Link className="shrink-0" href={`/${locale}/blog`}>
          {t.nav.blog}
        </Link>
      </nav>
    </header>
  );
}

export function SiteFooter({ locale }: { locale: Locale }) {
  const t = getTranslations(locale);
  const brand = process.env.NEXT_PUBLIC_BRAND_NAME || "Debt Relief Pro";

  return (
    <footer className="shrink-0 border-t border-stone-200 bg-stone-50">
      <div className="mx-auto grid max-w-7xl gap-6 px-5 py-10 text-sm text-slate-600 md:grid-cols-[1fr_auto]">
        <div>
          <Image
            src="/media/debt%20relief%20pro%20logo%20-%20v2.png"
            alt={brand}
            width={2400}
            height={600}
            className="h-9 w-auto"
          />
          <p className="mt-3 max-w-3xl text-xs leading-5 text-slate-500">
            {t.footer.disclosure}
          </p>
        </div>
      </div>
    </footer>
  );
}
