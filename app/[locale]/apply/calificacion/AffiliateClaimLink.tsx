"use client";

import type { MouseEvent, ReactNode } from "react";

import type { Locale } from "@/lib/i18n/locales";
import { sendAffiliateClickedEvent } from "@/src/lib/tracking/events";

export function AffiliateClaimLink({
  children,
  className,
  href,
  locale,
  qualificationId,
}: {
  children: ReactNode;
  className?: string;
  href: string;
  locale: Locale;
  qualificationId: string;
}) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      sendAffiliateClickedEvent({ affiliateUrl: href, locale, qualificationId });
      return;
    }

    event.preventDefault();
    sendAffiliateClickedEvent({
      affiliateUrl: href,
      locale,
      qualificationId,
      onComplete: () => {
        window.location.href = href;
      },
    });
  }

  return (
    <a className={className} href={href} onClick={handleClick}>
      {children}
    </a>
  );
}
