"use client";

import { reviews } from "@/data/reviews";
import { Star } from "lucide-react";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLang } from "@/lib/i18n/LanguageProvider";

export function ReviewCarousel() {
  const { t, lang } = useLang();
  const railRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: number) => {
    railRef.current?.scrollBy({ left: dir * 340, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div className="hidden md:flex gap-2 absolute -top-16 right-0">
        <button
          onClick={() => scrollBy(-1)}
          className="h-11 w-11 grid place-items-center rounded-full bg-white/10 hover:bg-white/20 text-white"
          aria-label={t("misc.review.prev")}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={() => scrollBy(1)}
          className="h-11 w-11 grid place-items-center rounded-full bg-white/10 hover:bg-white/20 text-white"
          aria-label={t("misc.review.next")}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div
        ref={railRef}
        className="flex gap-5 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-2"
      >
        {reviews.map((r) => (
          <figure
            key={r.id}
            className="snap-start shrink-0 w-[85%] sm:w-[360px] rounded-3xl bg-white/[0.06] border border-white/10 p-7"
          >
            <div className="flex gap-0.5 mb-4" aria-label={t("misc.review.ratingOutOf").replace("{n}", String(r.rating))}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < r.rating ? "fill-coral text-coral" : "text-white/20"}`}
                />
              ))}
            </div>
            <blockquote className="text-white/90 leading-relaxed">
              “{lang === "zh" && r.textZh ? r.textZh : r.text}”
            </blockquote>
            <figcaption className="mt-5 text-sm font-semibold text-white/70">
              {lang === "zh" && r.nameZh ? r.nameZh : r.name}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
