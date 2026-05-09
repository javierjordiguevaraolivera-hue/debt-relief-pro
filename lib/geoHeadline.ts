import { formatUsState } from "@/lib/usStates";

export type GeoLocation = {
  city?: string;
  state?: string;
};

export function buildDebtReliefHeadline(locale: "en" | "es", location: GeoLocation): string {
  const city = cleanGeoValue(location.city);
  const state = formatUsState(cleanGeoValue(location.state));

  if (city && state) {
    return locale === "es"
      ? `Alivio de deudas para ciudadanos de ${city}, ${state}`
      : `Debt relief for citizens of ${city}, ${state}`;
  }

  if (state) {
    return locale === "es"
      ? `Alivio de deudas para ciudadanos de ${state}`
      : `Debt relief for citizens of ${state}`;
  }

  return locale === "es"
    ? "Alivio de deudas para hispanos en Estados Unidos"
    : "Debt relief for Americans";
}

export function decodeGeoHeader(value: string | null): string | undefined {
  if (!value) {
    return undefined;
  }

  try {
    return decodeURIComponent(value.replace(/\+/g, " "));
  } catch {
    return value.replace(/\+/g, " ");
  }
}

function cleanGeoValue(value?: string): string | undefined {
  const cleaned = value?.trim();

  if (!cleaned || cleaned.toLowerCase() === "unknown") {
    return undefined;
  }

  return cleaned;
}
