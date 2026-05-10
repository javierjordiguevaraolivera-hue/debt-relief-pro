import { GoogleTagManager } from "@next/third-parties/google";
import type { Metadata } from "next";
import { headers } from "next/headers";
import Script from "next/script";

import { buildGtmInitScript, getVercelGeoContext } from "@/src/lib/tracking/pageContext";
import "./globals.css";

export const metadata: Metadata = {
  other: {
    charset: "utf-8",
  },
  title: {
    default: process.env.NEXT_PUBLIC_BRAND_NAME || "Debt Relief Pro",
    template: `%s | ${process.env.NEXT_PUBLIC_BRAND_NAME || "Debt Relief Pro"}`,
  },
  description: "Bilingual debt relief education and affiliate pre-qualification.",
  icons: {
    icon: "/media/debt%20relief%20pro%20icono.png",
    shortcut: "/media/debt%20relief%20pro%20icono.png",
    apple: "/media/debt%20relief%20pro%20icono.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const requestHeaders = await headers();
  const geoContext = getVercelGeoContext(requestHeaders);

  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <Script
        id="gtm-page-context-init"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: buildGtmInitScript(geoContext) }}
      />
      <GoogleTagManager gtmId="GTM-PF7DTLD6" />
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
