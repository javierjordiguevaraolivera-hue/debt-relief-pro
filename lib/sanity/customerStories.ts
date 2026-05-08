import { PortableTextBlock } from "@portabletext/types";
import { groq } from "next-sanity";

import type { Locale } from "@/lib/i18n/locales";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";

export type CustomerStoryCard = {
  _id: string;
  name: string;
  slug: string;
  state?: string;
  publishedAt?: string;
  quote?: string;
  rating?: number;
  imageUrl?: string;
  imageAlt?: string;
};

export type CustomerStory = CustomerStoryCard & {
  seoTitle?: string;
  seoDescription?: string;
  body?: PortableTextBlock[];
};

const storyFields = groq`
  _id,
  name,
  "slug": slug.current,
  state,
  publishedAt,
  rating,
  "quote": select($locale == "es" => coalesce(quote_es, quote_en), quote_en),
  "image": photo,
  "imageAlt": photo.alt
`;

export async function getCustomerStories(
  locale: Locale,
  limit = 12,
): Promise<CustomerStoryCard[]> {
  const stories = await safeFetch<Array<CustomerStoryCard & { image?: unknown }>>(
    groq`*[_type == "customerStory" && defined(slug.current)] | order(publishedAt desc)[0...$limit] {
      ${storyFields}
    }`,
    { locale, limit },
    [],
  );

  return stories.map(formatStoryCard);
}

export async function getCustomerStoryBySlug(
  locale: Locale,
  slug: string,
): Promise<CustomerStory | null> {
  const story = await safeFetch<(CustomerStory & { image?: unknown }) | null>(
    groq`*[_type == "customerStory" && slug.current == $slug][0] {
      ${storyFields},
      "seoTitle": select($locale == "es" => coalesce(seo_title_es, seo_title_en, name), coalesce(seo_title_en, name)),
      "seoDescription": select($locale == "es" => coalesce(seo_description_es, seo_description_en, quote_es, quote_en), coalesce(seo_description_en, quote_en)),
      "body": select($locale == "es" => coalesce(body_es, body_en), body_en)
    }`,
    { locale, slug },
    null,
  );

  return story ? formatStory(story) : null;
}

async function safeFetch<T>(
  query: string,
  params: Record<string, unknown>,
  fallback: T,
): Promise<T> {
  try {
    return await client.fetch<T>(query, params, { next: { revalidate: 60 } });
  } catch (error) {
    console.error("Sanity fetch failed", error);
    return fallback;
  }
}

function formatStoryCard(story: CustomerStoryCard & { image?: unknown }): CustomerStoryCard {
  return {
    _id: story._id,
    name: story.name,
    slug: story.slug,
    state: story.state,
    publishedAt: story.publishedAt,
    quote: story.quote,
    rating: story.rating,
    imageUrl: story.image ? urlFor(story.image).width(960).height(640).url() : undefined,
    imageAlt: story.imageAlt,
  };
}

function formatStory(story: CustomerStory & { image?: unknown }): CustomerStory {
  return {
    ...formatStoryCard(story),
    seoTitle: story.seoTitle,
    seoDescription: story.seoDescription,
    body: story.body,
  };
}
