"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useLang } from "@/lib/i18n/LanguageProvider";

const BRANCH_FRAMES = [
  {
    label: "KLCW",
    src: "/images/klcw-branch.png",
    alt: "Warung Jakarta KLCW — restaurant frontage with outdoor seating and signage",
  },
  {
    label: "SS4",
    src: "/images/ss4-branch.png",
    alt: "Warung Jakarta SS4 — warm wooden dining room",
  },
];

/* ---------------- handcrafted line-art icons ---------------- */
const ICON = {
  stroke: "currentColor",
  strokeWidth: 1.7,
  fill: "none",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function BowlSpoon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} {...ICON} width="100%" height="100%">
      <path d="M5 15h22a11 11 0 0 1-22 0Z" />
      <path d="M3.5 15h25" />
      <path d="M22 4.5c-1.6 1.2-1.6 3 0 4.2s1.6 3 0 4.2" />
      <path d="M26 5.5c-1.2 1-1.2 2.4 0 3.4s1.2 2.4 0 3.4" />
    </svg>
  );
}
function Chilli({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} {...ICON} width="100%" height="100%">
      <path d="M7 22c7 4 16 1 18-7 .4-1.6-1.4-2.6-2.6-1.5-2.4 2.2-6 3-9.4 1.8" />
      <path d="M22 13c1.2-2 3-2.8 5-2.6-1 1.8-1 3.4-.4 4.8" />
    </svg>
  );
}
function LeafIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} {...ICON} width="100%" height="100%">
      <path d="M25 7C13 7 7 13 7 25c12 0 18-6 18-18Z" />
      <path d="M11 21 23 9" />
    </svg>
  );
}
function MortarIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} {...ICON} width="100%" height="100%">
      <path d="M7 14h18a9 9 0 0 1-9 9 9 9 0 0 1-9-9Z" />
      <path d="M16 23v4M11 27h10" />
      <path d="M19 6 13.5 12" />
    </svg>
  );
}
function HeartIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} width="100%" height="100%" fill="currentColor" stroke="currentColor" strokeWidth={1.4} strokeLinejoin="round">
      <path d="M16 27S5 20 5 12.5A5.5 5.5 0 0 1 16 9a5.5 5.5 0 0 1 11 3.5C27 20 16 27 16 27Z" />
    </svg>
  );
}
const features = [
  { Icon: Chilli, titleKey: "pages.ourStory.feat1Title", body: ["pages.ourStory.feat1Body1", "pages.ourStory.feat1Body2"] },
  { Icon: LeafIcon, titleKey: "pages.ourStory.feat2Title", body: ["pages.ourStory.feat2Body1", "pages.ourStory.feat2Body2"] },
  { Icon: MortarIcon, titleKey: "pages.ourStory.feat3Title", body: ["pages.ourStory.feat3Body1", "pages.ourStory.feat3Body2"] },
  { Icon: HeartIcon, titleKey: "pages.ourStory.feat4Title", body: ["pages.ourStory.feat4Body1", "pages.ourStory.feat4Body2"] },
];

/* ---------------- batik pattern (right edge) ---------------- */
function BatikEdge() {
  return (
    <div
      className="pointer-events-none absolute inset-y-0 right-0 hidden md:block w-[220px] lg:w-[280px]"
      aria-hidden="true"
      style={{
        WebkitMaskImage: "linear-gradient(to left, #000, transparent)",
        maskImage: "linear-gradient(to left, #000, transparent)",
      }}
    >
      <svg className="h-full w-full" style={{ opacity: 0.12, color: "#D13827" }} aria-hidden="true">
        <defs>
          <pattern id="batik" width="56" height="56" patternUnits="userSpaceOnUse" patternTransform="rotate(8)">
            <path d="M28 8c8 4 12 12 0 20-12-8-8-16 0-20Z" fill="none" stroke="currentColor" strokeWidth="1.3" />
            <circle cx="28" cy="28" r="3" fill="currentColor" />
            <circle cx="4" cy="4" r="2" fill="currentColor" />
            <circle cx="52" cy="52" r="2" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#batik)" />
      </svg>
    </div>
  );
}

