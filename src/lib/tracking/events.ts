import type { Locale } from "@/lib/i18n/locales";

type ApplicationQualifiedEvent = {
  amount: string;
  locale: Locale;
  state?: string;
};

type DataLayerEvent = {
  [key: string]: string | undefined;
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
    application_state: state,
    language: locale,
    page_path: window.location.pathname,
    page_url: window.location.href,
  });
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
