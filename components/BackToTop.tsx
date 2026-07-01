"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { useLang } from "@/lib/i18n/LanguageProvider";

/**
 * Floating "jump to top" button. Appears after the user scrolls down and smoothly
 * returns to the top. All positioning/sizing/layering lives in the `.back-to-top-btn`
 * CSS class (globals.css): bottom-LEFT on every breakpoint, pinned a fixed 96px
 * above the bottom on mobile so it ALWAYS sits above the floating green CTA
 * (which is the same rounded shell on every page), and dropped to the low corner
 * on desktop. Plain CSS (not Tailwind arbitrary calc) keeps the safe-area math
 * reliable on Android Chrome. z-90: above the CTA (z-80), below modals (z-100+).
 */
export function BackToTop() {
  const { t } = useLang();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 300);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label={t("misc.backToTop")}
      className={`back-to-top-btn ${show ? "" : "is-hidden"}`}
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}
