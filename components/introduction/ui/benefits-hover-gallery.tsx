"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const IMAGES = [
  "/images/introduction/Benefit 01.png",
  "/images/introduction/Benefit 02.png",
  "/images/introduction/Benefit 03.png",
  "/images/introduction/Benefit 04.png",
  "/images/introduction/Benefit 05.png",
];

type Item = { title: string; desc: string };
type Dims = { active: number; inactive: number; height: number };

const DESKTOP: Dims = { active: 460, inactive: 82, height: 500 };

const AUTO_CHANGE_MS = 5000;
const PAUSE_AFTER_INTERACTION_MS = 5 * 60 * 1000;

/* Deterministic sparkle positions (fixed → no SSR/client mismatch). */
const SPARKLES = [
  { top: "16%", left: "32%", dur: 2.6, delay: 0 },
  { top: "38%", left: "64%", dur: 3.2, delay: 0.7 },
  { top: "62%", left: "36%", dur: 2.9, delay: 1.2 },
  { top: "82%", left: "60%", dur: 3.5, delay: 0.4 },
];

/** Benefits gallery.
 *  Desktop (md+): Skiper-style horizontal hover-expand — unchanged.
 *  Mobile (<md): vertical stacked tap-expand cards.
 *  Auto-advances every 5s; any interaction pauses auto-change for 5 minutes. */
