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
import { getPostBySlug } from "@/lib/sanity/posts";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) notFound();

  const post = await getPostBySlug(rawLocale, slug);
  if (!post) notFound();

  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    alternates: {
      canonical: `/${rawLocale}/blog/${post.slug}`,
      languages: {
        en: `/en/blog/${post.slug}`,
        es: `/es/blog/${post.slug}`,
      },
    },
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      images: post.imageUrl ? [{ url: post.imageUrl }] : undefined,
      locale: rawLocale === "es" ? "es_US" : "en_US",
    },
  };
}

export default async function PostPage({ params }: PageProps) {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) notFound();

  const locale: Locale = rawLocale;
  const t = getTranslations(locale);
  const post = await getPostBySlug(locale, slug);
  const adBanners = await getAdBanners("blog");

  if (!post) {
    notFound();
  }

  const seed = `${post.slug}-${adBanners.length}`;
  const topBanner = selectAdBanner(adBanners, "top", seed);
  const inlineBanner = selectAdBanner(adBanners, "inline", seed);
  const sidebarBanner = selectAdBanner(adBanners, "sidebar", seed);
  const firstBodyBlock = post.body?.[0] ? [post.body[0]] : [];
  const remainingBodyBlocks = post.body?.slice(1) || [];

  return (
    <div className="flex min-h-dvh flex-col bg-white text-slate-950">
      <SiteHeader locale={locale} />
      <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-12">
        <Link href={`/${locale}/blog`} className="font-semibold text-emerald-700">
          {t.blog.back}
        </Link>
        <AdBannerSlot banner={topBanner} locale={locale} placement="top" />
        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
          <article className="max-w-4xl">
            <h1 className="text-4xl font-semibold leading-tight tracking-normal md:text-5xl">
              {post.title}
            </h1>
            {post.excerpt ? <p className="mt-5 text-xl leading-8 text-slate-700">{post.excerpt}</p> : null}
            {post.imageUrl ? (
              <Image
                src={post.imageUrl}
                alt={post.imageAlt || ""}
                width={1120}
                height={630}
                priority
                className="mt-8 aspect-video w-full rounded-lg object-cover"
              />
            ) : null}
            <div className="article-content mt-10">
              {firstBodyBlock.length ? <PortableText value={firstBodyBlock} /> : null}
              <AdBannerSlot banner={inlineBanner} locale={locale} placement="inline" />
              {remainingBodyBlocks.length ? <PortableText value={remainingBodyBlocks} /> : null}
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
