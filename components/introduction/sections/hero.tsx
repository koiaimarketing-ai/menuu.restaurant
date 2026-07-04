"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useLang } from "@/components/introduction/providers/language-provider";
import { Button } from "@/components/introduction/ui/button";
import { PhonePreview } from "@/components/introduction/phone/phone-preview";
import { waUrl } from "@/lib/introduction/content";
import { useBookDemo } from "@/components/introduction/ui/book-demo-modal";
import { Check, CalendarCheck, MessageCircle, Sparkles, BadgeCheck } from "lucide-react";

export function Hero() {
  const { t } = useLang();
  const { openBookDemo } = useBookDemo();
  const reduce = useReducedMotion();
  const h = t.hero;

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
  };
  const item = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 22 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <section id="top" className="relative overflow-hidden bg-white pt-24 pb-10 sm:pt-28 lg:pb-16">
      <div className="bg-radial-brand absolute inset-0" />
      <div className="bg-grid absolute inset-0 opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent_70%)]" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-8">
        {/* Left — message */}
        <motion.div variants={container} initial="hidden" animate="show" className="text-center lg:text-left">
          <motion.div variants={item} className="flex justify-center lg:justify-start">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-brand-700 shadow-[var(--shadow-soft)] ring-1 ring-line">
              <Sparkles className="h-3.5 w-3.5 text-brand-500" />
              {h.pill}
            </span>
          </motion.div>

          <motion.h1
            variants={item}
            className="mt-5 text-[2rem] font-extrabold leading-[1.08] text-ink-900 sm:text-5xl lg:text-[3.4rem]"
          >
            {h.headline}
          </motion.h1>

          <motion.p variants={item} className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-body sm:text-lg lg:mx-0">
            {h.sub}
          </motion.p>

          <motion.ul variants={item} className="mx-auto mt-6 grid max-w-xl gap-2.5 text-left sm:grid-cols-2 lg:mx-0">
            {h.bullets.map((b, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm font-medium text-ink-800">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
                {b}
              </li>
            ))}
          </motion.ul>

          <motion.div variants={item} className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
            <Button size="lg" className="w-full sm:w-auto" onClick={openBookDemo}>
              <CalendarCheck className="h-5 w-5" />
              {h.primary}
            </Button>
            <Button href={waUrl(t.waMessage)} external size="lg" variant="secondary" className="w-full sm:w-auto">
              <MessageCircle className="h-5 w-5 text-brand-600" />
              {h.secondary}
            </Button>
          </motion.div>

          <motion.div variants={item} className="mt-7 flex flex-wrap justify-center gap-2 lg:justify-start">
            {h.badges.map((b, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 rounded-full bg-mist-100 px-3 py-1.5 text-xs font-semibold text-ink-700 ring-1 ring-line"
              >
                <BadgeCheck className="h-3.5 w-3.5 text-brand-500" />
                {b}
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* Right — phone */}
        <div className="relative flex justify-center lg:justify-end">
          {/* glow + decorative laptop hint behind */}
          <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-400/20 blur-3xl" />
          <div className="absolute right-2 top-16 hidden h-64 w-72 rotate-6 rounded-2xl border border-line bg-white/70 shadow-[var(--shadow-soft)] backdrop-blur sm:block lg:right-0" />

          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 40, rotate: -2 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <PhonePreview />

            {/* Floating chips (motion.div = position + entrance; inner div = gentle float) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute -left-6 top-20 hidden sm:block lg:-left-10"
            >
              <div className="hero-badge-float flex flex-col gap-1 rounded-2xl bg-brand-600 px-5 py-4 shadow-[0_16px_40px_rgba(37,99,235,0.28)]">
                <span className="text-3xl font-extrabold leading-none text-white">{h.stats[1].value}</span>
                <span className="text-xs font-medium text-white/90">{h.stats[1].label}</span>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.85, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute -right-5 bottom-24 hidden sm:block lg:-right-12"
            >
              <div className="hero-badge-float hero-badge-float-delayed flex flex-col gap-1 rounded-2xl bg-brand-600 px-5 py-4 shadow-[0_16px_40px_rgba(37,99,235,0.28)]">
                <span className="text-3xl font-extrabold leading-none text-white">{h.stats[0].value}</span>
                <span className="text-xs font-medium text-white/90">{h.stats[0].label}</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Stat strip */}
      <div className="relative mx-auto mt-14 grid max-w-3xl grid-cols-3 gap-4 px-4 sm:px-6">
        {h.stats.map((s, i) => {
          const blue = i === 1; // 0% transaction fees — highlighted card
          return (
            <div
              key={i}
              className={`group relative overflow-hidden rounded-2xl p-4 text-center transition-all duration-300 ease-out ${
                blue
                  ? "border border-[#AFC4FF]/30 bg-[#2F5BEE] shadow-[0_20px_50px_rgba(47,91,238,0.28)] hover:-translate-y-2 hover:scale-[1.03] hover:bg-[#234EDC] hover:shadow-[0_30px_60px_rgba(47,91,238,0.38)]"
                  : "border border-line bg-white/70 backdrop-blur"
              }`}
            >
              {blue && (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 -translate-x-full bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.18),transparent)] transition-transform duration-700 ease-out group-hover:translate-x-full"
                />
              )}
              <p className={`relative text-2xl font-extrabold sm:text-3xl ${blue ? "!text-white" : "text-brand-600"}`}>{s.value}</p>
              <p className={`relative mt-1 text-xs sm:text-sm ${blue ? "text-white/85" : "text-body"}`}>{s.label}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
