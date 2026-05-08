import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import { isLocale, type Locale } from "@/lib/i18n/locales";
import { getTranslations } from "@/lib/i18n/translations";
import { getCustomerStories } from "@/lib/sanity/customerStories";
import { formatUsState } from "@/lib/usStates";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getTranslations(locale);

  return {
    title: t.clientStories.title,
    description: t.clientStories.description,
    alternates: {
      canonical: `/${locale}/client-stories`,
      languages: {
        en: "/en/client-stories",
        es: "/es/client-stories",
      },
    },
  };
}

export default async function ClientStoriesPage({ params }: PageProps) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();

  const locale: Locale = rawLocale;
  const t = getTranslations(locale);
  const stories = await getCustomerStories(locale);

  return (
    <div className="flex min-h-dvh flex-col bg-white text-slate-950">
      <SiteHeader locale={locale} />
      <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-14">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold tracking-normal text-[#02163a] md:text-5xl">
            {t.clientStories.title}
          </h1>
          <p className="mt-4 text-lg leading-8 text-slate-700">{t.clientStories.description}</p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {stories.length ? (
            stories.map((story) => (
              <Link key={story._id} href={`/${locale}/client-stories/${story.slug}`} className="group rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                {story.imageUrl ? (
                  <Image
                    src={story.imageUrl}
                    alt={story.imageAlt || story.name}
                    width={480}
                    height={480}
                    className="aspect-square w-full rounded-md object-cover"
                  />
                ) : null}
                <div className="mt-4 flex items-center justify-between gap-3">
                  <h2 className="text-xl font-bold text-[#02163a] group-hover:text-emerald-700">{story.name}</h2>
                  {formatUsState(story.state) ? (
                    <span className="text-sm font-bold text-slate-500">{formatUsState(story.state)}</span>
                  ) : null}
                </div>
                <p className="mt-3 text-sm font-bold uppercase tracking-[0.14em] text-amber-600">
                  {"★".repeat(story.rating || 5)}
                </p>
                {story.quote ? <p className="mt-3 leading-7 text-slate-600">&ldquo;{story.quote}&rdquo;</p> : null}
                <p className="mt-5 font-bold text-emerald-700">{t.clientStories.readMore}</p>
              </Link>
            ))
          ) : (
            <p className="text-slate-600">{t.clientStories.empty}</p>
          )}
        </div>
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}
