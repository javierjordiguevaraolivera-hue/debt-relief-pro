import type { Locale } from "@/lib/i18n/locales";

export const APPLY_STATUS_COOKIE = "drp_apply_status";
export const APPLY_STATUS_MAX_AGE = 60 * 60 * 2;

export type ApplyStatus =
  | {
      id: string;
      locale: Locale;
      status: "qualified";
    }
  | {
      locale: Locale;
      reason: "debt" | "state";
      state?: string;
      status: "rejected";
    };

export function getApplyStatusPath(status: ApplyStatus, locale: Locale): string {
  if (status.status === "qualified") {
    return `/${locale}/apply/calificacion?id=${encodeURIComponent(status.id)}`;
  }

  const params = new URLSearchParams({ reason: status.reason });
  if (status.state) {
    params.set("state", status.state);
  }

  return `/${locale}/apply/rechazo?${params.toString()}`;
}

export function parseApplyStatusCookie(value?: string): ApplyStatus | null {
  if (!value) return null;

  try {
    const parsed = JSON.parse(decodeURIComponent(value)) as Partial<ApplyStatus>;

    if (parsed.status === "qualified" && isLocaleValue(parsed.locale) && isValidId(parsed.id)) {
      return {
        id: parsed.id,
        locale: parsed.locale,
        status: "qualified",
      };
    }

    if (
      parsed.status === "rejected" &&
      isLocaleValue(parsed.locale) &&
      isRejectionReason(parsed.reason)
    ) {
      return {
        locale: parsed.locale,
        reason: parsed.reason,
        state: typeof parsed.state === "string" ? parsed.state : undefined,
        status: "rejected",
      };
    }
  } catch {
    return null;
  }

  return null;
}

export function rememberApplyStatus(status: ApplyStatus) {
  if (typeof document === "undefined") return;

  document.cookie = `${APPLY_STATUS_COOKIE}=${encodeURIComponent(
    JSON.stringify(status),
  )}; Max-Age=${APPLY_STATUS_MAX_AGE}; Path=/; SameSite=Lax`;
}

export function forgetApplyStatus() {
  if (typeof document === "undefined") return;

  document.cookie = `${APPLY_STATUS_COOKIE}=; Max-Age=0; Path=/; SameSite=Lax`;
}

function isLocaleValue(value: unknown): value is Locale {
  return value === "en" || value === "es";
}

function isRejectionReason(value: unknown): value is "debt" | "state" {
  return value === "debt" || value === "state";
}

function isValidId(value: unknown): value is string {
  return typeof value === "string" && /^[A-Z]{6}$/.test(value);
}
