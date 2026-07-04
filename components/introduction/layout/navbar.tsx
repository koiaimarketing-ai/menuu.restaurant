"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useLang } from "@/components/introduction/providers/language-provider";
import { LanguageToggle } from "@/components/introduction/ui/language-toggle";
import { Button } from "@/components/introduction/ui/button";
import { Logo } from "@/components/introduction/ui/logo";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const { t } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scrollspy — position-based so it can't stick on one section.
  // Sections vary wildly in height (e.g. #problem is huge), so comparing raw
  // IntersectionObserver ratios is unreliable; instead pick the last section
  // whose top has scrolled above a fixed line just below the sticky navbar.
  useEffect(() => {
    const ids = t.nav.links.map((l) => l.href.replace("#", ""));
    let raf = 0;

    const compute = () => {
      raf = 0;
      const line = 120; // px below the sticky navbar
      // null while above the first section (hero) → no capsule.
      // Last id whose top crossed the line wins, so nested #comparison/#how
      // (inside #positioning) correctly override their parent.
      let current: string | null = null;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      // Bottom of the page → force the last item (short sections never cross the line).
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
        current = ids[ids.length - 1];
      }
      setActive(current);
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [t.nav.links]);

  // Close the mobile menu on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open ? "glass border-b border-line py-2" : "bg-transparent py-3"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <a href="#top" aria-label="MENUU home" className="shrink-0">
          <Logo />
        </a>

        {/* desktop links — sliding active capsule */}
        <div className="hidden items-center gap-1 lg:flex">
          {t.nav.links.map((l) => {
            const id = l.href.replace("#", "");
            const on = active === id;
            return (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setActive(id)}
                aria-current={on ? "true" : undefined}
                className="relative rounded-full px-3.5 py-2 text-sm font-semibold transition-colors duration-300"
              >
                {on && (
                  <motion.span
                    layoutId="nav-pill"
                    transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 30 }}
                    className="absolute inset-0 rounded-full bg-brand-600 shadow-[0_8px_24px_rgba(37,99,235,0.25)]"
                  />
                )}
                <span className={`relative z-10 transition-colors duration-300 ${on ? "text-white" : "text-navy hover:text-brand-600"}`}>
                  {l.label}
                </span>
              </a>
            );
          })}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageToggle />
          <span className="hidden lg:inline-flex">
            <Button href="#contact" size="md">
              {t.nav.demo}
            </Button>
          </span>

          {/* rounded burger — mobile / tablet only */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line bg-white text-ink-900 shadow-sm transition-colors hover:bg-mist-50 lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* mobile dropdown panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, height: "auto" }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden lg:hidden"
          >
            <div className="mx-auto max-w-6xl px-4 pb-4 pt-2 sm:px-6">
              <div className="flex flex-col gap-1 rounded-3xl border border-line bg-white p-2 shadow-[var(--shadow-card)]">
                {t.nav.links.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="rounded-2xl px-4 py-3 text-sm font-semibold text-ink-900 transition-colors hover:bg-mist-50 hover:text-brand-600"
                  >
                    {l.label}
                  </a>
                ))}
                <span className="mt-1 px-1 pb-1">
                  <Button href="#contact" size="md" className="w-full" onClick={() => setOpen(false)}>
                    {t.nav.demo}
                  </Button>
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
