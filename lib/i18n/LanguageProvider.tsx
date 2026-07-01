"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { DEFAULT_LANG, translations, type Lang } from "./translations";
import { dictPages } from "./dict-pages";
import { dictMenu } from "./dict-menu";
import { dictMisc } from "./dict-misc";

const STORAGE_KEY = "wj-lang";

// Merge the base dictionary with every area module into one lookup per language.
const MERGED: Record<Lang, Record<string, string>> = {
  en: { ...translations.en, ...dictPages.en, ...dictMenu.en, ...dictMisc.en },
  ms: { ...translations.ms, ...dictPages.ms, ...dictMenu.ms, ...dictMisc.ms },
  zh: { ...translations.zh, ...dictPages.zh, ...dictMenu.zh, ...dictMisc.zh },
};

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Default English (DEFAULT_LANG). Server + first client render both use it so
  // there is no hydration mismatch; a returning visitor's manually stored choice
  // is applied after mount. Never auto-detect browser/device language.
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Lang | null;
      if (stored && translations[stored]) setLangState(stored);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang === "zh" ? "zh-Hans" : lang;
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
  }, []);

  const t = useCallback(
    (key: string) => MERGED[lang][key] ?? MERGED.en[key] ?? key,
    [lang]
  );

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang(): Ctx {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used within a LanguageProvider");
  return ctx;
}
