"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/components/introduction/providers/language-provider";
import { waUrl } from "@/lib/introduction/content";
import { useBookDemo } from "@/components/introduction/ui/book-demo-modal";
import { MessageCircle, CalendarCheck } from "lucide-react";

/** Mobile-only sticky CTA bar. Appears after the user scrolls past the hero. */
export function StickyCta() {
  const { t } = useLang();
  const { openBookDemo } = useBookDemo();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 560);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-50 lg:hidden transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        show ? "translate-y-0" : "translate-y-[120%]"
      }`}
      style={{ paddingBottom: "max(env(safe-area-inset-bottom), 0px)" }}
    >
      <div className="glass mx-3 mb-3 flex items-center gap-2 rounded-2xl border border-line p-2 shadow-[var(--shadow-card)]">
        <a
          href={waUrl(t.waMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-white text-sm font-semibold text-ink-900 ring-1 ring-line active:scale-[0.97]"
        >
          <MessageCircle className="h-4 w-4 text-brand-600" />
          WhatsApp
        </a>
        <button
          type="button"
          onClick={openBookDemo}
          className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-brand-600 text-sm font-bold text-white shadow-[var(--shadow-cta)] active:scale-[0.97]"
        >
          <CalendarCheck className="h-4 w-4" />
          {t.stickyCta}
        </button>
      </div>
    </div>
  );
}
