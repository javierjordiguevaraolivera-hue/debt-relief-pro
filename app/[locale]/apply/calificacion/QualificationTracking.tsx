"use client";

import { useEffect } from "react";

import type { Locale } from "@/lib/i18n/locales";
import { sendApplicationQualifiedEvent } from "@/src/lib/tracking/events";

export function QualificationTracking({
  locale,
  qualificationId,
}: {
  locale: Locale;
  qualificationId: string;
}) {
  useEffect(() => {
    sendApplicationQualifiedEvent({ locale, qualificationId });
  }, [locale, qualificationId]);

  return null;
}
