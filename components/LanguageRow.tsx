"use client";

import { useLang } from "@/lib/i18n/LanguageProvider";
import { LANGS, LANG_LABELS } from "@/lib/i18n/translations";

/** Row of true-circle language buttons (BM / EN / 中文) for the mobile drawer. */
export function LanguageRow() {
  const { lang, setLang } = useLang();
  return (
    <div className="lang-row" role="group" aria-label="Language">
      {LANGS.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={`lang-row-btn ${lang === l ? "is-active" : ""}`}
        >
          {LANG_LABELS[l]}
        </button>
      ))}
    </div>
  );
}
