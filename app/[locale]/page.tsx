import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SiteFooter, SiteHeader } from "./components/SiteChrome";
import { getPhoneDisplay, getPhoneHref, getSupportHours } from "@/lib/ringba";
import { getPosts } from "@/lib/sanity/posts";
import { getTranslations } from "@/lib/i18n/translations";
import { isLocale, type Locale } from "@/lib/i18n/locales";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getTranslations(locale);
  const brand = process.env.NEXT_PUBLIC_BRAND_NAME || "Debt Relief Pro";

  return {
    title: `${brand} | ${t.home.heroTitle}`,
    description: t.home.heroText,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: "/en",
        es: "/es",
      },
    },
    openGraph: {
      title: `${brand} | ${t.home.heroTitle}`,
      description: t.home.heroText,
      type: "website",
      locale: locale === "es" ? "es_US" : "en_US",
    },
  };
}

export default async function HomePage({ params }: PageProps) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();

  const locale: Locale = rawLocale;
  const t = getTranslations(locale);
  const posts = await getPosts(locale, 3);

  return (
    <div className="flex min-h-dvh flex-col bg-white text-slate-950">
      <SiteHeader locale={locale} />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-[#f4f8fb]">
          <div className="absolute inset-x-0 top-0 h-32 bg-[#113b5f]" aria-hidden="true" />
          <div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-8 md:grid-cols-[1fr_420px] md:px-5 md:py-14 lg:py-20">
            <div className="flex flex-col justify-center rounded-lg bg-white p-6 shadow-sm md:bg-transparent md:p-0 md:shadow-none">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700 md:text-sm">
                {t.home.eyebrow}
              </p>
              <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-tight tracking-normal text-[#123b5d] md:text-6xl">
                {t.home.heroTitle}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-700 md:text-xl md:leading-8">
                {t.home.heroText}
              </p>
              <div className="mt-6 grid gap-3 text-sm font-semibold text-slate-800 sm:grid-cols-3">
                {t.home.reviewStats.map((stat) => (
                  <div key={stat.label} className="rounded-md border border-slate-200 bg-white p-4">
                    <p className="text-2xl font-bold text-emerald-700">{stat.value}</p>
                    <p className="mt-1 leading-5">{stat.label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={`/${locale}/apply`}
                  className="rounded-md bg-emerald-600 px-6 py-4 text-center font-bold uppercase text-white shadow-sm hover:bg-emerald-700"
                >
                  {t.home.primaryCta}
                </Link>
                <a
                  href={getPhoneHref()}
                  className="rounded-md border border-[#123b5d] px-6 py-4 text-center font-bold uppercase text-[#123b5d] hover:bg-white"
                >
                  {t.home.secondaryCta}
                </a>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-600">{t.home.trustNote}</p>
            </div>

            <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-xl md:p-6">
              <div className="rounded-md bg-[#113b5f] p-5 text-white">
                <p className="text-sm font-bold uppercase text-emerald-200">{t.home.estimateTitle}</p>
                <p className="mt-2 text-sm leading-6 text-slate-100">{t.home.estimateSubtitle}</p>
              </div>
              <form action={`/${locale}/apply`} className="mt-5 grid gap-4">
                <label className="grid gap-2">
                  <span className="text-sm font-bold text-slate-900">{t.home.debtSelectLabel}</span>
                  <select className="h-12 rounded-md border border-slate-300 bg-white px-3 text-base font-semibold text-slate-950 outline-none focus:border-emerald-600">
                    <option>$10,000 - $14,999</option>
                    <option>$15,000 - $24,999</option>
                    <option>$25,000 - $49,999</option>
                    <option>$50,000 - $74,999</option>
                    <option>$75,000+</option>
                  </select>
                </label>
                <button
                  type="submit"
                  className="rounded-md bg-emerald-600 px-5 py-4 text-sm font-bold uppercase text-white shadow-sm hover:bg-emerald-700"
                >
                  {t.home.estimateButton}
                </button>
              </form>
              <div className="mt-5 rounded-md bg-amber-50 p-4">
                <p className="text-xs font-bold uppercase text-amber-700">{getSupportHours()}</p>
                <a href={getPhoneHref()} className="mt-2 block text-xl font-bold text-[#123b5d]">
                    {getPhoneDisplay()}
                </a>
              </div>
            </aside>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white px-4 py-8">
          <div className="mx-auto max-w-7xl">
            <p className="text-center text-sm font-bold uppercase tracking-[0.16em] text-slate-500">
              {t.home.reviewTitle}
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {t.home.reviewStats.map((stat) => (
                <div key={stat.label} className="rounded-md bg-slate-50 p-4 text-center">
                  <p className="text-3xl font-bold text-[#123b5d]">{stat.value}</p>
                  <p className="mt-1 text-sm font-semibold text-slate-600">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="benefits" className="mx-auto max-w-7xl px-4 py-14 md:px-5 md:py-20">
          <h2 className="max-w-3xl text-3xl font-bold tracking-normal text-[#123b5d] md:text-4xl">
            {t.home.benefitsTitle}
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {t.home.benefits.map((benefit) => (
              <article key={benefit.title} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 text-lg font-bold text-emerald-700">
                  +
                </div>
                <h3 className="mt-5 text-xl font-bold text-slate-950">{benefit.title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{benefit.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="process" className="bg-[#113b5f] py-14 text-white md:py-20">
          <div className="mx-auto max-w-7xl px-4 md:px-5">
            <h2 className="text-3xl font-bold tracking-normal md:text-4xl">{t.home.processTitle}</h2>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {t.home.steps.map((step, index) => (
                <div key={step} className="rounded-lg border border-white/15 bg-white/5 p-6">
                  <p className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-400 text-sm font-bold text-[#113b5f]">
                    {index + 1}
                  </p>
                  <p className="mt-5 leading-7 text-slate-100">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#f4f8fb] py-14 md:py-20">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 md:grid-cols-[0.95fr_1.05fr] md:px-5">
            <div>
              <h2 className="text-3xl font-bold tracking-normal text-[#123b5d] md:text-4xl">
                {t.home.fitTitle}
              </h2>
              <Link
                href={`/${locale}/apply`}
                className="mt-7 inline-flex rounded-md bg-emerald-600 px-6 py-4 text-sm font-bold uppercase text-white hover:bg-emerald-700"
              >
                {t.home.primaryCta}
              </Link>
            </div>
            <ul className="grid gap-3">
              {t.home.fitItems.map((item) => (
                <li key={item} className="flex gap-3 rounded-md bg-white p-4 font-semibold text-slate-800 shadow-sm">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                    +
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="testimonials" className="mx-auto max-w-7xl px-4 py-14 md:px-5 md:py-20">
          <h2 className="text-3xl font-bold tracking-normal text-[#123b5d] md:text-4xl">
            {t.home.testimonialsTitle}
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {t.home.testimonials.map((item) => (
              <blockquote key={item.quote} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-600">5 star review</p>
                <p className="mt-4 text-lg leading-8 text-slate-800">&ldquo;{item.quote}&rdquo;</p>
                <footer className="mt-4 font-bold text-slate-950">{item.name}</footer>
              </blockquote>
            ))}
          </div>
        </section>

        <section className="bg-emerald-600 px-4 py-12 text-white md:px-5">
          <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-normal md:text-4xl">{t.home.ctaTitle}</h2>
              <p className="mt-3 max-w-2xl text-emerald-50">{t.home.ctaText}</p>
            </div>
            <Link
              href={`/${locale}/apply`}
              className="rounded-md bg-white px-6 py-4 text-center font-bold uppercase text-[#123b5d] hover:bg-emerald-50"
            >
              {t.home.primaryCta}
            </Link>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-14 md:px-5 md:py-20">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-3xl font-bold tracking-normal text-[#123b5d]">{t.home.blogTitle}</h2>
            <Link href={`/${locale}/blog`} className="font-bold text-emerald-700">
              {t.nav.blog}
            </Link>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {posts.length ? (
              posts.map((post) => (
                <Link key={post._id} href={`/${locale}/blog/${post.slug}`} className="group rounded-lg border border-slate-200 p-4 shadow-sm">
                  {post.imageUrl ? (
                    <Image
                      src={post.imageUrl}
                      alt={post.imageAlt || ""}
                      width={640}
                      height={360}
                      className="aspect-video w-full rounded-md object-cover"
                    />
                  ) : null}
                  <h3 className="mt-4 text-xl font-semibold group-hover:text-emerald-700">{post.title}</h3>
                  {post.excerpt ? <p className="mt-3 leading-7 text-slate-600">{post.excerpt}</p> : null}
                </Link>
              ))
            ) : (
              <p className="text-slate-600">{t.home.blogEmpty}</p>
            )}
          </div>
        </section>
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}
