import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CustomerStoriesCarousel } from "./components/CustomerStoriesCarousel";
import { SiteFooter, SiteHeader } from "./components/SiteChrome";
import { getCustomerStories, type CustomerStoryCard } from "@/lib/sanity/customerStories";
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
  const sanityStories = await getCustomerStories(locale, 3);
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
  const fallbackCustomerStories: CustomerStoryCard[] = stories.map((story, index) => ({
    _id: `fallback-${index}`,
    name: story.name,
    slug: index === 0 ? "andrea-a" : "carlos-m",
    quote: story.quote,
    rating: 5,
    state: index === 0 ? "FL" : "TX",
    imageUrl: story.image,
    imageAlt: story.name,
  }));
  const homeCustomerStories = sanityStories.length ? sanityStories : fallbackCustomerStories;
  const reviewPlatforms = [
    {
      name: "Google",
      logo: "/media/google%20logo.svg",
      logoWidth: 92,
      logoHeight: 31,
      score: "4.5",
      count: "9,700+ Reviews",
    },
    {
      name: "ConsumerAffairs",
      logo: "/media/consumeraffairs%20logo.svg",
      logoWidth: 177,
      logoHeight: 19,
      score: "4.7",
      count: "21,400+ Reviews",
    },
    {
      name: "Trustpilot",
      logo: "/media/trustpilot%20logo.svg",
      logoWidth: 138,
      logoHeight: 35,
      score: "4.6",
      count: "18,900+ Reviews",
    },
  ];
  const stepIcons = [
    <svg key="apply" viewBox="0 0 96 96" aria-hidden="true" className="h-16 w-16">
      <path
        d="M79 18 16 45.4c-4.1 1.8-3.9 7.7.4 9.1l15.8 5.1 6.2 18.5c1.3 3.9 6.5 4.8 9.1 1.5l9.1-11.7 16.1 11.5c3.6 2.6 8.7.4 9.3-4l7.8-49.5c.8-5.2-6-10-10.8-7.9Z"
        fill="#e8f3ff"
        stroke="#0077e3"
        strokeLinejoin="round"
        strokeWidth="4"
      />
      <path
        d="m33 59 38-27-32.6 36.2"
        fill="none"
        stroke="#02163a"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="4"
      />
    </svg>,
    <svg key="plan" viewBox="0 0 96 96" aria-hidden="true" className="h-16 w-16">
      <rect x="16" y="24" width="64" height="44" rx="10" fill="#fff" stroke="#02163a" strokeWidth="4" />
      <path d="M16 38h64" stroke="#02163a" strokeWidth="4" />
      <path d="M28 53h20M28 61h12" stroke="#02163a" strokeLinecap="round" strokeWidth="4" />
      <circle cx="67" cy="59" r="14" fill="#e8f3ff" stroke="#0077e3" strokeWidth="4" />
      <path d="m60 59 5 5 10-13" fill="none" stroke="#0077e3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
      <path d="M28 18h40" stroke="#0077e3" strokeLinecap="round" strokeWidth="4" />
    </svg>,
    <svg key="free" viewBox="0 0 96 96" aria-hidden="true" className="h-16 w-16">
      <path
        d="M48 78S18 59.8 18 36.8C18 25.7 25.6 18 35.7 18c5.9 0 9.9 2.9 12.3 6.4C50.4 20.9 54.4 18 60.3 18 70.4 18 78 25.7 78 36.8 78 59.8 48 78 48 78Z"
        fill="#e8f3ff"
        stroke="#02163a"
        strokeLinejoin="round"
        strokeWidth="4"
      />
      <circle cx="66" cy="62" r="14" fill="#fff" stroke="#0077e3" strokeWidth="4" />
      <path d="m59 62 5 5 10-13" fill="none" stroke="#0077e3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
      <path d="M36 39c5 5 19 5 24 0" fill="none" stroke="#0077e3" strokeLinecap="round" strokeWidth="4" />
    </svg>,
  ];

  return (
    <div className="flex min-h-dvh flex-col bg-white text-slate-950">
      <SiteHeader locale={locale} />
      <main className="flex-1">
        <section className="overflow-hidden bg-[#02163a]">
          <div className="scrollbar-hidden flex snap-x snap-mandatory overflow-x-auto">
              {stories.map((story, storyIndex) => (
                <div key={story.name} className="grid w-full shrink-0 snap-center lg:grid-cols-2">
                <div className="relative min-h-[205px] overflow-hidden sm:min-h-[380px] lg:min-h-[760px]">
                  <Image
                    src={story.image}
                    alt={story.name}
                    fill
                    priority={storyIndex === 0}
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover object-center"
                  />
                </div>
                <div
                  className="flex w-full shrink-0 snap-center items-start justify-center px-5 py-7 text-white sm:px-8 sm:py-12 lg:items-center lg:px-14 lg:py-16"
                >
                  <div className="w-full max-w-3xl text-center">
                    <p className="text-lg font-semibold">{story.name}</p>
                    <blockquote className="mt-5 text-xl font-normal italic leading-snug sm:text-2xl md:text-4xl md:leading-tight">
                      &ldquo;{story.quote}&rdquo;
                    </blockquote>
                    <Link
                      href={`/${locale}/apply`}
                      className="mt-7 inline-flex rounded-full bg-emerald-600 px-8 py-4 text-lg font-bold text-white hover:bg-emerald-700"
                    >
                      {t.home.primaryCta}
                    </Link>
                    <div className="mx-auto mt-8 grid max-w-2xl grid-cols-2 border-white/30 text-sm md:grid-cols-4">
                      <div className="border-b border-r border-white/30 p-4 md:border-b-0">
                        <p>{t.home.storyDebt}</p>
                        <p className="mt-1 text-2xl font-bold text-emerald-400">{story.debt}</p>
                      </div>
                      <div className="border-b border-white/30 p-4 md:border-b-0 md:border-r">
                        <p>{t.home.storyPayment}</p>
                        <p className="mt-1 text-2xl font-bold text-emerald-400">{story.payment}</p>
                      </div>
                      <div className="border-r border-white/30 p-4">
                        <p>{t.home.storyLength}</p>
                        <p className="mt-1 text-2xl font-bold text-emerald-400">{story.length}</p>
                      </div>
                      <div className="p-4">
                        <p>{t.home.storySavings}</p>
                        <p className="mt-1 text-2xl font-bold text-emerald-400">{story.savings}</p>
                      </div>
                    </div>
                    <p className="mt-5 text-xl font-bold text-emerald-400 sm:text-2xl">{story.result}</p>
                    <div className="mt-8 flex justify-center gap-3 lg:hidden">
                      {stories.map((dotStory, index) => (
                        <span
                          key={dotStory.name}
                          className={`h-3 w-3 rounded-full ${index === storyIndex ? "bg-white" : "bg-white/35"}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                </div>
              ))}
          </div>
        </section>

        <section id="benefits" className="bg-white px-5 py-12 md:py-20">
          <div className="mx-auto max-w-5xl">
            <h2 className="max-w-4xl text-3xl font-bold uppercase leading-tight tracking-normal text-[#02163a] md:text-5xl">
              {t.home.servicesTitle}
            </h2>
            <div className="mt-7 grid gap-5 text-lg leading-8 text-slate-700">
              {t.home.servicesParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <p className="mt-6 text-sm italic leading-6 text-slate-500">{t.home.servicesNote}</p>
          </div>
        </section>

        <section className="bg-[#f2f5fb] px-5 py-12 md:py-20">
          <div className="mx-auto max-w-5xl text-center">
            <h2 className="text-3xl font-bold tracking-normal text-[#02163a] md:text-5xl">
              {t.home.platformReviewsTitle}
            </h2>
            <div className="reviews-carousel-viewport mt-9 sm:overflow-visible">
              <div className="reviews-carousel-track">
                {[...reviewPlatforms, ...reviewPlatforms].map((platform, index) => (
                  <article
                    key={`${platform.name}-${index}`}
                    className={`reviews-carousel-card rounded-3xl bg-white px-6 py-8 text-[#02163a] shadow-sm ${
                      index >= reviewPlatforms.length ? "sm:hidden" : ""
                    }`}
                  >
                    <div className="flex min-h-9 items-center justify-center">
                      <Image
                        src={platform.logo}
                        alt={platform.name}
                        width={platform.logoWidth}
                        height={platform.logoHeight}
                        className="h-auto max-h-9 w-auto"
                      />
                    </div>
                    <div className="mt-5 flex justify-center gap-1.5" aria-label={`${platform.score} star rating`}>
                      <Image
                        src="/media/review-stars.svg"
                        alt=""
                        width={594}
                        height={146}
                        className="h-auto w-28"
                      />
                    </div>
                    <p className="mt-5 text-lg text-[#02163a]">
                      <span className="font-bold">{platform.score}</span>
                      <span> - {platform.count}</span>
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="process" className="bg-white px-5 py-14 md:py-20">
          <div className="mx-auto max-w-7xl text-center">
            <h2 className="text-3xl font-bold tracking-normal text-[#02163a] md:text-5xl">
              {t.home.howTitle}
            </h2>
            <p className="mx-auto mt-5 max-w-3xl text-xl font-bold leading-8 text-[#02163a]">
              {t.home.howSubtitle}
            </p>
            <div className="mt-10 grid gap-12 md:grid-cols-3 md:gap-9">
              {t.home.howSteps.map((step, index) => (
                <article key={step.title} className="mx-auto max-w-sm">
                  <div className="flex justify-center">{stepIcons[index]}</div>
                  <h3 className="mt-5 text-2xl font-bold leading-tight text-[#02163a]">{step.title}</h3>
                  <p className="mt-4 text-lg leading-8 text-[#02163a]">{step.text}</p>
                </article>
              ))}
            </div>
            <Link
              href={`/${locale}/apply`}
              className="mt-10 inline-flex rounded-full bg-emerald-600 px-8 py-4 text-base font-bold uppercase text-white shadow-sm hover:bg-emerald-700"
            >
              {t.home.howCta}
            </Link>
          </div>
        </section>

        <section className="bg-white px-5 py-10 md:py-14">
          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-[1fr_360px] md:items-start">
            <div>
              <h1 className="text-center text-3xl font-bold leading-tight text-[#02163a] md:text-left md:text-5xl">
                {t.home.consultTitle}
              </h1>
              <ul className="mt-7 grid gap-4 text-lg text-[#02163a]">
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
                <span className="text-sm font-bold text-[#02163a]">{t.home.debtSelectLabel}</span>
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

        <section className="bg-[#f4f8fb] py-14 md:py-20">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 md:grid-cols-[0.95fr_1.05fr] md:px-5">
            <div>
              <h2 className="text-3xl font-bold tracking-normal text-[#02163a] md:text-4xl">
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
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-normal text-[#02163a] md:text-4xl">
              {t.clientStories.homeTitle}
            </h2>
            <Link href={`/${locale}/client-stories`} className="mt-3 inline-flex font-bold text-emerald-700">
              {t.clientStories.title}
            </Link>
          </div>
          <CustomerStoriesCarousel
            locale={locale}
            readMoreLabel={t.clientStories.readMore}
            stories={homeCustomerStories}
          />
          {/*
                <p className="mt-3 text-sm font-bold text-amber-600">
                  {"★".repeat(story.rating || 5)}
                </p>
                {story.quote ? (
                  <p className="mt-3 line-clamp-4 text-sm leading-6 text-slate-700">&ldquo;{story.quote}&rdquo;</p>
                ) : null}
                <p className="mt-5 text-sm font-bold text-emerald-700">{t.clientStories.readMore}</p>
              </Link>
            ))}
          </div>
          <div className="mt-5 flex justify-center gap-2 md:hidden" aria-hidden="true">
            {homeCustomerStories.map((story, storyIndex) => (
              <a
                key={story._id}
                href={`#home-story-${storyIndex + 1}`}
                className={`h-2.5 w-2.5 rounded-full ${storyIndex === 0 ? "bg-[#02163a]" : "bg-slate-300"}`}
              />
            ))}
          </div>
          */}
        </section>

        <section className="bg-emerald-600 px-4 py-12 text-white md:px-5">
          <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-normal md:text-4xl">{t.home.ctaTitle}</h2>
              <p className="mt-3 max-w-2xl text-emerald-50">{t.home.ctaText}</p>
            </div>
            <Link
              href={`/${locale}/apply`}
              className="rounded-md bg-white px-6 py-4 text-center font-bold uppercase text-[#02163a] hover:bg-emerald-50"
            >
              {t.home.primaryCta}
            </Link>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-14 md:px-5 md:py-20">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-3xl font-bold tracking-normal text-[#02163a]">{t.home.blogTitle}</h2>
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
