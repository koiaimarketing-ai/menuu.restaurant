"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { useLang } from "@/lib/i18n/LanguageProvider";
import { useMealPlan } from "@/lib/meal-plan-store";

/**
 * Floating "jump to top" button. Appears after the user scrolls down and smoothly
 * returns to the top. Anchored bottom-LEFT on every breakpoint (desktop + mobile)
 * so it never collides with the bottom-right ambient toggle.
 *
 * On mobile it sits ABOVE the green sticky "View Meal Plan" CTA, which only shows
 * when the plan has items — so when the plan is empty it drops to the lower corner.
 * env(safe-area-inset-bottom) keeps it clear of the iOS browser bottom bar.
 *
 * Layering: content < green meal-plan bar (z-50) < back-to-top (z-80) < modals.
 */
export function BackToTop() {
  const { t } = useLang();
  const plan = useMealPlan();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 300);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The green "View Meal Plan" bar is present on mobile whenever the plan has items.
  const hasMealPlanButton = plan.count > 0;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label={t("misc.backToTop")}
      className={`back-to-top-btn fixed left-5 z-[80] grid h-11 w-11 place-items-center rounded-full bg-primary text-white shadow-lg transition-all duration-300 hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 lg:left-6 lg:bottom-6 lg:z-[70] ${
        hasMealPlanButton
          ? "bottom-[calc(96px_+_env(safe-area-inset-bottom))]"
          : "bottom-[calc(24px_+_env(safe-area-inset-bottom))]"
      } ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}
