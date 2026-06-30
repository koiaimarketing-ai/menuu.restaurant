"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MenuCard } from "./MenuCard";
import { BEVERAGE_GROUP, sectionItems, isVegetarian, type PlannerSection } from "./sections";
import { useLang } from "@/lib/i18n/LanguageProvider";

/**
 * Beverages as one featured top-level section containing four vertically-stacked
 * subsections. The capsule row only JUMPS to a subsection — it never filters or
 * hides the others (all remain visible on the page).
 */
export function BeverageGroup({ vegOnly }: { vegOnly?: boolean }) {
  const { t } = useLang();
  const railRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateArrows = () => {
    const el = railRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 2);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 2);
  };

  const jump = (id: string) => {
    const el = document.getElementById(`sec-${id}`);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 150, behavior: "smooth" });
  };

  return (
    <section id={`sec-${BEVERAGE_GROUP.id}`} data-section={BEVERAGE_GROUP.id} className="scroll-mt-32">
      <div className="overflow-hidden rounded-[24px] border border-[#dde4f7] bg-white shadow-soft">
        {/* full-width illustrated beverages banner (title + description baked in) */}
        {BEVERAGE_GROUP.featuredImage && (
          <Image
            src={BEVERAGE_GROUP.featuredImage}
            alt={t("menu.section.beverages.label")}
            width={2079}
            height={756}
            sizes="(max-width: 1024px) 100vw, 760px"
            className="block h-auto w-full"
          />
        )}

        {/* pill subsection tabs — horizontally scrollable, arrows on desktop overflow */}
        <div className="flex items-center gap-2 px-4 pt-3 sm:px-5">
          {!atStart && (
            <button
              onClick={() => railRef.current?.scrollBy({ left: -240, behavior: "smooth" })}
              aria-label={t("menu.bev.scrollLeft")}
              className="hidden h-8 w-8 shrink-0 place-items-center rounded-full border border-line-warm bg-white text-ink-secondary shadow-soft hover:bg-secondary md:grid"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}
          <div
            ref={railRef}
            onScroll={updateArrows}
            className="no-scrollbar flex flex-nowrap items-center gap-2 overflow-x-auto whitespace-nowrap py-0.5"
            style={{ overscrollBehaviorX: "contain", touchAction: "pan-x pan-y" }}
          >
            {BEVERAGE_GROUP.subsections.map((s) => (
              <button
                key={s.id}
                onClick={() => jump(s.id)}
                className="h-8 shrink-0 whitespace-nowrap rounded-full border border-line-light bg-white px-3.5 text-[13px] font-medium text-ink-primary transition-colors hover:border-green hover:bg-green-soft hover:text-green-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green/30"
              >
                {t(`menu.section.${s.id}.label`) === `menu.section.${s.id}.label`
                  ? s.label
                  : t(`menu.section.${s.id}.label`)}
              </button>
            ))}
          </div>
          {!atEnd && (
            <button
              onClick={() => railRef.current?.scrollBy({ left: 240, behavior: "smooth" })}
              aria-label={t("menu.bev.scrollRight")}
              className="hidden h-8 w-8 shrink-0 place-items-center rounded-full border border-line-warm bg-white text-ink-secondary shadow-soft hover:bg-secondary md:grid"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* subsections (all visible) */}
        <div className="space-y-4 px-4 pb-4 pt-3 sm:px-5 sm:pb-5">
          {BEVERAGE_GROUP.subsections.map((s) => (
            <BeverageSubsection key={s.id} section={s} vegOnly={vegOnly} />
          ))}
        </div>
      </div>
    </section>
  );
}

function BeverageSubsection({ section, vegOnly }: { section: PlannerSection; vegOnly?: boolean }) {
  const { t } = useLang();
  const items = sectionItems(section).filter((m) => (vegOnly ? isVegetarian(m.id) : true));
  if (!items.length) return null;

  const labelKey = `menu.section.${section.id}.label`;
  const label = t(labelKey) === labelKey ? section.label : t(labelKey);

  return (
    <section id={`sec-${section.id}`} data-section={section.id} className="scroll-mt-32">
      <h3 className="text-[15px] font-semibold text-heading" style={{ fontFamily: "var(--font-fraunces)" }}>
        {label}
      </h3>
      <div className="mt-2.5 grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3 xl:grid-cols-3">
        {items.map((item) => (
          <MenuCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