export function BenefitsHoverGallery({ items }: { items: readonly Item[] }) {
  const [active, setActive] = useState(0);
  const [dims, setDims] = useState<Dims>(DESKTOP);
  const [interacting, setInteracting] = useState(false);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 1024) setDims({ active: 360, inactive: 64, height: 460 });
      else setDims(DESKTOP);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Auto-advance every 5s; paused while interacting or reduced-motion.
  useEffect(() => {
    if (interacting || reduce) return;
    const id = setInterval(() => setActive((v) => (v + 1) % IMAGES.length), AUTO_CHANGE_MS);
    return () => clearInterval(id);
  }, [interacting, reduce]);

  useEffect(() => () => { if (resumeTimer.current) clearTimeout(resumeTimer.current); }, []);

  // Any interaction → pause 5 minutes, then resume from the current card.
  const pauseNow = () => {
    setInteracting(true);
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => setInteracting(false), PAUSE_AFTER_INTERACTION_MS);
  };
  const select = (index: number) => {
    setActive(index);
    pauseNow();
  };

  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="relative mt-14"
    >
      {/* ============ Desktop / tablet: horizontal hover-expand (unchanged) ============ */}
      <div
        onTouchStart={pauseNow}
        onScroll={pauseNow}
        className="hidden w-full items-center justify-center gap-3 px-2 pb-6 pt-2 md:flex"
      >
        {IMAGES.map((src, index) => {
          const isActive = active === index;
          const item = items[index];
          return (
            <div key={src} className="relative shrink-0">
              {/* soft brand glow behind the active card */}
              <motion.div
                aria-hidden="true"
                animate={{ opacity: isActive ? 0.8 : 0 }}
                transition={{ duration: reduce ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="pointer-events-none absolute -inset-6 rounded-[3rem] bg-[radial-gradient(circle_at_center,rgba(34,88,218,0.30),transparent_70%)] blur-2xl"
              />

              <motion.button
                type="button"
                onMouseEnter={() => select(index)}
                onFocus={() => select(index)}
                onClick={() => select(index)}
                aria-label={item?.title ?? `Benefit ${index + 1}`}
                aria-pressed={isActive}
                className={`relative cursor-pointer overflow-hidden rounded-[2rem] border bg-mist-50 outline-none transition-[border-color,box-shadow] duration-300 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 ${
                  isActive
                    ? "border-primary-accent/60 shadow-[0_24px_60px_-16px_rgba(34,88,218,0.35)]"
                    : "border-white/40 shadow-[0_10px_40px_rgba(8,17,39,0.08)]"
                }`}
                animate={{ width: isActive ? dims.active : dims.inactive }}
                style={{ height: dims.height }}
                transition={reduce ? { duration: 0 } : { duration: 0.42, ease: [0.25, 0.8, 0.25, 1] }}
              >
                <Image
                  src={src}
                  alt={item?.title ?? `Benefit ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 78vw, 460px"
                  draggable={false}
                  className={`object-cover transition-[filter] duration-500 ${
                    isActive ? "" : "brightness-[0.94] grayscale-[0.18]"
                  }`}
                />

                {/* frosted-glass overlay on inactive cards */}
                <motion.div
                  aria-hidden="true"
                  animate={{ opacity: isActive ? 0 : 1 }}
                  transition={{ duration: reduce ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="pointer-events-none absolute inset-0 border border-white/30 bg-white/25 backdrop-blur-[4px]"
                />

                {/* subtle twinkling sparkles on inactive cards */}
                <AnimatePresence>
                  {!isActive && !reduce && (
                    <motion.div
                      aria-hidden="true"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="pointer-events-none absolute inset-0"
                    >
                      {SPARKLES.map((sp, si) => (
                        <motion.span
                          key={si}
                          animate={{ opacity: [0.15, 0.75, 0.15], scale: [0.8, 1.15, 0.8] }}
                          transition={{ duration: sp.dur, delay: sp.delay, repeat: Infinity, ease: "easeInOut" }}
                          className="absolute h-[3px] w-[3px] rounded-full bg-white shadow-[0_0_6px_2px_rgba(255,255,255,0.55)]"
                          style={{ top: sp.top, left: sp.left }}
                        />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* bottom scrim + label on active card */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy/25 via-transparent to-transparent"
                    />
                  )}
                </AnimatePresence>
                <AnimatePresence>
                  {isActive && item && (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 12 }}
                      transition={{ duration: 0.25 }}
                      className="pointer-events-none absolute bottom-4 left-4 max-w-[85%] rounded-full bg-white/85 px-4 py-2 text-xs font-bold text-primary shadow-sm backdrop-blur-md"
                    >
                      {item.title}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          );
        })}
      </div>

      {/* ============ Mobile: vertical tap-expand stack ============ */}
      <div className="flex flex-col gap-3 md:hidden" onTouchStart={pauseNow}>
        {IMAGES.map((src, index) => {
          const isActive = active === index;
          const item = items[index];
          return (
            <motion.button
              key={src}
              type="button"
              onClick={() => select(index)}
              aria-label={item?.title ?? `Benefit ${index + 1}`}
              aria-pressed={isActive}
              animate={{ height: isActive ? 410 : 68 }}
              transition={reduce ? { duration: 0 } : { duration: 0.35, ease: "easeInOut" }}
              className={`relative w-full overflow-hidden text-left outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                isActive
                  ? "rounded-[2rem] border border-primary-accent/60 bg-mist-50 shadow-[0_24px_60px_-16px_rgba(34,88,218,0.35)]"
                  : "rounded-[2rem] border border-white/40 bg-mist-50 shadow-[0_10px_40px_rgba(8,17,39,0.08)]"
              }`}
            >
              {isActive ? (
                /* active: bright full image + small capsule label (like desktop) */
                <>
                  <Image
                    src={src}
                    alt={item?.title ?? `Benefit ${index + 1}`}
                    fill
                    sizes="92vw"
                    draggable={false}
                    className="object-cover object-top"
                  />
                  <motion.span
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.15 }}
                    className="pointer-events-none absolute bottom-4 left-4 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-primary shadow-md backdrop-blur-md"
                  >
                    {item?.title}
                  </motion.span>
                </>
              ) : (
                /* collapsed: same as desktop inactive — dimmed image + light frost + white sparkles */
                <>
                  <Image
                    src={src}
                    alt=""
                    aria-hidden="true"
                    fill
                    sizes="92vw"
                    draggable={false}
                    className="object-cover object-center brightness-[0.94] grayscale-[0.18]"
                  />
                  <div className="pointer-events-none absolute inset-0 border border-white/30 bg-white/25 backdrop-blur-[4px]" />
                  {!reduce && (
                    <span aria-hidden="true" className="pointer-events-none absolute inset-0 z-[2]">
                      {SPARKLES.map((sp, si) => (
                        <motion.span
                          key={si}
                          animate={{ opacity: [0.15, 0.75, 0.15], scale: [0.8, 1.15, 0.8] }}
                          transition={{ duration: sp.dur, delay: sp.delay, repeat: Infinity, ease: "easeInOut" }}
                          className="absolute h-[3px] w-[3px] rounded-full bg-white shadow-[0_0_6px_2px_rgba(255,255,255,0.55)]"
                          style={{ top: sp.top, left: `${16 + si * 20}%` }}
                        />
                      ))}
                    </span>
                  )}
                  {/* same small capsule label as the active card, for tap identity */}
                  <span className="absolute left-4 top-1/2 z-[3] -translate-y-1/2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-primary shadow-md backdrop-blur-md">
                    {item?.title}
                  </span>
                </>
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
