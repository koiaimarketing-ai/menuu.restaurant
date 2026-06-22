"use client";

import { useEffect, useRef, useState } from "react";
import { useLang } from "@/lib/i18n/LanguageProvider";
import { LANGS, LANG_LABELS } from "@/lib/i18n/translations";

/** Main language circle that, on click, drops its language options as floating
 *  circles stacked vertically beneath it (no rectangle panel). */
export function LanguageCircle({ className = "" }: { className?: string }) {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className={`language-dropdown ${open ? "open" : ""} ${className}`}>
      <button
        type="button"
        className="language-main"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Language"
      >
        {LANG_LABELS[lang]}
      </button>

      <div className="language-options" role="listbox" aria-label="Choose language">
        {LANGS.filter((l) => l !== lang).map((l) => (
          <button
            key={l}
            type="button"
            role="option"
            aria-selected={false}
            tabIndex={open ? 0 : -1}
            onClick={() => {
              setLang(l);
              setOpen(false);
            }}
            className="language-option"
          >
            {LANG_LABELS[l]}
          </button>
        ))}
      </div>
    </div>
  );
}
