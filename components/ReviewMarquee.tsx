"use client";

import { useEffect, useRef } from "react";
import { Star } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { reviews, type Review } from "@/data/reviews";
import { useLang } from "@/lib/i18n/LanguageProvider";

/**
 * Premium two-row testimonial marquee.
 *  • Row 1 drifts right→left (~38s), Row 2 left→right (~44s), both linear & seamless.
 *  • Looping uses a duplicated, aria-hidden second set + a Web Animations API
 *    transform animation (translate3d, GPU-friendly, no React state churn).
 *  • Desktop: hovering a row gently ramps its speed down; hovering a card lifts,
 *    scales and tilts it within ±1.5° following the pointer.
 *  • Touch: drag a row without breaking the marquee — it resumes on release.
 *  • prefers-reduced-motion: animation off, rows become horizontally scrollable.
 */

// Two genuinely different orderings so the rows never show the same card in the
// same position (row two is reversed, then rotated).
const ROW_ONE: Review[] = reviews;
const half = Math.floor(reviews.length / 2);
const ROW_TWO: Review[] = [...reviews].reverse();
const ROW_TWO_OFFSET: Review[] = [...ROW_TWO.slice(half), ...ROW_TWO.slice(0, half)];

export function ReviewMarquee() {
  return (
    <div className="flex flex-col gap-5 md:gap-6">
      <MarqueeRow items={ROW_ONE} duration={38} />
      <MarqueeRow items={ROW_TWO_OFFSET} duration={44} reverse offset />
    </div>
  );
}

