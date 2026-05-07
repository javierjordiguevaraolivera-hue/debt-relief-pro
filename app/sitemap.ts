import type { MetadataRoute } from "next";

import { getPosts } from "@/lib/sanity/posts";
import { locales } from "@/lib/i18n/locales";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
  const staticRoutes = locales.flatMap((locale) => [
    {
      url: `${baseUrl}/${locale}`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/${locale}/blog`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/${locale}/apply`,
      lastModified: new Date(),
    },
  ]);

  const localizedPosts = await Promise.all(
    locales.map(async (locale) => {
      const posts = await getPosts(locale, 100);
      return posts.map((post) => ({
        url: `${baseUrl}/${locale}/blog/${post.slug}`,
        lastModified: post.publishedAt ? new Date(post.publishedAt) : new Date(),
      }));
    }),
  );

  return [...staticRoutes, ...localizedPosts.flat()];
}
