import type { MetadataRoute } from "next";

import { getCustomerStories } from "@/lib/sanity/customerStories";
import { getPosts } from "@/lib/sanity/posts";
import { defaultLocale, locales, type Locale } from "@/lib/i18n/locales";

const defaultSiteUrl = "https://www.debt-relief.pro";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();
  const now = new Date();
  const staticPaths = ["", "/blog", "/apply", "/client-stories"];
  const staticRoutes = staticPaths.flatMap((path) =>
    locales.map((locale) =>
      sitemapEntry({
        baseUrl,
        changeFrequency: path === "/blog" || path === "/client-stories" ? "weekly" : "monthly",
        lastModified: now,
        locale,
        path,
        priority: path === "" ? 1 : path === "/apply" ? 0.9 : 0.8,
      }),
    ),
  );

  const postsByLocale = Object.fromEntries(
    await Promise.all(locales.map(async (locale) => [locale, await getPosts(locale, 100)])),
  ) as Record<Locale, Awaited<ReturnType<typeof getPosts>>>;
  const storiesByLocale = Object.fromEntries(
    await Promise.all(
      locales.map(async (locale) => [locale, await getCustomerStories(locale, 100)]),
    ),
  ) as Record<Locale, Awaited<ReturnType<typeof getCustomerStories>>>;

  const localizedPosts = locales.flatMap((locale) =>
    postsByLocale[locale].map((post) =>
      sitemapEntry({
        alternates: buildLocalizedAlternates(baseUrl, postsByLocale, post._id, "blog"),
        baseUrl,
        changeFrequency: "monthly",
        lastModified: post.publishedAt ? new Date(post.publishedAt) : now,
        locale,
        path: `/blog/${post.slug}`,
        priority: 0.7,
      }),
    ),
  );
  const localizedStories = locales.flatMap((locale) =>
    storiesByLocale[locale].map((story) =>
      sitemapEntry({
        alternates: buildLocalizedAlternates(baseUrl, storiesByLocale, story._id, "client-stories"),
        baseUrl,
        changeFrequency: "monthly",
        lastModified: story.publishedAt ? new Date(story.publishedAt) : now,
        locale,
        path: `/client-stories/${story.slug}`,
        priority: 0.6,
      }),
    ),
  );

  return [...staticRoutes, ...localizedPosts, ...localizedStories];
}

function sitemapEntry({
  alternates,
  baseUrl,
  changeFrequency,
  lastModified,
  locale,
  path,
  priority,
}: {
  alternates?: Record<string, string>;
  baseUrl: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  lastModified: Date;
  locale: Locale;
  path: string;
  priority: number;
}): MetadataRoute.Sitemap[number] {
  return {
    url: `${baseUrl}/${locale}${path}`,
    lastModified,
    changeFrequency,
    priority,
    alternates: {
      languages: alternates || buildStaticAlternates(baseUrl, path),
    },
  };
}

function buildStaticAlternates(baseUrl: string, path: string): Record<string, string> {
  return {
    en: `${baseUrl}/en${path}`,
    es: `${baseUrl}/es${path}`,
    "x-default": `${baseUrl}/${defaultLocale}${path}`,
  };
}

function buildLocalizedAlternates(
  baseUrl: string,
  recordsByLocale: Record<Locale, Array<{ _id: string; slug: string }>>,
  id: string,
  section: "blog" | "client-stories",
): Record<string, string> {
  const languages = Object.fromEntries(
    locales.map((locale) => {
      const record = recordsByLocale[locale].find((item) => item._id === id);
      return [locale, `${baseUrl}/${locale}/${section}/${record?.slug || ""}`];
    }),
  );
  const defaultRecord = recordsByLocale[defaultLocale].find((item) => item._id === id);

  return {
    ...languages,
    "x-default": `${baseUrl}/${defaultLocale}/${section}/${defaultRecord?.slug || ""}`,
  };
}

function getBaseUrl(): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || defaultSiteUrl;
  return siteUrl.replace(/\/+$/, "");
}
