import type { MetadataRoute } from "next";

const defaultSiteUrl = "https://www.debt-relief.pro";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/studio", "/api"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

function getBaseUrl(): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || defaultSiteUrl;
  return siteUrl.replace(/\/+$/, "");
}
