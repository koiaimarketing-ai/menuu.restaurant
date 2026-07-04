"use client";

/* "Phone orders still create extra workload" — card, rendered INSIDE the
 * "Customers are searching…" (market-problem) section.
 * Image assets (public path, case-sensitive):
 *   /images/introduction/overloaded-staff.webp
 *   /images/introduction/details-get-missed.webp
 *   /images/introduction/lost-sales.webp */

import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { useLang } from "@/components/introduction/providers/language-provider";
import { Reveal } from "@/components/introduction/ui/reveal";
import { Users, CircleX, ArrowRight, HelpCircle, Angry, CircleArrowDown } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

export function PhoneWorkload() {
  const { t } = useLang();
  const w = t.workload;
  const reduce = useReducedMotion();

  const parent: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
  };
  const rise: Variants = reduce
    ? { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.4 } } }
    : {
        hidden: { opacity: 0, y: 26 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
      };

  /* Shared premium image-card shell — depth, blue border, hover lift */
  const cardShell =
    "group relative z-10 overflow-hidden rounded-[30px] border border-primary/12 bg-white shadow-[0_18px_50px_rgba(37,99,235,0.10),inset_0_1px_0_rgba(255,255,255,0.9)] transition-all duration-500 ease-out hover:-translate-y-2 hover:scale-[1.01] hover:shadow-[0_26px_70px_rgba(37,99,235,0.18)]";

  return (
    <div className="relative">
      {/* soft blue glow behind the card */}
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-6 h-72 w-[80%] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />

      <motion.div
        variants={parent}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="relative rounded-[32px] border border-primary/12 bg-white/90 p-6 shadow-[0_40px_100px_-40px_rgba(34,88,218,0.28)] backdrop-blur sm:p-9 lg:p-12"
      >
        {/* ── Copy ── */}
        <div className="max-w-2xl">
          <motion.h2 variants={rise} className="text-[1.9rem] font-extrabold leading-[1.1] text-navy sm:text-4xl lg:text-[2.6rem]">
            {w.headlineLead} <span className="text-primary">{w.headlineAccent}</span>
          </motion.h2>
          <motion.p variants={rise} className="mt-5 max-w-xl text-base leading-relaxed text-body">
            {w.desc}
          </motion.p>
        </div>

        {/* ── Visual row — 3 evenly-spaced 1:1 image cards ── */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {/* overloaded staff */}
          <motion.figure variants={rise} className={cardShell}>
            <div className="relative aspect-square w-full">
              <Image src="/images/introduction/overloaded-staff.webp" alt={w.cards.overloaded.label} fill sizes="(max-width:640px) 90vw, (max-width:1024px) 45vw, 380px" className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]" />
            </div>
            <figcaption className="absolute inset-x-3 bottom-3 flex items-center gap-3 rounded-2xl bg-white/94 px-4 py-3 shadow-[0_10px_30px_rgba(8,17,39,0.14)] backdrop-blur">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500"><Users className="h-4.5 w-4.5" /></span>
              <span>
                <span className="block text-sm font-bold text-navy">{w.cards.overloaded.label}</span>
                <span className="block text-xs text-slate">{w.cards.overloaded.sub}</span>
              </span>
            </figcaption>
          </motion.figure>

          {/* details get missed */}
          <motion.figure variants={rise} className={cardShell}>
            <div className="relative aspect-square w-full">
              <Image src="/images/introduction/details-get-missed.webp" alt={w.cards.missed.label} fill sizes="(max-width:640px) 90vw, (max-width:1024px) 45vw, 380px" className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]" />
              {/* single decorative question badge, top-left — clear of the face */}
              <span className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-red-500 shadow-[0_10px_24px_rgba(8,17,39,0.18)]"><HelpCircle className="h-5 w-5" /></span>
            </div>
            <figcaption className="absolute inset-x-3 bottom-3 flex items-center gap-3 rounded-2xl bg-white/94 px-4 py-3 shadow-[0_10px_30px_rgba(8,17,39,0.14)] backdrop-blur">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500"><CircleX className="h-4.5 w-4.5" /></span>
              <span>
                <span className="block text-sm font-bold text-navy">{w.cards.missed.label}</span>
                <span className="block text-xs text-slate">{w.cards.missed.sub}</span>
              </span>
            </figcaption>
          </motion.figure>

          {/* lost sales — negative outcome (title only, no subtitle) */}
          <motion.figure variants={rise} className={cardShell}>
            <div className="relative aspect-square w-full">
              <Image src="/images/introduction/lost-sales.webp" alt={w.cards.ready.label} fill sizes="(max-width:640px) 90vw, (max-width:1024px) 45vw, 380px" className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]" />
              {/* red angry badge — frustration / negative outcome */}
              <span className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-red-500 text-white shadow-[0_12px_28px_rgba(239,68,68,0.4)]"><Angry className="h-5 w-5" /></span>
            </div>
            <figcaption className="absolute inset-x-3 bottom-3 flex items-center gap-3 rounded-2xl bg-white/94 px-4 py-3 shadow-[0_10px_30px_rgba(8,17,39,0.14)] backdrop-blur">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500"><CircleArrowDown className="h-4.5 w-4.5" /></span>
              <span className="text-sm font-bold text-navy">{w.cards.ready.label}</span>
            </figcaption>
          </motion.figure>
        </div>

        {/* ── CTA → scrolls to the big customer-journey image below ── */}
        <Reveal className="mt-12 flex justify-center">
          <a
            href="#customer-journey-image"
            className="group mx-auto flex w-fit max-w-[340px] items-center gap-4 rounded-full bg-white px-4 py-3 text-left shadow-[0_14px_40px_rgba(34,88,218,0.18)] ring-1 ring-primary/15 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_54px_rgba(34,88,218,0.3)] sm:px-5"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white transition-transform duration-300 group-hover:scale-110">
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </span>
            <span className="pr-1 text-sm font-extrabold leading-snug text-primary">{w.cta}</span>
          </a>
        </Reveal>
      </motion.div>
    </div>
  );
}
