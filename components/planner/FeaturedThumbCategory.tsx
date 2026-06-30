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
      <div className="overflow-hidden rounded-[24px] border border-[#dde4f7] bg-white shadow-soft">
        {section.featuredImage &&
          (section.illustrationBanner ? (
            /* square food illustration → title text + contained illustration */
            <div className="flex items-center gap-4 bg-[#eef3ff] px-5 py-4 sm:gap-6 sm:px-6">
              <div className="min-w-0 flex-1">
                <h2 className="text-[clamp(1.5rem,3vw,2.2rem)] font-medium leading-tight text-heading" style={{ fontFamily: "var(--font-fraunces)" }}>
                  {label}
                </h2>
                <p className="mt-1.5 line-clamp-2 max-w-md text-sm leading-relaxed text-body">{blurb}</p>
              </div>
              <Image
                src={section.featuredImage}
                alt={label}
                width={1254}
                height={1254}
                sizes="160px"
                className="h-[104px] w-[104px] shrink-0 object-contain sm:h-[140px] sm:w-[140px]"
              />
            </div>
          ) : (
            /* full-width illustrated banner (title + description baked in) */
            <Image
              src={section.featuredImage}
              alt={label}
              width={2079}
              height={756}
              sizes="(max-width: 1024px) 100vw, 760px"
              className="block h-auto w-full"
            />
          ))}

        {/* product cards (with thumbnails): 1 → 2 → 3 columns */}
        <div className="grid grid-cols-1 gap-2.5 px-4 pb-4 pt-4 sm:grid-cols-2 sm:gap-3 sm:px-5 sm:pb-5 xl:grid-cols-3">
          {items.map((item) => (
            <MenuCard key={item.id} item={item} noImage={noImage} />
          ))}
        </div>
      </div>
    </section>
  );
}
