"use client";

import Image from "next/image";
import { OptionCard } from "./OptionCard";
import { sectionItems, isVegetarian, type PlannerSection } from "./sections";
import { useLang } from "@/lib/i18n/LanguageProvider";

/**
 * Style A — compact "featured food banner" (Image 1 reference):
 *  • one rounded rectangular section on a warm surface,
 *  • category title + short description on the left,
 *  • the dish photo integrated on the right (object-cover, blended into the
 *    section with a soft warm gradient),
 *  • compact text-only product cards arranged along the bottom.
 * Far shorter than the previous full-width hero. All meal-plan logic is via the
 * unchanged OptionCard. Used for Mie Ayam, Bakso, Gorengan and Roti Bakar.
 */
export function FeaturedMenuCategory({ section, vegOnly }: { section: PlannerSection; vegOnly?: boolean }) {
  const { t } = useLang();
  const items = sectionItems(section).filter((m) => (vegOnly ? isVegetarian(m.id) : true));
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

        {/* compact product cards: 1 → 3 → 4 columns */}
        <div className="grid grid-cols-1 gap-2.5 px-4 pb-4 pt-4 sm:grid-cols-3 sm:gap-3 sm:px-5 sm:pb-5 xl:grid-cols-4">
          {items.map((item) => (
            <OptionCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
