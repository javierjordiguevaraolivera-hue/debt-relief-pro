import Image from "next/image";
import Link from "next/link";

import type { Locale } from "@/lib/i18n/locales";
import {
  adBannerSizes,
  getAdBannerHref,
  type AdBanner,
  type AdBannerPlacement,
} from "@/lib/sanity/adBanners";

type AdBannerSlotProps = {
  banner: AdBanner | null;
  locale: Locale;
  placement: AdBannerPlacement;
};

const slotClassNames: Record<AdBannerPlacement, string> = {
  top: "my-8 flex w-full justify-center",
  inline: "my-10 flex w-full justify-center",
  sidebar: "sticky top-28 hidden w-[300px] lg:block",
};

const imageClassNames: Record<AdBannerPlacement, string> = {
  top: "h-auto w-full rounded-md object-contain shadow-sm",
  inline: "h-auto w-full rounded-md object-contain shadow-sm",
  sidebar: "h-auto w-full rounded-md object-contain shadow-sm",
};

export function AdBannerSlot({ banner, locale, placement }: AdBannerSlotProps) {
  if (!banner?.imageUrl) {
    return null;
  }

  const size = adBannerSizes[banner.format];
  const maxWidth = placement === "sidebar" ? 300 : size.width;

  return (
    <div className={slotClassNames[placement]}>
      <Link
        href={getAdBannerHref(banner, locale)}
        aria-label={banner.title}
        className="block"
        style={{ maxWidth }}
      >
        <Image
          src={banner.imageUrl}
          alt={banner.imageAlt}
          width={size.width}
          height={size.height}
          className={imageClassNames[placement]}
        />
      </Link>
    </div>
  );
}
