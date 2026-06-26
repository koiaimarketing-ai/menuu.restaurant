"use client";

import { Flame, Leaf, Fish, Drumstick } from "lucide-react";
import { useLang } from "@/lib/i18n/LanguageProvider";

/**
 * Clear front-facing cow head (lucide has no cow icon) — horns, ears, forehead,
 * eyes and a large muzzle with nostrils, so it reads as "beef" even at icon size.
 * Rounded line style + currentColor to match the spicy / veg / fish icons.
 */
function CowIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* horns */}
      <path d="M7.2 5.6C6.2 4.3 4.6 4.2 3.9 5c-.6.7-.4 1.9.7 2.7" />
      <path d="M16.8 5.6c1-1.3 2.6-1.4 3.3-.6.6.7.4 1.9-.7 2.7" />
      {/* ears */}
      <path d="M5.6 8.1C3.9 7.9 2.7 8.7 2.7 9.9c0 1.2 1.2 2 2.8 1.9" />
      <path d="M18.4 8.1c1.7-.2 2.9.6 2.9 1.8 0 1.2-1.2 2-2.8 1.9" />
      {/* forehead / head outline down to the muzzle */}
      <path d="M5.4 9C5.4 7.2 8.3 6 12 6s6.6 1.2 6.6 3c0 1.8-.8 3.4-2 4.5" />
      <path d="M5.4 9c0 1.8.8 3.4 2 4.5" />
      {/* muzzle */}
      <ellipse cx="12" cy="15" rx="4.6" ry="3.1" />
      {/* eyes */}
      <path d="M9.2 10h.01" />
      <path d="M14.8 10h.01" />
      {/* nostrils */}
      <path d="M10.4 15h.01" />
      <path d="M13.6 15h.01" />
    </svg>
  );
}

/**
 * Dedicated metadata row of dietary / ingredient indicators — ICONS ONLY.
 *  • Flame = spicy, Beef = beef (one cow icon for all beef), Fish = fish/seafood,
 *    Leaf = vegetarian.
 *  • Each has an accessible label + hover/tap tooltip (title).
 *  • Consistent icon size, gap and alignment across every food card.
 * Renders nothing when none apply (no reserved empty row). Never used on
 * beverages (callers gate the flags via the show* helpers).
 */
export function FoodTags({
  spicy,
  veg,
  fish,
  beef,
  chicken,
  className = "",
}: {
  spicy?: boolean;
  veg?: boolean;
  fish?: boolean;
  beef?: boolean;
  chicken?: boolean;
  className?: string;
}) {
  const { t } = useLang();
  if (!spicy && !veg && !fish && !beef && !chicken) return null;

  return (
    <div className={`flex min-h-[18px] items-center gap-1.5 ${className}`}>
      {spicy && (
        <span className="inline-flex items-center justify-center leading-none text-[#ef4438]" aria-label={t("menu.tag.spicy")} title={t("menu.tag.spicy")}>
          <Flame className="h-[15px] w-[15px]" />
        </span>
      )}
      {chicken && (
        <span className="inline-flex items-center justify-center leading-none text-[#C97A33]" aria-label={t("menu.tag.chicken")} title={t("menu.tag.chicken")}>
          <Drumstick className="h-[15px] w-[15px]" />
        </span>
      )}
      {beef && (
        <span className="inline-flex items-center justify-center leading-none text-[#9a5a33]" aria-label={t("menu.tag.beef")} title={t("menu.tag.beef")}>
          <CowIcon className="h-[15px] w-[15px]" />
        </span>
      )}
      {fish && (
        <span className="inline-flex items-center justify-center leading-none text-[#2b86c5]" aria-label={t("menu.tag.fish")} title={t("menu.tag.fish")}>
          <Fish className="h-[15px] w-[15px]" />
        </span>
      )}
      {veg && (
        <span className="inline-flex items-center justify-center leading-none text-[#159447]" aria-label={t("menu.tag.veg")} title={t("menu.tag.veg")}>
          <Leaf className="h-[15px] w-[15px]" />
        </span>
      )}
    </div>
  );
}
