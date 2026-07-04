"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { content, type Dict, type Lang } from "@/lib/introduction/content";

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Dict;
};

const LanguageContext = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  // Hydrate from storage / browser on mount
  useEffect(() => {
    const stored = (typeof window !== "undefined" && localStorage.getItem("menuu-lang")) as Lang | null;
    if (stored && Object.prototype.hasOwnProperty.call(content, stored)) {
      setLangState(stored);
      return;
    }
    const nav = typeof navigator !== "undefined" ? navigator.language.toLowerCase() : "en";
    if (nav.startsWith("ms")) setLangState("ms");
    else if (nav.startsWith("zh")) setLangState("zh");
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("menuu-lang", l);
  };

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang === "ms" ? "ms" : lang === "zh" ? "zh" : "en";
    }
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: content[lang] as Dict }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
}
