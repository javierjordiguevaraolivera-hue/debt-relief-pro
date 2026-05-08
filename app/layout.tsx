import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
