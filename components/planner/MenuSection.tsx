"use client";

import { MenuCard } from "./MenuCard";
import { sectionItems, isVegetarian, type PlannerSection } from "./sections";
import { useLang } from "@/lib/i18n/LanguageProvider";

/**
 * Standard category presentation (original design): heading, blurb and a grid
 * of per-item thumbnail cards. Used for Nasi Meals, À La Carte, Vegetables and
 * Add-Ons. No large featured hero image.
 */
export function MenuSection({ section, vegOnly }: { section: PlannerSection; vegOnly?: boolean }) {
  const { t } = useLang();
  const items = sectionItems(section).filter((m) => (vegOnly ? isVegetarian(m.id) : true));
  if (!items.length) return null;

  const labelKey = `menu.section.${section.id}.label`;
  const blurbKey = `menu.section.${section.id}.blurb`;
  const label = t(labelKey) === labelKey ? section.label : t(labelKey);
  const blurb = t(blurbKey) === blurbKey ? section.blurb : t(blurbKey);

  return (
    <section id={`sec-${section.id}`} data-section={section.id} className="scroll-mt-32 pt-2">
      <h2 className="text-[clamp(1.4rem,2vw,1.6rem)] text-heading" style={{ fontFamily: "var(--font-fraunces)" }}>
        {label}
      </h2>
      <p className="mt-1 text-sm text-ink-secondary">{blurb}</p>
      <div className="mt-4 grid gap-3.5 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <MenuCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
