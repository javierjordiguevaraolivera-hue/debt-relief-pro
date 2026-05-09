"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import type { Locale } from "@/lib/i18n/locales";
import type { BlogPostCard } from "@/lib/sanity/posts";

type BlogPostCarouselProps = {
  blogLabel: string;
  emptyLabel: string;
  locale: Locale;
  posts: BlogPostCard[];
  readMoreLabel: string;
};

export function BlogPostCarousel({
  blogLabel,
  emptyLabel,
  locale,
  posts,
  readMoreLabel,
}: BlogPostCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToPost(0, "auto");
  }, [posts.length]);

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

  function scrollToPost(index: number, behavior: ScrollBehavior = "smooth") {
    const track = trackRef.current;
    const item = track?.children[index] as HTMLElement | undefined;

    if (!track || !item) {
      return;
    }

    item.scrollIntoView({ behavior, block: "nearest", inline: "center" });
    setActiveIndex(index);
  }

  if (!posts.length) {
    return <p className="mt-8 text-center text-slate-600">{emptyLabel}</p>;
  }

  return (
    <>
      <div
        ref={trackRef}
        onScroll={updateActiveSlide}
        className="scrollbar-hidden -mx-4 mt-9 flex snap-x snap-mandatory gap-5 overflow-x-auto px-[calc((100vw-21rem)/2)] pb-2 md:mx-auto md:max-w-6xl md:px-0"
      >
        {posts.map((post) => (
          <article
            key={post._id}
            className="w-[21rem] shrink-0 snap-center overflow-hidden rounded-lg bg-white shadow-md ring-1 ring-slate-200 md:w-[25rem]"
          >
            <Link href={`/${locale}/blog/${post.slug}`} className="block">
              {post.imageUrl ? (
                <Image
                  src={post.imageUrl}
                  alt={post.imageAlt || post.title}
                  width={960}
                  height={540}
                  className="aspect-[16/9] w-full object-cover"
                />
              ) : (
                <div className="aspect-[16/9] w-full bg-slate-200" />
              )}
            </Link>
            <div className="p-5">
              <h3 className="text-xl font-bold leading-snug text-[#02163a]">
                <Link href={`/${locale}/blog/${post.slug}`}>{post.title}</Link>
              </h3>
              {post.excerpt ? (
                <p className="mt-4 text-sm leading-6 text-slate-600">
                  {truncateText(post.excerpt, 90)}
                </p>
              ) : null}
              <Link
                href={`/${locale}/blog/${post.slug}`}
                className="mt-6 inline-flex font-semibold text-[#02163a] underline underline-offset-4"
              >
                {readMoreLabel}
              </Link>
            </div>
          </article>
        ))}
      </div>
      <div className="mt-8 flex justify-center gap-2">
        {posts.map((post, postIndex) => (
          <button
            key={post._id}
            type="button"
            aria-label={`Go to post ${postIndex + 1}`}
            aria-current={activeIndex === postIndex ? "true" : undefined}
            onClick={() => scrollToPost(postIndex)}
            className={`h-2.5 w-2.5 rounded-full transition ${
              activeIndex === postIndex ? "bg-[#02163a]" : "bg-slate-400"
            }`}
          />
        ))}
      </div>
      <div className="mt-8 text-center">
        <Link
          href={`/${locale}/blog`}
          className="inline-flex rounded-full border-2 border-[#02163a] px-7 py-3 text-sm font-bold text-[#02163a] hover:bg-[#02163a] hover:text-white"
        >
          {blogLabel}
        </Link>
      </div>
    </>
  );
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength).trimEnd()}...`;
}
