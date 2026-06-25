"use client";

import { Star } from "lucide-react";
import { GUEST_AVATARS } from "@/lib/avatars";
import { REVIEW_INFO } from "@/data/review-info";
import { useLang } from "@/lib/i18n/LanguageProvider";

/** Five brand-coloured stars. */
export function ReviewStars({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`${className} fill-primary text-primary`} />
      ))}
    </span>
  );
}

/** Two centred rows: ★★★★★ 4.6 on top, glowing "500+ Combined Review" below.
 * Only the combined-review text carries the shine. */
export function ReviewMeta({ className = "", starClass }: { className?: string; starClass?: string }) {
  const { t } = useLang();
  return (
    <span className={`inline-flex min-w-0 flex-col items-center gap-1.5 text-center ${className}`}>
      <span className="flex items-center gap-2">
        <ReviewStars className={starClass ?? "h-4 w-4"} />
        <span className="font-bold text-heading">{REVIEW_INFO.rating}</span>
      </span>
      <span className="reviews-shine whitespace-nowrap font-bold">{t("misc.review.combined")}</span>
    </span>
  );
}

/** Reusable review strip: avatar group + stars/rating/reviews + trust line.
 * `compact` → single horizontal row, no trust text (Menu page hero). */
export function ReviewStrip({ className = "", compact = false }: { className?: string; compact?: boolean }) {
  const { t } = useLang();

  if (compact) {
    return (
      <div
        className={`inline-flex max-w-[calc(100%-24px)] flex-col items-center gap-2.5 rounded-[18px] border border-line-warm bg-white px-5 py-3.5 shadow-[0_12px_30px_rgba(80,40,25,0.08)] ${className}`}
      >
        {/* Row 1: avatar group, centred */}
        <div className="flex shrink-0 -space-x-2.5">
          {GUEST_AVATARS.map((src, i) => (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              key={i}
              src={src}
              alt="Warung Jakarta customer"
              loading="lazy"
              className="h-7 w-7 rounded-full border-2 border-cream bg-secondary object-cover sm:h-8 sm:w-8"
            />
          ))}
        </div>
        {/* Row 2: stars + rating + combined review count */}
        <span className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
          <ReviewStars className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span className="font-bold text-heading">{REVIEW_INFO.rating}</span>
          <span className="reviews-shine whitespace-nowrap text-sm font-bold">{t("misc.review.combined")}</span>
        </span>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-wrap items-center gap-x-4 gap-y-3 rounded-2xl border border-line-warm bg-white/70 px-4 py-3.5 ${className}`}
    >
      <div className="flex -space-x-2.5">
        {GUEST_AVATARS.map((src, i) => (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            key={i}
            src={src}
            alt="Warung Jakarta customer"
            loading="lazy"
            className="h-9 w-9 rounded-full border-2 border-cream bg-secondary object-cover"
          />
        ))}
      </div>
      <div className="min-w-0">
        <ReviewMeta />
        <p className="mt-1 text-sm text-ink-secondary">
          {t("pages.contact.lovedTitle")} {t("pages.contact.lovedDesc")}
        </p>
      </div>
    </div>
  );
}
