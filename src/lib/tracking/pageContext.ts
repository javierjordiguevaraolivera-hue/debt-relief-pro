export type VercelGeoContext = {
  city?: string;
  country?: string;
  postalCode?: string;
  state?: string;
};

const geoHeaders = {
  city: "x-vercel-ip-city",
  country: "x-vercel-ip-country",
  postalCode: "x-vercel-ip-postal-code",
  state: "x-vercel-ip-country-region",
} as const;

export function getVercelGeoContext(headersList: Headers): VercelGeoContext {
  return {
    city: normalizeGeoValue(headersList.get(geoHeaders.city)),
    country: normalizeGeoValue(headersList.get(geoHeaders.country)),
    postalCode: normalizeGeoValue(headersList.get(geoHeaders.postalCode)),
    state: normalizeGeoValue(headersList.get(geoHeaders.state)),
  };
}

export function buildGtmInitScript(geoContext: VercelGeoContext): string {
  const serializedGeo = JSON.stringify(geoContext).replace(/</g, "\\u003c");

  return `
    (function () {
      var geoContext = ${serializedGeo};
      var externalIdCookieName = "drp_external_id";
      var clickIdKeys = ["gclid", "gbraid", "wbraid", "ttclid"];

      function generateUuid() {
        if (window.crypto && typeof window.crypto.randomUUID === "function") {
          return window.crypto.randomUUID();
        }

        if (!window.crypto || typeof window.crypto.getRandomValues !== "function") {
          return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (character) {
            var random = Math.random() * 16 | 0;
            var value = character === "x" ? random : (random & 3) | 8;
            return value.toString(16);
          });
        }

        return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, function (character) {
          return (
            Number(character) ^
            (window.crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (Number(character) / 4)))
          ).toString(16);
        });
      }

      function readCookie(name) {
        var cookie = document.cookie
          .split("; ")
          .find(function (item) {
            return item.indexOf(name + "=") === 0;
          });

        return cookie ? decodeURIComponent(cookie.substring(name.length + 1)) : undefined;
      }

      function writeCookie(name, value) {
        document.cookie = name + "=" + encodeURIComponent(value) + "; Max-Age=31536000; Path=/; SameSite=Lax";
      }

      function getExternalId() {
        var storedId = readCookie(externalIdCookieName);

        try {
          storedId = storedId || window.localStorage.getItem(externalIdCookieName) || undefined;
        } catch {}

        if (!storedId) {
          storedId = "visitor_" + generateUuid();
        }

        writeCookie(externalIdCookieName, storedId);

        try {
          window.localStorage.setItem(externalIdCookieName, storedId);
        } catch {}

        return storedId;
      }

      function getLanguage(pathname) {
        var locale = pathname.split("/")[1];
        return locale === "es" || locale === "en" ? locale : "en";
      }

      function getUrlParam(searchParams, key) {
        return searchParams.get(key) || undefined;
      }

      window.dataLayer = window.dataLayer || [];

      var searchParams = new URLSearchParams(window.location.search);
      var clickIds = clickIdKeys.reduce(function (values, key) {
        values[key] = getUrlParam(searchParams, key);
        return values;
      }, {});

      var city = geoContext.city || undefined;
      var state = geoContext.state || undefined;
      var country = geoContext.country || undefined;
      var postalCode = geoContext.postalCode || undefined;

      window.dataLayer.push({
        event: "gtm.init",
        event_id: generateUuid(),
        external_id: getExternalId(),
        language: getLanguage(window.location.pathname),
        city: city,
        state: state,
        country: country,
        zip: postalCode,
        postal_code: postalCode,
        page_path: window.location.pathname,
        page_url: window.location.href,
        fbp: readCookie("_fbp"),
        fbc: readCookie("_fbc"),
        gclid: clickIds.gclid,
        gbraid: clickIds.gbraid,
        wbraid: clickIds.wbraid,
        ttclid: clickIds.ttclid,
        ct: city,
        st: state,
        zp: postalCode
      });
    })();
  `;
}

function normalizeGeoValue(value: string | null): string | undefined {
  if (!value) {
    return undefined;
  }

  const decoded = decodeGeoHeader(value).trim().toLowerCase();

  if (!decoded || decoded === "unknown") {
    return undefined;
  }

  return decoded;
}

function decodeGeoHeader(value: string): string {
  try {
    return decodeURIComponent(value.replace(/\+/g, " "));
  } catch {
    return value.replace(/\+/g, " ");
  }
}