export function OurStory() {
  const { t } = useLang();
  const reduce = useReducedMotion() ?? false;
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => setFrame((f) => (f + 1) % BRANCH_FRAMES.length), 4500);
    return () => clearInterval(t);
  }, [reduce]);
  const branch = BRANCH_FRAMES[frame];

  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-60px" },
          transition: { duration: 0.55, delay, ease: [0.22, 0.8, 0.2, 1] as const },
        };

  return (
    <section
      className="
        relative z-[2] isolate overflow-hidden
        rounded-t-[30px] md:rounded-t-[56px]
        bg-secondary
        pt-[clamp(220px,32vw,500px)]
        pb-14 md:pb-20
        shadow-[0_-22px_60px_-24px_rgba(209,56,39,0.16),0_-10px_34px_-18px_rgba(58,30,26,0.18),inset_0_2px_30px_rgba(58,30,26,0.04)]
      "
    >
      {/* full-section background: the 2nd-section artwork (cover, undistorted) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20"
        style={{
          backgroundImage: "url('/images/2nd-section.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      {/* warm readability overlay (kept off the outlet image box, which sits in content) */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[rgba(255,248,239,0.72)]" />

      <BatikEdge />

      <div className="container-site relative">
        {/* ---- two-column story ---- */}
        <div className="grid lg:grid-cols-[40%_minmax(0,1fr)] gap-10 lg:gap-16 items-center">
          {/* left column */}
          <div>
            <motion.span {...rise(0)} className="inline-flex items-center gap-3 eyebrow">
              {t("pages.ourStory.eyebrow")}
              <span className="h-px w-10 bg-primary/70" aria-hidden />
            </motion.span>

            <motion.h2
              {...rise(0.08)}
              className="mt-4 text-[clamp(2.1rem,4.6vw,3.5rem)] text-heading"
              style={{ fontFamily: "var(--font-fraunces)", fontWeight: 500, lineHeight: 1.02, letterSpacing: "-0.01em" }}
            >
              {t("pages.ourStory.title1")}
              <br className="hidden sm:block" /> {t("pages.ourStory.title2")}
            </motion.h2>

            <motion.div {...rise(0.16)} className="mt-6 flex gap-3.5 max-w-md">
              <span className="h-9 w-9 shrink-0 text-primary mt-0.5">
                <BowlSpoon className="h-full w-full" />
              </span>
              <p className="text-body leading-[1.6] text-[16px]">
                {t("pages.ourStory.body")}
              </p>
            </motion.div>

            <motion.div {...rise(0.22)} className="mt-7">
              <Link href="/our-story" className="read-story-link">
                {t("pages.ourStory.readLink")} <span className="arrow" aria-hidden="true">→</span>
              </Link>
            </motion.div>
          </div>

          {/* right image — auto-rotates between KLCW and SS4 with a branch capsule */}
          <motion.div
            initial={reduce ? undefined : { opacity: 0, scale: 0.97 }}
            whileInView={reduce ? undefined : { opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="group relative overflow-hidden rounded-[28px] lg:rounded-[34px]"
            style={{ boxShadow: "0 22px 50px rgba(58,30,26,0.10), 0 4px 12px rgba(58,30,26,0.05)" }}
          >
            <div className="relative aspect-[3/2] w-full">
              <AnimatePresence mode="sync">
                <motion.div
                  key={branch.src}
                  initial={reduce ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={reduce ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  <Image
                    src={branch.src}
                    alt={branch.alt}
                    fill
                    sizes="(max-width:1024px) 100vw, 560px"
                    priority
                    className="object-cover transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.015]"
                  />
                </motion.div>
              </AnimatePresence>

              {/* branch capsule */}
              <div className="absolute left-3 top-3 z-10">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={branch.label}
                    initial={reduce ? false : { opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? undefined : { opacity: 0, y: -4 }}
                    transition={{ duration: 0.3 }}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-heading shadow-soft backdrop-blur"
                  >
                    <MapPin className="h-3.5 w-3.5 text-primary" />
                    {branch.label}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ---- divider ---- */}
        <div className="mt-12 md:mt-16 h-px bg-line-warm" />

        {/* ---- four value items ---- */}
        <div className="mt-10 grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-line-warm">
          {features.map(({ Icon, titleKey, body }, i) => (
            <motion.div
              key={titleKey}
              {...rise(0.05 * i)}
              className="flex items-start gap-3.5 lg:px-6 first:lg:pl-0 py-2"
            >
              <span className="h-12 w-12 shrink-0 grid place-items-center rounded-full bg-[#F04438] text-white shadow-[0_8px_20px_rgba(240,68,56,0.22)]">
                <span className="h-5 w-5">
                  <Icon className="h-full w-full" />
                </span>
              </span>
              <div>
                <p className="font-semibold text-heading">{t(titleKey)}</p>
                <p className="text-sm text-body leading-snug">
                  {t(body[0])}
                  <br />
                  {t(body[1])}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
