"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Leaf } from "lucide-react";
import { TOP_NAV_SECTIONS } from "./sections";
import { useLang } from "@/lib/i18n/LanguageProvider";

export function CategoryPills({
  vegOnly,
  onToggleVeg,
}: {
  vegOnly: boolean;
  onToggleVeg: () => void;
}) {
  const { t } = useLang();
  const [active, setActive] = useState(TOP_NAV_SECTIONS[0].id);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const railRef = useRef<HTMLDivElement>(null);

  // active category via IntersectionObserver
  useEffect(() => {
    const sections = TOP_NAV_SECTIONS.map((s) => document.getElementById(`sec-${s.id}`)).filter(
      Boolean
    ) as HTMLElement[];
    if (!sections.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const vis = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (vis[0]) setActive(vis[0].target.id.replace("sec-", ""));
      },
      { rootMargin: "-180px 0px -70% 0px" }
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  const updateArrows = () => {
    const el = railRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 2);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 2);
  };
  useEffect(() => {
    updateArrows();
    const el = railRef.current;
    el?.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el?.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, []);

  // keep active pill in view — scroll ONLY the rail horizontally.
  // scrollIntoView would resolve block:"nearest" against the pill's natural
  // (un-sticky) document position and yank the whole page back up, which made
  // the page feel like it couldn't scroll to the bottom.
  useEffect(() => {
    const rail = railRef.current;
    const pill = rail?.querySelector<HTMLElement>(`[data-pill="${active}"]`);
    if (!rail || !pill) return;
    const railRect = rail.getBoundingClientRect();
    const pillRect = pill.getBoundingClientRect();
    const scrollOffset =
      pill.offsetLeft - rail.offsetLeft - railRect.width / 2 + pillRect.width / 2;
    rail.scrollTo({ left: scrollOffset, behavior: "smooth" });
  }, [active]);

  const nudge = (dir: number) => railRef.current?.scrollBy({ left: dir * 300, behavior: "smooth" });

  const jump = (id: string) => {
    const el = document.getElementById(`sec-${id}`);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 150, behavior: "smooth" });
  };

  return (
    <div className="menu-category-sticky">
      {/* Frosted glass pill — settles below the navbar when sticky. */}
      <div className="menu-category-sticky-inner">
        <div className="relative z-[1] flex items-center gap-2 px-2 py-1.5">
          {/* Left arrow — desktop only; shown when the rail is scrolled right. */}
          {!atStart && (
            <button
              onClick={() => nudge(-1)}
              aria-label={t("menu.pills.scrollLeft")}
              className="hidden h-10 w-10 shrink-0 place-items-center rounded-full border border-[#dde4f7] bg-white text-ink-secondary shadow-soft transition-colors hover:bg-secondary md:grid"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}

          <div className="min-w-0 flex-1">
            <div
              ref={railRef}
              className="category-scroll px-1 py-1"
              style={{ touchAction: "pan-x pan-y" }}
            >
              {TOP_NAV_SECTIONS.map((s) => (
                <button
                  key={s.id}
                  data-pill={s.id}
                  onClick={() => jump(s.id)}
                  aria-current={active === s.id ? "true" : undefined}
                  className={`h-10 shrink-0 whitespace-nowrap rounded-full border px-4 text-sm font-medium transition-colors ${
                    active === s.id
                      ? "border-green bg-green text-white"
                      : "border-line-light bg-white text-ink-primary hover:border-green"
                  }`}
                >
                  {t(`menu.section.${s.id}.label`) === `menu.section.${s.id}.label`
                    ? s.label
                    : t(`menu.section.${s.id}.label`)}
                </button>
              ))}

              {/* vegetarian filter — same row, same height */}
              <button
                onClick={onToggleVeg}
                aria-pressed={vegOnly}
                className={`inline-flex h-10 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-4 text-sm font-semibold transition-colors ${
                  vegOnly ? "border-green bg-green text-white" : "border-[#A7E1C1] bg-[#F0FFF6] text-[#087A3E] hover:bg-[#e6fbef]"
                }`}
              >
                <Leaf className="h-4 w-4" /> {t("menu.pills.vegFriendly")}
              </button>
            </div>
          </div>

          {/* Right arrow — desktop only; shown when more categories remain. */}
          {!atEnd && (
            <button
              onClick={() => nudge(1)}
              aria-label={t("menu.pills.scrollRight")}
              className="hidden h-10 w-10 shrink-0 place-items-center rounded-full border border-[#dde4f7] bg-white text-ink-secondary shadow-soft transition-colors hover:bg-secondary md:grid"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {vegOnly && (
        <p className="mt-2 px-1 text-center text-xs text-ink-muted">
          {t("menu.pills.vegNote")}
        </p>
      )}
    </div>
  );
}
