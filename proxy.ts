import { NextResponse, type NextRequest } from "next/server";

import { detectLocale, isLocale, localeCookieName } from "./lib/i18n/locales";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const firstSegment = pathname.split("/")[1];

  if (isLocale(firstSegment)) {
    const response = NextResponse.next();
    response.cookies.set(localeCookieName, firstSegment, {
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
      sameSite: "lax",
    });
    return response;
  }

  const preferredLocale = request.cookies.get(localeCookieName)?.value;
  const locale = preferredLocale && isLocale(preferredLocale)
    ? preferredLocale
    : detectLocale(request.headers.get("accept-language"));
  const url = request.nextUrl.clone();
  url.pathname = pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;

  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|studio|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)"],
};
