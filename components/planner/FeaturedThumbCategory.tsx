"use client";

import Image from "next/image";
import { MenuCard } from "./MenuCard";
import { sectionItems, showVegLeaf, type PlannerSection } from "./sections";
import { useLang } from "@/lib/i18n/LanguageProvider";

/**
 * Same compact "featured banner" shell as the Bakso section (rounded warm card,
 * title + description on the left, dish photo integrated on the right) — but the
 * product grid uses the thumbnail MenuCard so every item keeps its own photo.
 * Used for Rice Meal, À La Carte, Vegetables & Sides and Add-On / Sides.
 */
export function FeaturedThumbCategory({
  section,
  vegOnly,
  noImage,
}: {
  section: PlannerSection;
  vegOnly?: boolean;
  /** Render the product cards without per-item thumbnails (e.g. Add-On / Sides). */
  noImage?: boolean;
}) {
  const { t } = useLang();
  const items = sectionItems(section).filter((m) => (vegOnly ? showVegLeaf(m) : true));
  if (!items.length) return null;

  const labelKey = `menu.section.${section.id}.label`;
  const blurbKey = `menu.section.${section.id}.blurb`;
  const label = t(labelKey) === labelKey ? section.label : t(labelKey);
  const blurb = t(blurbKey) === blurbKey ? section.blurb : t(blurbKey);

  return (
    <section id={`sec-${section.id}`} data-section={section.id} className="scroll-mt-32">
      <div className="overflow-hidden rounded-[28px] border border-line-warm bg-secondary shadow-soft">
        {/* banner top: editorial text (left) + integrated dish photo (right) */}
        <div className="grid md:grid-cols-[1fr_minmax(0,1.05fr)]">
          <div className="relative z-[2] flex flex-col justify-center px-5 py-5 sm:px-6">
            <h2
              className="text-[clamp(1.6rem,3vw,2.35rem)] font-medium leading-tight text-heading"
              style={{ fontFamily: "var(--font-fraunces)" }}
            >
              {label}
            </h2>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-body">{blurb}</p>
          </div>

          {section.featuredImage && (
            <div className="relative h-[170px] w-full sm:h-[200px] md:h-auto md:min-h-[200px]">
              <Image
                src={section.featuredImage}
                alt={label}
                fill
                sizes="(max-width: 768px) 100vw, 480px"
                className="object-cover object-right"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 hidden bg-gradient-to-r from-secondary via-secondary/15 to-transparent md:block"
              />
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-secondary/70 to-transparent md:hidden"
              />
            </div>
          )}
        </div>

        {/* product cards (with thumbnails) along the bottom: 1 → 2 → 3 columns */}
        <div className="grid grid-cols-1 gap-2.5 px-4 pb-4 pt-1 sm:grid-cols-2 sm:gap-3 sm:px-5 sm:pb-5 xl:grid-cols-3">
          {items.map((item) => (
            <MenuCard key={item.id} item={item} noImage={noImage} />
          ))}
        </div>
      </div>
    </section>
  );
}
