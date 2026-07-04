"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Modern thin auto-hiding scroll indicator for mobile. The default browser
 * scrollbar is hidden (CSS, mobile only); this paints a slim brand-coloured pill
 * on the right that tracks scroll progress and fades out ~900ms after scrolling
 * stops. Pure visual — never changes layout, width or scroll behaviour.
 */
export function MobileScrollbar() {
  const pathname = usePathname();
  useEffect(() => {
    const bar = document.querySelector<HTMLElement>(".custom-scrollbar");
    if (!bar) return;
    let hideTimer: ReturnType<typeof setTimeout>;

    const update = () => {
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) {
        document.body.classList.remove("is-scrolling");
        return;
      }
      const progress = window.scrollY / docHeight;
      const maxMove = window.innerHeight - bar.offsetHeight - 20;
      bar.style.transform = `translateY(${progress * maxMove}px)`;
      document.body.classList.add("is-scrolling");
      clearTimeout(hideTimer);
      hideTimer = setTimeout(
        () => document.body.classList.remove("is-scrolling"),
        900
      );
    };

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      clearTimeout(hideTimer);
    };
  }, []);

  if (pathname?.startsWith("/introduction")) return null;
  return <div className="custom-scrollbar" aria-hidden="true" />;
}
