import type { MetadataRoute } from "next";

import { getCustomerStories } from "@/lib/sanity/customerStories";
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
    {
      url: `${baseUrl}/${locale}/client-stories`,
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
  const localizedStories = await Promise.all(
    locales.map(async (locale) => {
      const stories = await getCustomerStories(locale, 100);
      return stories.map((story) => ({
        url: `${baseUrl}/${locale}/client-stories/${story.slug}`,
        lastModified: story.publishedAt ? new Date(story.publishedAt) : new Date(),
      }));
    }),
  );

  return [...staticRoutes, ...localizedPosts.flat(), ...localizedStories.flat()];
}