function MarqueeRow({
  items,
  duration,
  reverse,
  offset,
}: {
  items: Review[];
  duration: number;
  reverse?: boolean;
  offset?: boolean;
}) {
  const reduce = useReducedMotion() ?? false;
  const trackRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<Animation | null>(null);
  const rampRef = useRef<number | null>(null);
  const canHoverRef = useRef(false);

  // Drag bookkeeping (refs only — never triggers a re-render mid-animation).
  const drag = useRef({ active: false, startX: 0, dx: 0, touch: false });

  // Start the looping transform animation (skipped under reduced motion).
  useEffect(() => {
    const track = trackRef.current;
    if (!track || reduce) return;

    canHoverRef.current =
      typeof window !== "undefined" &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    const from = reverse ? "translate3d(-50%,0,0)" : "translate3d(0,0,0)";
    const to = reverse ? "translate3d(0,0,0)" : "translate3d(-50%,0,0)";
    const anim = track.animate([{ transform: from }, { transform: to }], {
      duration: duration * 1000,
      iterations: Infinity,
      easing: "linear",
    });
    animRef.current = anim;
    return () => {
      anim.cancel();
      animRef.current = null;
      if (rampRef.current) cancelAnimationFrame(rampRef.current);
    };
  }, [duration, reverse, reduce]);

  // Smoothly ramp the row's playback rate (slow on hover, restore on leave).
  const rampTo = (target: number) => {
    const anim = animRef.current;
    if (!anim) return;
    if (rampRef.current) cancelAnimationFrame(rampRef.current);
    const start = anim.playbackRate;
    const t0 = performance.now();
    const span = 500;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / span);
      const eased = 1 - Math.pow(1 - p, 3);
      anim.playbackRate = start + (target - start) * eased;
      if (p < 1) rampRef.current = requestAnimationFrame(tick);
    };
    rampRef.current = requestAnimationFrame(tick);
  };

  const onPointerEnter = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && canHoverRef.current) rampTo(0.28);
  };
  const onPointerLeave = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse") rampTo(1);
  };

  // Touch drag: pause the marquee, follow the finger on an outer wrapper, then
  // snap back and resume. Keeps the animation intact (no broken state).
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" || reduce) return;
    const anim = animRef.current;
    drag.current = { active: true, startX: e.clientX, dx: 0, touch: true };
    anim?.pause();
    if (dragRef.current) dragRef.current.style.transition = "none";
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current.active) return;
    drag.current.dx = e.clientX - drag.current.startX;
    if (dragRef.current)
      dragRef.current.style.transform = `translate3d(${drag.current.dx}px,0,0)`;
  };
  const endDrag = () => {
    if (!drag.current.active) return;
    drag.current.active = false;
    if (dragRef.current) {
      dragRef.current.style.transition = "transform 0.5s cubic-bezier(0.22,1,0.36,1)";
      dragRef.current.style.transform = "translate3d(0,0,0)";
    }
    animRef.current?.play();
  };

  // Reduced motion → a plain horizontally scrollable rail (single set).
  if (reduce) {
    return (
      <div className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex w-max">
          {items.map((r) => (
            <ReviewCard key={r.id} r={r} canTilt={false} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className="marquee-mask relative overflow-hidden"
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      style={{ touchAction: "pan-y" }}
    >
      {/* offset lives on the (non-animated) wrapper so it never skews the
          track's exact -50% seamless-loop math */}
      <div ref={dragRef} className={`will-change-transform ${offset ? "pl-12 md:pl-24" : ""}`}>
        <div ref={trackRef} className="flex w-max will-change-transform">
          {items.map((r) => (
            <ReviewCard key={r.id} r={r} canTilt />
          ))}
          {/* seamless duplicate — hidden from assistive tech */}
          {items.map((r) => (
            <ReviewCard key={`dup-${r.id}`} r={r} canTilt duplicate />
          ))}
        </div>
      </div>
    </div>
  );
}

function ReviewCard({
  r,
  canTilt,
  duplicate,
}: {
  r: Review;
  canTilt: boolean;
  duplicate?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const { t, lang } = useLang();
  const name = lang === "zh" && r.nameZh ? r.nameZh : r.name;
  const text = lang === "zh" && r.textZh ? r.textZh : r.text;

  const set = (k: string, v: string) => ref.current?.style.setProperty(k, v);

  const onEnter = () => {
    if (!canTilt) return;
    set("--lift", "-6px");
    set("--scale", "1.015");
    set("--glow", "1");
  };
  const onMove = (e: React.PointerEvent) => {
    if (!canTilt || e.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5; // -0.5..0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    set("--rx", `${(-py * 3).toFixed(2)}deg`); // ±1.5°
    set("--ry", `${(px * 3).toFixed(2)}deg`);
    set("--tx", `${(px * 7).toFixed(1)}px`); // content shift ≈ ±3.5px
    set("--ty", `${(py * 7).toFixed(1)}px`);
  };
  const onLeave = () => {
    if (!canTilt) return;
    set("--lift", "0px");
    set("--scale", "1");
    set("--rx", "0deg");
    set("--ry", "0deg");
    set("--tx", "0px");
    set("--ty", "0px");
    set("--glow", "0");
  };

  return (
    <figure
      ref={ref as React.RefObject<HTMLElement>}
      aria-hidden={duplicate || undefined}
      onPointerEnter={onEnter}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="review-card mr-4 flex shrink-0 flex-col rounded-[18px] border p-6 md:mr-5"
      style={{
        width: "var(--card-w)",
        minHeight: "176px",
        background: "rgba(255, 245, 238, 0.05)",
        borderColor:
          "color-mix(in srgb, #F3C5BA calc(var(--glow, 0) * 45%), rgba(255,255,255,0.10))",
        boxShadow:
          "0 18px 40px rgba(0,0,0,calc(0.18 + var(--glow,0) * 0.18)), 0 0 0 1px rgba(255,255,255,0.02), 0 0 calc(var(--glow,0) * 40px) rgba(243,197,186,calc(var(--glow,0) * 0.22))",
        transform:
          "translate3d(0,var(--lift,0px),0) scale(var(--scale,1)) perspective(900px) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg))",
        transition:
          "transform 0.28s cubic-bezier(0.22,1,0.36,1), box-shadow 0.4s ease, border-color 0.4s ease",
      }}
    >
      <div
        style={{
          transform: "translate3d(var(--tx,0px),var(--ty,0px),0)",
          transition: "transform 0.28s cubic-bezier(0.22,1,0.36,1)",
        }}
        className="flex h-full flex-col"
      >
        <div className="mb-3 flex gap-0.5" aria-label={t("misc.review.ratingOutOf").replace("{n}", String(r.rating))}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-3.5 w-3.5 ${i < r.rating ? "fill-coral text-coral" : "text-white/20"}`}
            />
          ))}
        </div>
        <blockquote className="line-clamp-5 text-[14.5px] leading-[1.65] text-white/90">
          “{text}”
        </blockquote>
        <figcaption className="mt-auto pt-5 text-sm font-semibold text-white/70">
          {name}
        </figcaption>
      </div>
    </figure>
  );
}
