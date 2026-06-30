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
              {/* blend the photo's left edge into the warm section surface */}
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

        {/* compact product cards along the bottom: 1 → 3 → 4 columns */}
        <div className="grid grid-cols-1 gap-2.5 px-4 pb-4 pt-1 sm:grid-cols-3 sm:gap-3 sm:px-5 sm:pb-5 xl:grid-cols-4">
          {items.map((item) => (
            <OptionCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
