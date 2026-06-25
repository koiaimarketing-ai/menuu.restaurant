"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { useLang } from "@/lib/i18n/LanguageProvider";

/**
 * Floating "jump to top" button. Appears after the user scrolls down a screenful
 * and smoothly returns to the top. Anchored bottom-left so it never collides with
 * the ambient-sound toggle / meal-plan capsule on the bottom-right.
 */
export function BackToTop() {
  const { t } = useLang();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label={t("misc.backToTop")}
      className={`back-to-top-btn fixed right-4 bottom-[96px] z-[55] grid h-[46px] w-[46px] place-items-center rounded-full bg-primary text-white shadow-lg transition-all duration-300 hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 sm:left-6 sm:right-auto sm:bottom-6 sm:z-[70] sm:h-11 sm:w-11 ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}
