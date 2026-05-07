import { NextResponse, type NextRequest } from "next/server";

import { detectLocale, isLocale } from "./lib/i18n/locales";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const firstSegment = pathname.split("/")[1];

  if (isLocale(firstSegment)) {
    return NextResponse.next();
  }

  const locale = detectLocale(request.headers.get("accept-language"));
  const url = request.nextUrl.clone();
  url.pathname = pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;

  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|studio|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)"],
};
