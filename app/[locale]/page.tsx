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
    <div className="min-h-screen bg-white text-slate-950">
      <SiteHeader locale={locale} />
      <main>
        <section className="relative overflow-hidden bg-stone-50">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-[1.05fr_0.95fr] md:py-24">
            <div className="flex flex-col justify-center">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
                {t.home.eyebrow}
              </p>
              <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight tracking-normal text-slate-950 md:text-6xl">
                {t.home.heroTitle}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700">
                {t.home.heroText}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={`/${locale}/apply`}
                  className="rounded-md bg-emerald-700 px-6 py-3 text-center font-semibold text-white shadow-sm hover:bg-emerald-800"
                >
                  {t.home.primaryCta}
                </Link>
                <Link
                  href={`/${locale}/blog`}
                  className="rounded-md border border-slate-300 px-6 py-3 text-center font-semibold text-slate-900 hover:bg-white"
                >
                  {t.home.secondaryCta}
                </Link>
              </div>
              <p className="mt-5 text-sm text-slate-600">{t.home.trustNote}</p>
            </div>

            <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
              <div className="rounded-md bg-slate-950 p-5 text-white">
                <p className="text-sm text-emerald-200">Debt snapshot</p>
                <div className="mt-6 space-y-5">
                  {["Credit cards", "Personal loans", "Medical bills"].map((label, index) => (
                    <div key={label}>
                      <div className="flex justify-between text-sm">
                        <span>{label}</span>
                        <span>{[64, 42, 28][index]}%</span>
                      </div>
                      <div className="mt-2 h-2 rounded-full bg-white/15">
                        <div
                          className="h-2 rounded-full bg-emerald-400"
                          style={{ width: `${[64, 42, 28][index]}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-md bg-amber-50 p-4">
                  <p className="text-xs font-semibold uppercase text-amber-700">Support</p>
                  <a href={getPhoneHref()} className="mt-2 block font-semibold text-slate-950">
                    {getPhoneDisplay()}
                  </a>
                </div>
                <div className="rounded-md bg-cyan-50 p-4">
                  <p className="text-xs font-semibold uppercase text-cyan-700">Hours</p>
                  <p className="mt-2 font-semibold text-slate-950">{getSupportHours()}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="benefits" className="mx-auto max-w-7xl px-5 py-16">
          <h2 className="max-w-3xl text-3xl font-semibold tracking-normal">{t.home.benefitsTitle}</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {t.home.benefits.map((benefit) => (
              <article key={benefit.title} className="rounded-lg border border-stone-200 p-6">
                <h3 className="text-xl font-semibold">{benefit.title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{benefit.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="process" className="bg-slate-950 py-16 text-white">
          <div className="mx-auto max-w-7xl px-5">
            <h2 className="text-3xl font-semibold tracking-normal">{t.home.processTitle}</h2>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {t.home.steps.map((step, index) => (
                <div key={step} className="rounded-lg border border-white/15 p-6">
                  <p className="text-sm font-semibold text-emerald-300">0{index + 1}</p>
                  <p className="mt-4 leading-7 text-slate-100">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="testimonials" className="mx-auto max-w-7xl px-5 py-16">
          <h2 className="text-3xl font-semibold tracking-normal">{t.home.testimonialsTitle}</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {t.home.testimonials.map((item) => (
              <blockquote key={item.quote} className="rounded-lg bg-stone-50 p-6">
                <p className="text-lg leading-8 text-slate-800">&ldquo;{item.quote}&rdquo;</p>
                <footer className="mt-4 font-semibold text-slate-950">{item.name}</footer>
              </blockquote>
            ))}
          </div>
        </section>

        <section className="bg-emerald-700 px-5 py-14 text-white">
          <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <h2 className="text-3xl font-semibold tracking-normal">{t.home.ctaTitle}</h2>
              <p className="mt-3 max-w-2xl text-emerald-50">{t.home.ctaText}</p>
            </div>
            <Link
              href={`/${locale}/apply`}
              className="rounded-md bg-white px-6 py-3 text-center font-semibold text-emerald-800 hover:bg-emerald-50"
            >
              {t.home.primaryCta}
            </Link>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-16">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-3xl font-semibold tracking-normal">{t.home.blogTitle}</h2>
            <Link href={`/${locale}/blog`} className="font-semibold text-emerald-700">
              {t.nav.blog}
            </Link>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {posts.length ? (
              posts.map((post) => (
                <Link key={post._id} href={`/${locale}/blog/${post.slug}`} className="group rounded-lg border border-stone-200 p-4">
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
