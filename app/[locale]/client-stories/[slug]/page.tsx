import { PortableText } from "@portabletext/react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AdBannerSlot } from "../../components/AdBannerSlot";
import { SiteFooter, SiteHeader } from "../../components/SiteChrome";
import { isLocale, type Locale } from "@/lib/i18n/locales";
import { getTranslations } from "@/lib/i18n/translations";
import { getAdBanners, selectAdBanner } from "@/lib/sanity/adBanners";
import { getCustomerStoryBySlug } from "@/lib/sanity/customerStories";
import { formatUsState } from "@/lib/usStates";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) notFound();

  const story = await getCustomerStoryBySlug(rawLocale, slug);
  if (!story) notFound();

  return {
    title: story.seoTitle || story.name,
    description: story.seoDescription || story.quote,
    alternates: {
      canonical: `/${rawLocale}/client-stories/${story.slug}`,
      languages: {
        en: `/en/client-stories/${story.slug}`,
        es: `/es/client-stories/${story.slug}`,
      },
    },
    openGraph: {
      title: story.seoTitle || story.name,
      description: story.seoDescription || story.quote,
      type: "article",
      publishedTime: story.publishedAt,
      images: story.imageUrl ? [{ url: story.imageUrl }] : undefined,
      locale: rawLocale === "es" ? "es_US" : "en_US",
    },
  };
}

export default async function ClientStoryPage({ params }: PageProps) {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) notFound();

  const locale: Locale = rawLocale;
  const t = getTranslations(locale);
  const story = await getCustomerStoryBySlug(locale, slug);
  const adBanners = await getAdBanners("clientStory");

  if (!story) {
    notFound();
  }

  const date = story.publishedAt
    ? new Intl.DateTimeFormat(locale === "es" ? "es-US" : "en-US", {
        dateStyle: "long",
      }).format(new Date(story.publishedAt))
    : null;
  const [, middleCta, finalCta] = t.clientStories.storyCtas;
  const firstBodyBlock = story.body?.[0] ? [story.body[0]] : [];
  const remainingBodyBlocks = story.body?.slice(1) || [];
  const seed = `${story.slug}-${adBanners.length}`;
  const topBanner = selectAdBanner(adBanners, "top", seed);
  const inlineBanner = selectAdBanner(adBanners, "inline", seed);
  const sidebarBanner = selectAdBanner(adBanners, "sidebar", seed);

  return (
    <div className="flex min-h-dvh flex-col bg-white text-slate-950">
      <SiteHeader locale={locale} />
      <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-12">
        <Link href={`/${locale}/client-stories`} className="font-bold text-emerald-700">
          {t.clientStories.back}
        </Link>
        <AdBannerSlot banner={topBanner} locale={locale} placement="top" />
        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
          <article className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-3 text-sm font-bold uppercase tracking-[0.14em] text-slate-500">
              {date ? <span>{date}</span> : null}
              {formatUsState(story.state) ? <span>{formatUsState(story.state)}</span> : null}
              <span className="text-amber-600">{"★".repeat(story.rating || 5)}</span>
            </div>
            <h1 className="mt-4 text-4xl font-bold leading-tight tracking-normal text-[#02163a] md:text-5xl">
              {story.name}
            </h1>
            {story.quote ? <p className="mt-5 text-2xl italic leading-9 text-slate-700">&ldquo;{story.quote}&rdquo;</p> : null}
            {story.imageUrl ? (
              <Image
                src={story.imageUrl}
                alt={story.imageAlt || story.name}
                width={480}
                height={480}
                priority
                className="mt-8 aspect-square w-full max-w-xs rounded-lg object-cover"
              />
            ) : null}
            <div className="article-content mt-10">
              {firstBodyBlock.length ? <PortableText value={firstBodyBlock} /> : null}
              <AdBannerSlot banner={inlineBanner} locale={locale} placement="inline" />
              <div className="my-9 rounded-lg bg-[#f4f8fb] p-6 text-center">
                <p className="text-xl font-bold leading-8 text-[#02163a]">{story.quote}</p>
                <Link
                  href={`/${locale}/apply`}
                  className="article-cta mt-5 inline-flex rounded-full bg-emerald-600 px-7 py-4 text-sm font-bold uppercase text-white shadow-sm hover:bg-emerald-700"
                >
                  {middleCta}
                </Link>
              </div>
              {remainingBodyBlocks.length ? <PortableText value={remainingBodyBlocks} /> : null}
              <div className="mt-10 border-t border-slate-200 pt-8 text-center">
                <Link
                  href={`/${locale}/apply`}
                  className="article-cta inline-flex rounded-full bg-emerald-600 px-8 py-4 text-sm font-bold uppercase text-white shadow-sm hover:bg-emerald-700"
                >
                  {finalCta}
                </Link>
              </div>
            </div>
          </article>
          <aside>
            <AdBannerSlot banner={sidebarBanner} locale={locale} placement="sidebar" />
          </aside>
        </div>
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}
