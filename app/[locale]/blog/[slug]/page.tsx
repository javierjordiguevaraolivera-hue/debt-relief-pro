import { PortableText } from "@portabletext/react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SiteFooter, SiteHeader } from "../../components/SiteChrome";
import { isLocale, type Locale } from "@/lib/i18n/locales";
import { getTranslations } from "@/lib/i18n/translations";
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

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white text-slate-950">
      <SiteHeader locale={locale} />
      <main className="mx-auto max-w-4xl px-5 py-12">
        <Link href={`/${locale}/blog`} className="font-semibold text-emerald-700">
          {t.blog.back}
        </Link>
        <article className="mt-8">
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
            {post.body?.length ? <PortableText value={post.body} /> : null}
          </div>
        </article>
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}
