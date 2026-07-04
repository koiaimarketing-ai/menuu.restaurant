"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";

// Fixed English alt text per step (independent of the UI language toggle).
const STEP_ALT = [
  "Google Search journey image",
  "Select Restaurant journey image",
  "Menu Browsing journey image",
  "Pre-Arrival Order journey image",
  "Restaurant Visit journey image",
];

const AUTO_CHANGE_MS = 5000;
const PAUSE_AFTER_INTERACTION_MS = 5 * 60 * 1000;

/** Auto-cycling customer-journey preview.
 *  - Advances every 5s; any interaction pauses auto-change for 5 minutes.
 *  - Auto-change NEVER scrolls the page; capsule scrollIntoView runs only on
 *    manual selection (horizontal, block:"nearest"). */
export function JourneyPreview({ title, steps }: { title: string; steps: readonly string[] }) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [mobile, setMobile] = useState(false);
  const [pauseUntil, setPauseUntil] = useState(0);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const capRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const pauseAutoChange = () => setPauseUntil(Date.now() + PAUSE_AFTER_INTERACTION_MS);

  const selectStep = (i: number) => {
    setActive(i);
    pauseAutoChange();
  };

  // Auto-advance — skipped while paused; never touches scroll.
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => {
      if (Date.now() < pauseUntil) return;
      setActive((v) => (v + 1) % steps.length);
    }, AUTO_CHANGE_MS);
    return () => clearInterval(id);
  }, [reduce, steps.length, pauseUntil]);

  // Mobile only: center the active capsule horizontally inside its own scroll
  // container. Uses scrollLeft only — never scrolls the page vertically.
  useEffect(() => {
    if (!window.matchMedia("(max-width: 767px)").matches) return;
    const container = scrollRef.current;
    const cap = capRefs.current[active];
    if (!container || !cap) return;
    const cRect = container.getBoundingClientRect();
    const capRect = cap.getBoundingClientRect();
    const left = container.scrollLeft + capRect.left - cRect.left - cRect.width / 2 + capRect.width / 2;
    container.scrollTo({ left, behavior: "smooth" });
  }, [active]);

  return (
    <div className="mt-12 overflow-hidden rounded-[2rem] border border-primary/15 bg-white/80 p-6 shadow-[0_26px_70px_rgba(34,88,218,0.12)] backdrop-blur sm:p-9">
      <p className="mx-auto max-w-3xl text-center text-lg font-bold leading-relaxed text-ink sm:text-xl">{title}</p>

      {/* capsule row — snap-scroll on mobile, centered on desktop, edge-faded */}
      <div
        ref={scrollRef}
        onTouchStart={pauseAutoChange}
        onScroll={pauseAutoChange}
        className="no-scrollbar mt-6 snap-x snap-mandatory overflow-x-auto py-3 [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)] md:overflow-x-visible"
      >
        <div className="mx-auto flex w-max items-center justify-center gap-2 px-[42%] md:px-4">
          {steps.map((label, i) => {
            const on = active === i;
            return (
              <div key={i} className="flex shrink-0 items-center gap-2">
                <button
                  ref={(el) => {
                    capRefs.current[i] = el;
                  }}
                  type="button"
                  onClick={() => selectStep(i)}
                  onMouseEnter={pauseAutoChange}
                  onFocus={pauseAutoChange}
                  aria-pressed={on}
                  className={`relative shrink-0 snap-center whitespace-nowrap rounded-full border text-[13px] font-bold transition-all duration-300 ease-out ${
                    on
                      ? "scale-110 border-transparent bg-gradient-to-br from-brand-600 to-brand-800 px-5 py-3 text-white shadow-[0_16px_38px_rgba(34,88,218,0.35)]"
                      : "border-primary/15 bg-soft-blue px-4 py-2 text-primary hover:-translate-y-0.5 hover:scale-[1.03] hover:border-primary-accent hover:bg-white hover:shadow-lg"
                  }`}
                >
                  {on && !reduce && (
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -inset-4 -z-10 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.4)_0%,rgba(59,130,246,0.16)_42%,transparent_72%)]"
                      style={{ animation: "capsule-glow-pulse 1.8s ease-in-out infinite" }}
                    />
                  )}
                  {label}
                </button>
                {i < steps.length - 1 && <ArrowRight className="h-3.5 w-3.5 shrink-0 text-primary-accent" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* image preview — mobile 2:3 (/Image), desktop 3:2 (journey-desktop-N.png); fades in place */}
      <div className="relative mx-auto mt-6 aspect-[2/3] w-full max-w-[380px] overflow-hidden rounded-[24px] border border-primary/15 bg-white shadow-[0_22px_60px_rgba(34,88,218,0.14)] md:aspect-[3/2] md:max-w-none">
        <Image
          key={`${mobile ? "m" : "d"}-${active}`}
          src={`/images/introduction/${mobile ? "" : "journey-desktop-"}${active + 1}.png`}
          alt={STEP_ALT[active] ?? steps[active]}
          fill
          sizes="(max-width: 767px) 92vw, 1100px"
          priority={active === 0}
          draggable={false}
          className={`object-cover object-center ${reduce ? "" : "journey-fade"}`}
        />
      </div>
    </div>
  );
}
