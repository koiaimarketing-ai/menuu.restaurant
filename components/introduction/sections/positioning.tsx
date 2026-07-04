"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useLang } from "@/components/introduction/providers/language-provider";
import { SectionHeading } from "@/components/introduction/ui/section";
import { Reveal } from "@/components/introduction/ui/reveal";
import { JourneyPreview } from "@/components/introduction/ui/journey-preview";
import { BookDemoCTA } from "@/components/introduction/ui/book-demo-cta";
import {
  ArrowRight,
  Star,
  Sparkles,
  Target,
  CreditCard,
  Wrench,
  Percent,
  Calculator,
  Tag,
  MapPin,
  Clock3,
  Store,
  TriangleAlert,
  CircleCheck,
  type LucideIcon,
} from "lucide-react";

const ROW_ICONS: LucideIcon[] = [Target, CreditCard, Wrench, Percent, Calculator, Tag, MapPin, Clock3, Store, TriangleAlert, CircleCheck];
const KEY_ROWS = [3, 4, 6, 7, 9, 10]; // txn fee, monthly eg, range, timing, weakness, best-choice

const EASE = [0.22, 1, 0.36, 1] as const;
const STAGE_IMAGES = ["/images/introduction/delivery.webp", "/images/introduction/dine-in-qr.webp", "/images/introduction/menuu.webp"];
const STAGE_ALT = [
  "Delivery platform food ordering",
  "Dine-in QR ordering system",
  "MENUU pre-arrival website order preview",
];

/** Tone per table cell: n=neutral, g=green advantage, b=red pain, h=blue MENUU highlight.
 *  Rows: purpose, subscription, setup, txn fee, monthly eg, price impact,
 *        range, timing, best-for, weakness, best-choice. */
const TONES: ("n" | "g" | "b" | "h")[][] = [
  ["n", "n", "h"],
  ["n", "b", "g"],
  ["n", "n", "h"],
  ["b", "b", "g"],
  ["b", "b", "g"],
  ["b", "n", "g"],
  ["n", "b", "g"],
  ["n", "n", "h"],
  ["n", "n", "h"],
  ["b", "b", "n"],
  ["n", "n", "g"],
];

const toneCls: Record<string, string> = {
  n: "text-ink",
  g: "font-semibold text-emerald-600",
  b: "text-red-500",
  h: "font-semibold text-primary",
};

