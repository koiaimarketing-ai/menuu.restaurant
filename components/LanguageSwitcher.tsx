"use client";

import { useLang } from "@/lib/i18n/LanguageProvider";
import { LANGS, LANG_LABELS } from "@/lib/i18n/translations";

/** Compact segmented language switcher: [ BM | EN | 中文 ]. */
export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { lang, setLang } = useLang();
  return (
    <div
      role="group"
      aria-label="Language"
      className={`inline-flex shrink-0 items-center gap-0.5 rounded-full border border-[#dde4f7] bg-[#eef3ff] p-0.5 ${className}`}
    >
      {LANGS.map((l) => {
        const active = lang === l;
        return (
          <button
            key={l}
            type="button"
            onClick={() => setLang(l)}
            aria-pressed={active}
            className={`rounded-full px-2.5 py-1 text-xs font-bold leading-none transition-colors ${
              active ? "bg-[#2258da] text-white" : "text-[#6b7589] hover:text-[#2258da]"
            }`}
          >
            {LANG_LABELS[l]}
          </button>
        );
      })}
    </div>
  );
}
