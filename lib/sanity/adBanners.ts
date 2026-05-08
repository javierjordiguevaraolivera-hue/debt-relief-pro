import { groq } from "next-sanity";

import type { Locale } from "@/lib/i18n/locales";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";

export type AdBannerCategory = "cta" | "blog" | "historia";
export type AdBannerPlacement = "top" | "inline" | "sidebar";
export type AdBannerPageType = "home" | "blog" | "clientStory";
export type AdBannerFormat =
  | "mediumRectangle"
  | "halfPage"
  | "largeRectangle"
  | "leaderboard"
  | "mobileLeaderboard"
  | "largeMobileBanner"
  | "billboard";

export type AdBanner = {
  _id: string;
  title: string;
  category: AdBannerCategory;
  format: AdBannerFormat;
  imageUrl?: string;
  imageAlt: string;
  internalPath?: string;
};

export const adBannerSizes: Record<AdBannerFormat, { width: number; height: number }> = {
  mediumRectangle: { width: 300, height: 250 },
  halfPage: { width: 300, height: 600 },
  largeRectangle: { width: 336, height: 280 },
  leaderboard: { width: 728, height: 90 },
  mobileLeaderboard: { width: 320, height: 50 },
  largeMobileBanner: { width: 320, height: 100 },
  billboard: { width: 970, height: 250 },
};

const bannerFields = groq`
  _id,
  title,
  category,
  format,
  internalPath,
  "image": image,
  "imageAlt": image.alt
`;

export async function getAdBanners(
  pageType: AdBannerPageType,
): Promise<AdBanner[]> {
  const banners = await safeFetch<Array<AdBanner & { image?: unknown }>>(
    groq`*[
      _type == "adBanner" &&
      active == true &&
      $pageType in showOn[] &&
      defined(image)
    ] | order(_createdAt asc) {
      ${bannerFields}
    }`,
    { pageType },
    [],
  );

  return banners.map(formatBanner).filter((banner) => Boolean(banner.imageUrl));
}

export function selectAdBanner(
  banners: AdBanner[],
  placement: AdBannerPlacement,
  seed: string,
): AdBanner | null {
  const candidates = banners.filter((banner) => isFormatEligibleForPlacement(banner.format, placement));

  if (!candidates.length) {
    return null;
  }

  const index = hashSeed(`${seed}-${placement}`) % candidates.length;

  return candidates[index] || null;
}

export function getAdBannerHref(banner: AdBanner, locale: Locale): string {
  if (banner.category === "cta") {
    return `/${locale}/apply`;
  }

  if (!banner.internalPath) {
    return `/${locale}/apply`;
  }

  if (banner.internalPath.startsWith("/en/") || banner.internalPath.startsWith("/es/")) {
    return banner.internalPath;
  }

  return `/${locale}${banner.internalPath}`;
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

function formatBanner(banner: AdBanner & { image?: unknown }): AdBanner {
  const size = adBannerSizes[banner.format] || adBannerSizes.mediumRectangle;

  return {
    _id: banner._id,
    title: banner.title,
    category: banner.category,
    format: banner.format,
    imageUrl: banner.image
      ? urlFor(banner.image).width(size.width).height(size.height).fit("max").url()
      : undefined,
    imageAlt: banner.imageAlt,
    internalPath: banner.internalPath,
  };
}

function isFormatEligibleForPlacement(
  format: AdBannerFormat,
  placement: AdBannerPlacement,
): boolean {
  if (placement === "top") {
    return ["leaderboard", "billboard", "mobileLeaderboard", "largeMobileBanner"].includes(format);
  }

  if (placement === "sidebar") {
    return format === "halfPage";
  }

  return ["mediumRectangle", "largeRectangle", "largeMobileBanner"].includes(format);
}

function hashSeed(seed: string): number {
  let hash = 0;

  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) >>> 0;
  }

  return hash;
}
