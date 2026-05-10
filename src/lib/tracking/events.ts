import type { Locale } from "@/lib/i18n/locales";

type ApplicationQualifiedEvent = {
  amount?: string;
  locale: Locale;
  qualificationId?: string;
  state?: string;
};

type AffiliateClickedEvent = {
  affiliateUrl: string;
  locale: Locale;
  onComplete?: () => void;
  qualificationId?: string;
};

type DataLayerEvent = {
  [key: string]: unknown;
  event: string;
};

declare global {
  interface Window {
    dataLayer?: DataLayerEvent[];
  }
}

export function sendApplicationQualifiedEvent({
  amount,
  locale,
  qualificationId,
  state,
}: ApplicationQualifiedEvent) {
  if (typeof window === "undefined") {
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "application_qualified",
    event_id: generateEventId(),
    application_amount: amount,
    qualification_id: qualificationId,
    application_state: state,
    language: locale,
    page_path: window.location.pathname,
    page_url: window.location.href,
  });
}

export function sendAffiliateClickedEvent({
  affiliateUrl,
  locale,
  onComplete,
  qualificationId,
}: AffiliateClickedEvent) {
  if (typeof window === "undefined") {
    onComplete?.();
    return;
  }

  let completed = false;
  const complete = () => {
    if (completed) return;
    completed = true;
    onComplete?.();
  };

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "affiliate_clicked",
    event_id: generateEventId(),
    affiliate_url: affiliateUrl,
    qualification_id: qualificationId,
    language: locale,
    page_path: window.location.pathname,
    page_url: window.location.href,
    eventCallback: complete,
    eventTimeout: 800,
  });

  window.setTimeout(complete, 900);
}

function generateEventId(): string {
  if (window.crypto && typeof window.crypto.randomUUID === "function") {
    return window.crypto.randomUUID();
  }

  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (character) => {
    const random = (Math.random() * 16) | 0;
    const value = character === "x" ? random : (random & 3) | 8;
    return value.toString(16);
  });
}