export function Positioning() {
  const { t } = useLang();
  const p = t.positioning;
  const reduce = useReducedMotion();
  const [tab, setTab] = useState(0); // 0 = Compare All, 1 = Key Differences
  const shown = tab === 0 ? p.rows.map((_, i) => i) : KEY_ROWS;
  const [mobileCol, setMobileCol] = useState(2); // mobile segmented tab — MENUU default
  const [activeStage, setActiveStage] = useState(2); // mobile timeline — MENUU open by default

  const parent = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15, delayChildren: 0.15 } },
  };
  const card = reduce
    ? { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.4 } } }
    : {
        hidden: { opacity: 0, y: 30, scale: 0.96 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease: EASE } },
      };
  const dot = reduce
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : { hidden: { scale: 0, opacity: 0 }, visible: { scale: 1, opacity: 1, transition: { duration: 0.35, ease: EASE } } };
  const lineH = reduce
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : { hidden: { scaleX: 0 }, visible: { scaleX: 1, transition: { duration: 0.9, ease: "easeInOut" as const } } };
  const lineV = reduce
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : { hidden: { scaleY: 0 }, visible: { scaleY: 1, transition: { duration: 0.9, ease: "easeInOut" as const } } };
  const chip = reduce
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : { hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.35, ease: EASE } } };

  return (
    <section id="positioning" className="relative overflow-hidden bg-mist-50 py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading tag={p.tag} heading={p.heading} sub={p.sub} />

        {/* Mobile summary card */}
        <Reveal className="mt-8 lg:hidden">
          <div className="flex items-center justify-center gap-2 rounded-2xl border border-primary bg-soft-blue px-4 py-3 text-sm font-bold text-primary">
            <Star className="h-4 w-4 fill-primary text-primary" />
            {p.summary}
          </div>
        </Reveal>

        {/* Timeline + stage cards (desktop / tablet) */}
        <motion.div
          variants={parent}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="relative mt-10 hidden md:block lg:mt-16"
        >
          {/* horizontal connector (desktop) */}
          <motion.div
            variants={lineH}
            className="absolute left-[15%] right-[19%] top-[15px] hidden h-0.5 origin-left rounded-full bg-primary-accent/50 lg:block"
          />
          <motion.span
            variants={dot}
            className="absolute right-[16.5%] top-[7px] hidden text-primary lg:block"
            aria-hidden="true"
          >
            <ArrowRight className="h-4 w-4" strokeWidth={3} />
          </motion.span>
          {/* vertical connector (mobile) */}
          <motion.div
            variants={lineV}
            className="absolute bottom-10 left-[15px] top-1 w-0.5 origin-top rounded-full bg-primary-accent/50 lg:hidden"
          />

          <div className="grid gap-8 lg:grid-cols-[1fr_1fr_1.2fr] lg:items-start lg:gap-6">
            {p.stages.map((s, i) => {
              const hero = i === 2;
              return (
                <div key={i} className="relative pl-11 lg:flex lg:flex-col lg:items-center lg:pl-0">
                  {/* numbered dot */}
                  <motion.span
                    variants={dot}
                    className={`absolute left-0 top-0 z-10 flex h-8 w-8 items-center justify-center rounded-full text-sm font-extrabold lg:static ${
                      hero
                        ? "bg-primary text-white shadow-[var(--shadow-cta)]"
                        : "border border-border-blue bg-white text-primary"
                    }`}
                  >
                    {i + 1}
                  </motion.span>

                  {/* stage label */}
                  <motion.p
                    variants={chip}
                    className={`mt-1 text-[10px] font-extrabold tracking-[0.18em] lg:mt-3 lg:text-center ${
                      hero ? "text-primary" : "text-slate"
                    }`}
                  >
                    {s.label}
                  </motion.p>

                  {/* card */}
                  <motion.div
                    variants={card}
                    whileHover={reduce ? undefined : { y: -6 }}
                    transition={{ duration: 0.22, ease: EASE }}
                    className={`group relative mt-2 w-full rounded-3xl lg:mt-3 ${
                      hero
                        ? "border border-primary-accent/60 bg-white p-3 shadow-[0_24px_70px_rgba(34,88,218,0.35)] lg:origin-top lg:scale-[1.03]"
                        : "border border-border-blue bg-white p-3 shadow-[var(--shadow-soft)]"
                    }`}
                  >
                    {hero && (
                      /* soft glow behind the card */
                      <div
                        aria-hidden="true"
                        className="absolute -inset-4 -z-10 rounded-[2.4rem] bg-primary/25 blur-3xl"
                      />
                    )}

                    {/* image only — full image, no crop, no text overlay */}
                    <div className="relative aspect-[3/2] w-full overflow-hidden rounded-[1.2rem] bg-white">
                      {/* Recommended badge — top-left inside the image box */}
                      {hero && (
                        <span className="intro-cta-shine absolute left-5 top-5 z-20 inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-primary px-4 py-1.5 text-[11px] font-bold text-white shadow-md">
                          <Star className="h-3 w-3 fill-white" /> {p.recommended}
                        </span>
                      )}
                      <Image
                        src={STAGE_IMAGES[i]}
                        alt={STAGE_ALT[i]}
                        fill
                        sizes="(max-width: 1024px) 92vw, 420px"
                        draggable={false}
                        className="object-contain object-center"
                      />
                    </div>

                    {/* recommended next action — desktop only */}
                    {hero && <BookDemoCTA size="md" className="pt-4 pb-1" />}
                  </motion.div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Timeline — mobile: number stepper + single reserved-height stage (no layout shift) */}
        <div className="mt-8 md:hidden">
          {/* number stepper */}
          <div className="flex items-center justify-center">
            {p.stages.map((s, i) => {
              const on = activeStage === i;
              return (
                <div key={i} className="flex items-center">
                  <button
                    type="button"
                    onClick={() => setActiveStage(i)}
                    aria-pressed={on}
                    aria-label={s.title}
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-extrabold transition-all duration-300 ${
                      on
                        ? "scale-110 bg-primary text-white shadow-[0_14px_32px_rgba(34,88,218,0.34),0_0_28px_rgba(34,88,218,0.24)]"
                        : "border border-primary/35 bg-white text-primary shadow-sm"
                    }`}
                  >
                    {i + 1}
                  </button>
                  {i < p.stages.length - 1 && (
                    <span className={`mx-1.5 h-0.5 w-8 rounded-full ${activeStage > i ? "bg-primary/50" : "bg-primary/20"}`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* active label */}
          <p className="mt-3 text-center text-[10px] font-extrabold uppercase tracking-[0.16em] text-primary">
            {p.stages[activeStage].label}
          </p>

          {/* reserved-height card stage — active card only, absolute layer, swaps in place */}
          <div className="relative mt-3 aspect-[3/2] overflow-visible">
            {/* Recommended badge — top-left inside the image card */}
            {activeStage === 2 && (
              <span className="absolute left-4 top-4 z-20 inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-[10px] font-bold text-white shadow-md">
                <Star className="h-2.5 w-2.5 fill-white" /> {p.recommended}
              </span>
            )}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStage}
                initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 14, filter: "blur(8px)" }}
                animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: -8, filter: "blur(6px)" }}
                transition={{ duration: 0.28, ease: EASE }}
                className={`absolute inset-0 overflow-hidden rounded-3xl ${
                  activeStage === 2
                    ? "border border-primary-accent/60 shadow-[0_24px_70px_rgba(34,88,218,0.35)]"
                    : "border border-border-blue shadow-[var(--shadow-soft)]"
                }`}
              >
                <Image src={STAGE_IMAGES[activeStage]} alt={STAGE_ALT[activeStage]} fill sizes="92vw" draggable={false} className="object-cover object-center" />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ============ Quick Comparison board ============ */}
        <div id="comparison" className="mt-14 scroll-mt-24 rounded-[2.25rem] border border-primary/15 bg-white/80 p-5 shadow-[0_28px_70px_rgba(34,88,218,0.12)] backdrop-blur sm:p-7">
          {/* header */}
          <div className="grid grid-cols-[1fr_auto] items-start gap-3">
            <div className="min-w-0">
              <h3 className="flex items-center gap-2 text-xl font-bold text-navy sm:text-2xl">
                <Sparkles className="h-5 w-5 shrink-0 text-primary" /> {p.tableTitle}
              </h3>
              <div className="mt-3 inline-flex flex-wrap gap-2">
                {p.tabs.map((tb, ti) => (
                  <button
                    key={ti}
                    type="button"
                    onClick={() => setTab(ti)}
                    aria-pressed={tab === ti}
                    className={`rounded-xl px-4 py-2 text-xs font-bold transition-colors ${
                      tab === ti ? "bg-primary text-white" : "border border-primary/15 bg-white text-primary hover:bg-soft-blue"
                    }`}
                  >
                    {tb}
                  </button>
                ))}
              </div>
            </div>
            <a
              href="#offer"
              className="inline-flex shrink-0 items-center gap-1.5 justify-self-end whitespace-nowrap rounded-full border border-primary/18 bg-white px-3 py-2 text-xs font-extrabold text-primary shadow-[0_10px_24px_rgba(34,88,218,0.08)] transition-colors hover:bg-soft-blue sm:px-4"
            >
              <Star className="h-3.5 w-3.5 fill-primary text-primary" /> {p.whyBtn}
            </a>
          </div>

          {/* desktop grid board */}
          <div className="relative mt-6 hidden md:block">
            <div className="pointer-events-none absolute -inset-y-4 right-0 -z-10 w-[36%] rounded-[2.75rem] bg-primary/25 blur-3xl" />
            <div className="grid grid-cols-[188px_1fr_1fr_1.55fr] gap-x-3 gap-y-0">
              {/* header row */}
              <div />
              {p.cols.map((c, ci) => {
                const hero = ci === 2;
                return (
                  <div
                    key={ci}
                    className={`relative border-x border-t px-4 font-bold ${
                      hero
                        ? "rounded-t-[28px] border-primary/30 bg-gradient-to-br from-brand-600 to-brand-800 pb-5 pt-7 text-base text-white"
                        : "rounded-t-2xl border-border-blue bg-white/70 pb-3 pt-5 text-sm text-navy"
                    }`}
                  >
                    {hero && (
                      <span className="absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 whitespace-nowrap rounded-full bg-primary px-3 py-1 text-[10px] font-extrabold text-white shadow-[var(--shadow-cta)] ring-1 ring-white/40">
                        <Star className="h-3 w-3 fill-white" /> {p.recommended.toUpperCase()}
                      </span>
                    )}
                    {c}
                  </div>
                );
              })}

              {/* data rows */}
              {shown.map((ri, order) => {
                const r = p.rows[ri];
                const Icon = ROW_ICONS[ri];
                const last = order === shown.length - 1;
                return (
                  <div key={ri} className="contents">
                    <div className={`flex items-center gap-2 py-3.5 pr-2 text-[11px] font-bold uppercase tracking-wide text-slate ${last ? "" : "border-b border-primary/10"}`}>
                      <Icon className="h-4 w-4 shrink-0 text-primary/70" /> {r.label}
                    </div>
                    {r.values.map((v, ci) => {
                      const hero = ci === 2;
                      const tone = TONES[ri][ci];
                      // MENUU body: blue text → black bold; keep green for savings.
                      const txt = hero ? (tone === "g" ? "text-emerald-600 font-bold" : "text-navy font-bold") : toneCls[tone];
                      return (
                        <div
                          key={ci}
                          className={`border-x px-4 py-3.5 text-[12.5px] leading-snug ${txt} ${
                            hero ? "border-primary/30 bg-white" : "border-border-blue bg-white/70"
                          } ${last ? (hero ? "rounded-b-[28px] border-b shadow-[0_34px_60px_-20px_rgba(34,88,218,0.4)]" : "rounded-b-2xl border-b") : "border-b border-primary/10"}`}
                        >
                          {v}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>

          {/* mobile segmented tabs — pick a column, 2-col rows below */}
          <div className="md:hidden">
            {/* segmented control — one sliding blue capsule behind the active tab */}
            <div className="relative mx-auto mt-6 flex w-full max-w-md rounded-full border border-primary/15 bg-soft-blue/80 p-1 shadow-sm">
              {p.colsShort.map((s, ci) => {
                const on = mobileCol === ci;
                return (
                  <button
                    key={ci}
                    type="button"
                    onClick={() => setMobileCol(ci)}
                    aria-pressed={on}
                    className="relative flex-1 rounded-full px-3 py-2.5 text-xs font-bold sm:text-sm"
                  >
                    {on && (
                      <motion.span
                        layoutId="cmp-tab-pill"
                        transition={{ type: "spring", stiffness: 420, damping: 32 }}
                        className="absolute inset-0 rounded-full bg-primary shadow-lg shadow-primary/25"
                      />
                    )}
                    <span className={`relative z-10 transition-colors duration-300 ${on ? "text-white" : "text-ink"}`}>
                      {s}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* selected column content */}
            <div className="mt-4 overflow-hidden rounded-3xl border border-border-blue bg-white shadow-[var(--shadow-soft)]">
              <div className={`flex items-center justify-between gap-2 px-5 py-3.5 ${mobileCol === 2 ? "bg-gradient-to-r from-brand-600 to-brand-700" : "bg-mist-50"}`}>
                <span className={`text-sm font-bold ${mobileCol === 2 ? "text-white" : "text-navy"}`}>{p.cols[mobileCol]}</span>
                {mobileCol === 2 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[9px] font-bold text-primary">
                    <Star className="h-2.5 w-2.5 fill-primary text-primary" /> {p.recommended}
                  </span>
                )}
              </div>
              <AnimatePresence mode="wait">
                <motion.dl
                  key={mobileCol}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, x: -12 }}
                  transition={{ duration: 0.28, ease: EASE }}
                  className="divide-y divide-primary/10 px-5 py-1"
                >
                  {shown.map((ri) => {
                    const r = p.rows[ri];
                    const tone = TONES[ri][mobileCol];
                    const cls = mobileCol === 2 ? (tone === "g" ? "text-emerald-600 font-bold" : "text-navy font-bold") : toneCls[tone];
                    return (
                      <div key={ri} className="grid grid-cols-[42%_58%] gap-3 py-3">
                        <dt className="text-[11px] font-bold uppercase leading-tight tracking-wide text-slate">{r.label}</dt>
                        <dd className={`text-[13px] leading-snug ${cls}`}>{r.values[mobileCol]}</dd>
                      </div>
                    );
                  })}
                </motion.dl>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Desktop-only Book Demo CTA below the Quick Comparison board */}
        <BookDemoCTA className="mt-8 mb-6" />

        {/* Auto-cycling customer-journey preview (below the comparison) */}
        <div id="how" className="scroll-mt-24">
          <JourneyPreview title={p.closing} steps={p.journey} />
        </div>
      </div>
    </section>
  );
}
