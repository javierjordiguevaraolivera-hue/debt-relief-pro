import { PortableText } from "@portabletext/react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SiteFooter, SiteHeader } from "../../components/SiteChrome";
import { isLocale, type Locale } from "@/lib/i18n/locales";
import { getTranslations } from "@/lib/i18n/translations";
import { getCustomerStoryBySlug } from "@/lib/sanity/customerStories";

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

  if (!story) {
    notFound();
  }

  const date = story.publishedAt
    ? new Intl.DateTimeFormat(locale === "es" ? "es-US" : "en-US", {
        dateStyle: "long",
      }).format(new Date(story.publishedAt))
    : null;

  return (
    <div className="flex min-h-dvh flex-col bg-white text-slate-950">
      <SiteHeader locale={locale} />
      <main className="mx-auto w-full max-w-4xl flex-1 px-5 py-12">
        <Link href={`/${locale}/client-stories`} className="font-bold text-emerald-700">
          {t.clientStories.back}
        </Link>
        <article className="mt-8">
          <div className="flex flex-wrap items-center gap-3 text-sm font-bold uppercase tracking-[0.14em] text-slate-500">
            {date ? <span>{date}</span> : null}
            {story.state ? <span>{story.state}</span> : null}
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
              width={1120}
              height={760}
              priority
              className="mt-8 aspect-[4/3] w-full rounded-lg object-cover"
            />
          ) : null}
          <div className="article-content mt-10">
            {story.body?.length ? <PortableText value={story.body} /> : null}
          </div>
        </article>
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}
