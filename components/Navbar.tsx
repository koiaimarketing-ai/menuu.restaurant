"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Menu,
  X,
  ArrowRight,
  Home,
  BookOpen,
  MapPin,
  Heart,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import { useMealPlan } from "@/lib/meal-plan-store";
import { computeTotals, fmtRM } from "@/lib/planner";
import { getLocation } from "@/data/locations";
import { getLiveStatus } from "@/lib/operating-status";
import { useBackdropDismiss } from "@/lib/use-backdrop-dismiss";
import { useLang } from "@/lib/i18n/LanguageProvider";
import type { TKey } from "@/lib/i18n/translations";
import { LanguageCircle } from "@/components/LanguageCircle";
import { LanguageRow } from "@/components/LanguageRow";

const links: { href: string; key: TKey; icon: typeof Home }[] = [
  { href: "/", key: "nav.home", icon: Home },
  { href: "/menu", key: "nav.menu", icon: BookOpen },
  { href: "/our-story", key: "nav.story", icon: Heart },
  { href: "/contact", key: "nav.contact", icon: MapPin },
];

export function Navbar() {
  const pathname = usePathname();
  const plan = useMealPlan();
  const { t } = useLang();
  const reduce = useReducedMotion() ?? false;
  const [open, setOpen] = useState(false);
  const backdrop = useBackdropDismiss(() => setOpen(false));

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const onPlanner = pathname.startsWith("/menu");
  const totals = computeTotals(plan.items);

  // Lock background scroll while the overlay is open; overflow:hidden on body
  // preserves the scroll position automatically. Always restore on close/unmount.
  useEffect(() => {
    if (!open) return;
    const { overflow, touchAction } = document.body.style;
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";
    // Marks the open state for global CSS (locks html scroll + hides the
    // floating back-to-top button so it never sits above the menu).
    document.documentElement.classList.add("menu-open");
    document.body.classList.add("menu-open");
    return () => {
      document.body.style.overflow = overflow;
      document.body.style.touchAction = touchAction;
      document.documentElement.classList.remove("menu-open");
      document.body.classList.remove("menu-open");
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    const mq = window.matchMedia("(min-width: 1080px)");
    const onChange = () => mq.matches && setOpen(false);
    mq.addEventListener("change", onChange);
    return () => {
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onChange);
    };
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-40 pt-4 sm:pt-3">
      <div className="container-site">
        {/* Full-width pill containing logo + nav + CTA.
            `relative` anchors the absolutely-centred mobile meal-plan pill. */}
        <div className="relative flex h-16 flex-nowrap items-center gap-3 rounded-full border border-white/55 bg-white/70 px-4 pl-4 shadow-[0_8px_30px_rgba(58,30,26,0.12)] backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-white/60 sm:pl-5 min-[1080px]:gap-[clamp(12px,1.5vw,26px)]">
          {/* Brand */}
          <Link href="/" className="relative z-[2] flex shrink-0 items-center gap-2.5" aria-label="Warung Jakarta home">
            <Image
              src="/images/logo.png"
              alt="Warung Jakarta"
              width={48}
              height={48}
              className="h-10 w-10 rounded-full"
              priority
            />
            <span className="hidden flex-col leading-none sm:flex">
              <span className="brand-name text-base">Warung Jakarta</span>
              <span className="brand-tagline mt-0.5 whitespace-nowrap text-[9px]">Rasa Original Jakarta</span>
            </span>
          </Link>

          {/* Nav — desktop only, single row, never wraps */}
          <nav aria-label="Main navigation" className="hidden min-w-0 flex-1 flex-nowrap items-center justify-center gap-[clamp(8px,1.3vw,24px)] whitespace-nowrap min-[1080px]:flex">
            {links.map((l) => {
              const active = isActive(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative shrink-0 whitespace-nowrap py-2 text-[clamp(13px,0.95vw,15px)] font-medium transition-colors ${
                    active ? "text-primary" : "text-ink-primary hover:text-primary"
                  }`}
                >
                  {t(l.key)}
                  {active && (
                    <span className="absolute inset-x-0 -bottom-0.5 h-0.5 rounded-full bg-primary" aria-hidden />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop actions (≥1080px) — a fixed-width, always-present column so the
              centred nav never shifts.
              • On the planner page → "View Meal Plan" button, ALWAYS visible
                (even when the plan is empty → "0 · RM 0.00"). The count/price
                badge reserves a fixed width with tabular figures so the button's
                dimensions never change as items are added.
              • Elsewhere → "Explore Menu Now". */}
          <div className="hidden shrink-0 items-center justify-end gap-3 whitespace-nowrap min-[1080px]:flex">
            {onPlanner ? (
              <button
                type="button"
                onClick={plan.openReceipt}
                aria-label={`View meal plan. ${plan.count} items. Total ${fmtRM(totals.grandTotal)}`}
                className="cta-whatsapp inline-flex h-12 cursor-pointer items-center justify-center whitespace-nowrap rounded-full px-6 text-sm font-bold tabular-nums transition-all hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]/40 focus-visible:ring-offset-2"
              >
                {plan.count} · {fmtRM(totals.grandTotal)}
              </button>
            ) : (
              <Link
                href="/menu"
                className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
              >
                {t("nav.exploreMenuNow")} <ArrowRight className="h-4 w-4" />
              </Link>
            )}
            {/* Language circle — always the last item on the right */}
            <LanguageCircle />
          </div>

          {/* (Mobile meal-plan capsule removed — the bottom sticky MobileMealBar
              pill is the single mobile meal-plan CTA now.) */}

          {/* Mobile toggle (<1080px) */}
          <button
            type="button"
            className="relative z-[2] ml-auto inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary text-heading min-[1080px]:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t("nav.closeMenu") : t("nav.openMenu")}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile overlay drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-[100] min-[1080px]:hidden"
            style={{
              height: "100dvh",
              padding:
                "max(14px, env(safe-area-inset-top)) 14px max(14px, env(safe-area-inset-bottom))",
              background: "rgba(38, 26, 22, 0.22)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
            }}
            initial={reduce ? { opacity: 0 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            {...backdrop}
          >
            <motion.div
              className="flex h-full w-full flex-col overflow-y-auto rounded-3xl border border-[#F0E6E0] bg-white shadow-[0_20px_60px_rgba(58,30,26,0.16)]"
              style={{ overscrollBehavior: "contain", WebkitOverflowScrolling: "touch" }}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
              transition={{ duration: 0.2, ease: [0.22, 0.8, 0.2, 1] }}
            >
              {/* Header: logo left, close right */}
              <div className="flex items-center justify-between px-5 pb-2 pt-4">
                <Link
                  href="/"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5"
                  aria-label="Warung Jakarta home"
                >
                  <Image
                    src="/images/logo.png"
                    alt="Warung Jakarta"
                    width={44}
                    height={44}
                    className="h-10 w-10 rounded-full"
                  />
                  <span className="brand-name text-[17px]">Warung Jakarta</span>
                </Link>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close navigation menu"
                  className="grid h-12 w-12 place-items-center rounded-full border border-[rgba(58,30,26,0.10)] bg-white text-[#3a1e1a] shadow-soft"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Nav links — clean white cards */}
              <nav className="mt-2 space-y-2 px-4" aria-label="Mobile navigation">
                {links.map((l) => {
                  const active = isActive(l.href);
                  const Icon = l.icon;
                  return (
                    <Link
                      key={l.href}
                      href={l.href}
                      onClick={() => setOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={`grid min-h-[64px] grid-cols-[32px_1fr_24px] items-center gap-4 rounded-2xl border px-5 ${
                        active ? "border-[#F2CFC7] bg-[#FCEDEA]" : "border-[#F0E6E0] bg-white"
                      }`}
                    >
                      <Icon className={`h-6 w-6 ${active ? "text-[#E24A34]" : "text-[#3A2A20]"}`} />
                      <span
                        className={`text-[17px] ${
                          active ? "font-semibold text-[#E24A34]" : "font-medium text-[#3A2A20]"
                        }`}
                      >
                        {t(l.key)}
                      </span>
                      <ChevronRight className={`h-5 w-5 ${active ? "text-[#E24A34]" : "text-[#a89a92]"}`} />
                    </Link>
                  );
                })}
              </nav>

              {/* Language switcher — true circles */}
              <div className="px-5 pt-5">
                <LanguageRow />
              </div>

              {/* Primary CTA */}
              <div className="px-5 pt-4">
                <Link
                  href="/menu"
                  onClick={() => setOpen(false)}
                  className="flex h-[58px] w-full items-center justify-center gap-2 rounded-full bg-primary text-base font-semibold text-white transition-colors hover:bg-primary-hover"
                >
                  {t("nav.exploreMenu")} <ArrowRight className="h-5 w-5" />
                </Link>
                <p className="mt-2 text-center text-sm text-[#6B5E5A]">{t("nav.discover")}</p>
              </div>

              {/* Dynamic branch-status card */}
              <BranchStatusCard onNavigate={() => setOpen(false)} />

              <div className="flex-1" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/* ---- Dynamic branch status — only renders when there's something useful to say ---- */
function BranchStatusCard({ onNavigate }: { onNavigate: () => void }) {
  const { t } = useLang();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null; // status depends on current time — compute client-side only

  const ss4 = getLocation("ss4");
  const klcw = getLocation("kl-central-walk");
  if (!ss4 || !klcw) return null;

  const ss4Open = getLiveStatus(ss4).kind === "open";
  const klcw_ = getLiveStatus(klcw);
  const klcwClosed =
    klcw_.kind === "closed" || klcw_.kind === "closed-day" || klcw_.kind === "opens-later";

  let title: string | null = null;
  let action: string | null = null;
  let actionIsSs4Link = false;

  if (klcw_.kind === "closing-soon") {
    title = t("status.klcwClosingSoon");
    if (ss4Open) {
      action = t("status.viewSs4");
      actionIsSs4Link = true;
    }
  } else if (klcwClosed) {
    if (ss4Open) {
      title = t("status.klcwClosed");
      action = t("status.viewSs4");
      actionIsSs4Link = true;
    } else {
      // both closed — show the next known opening instead of suggesting availability
      title = t("status.bothClosed");
      action = klcw_.nextOpen ? `${t("status.klcwReopens")} ${klcw_.nextOpen}` : null;
    }
  }

  if (!title) return null;

  return (
    <div className="px-5 pt-4">
      <div className="rounded-2xl border border-[#F2CFC7] bg-[#FFF7F5] p-4">
        <div className="flex items-start gap-2.5">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#E24A34]" />
          <div className="text-sm text-[#C94B35]">
            <p className="font-semibold">{title}</p>
            {action &&
              (actionIsSs4Link ? (
                <Link
                  href="/menu"
                  onClick={onNavigate}
                  className="mt-1 inline-block font-semibold text-primary underline"
                >
                  {action}
                </Link>
              ) : (
                <p className="mt-1 text-[#7a5620]">{action}</p>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
