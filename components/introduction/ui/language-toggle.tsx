"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useLang } from "@/components/introduction/providers/language-provider";
import { LANGS, type Lang } from "@/lib/introduction/content";
import { Globe } from "lucide-react";

/** Collapsed: a single rounded pill showing the active language.
 *  Open: the pill expands to reveal all three languages.
 *  Selecting one switches language and collapses again.
 *  Closes on outside-click and Escape. */
export function LanguageToggle({ className = "" }: { className?: string }) {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);

  const active = LANGS.find((l) => l.id === lang) ?? LANGS[0];

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const pick = (l: Lang) => {
    setLang(l);
    setOpen(false);
  };

  return (
    <div ref={ref} className={`relative shrink-0 ${className}`}>
      <motion.div
        layout
        transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }}
        className="flex items-center rounded-full bg-mist-100 p-0.5 ring-1 ring-line"
      >
        <AnimatePresence initial={false} mode="popLayout">
          {open ? (
            LANGS.map((l) => {
              const on = l.id === lang;
              return (
                <motion.button
                  key={l.id}
                  layout
                  initial={reduce ? false : { opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduce ? undefined : { opacity: 0, scale: 0.85 }}
                  transition={{ duration: 0.18 }}
                  onClick={() => pick(l.id)}
                  aria-pressed={on}
                  className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold transition-colors duration-200 ${
                    on ? "bg-brand-600 text-white shadow-sm" : "text-body hover:text-ink-900"
                  }`}
                >
                  {l.short}
                </motion.button>
              );
            })
          ) : (
            <motion.button
              key="collapsed"
              layout
              initial={reduce ? false : { opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduce ? undefined : { opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.18 }}
              onClick={() => setOpen(true)}
              aria-label={`Change language — current: ${active.label}`}
              aria-expanded={open}
              className="flex items-center gap-1 whitespace-nowrap rounded-full bg-brand-600 px-2.5 py-1 text-xs font-semibold text-white shadow-sm"
            >
              <Globe className="h-3.5 w-3.5" />
              {active.short}
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
