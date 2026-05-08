import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SiteFooter, SiteHeader } from "./components/SiteChrome";
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
  const stories =
    locale === "es"
      ? [
          {
            name: "Andrea A.",
            image: "/media/happy-family-es1.png",
            quote:
              "Poder confiar en el proceso nos permitio enfocarnos en lo mas importante para nuestra familia.",
            debt: "$51,361",
            payment: "$684",
            length: "53 meses",
            savings: "$15,068",
            result: "Andrea redujo 29% de su deuda",
          },
          {
            name: "Carlos M.",
            image: "/media/happy-man-es2.png",
            quote:
              "Tener un plan claro cambio la forma en que veia mis pagos y mi futuro financiero.",
            debt: "$34,728",
            payment: "$546",
            length: "46 meses",
            savings: "$10,648",
            result: "Carlos redujo 31% de su deuda",
          },
        ]
      : [
          {
            name: "Andrea A.",
            image: "/media/happy-family-es1.png",
            quote:
              "Being able to trust the process allowed us to focus on what mattered most for our family.",
            debt: "$51,361",
            payment: "$684",
            length: "53 months",
            savings: "$15,068",
            result: "Andrea saved 29% on her debt",
          },
          {
            name: "Carlos M.",
            image: "/media/happy-man-es2.png",
            quote:
              "Having a clear plan changed how I looked at my payments and my financial future.",
            debt: "$34,728",
            payment: "$546",
            length: "46 months",
            savings: "$10,648",
            result: "Carlos saved 31% on his debt",
          },
        ];
  const heroStory = stories[0];

  return (
    <div className="flex min-h-dvh flex-col bg-white text-slate-950">
      <SiteHeader locale={locale} />
      <main className="flex-1">
        <section className="bg-[#20234f]">
          <div className="grid min-h-[640px] lg:grid-cols-2">
            <div className="relative min-h-[225px] overflow-hidden sm:min-h-[380px] lg:min-h-[760px]">
              <Image
                src={heroStory.image}
                alt={heroStory.name}
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover object-center"
              />
            </div>
            <div className="flex items-center justify-center px-5 py-12 text-white sm:px-8 lg:px-14">
              <div className="w-full max-w-3xl text-center">
                <p className="text-lg font-semibold">{heroStory.name}</p>
                <blockquote className="mt-6 text-2xl font-bold italic leading-snug md:text-4xl md:leading-tight">
                  &ldquo;{heroStory.quote}&rdquo;
                </blockquote>
                <Link
                  href={`/${locale}/apply`}
                  className="mt-8 inline-flex rounded-full bg-emerald-600 px-8 py-4 text-lg font-bold text-white hover:bg-emerald-700"
                >
                  {t.home.primaryCta}
                </Link>
                <div className="mx-auto mt-8 grid max-w-2xl grid-cols-2 border-white/30 text-sm md:grid-cols-4">
                  <div className="border-b border-r border-white/30 p-4 md:border-b-0">
                    <p>{t.home.storyDebt}</p>
                    <p className="mt-1 text-2xl font-bold text-emerald-400">{heroStory.debt}</p>
                  </div>
                  <div className="border-b border-white/30 p-4 md:border-b-0 md:border-r">
                    <p>{t.home.storyPayment}</p>
                    <p className="mt-1 text-2xl font-bold text-emerald-400">{heroStory.payment}</p>
                  </div>
                  <div className="border-r border-white/30 p-4">
                    <p>{t.home.storyLength}</p>
                    <p className="mt-1 text-2xl font-bold text-emerald-400">{heroStory.length}</p>
                  </div>
                  <div className="p-4">
                    <p>{t.home.storySavings}</p>
                    <p className="mt-1 text-2xl font-bold text-emerald-400">{heroStory.savings}</p>
                  </div>
                </div>
                <p className="mt-5 text-2xl font-bold text-emerald-400">{heroStory.result}</p>
                <div className="mt-12 flex justify-center gap-3">
                  {stories.map((story, index) => (
                    <span
                      key={story.name}
                      className={`h-3 w-3 rounded-full ${index === 0 ? "bg-white" : "bg-white/35"}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white px-5 py-10 md:py-14">
          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-[1fr_360px] md:items-start">
            <div>
              <h1 className="text-center text-3xl font-bold leading-tight text-[#20234f] md:text-left md:text-5xl">
                {t.home.consultTitle}
              </h1>
              <ul className="mt-7 grid gap-4 text-lg text-[#20234f]">
                {t.home.consultBullets.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="font-bold text-emerald-600">+</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <form action={`/${locale}/apply`} className="rounded-lg border border-slate-200 bg-[#f4f8fb] p-5 shadow-sm">
              <label className="grid gap-2">
                <span className="text-sm font-bold text-[#20234f]">{t.home.debtSelectLabel}</span>
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
                className="mt-4 w-full rounded-full bg-emerald-600 px-5 py-4 text-sm font-bold uppercase text-white hover:bg-emerald-700"
              >
                {t.home.estimateButton}
              </button>
              <p className="mt-4 text-sm leading-6 text-slate-600">{t.home.trustNote}</p>
            </form>
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
