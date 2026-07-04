"use client";

import { useEffect, useRef, useState } from "react";

/** Slim floating auto-hide scrollbar in MENUU blue. Desktop only. */
export function ModernScrollbar() {
  const thumbRef = useRef<HTMLDivElement | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [visible, setVisible] = useState(false);
  const [showBar, setShowBar] = useState(false);

  useEffect(() => {
    const updateScrollbar = () => {
      const doc = document.documentElement;
      const scrollTop = window.scrollY || doc.scrollTop;
      const scrollHeight = doc.scrollHeight;
      const clientHeight = doc.clientHeight;
      const maxScroll = scrollHeight - clientHeight;

      if (maxScroll <= 0) {
        setShowBar(false);
        return;
      }
      setShowBar(true);

      const trackHeight = window.innerHeight - 24;
      const thumbHeight = Math.max((clientHeight / scrollHeight) * trackHeight, 48);
      const maxThumbTop = trackHeight - thumbHeight;
      const thumbTop = (scrollTop / maxScroll) * maxThumbTop;

      if (thumbRef.current) {
        thumbRef.current.style.height = `${thumbHeight}px`;
        thumbRef.current.style.transform = `translateY(${thumbTop}px)`;
      }
    };

    const showScrollbar = () => {
      updateScrollbar();
      setVisible(true);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      hideTimerRef.current = setTimeout(() => setVisible(false), 1000);
    };

    updateScrollbar();
    window.addEventListener("scroll", showScrollbar, { passive: true });
    window.addEventListener("resize", updateScrollbar);
    return () => {
      window.removeEventListener("scroll", showScrollbar);
      window.removeEventListener("resize", updateScrollbar);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, []);

  if (!showBar) return null;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed right-2 top-3 z-[9999] hidden h-[calc(100vh-24px)] w-2.5 rounded-full transition-all duration-300 md:block ${
        visible ? "translate-x-0 opacity-100" : "translate-x-2 opacity-0"
      }`}
    >
      <div className="absolute inset-0 rounded-full bg-primary/5 backdrop-blur-sm" />
      <div
        ref={thumbRef}
        className="absolute left-[1px] top-0 w-2 rounded-full bg-gradient-to-b from-brand-600 to-brand-500 shadow-[0_0_14px_rgba(34,88,218,0.25)] transition-[height,transform] duration-75 ease-out"
      />
    </div>
  );
}
