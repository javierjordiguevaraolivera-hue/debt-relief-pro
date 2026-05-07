import { PortableTextBlock } from "@portabletext/types";
import { groq } from "next-sanity";

import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import type { Locale } from "@/lib/i18n/locales";

export type BlogPostCard = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  publishedAt?: string;
  imageUrl?: string;
  imageAlt?: string;
};

export type BlogPost = BlogPostCard & {
  seoTitle?: string;
  seoDescription?: string;
  body?: PortableTextBlock[];
};

const postFields = groq`
  _id,
  "title": select($locale == "es" => coalesce(title_es, title_en), title_en),
  "slug": select($locale == "es" => coalesce(slug_es.current, slug_en.current), slug_en.current),
  "excerpt": select($locale == "es" => coalesce(excerpt_es, excerpt_en), excerpt_en),
  publishedAt,
  "image": featured_image,
  "imageAlt": featured_image.alt
`;

export async function getPosts(locale: Locale, limit = 12): Promise<BlogPostCard[]> {
  const posts = await client.fetch(
    groq`*[_type == "post" && defined(slug_en.current)] | order(publishedAt desc)[0...$limit] {
      ${postFields}
    }`,
    { locale, limit },
    { next: { revalidate: 60 } },
  );

  return posts.map(formatPostCard);
}

export async function getPostBySlug(
  locale: Locale,
  slug: string,
): Promise<BlogPost | null> {
  const post = await client.fetch(
    groq`*[
      _type == "post" &&
      (slug_en.current == $slug || slug_es.current == $slug)
    ][0] {
      ${postFields},
      "seoTitle": select($locale == "es" => coalesce(seo_title_es, seo_title_en, title_es, title_en), coalesce(seo_title_en, title_en)),
      "seoDescription": select($locale == "es" => coalesce(seo_description_es, seo_description_en, excerpt_es, excerpt_en), coalesce(seo_description_en, excerpt_en)),
      "body": select($locale == "es" => coalesce(body_es, body_en), body_en)
    }`,
    { locale, slug },
    { next: { revalidate: 60 } },
  );

  return post ? formatPost(post) : null;
}

function formatPostCard(post: BlogPostCard & { image?: unknown }): BlogPostCard {
  return {
    _id: post._id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    publishedAt: post.publishedAt,
    imageUrl: post.image ? urlFor(post.image).width(960).height(540).url() : undefined,
    imageAlt: post.imageAlt,
  };
}

function formatPost(post: BlogPost & { image?: unknown }): BlogPost {
  return {
    ...formatPostCard(post),
    seoTitle: post.seoTitle,
    seoDescription: post.seoDescription,
    body: post.body,
  };
}
