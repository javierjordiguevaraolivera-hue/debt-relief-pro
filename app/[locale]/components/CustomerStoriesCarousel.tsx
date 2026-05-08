"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import type { Locale } from "@/lib/i18n/locales";
import type { CustomerStoryCard } from "@/lib/sanity/customerStories";
import { formatUsState } from "@/lib/usStates";

type CustomerStoriesCarouselProps = {
  locale: Locale;
  readMoreLabel: string;
  stories: CustomerStoryCard[];
};

export function CustomerStoriesCarousel({
  locale,
  readMoreLabel,
  stories,
}: CustomerStoriesCarouselProps) {
  const initialIndex = stories.length > 1 ? 1 : 0;
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToStory(initialIndex, "auto");
  }, [initialIndex]);

  function updateActiveSlide() {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    const center = track.scrollLeft + track.clientWidth / 2;
    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    Array.from(track.children).forEach((child, index) => {
      const item = child as HTMLElement;
      const itemCenter = item.offsetLeft + item.offsetWidth / 2;
      const distance = Math.abs(center - itemCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    setActiveIndex(closestIndex);
  }

  function scrollToStory(index: number, behavior: ScrollBehavior = "smooth") {
    const track = trackRef.current;
    const item = track?.children[index] as HTMLElement | undefined;

    if (!track || !item) {
      return;
    }

    item.scrollIntoView({ behavior, block: "nearest", inline: "center" });
    setActiveIndex(index);
  }

  return (
    <>
      <div
        ref={trackRef}
        onScroll={updateActiveSlide}
        className="scrollbar-hidden -mx-4 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-[calc((100vw-18rem)/2)] pb-2 md:mx-auto md:grid md:max-w-5xl md:grid-cols-3 md:gap-5 md:overflow-visible md:px-0 md:pb-0"
      >
        {stories.map((story) => (
          <Link
            key={story._id}
            href={`/${locale}/client-stories/${story.slug}`}
            className="group w-72 shrink-0 snap-center rounded-lg border border-slate-200 bg-white p-5 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md md:w-auto"
          >
            {story.imageUrl ? (
              <Image
                src={story.imageUrl}
                alt={story.imageAlt || story.name}
                width={480}
                height={480}
                className="mx-auto aspect-square w-28 rounded-full object-cover ring-4 ring-slate-50"
              />
            ) : null}
            <div className="mt-4">
              <h3 className="text-lg font-bold text-[#02163a] group-hover:text-emerald-700">
                {story.name}
              </h3>
              {formatUsState(story.state) ? (
                <span className="mt-1 block text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                  {formatUsState(story.state)}
                </span>
              ) : null}
            </div>
            <p className="mt-3 text-sm font-bold text-amber-600">
              {"★".repeat(story.rating || 5)}
            </p>
            {story.quote ? (
              <p className="mt-3 line-clamp-4 text-sm leading-6 text-slate-700">
                &ldquo;{story.quote}&rdquo;
              </p>
            ) : null}
            <p className="mt-5 text-sm font-bold text-emerald-700">{readMoreLabel}</p>
          </Link>
        ))}
      </div>
      <div className="mt-5 flex justify-center gap-2 md:hidden">
        {stories.map((story, storyIndex) => (
          <button
            key={story._id}
            type="button"
            aria-label={`Go to story ${storyIndex + 1}`}
            aria-current={activeIndex === storyIndex ? "true" : undefined}
            onClick={() => scrollToStory(storyIndex)}
            className={`h-2.5 w-2.5 rounded-full transition ${
              activeIndex === storyIndex ? "bg-[#02163a]" : "bg-slate-300"
            }`}
          />
        ))}
      </div>
    </>
  );
}
