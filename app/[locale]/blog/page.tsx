import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import { isLocale, type Locale } from "@/lib/i18n/locales";
import { getTranslations } from "@/lib/i18n/translations";
import { getPosts } from "@/lib/sanity/posts";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getTranslations(locale);

  return {
    title: t.blog.title,
    description: t.blog.description,
    alternates: {
      canonical: `/${locale}/blog`,
      languages: {
        en: "/en/blog",
        es: "/es/blog",
      },
    },
    openGraph: {
      title: t.blog.title,
      description: t.blog.description,
      type: "website",
      locale: locale === "es" ? "es_US" : "en_US",
    },
  };
}

export default async function BlogPage({ params }: PageProps) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();

  const locale: Locale = rawLocale;
  const t = getTranslations(locale);
  const posts = await getPosts(locale);

  return (
    <div className="flex min-h-dvh flex-col bg-white text-slate-950">
      <SiteHeader locale={locale} />
      <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-14">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-semibold tracking-normal md:text-5xl">{t.blog.title}</h1>
          <p className="mt-4 text-lg leading-8 text-slate-700">{t.blog.description}</p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {posts.length ? (
            posts.map((post) => (
              <article key={post._id} className="rounded-lg border border-stone-200 p-4">
                {post.imageUrl ? (
                  <Image
                    src={post.imageUrl}
                    alt={post.imageAlt || ""}
                    width={760}
                    height={428}
                    className="aspect-video w-full rounded-md object-cover"
                  />
                ) : null}
                <h2 className="mt-4 text-xl font-semibold">{post.title}</h2>
                {post.excerpt ? <p className="mt-3 leading-7 text-slate-600">{post.excerpt}</p> : null}
                <Link
                  href={`/${locale}/blog/${post.slug}`}
                  className="mt-5 inline-flex font-semibold text-emerald-700 hover:text-emerald-800"
                >
                  {t.blog.readMore}
                </Link>
              </article>
            ))
          ) : (
            <p className="text-slate-600">{t.blog.empty}</p>
          )}
        </div>
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}
