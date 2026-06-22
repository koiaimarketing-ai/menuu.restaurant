"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { ChefHat } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { formatRM } from "@/lib/currency";
import { useLang } from "@/lib/i18n/LanguageProvider";

export type Pick = {
  id: string;
  name: string;
  image?: string;
  price: number | null;
};

/**
 * Single-row, slowly auto-scrolling carousel of the featured "Warung Jakarta
 * Picks" cards. Seamless infinite loop via a duplicated set + a Web Animations
 * API transform (GPU-friendly, no React state churn). Pauses on hover and while
 * dragging, resumes smoothly after, supports manual swipe/drag, and falls back
 * to a plain horizontal scroller under prefers-reduced-motion. Content unchanged.
 */
export function PicksCarousel({ items }: { items: Pick[] }) {
  const reduce = useReducedMotion() ?? false;
  const trackRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<Animation | null>(null);
  const canHoverRef = useRef(false);
  const drag = useRef({ active: false, startX: 0 });

  useEffect(() => {
    const track = trackRef.current;
    if (!track || reduce) return;
    canHoverRef.current =
      typeof window !== "undefined" &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    // ~slow drift; scale duration with the number of cards so speed stays even.
    const duration = Math.max(28000, items.length * 6200);
    const anim = track.animate(
      [{ transform: "translate3d(0,0,0)" }, { transform: "translate3d(-50%,0,0)" }],
      { duration, iterations: Infinity, easing: "linear" }
    );
    animRef.current = anim;
    return () => {
      anim.cancel();
      animRef.current = null;
    };
  }, [items.length, reduce]);

  const onEnter = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && canHoverRef.current) animRef.current?.pause();
  };
  const onLeave = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && !drag.current.active) animRef.current?.play();
  };

  // Manual drag: pause the marquee, follow the pointer on an outer wrapper, then
  // snap back and resume — never breaks the loop.
  const onDown = (e: React.PointerEvent) => {
    if (reduce) return;
    drag.current = { active: true, startX: e.clientX };
    animRef.current?.pause();
    if (dragRef.current) dragRef.current.style.transition = "none";
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    if (!drag.current.active || !dragRef.current) return;
    dragRef.current.style.transform = `translate3d(${e.clientX - drag.current.startX}px,0,0)`;
  };
  const onUp = () => {
    if (!drag.current.active) return;
    drag.current.active = false;
    if (dragRef.current) {
      dragRef.current.style.transition = "transform 0.5s cubic-bezier(0.22,1,0.36,1)";
      dragRef.current.style.transform = "translate3d(0,0,0)";
    }
    animRef.current?.play();
  };

  if (reduce) {
    return (
      <div className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex w-max">
          {items.map((it) => (
            <PickCard key={it.id} item={it} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className="picks-mask relative overflow-hidden"
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      style={{ touchAction: "pan-y" }}
    >
      <div ref={dragRef} className="will-change-transform">
        <div ref={trackRef} className="flex w-max will-change-transform">
          {items.map((it) => (
            <PickCard key={it.id} item={it} />
          ))}
          {items.map((it) => (
            <PickCard key={`dup-${it.id}`} item={it} duplicate />
          ))}
        </div>
      </div>
    </div>
  );
}

function PickCard({ item, duplicate }: { item: Pick; duplicate?: boolean }) {
  const { t } = useLang();
  return (
    <article
      aria-hidden={duplicate || undefined}
      className="group mr-4 flex w-[min(72vw,240px)] shrink-0 flex-col overflow-hidden rounded-3xl border border-line-light bg-white shadow-soft sm:mr-5 md:w-[230px]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="240px"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-ink-muted">
            <ChefHat className="h-10 w-10" />
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-primary">
          {t("pages.home.recommended")}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-semibold text-ink-primary">{item.name}</h3>
        <p className="mt-1 text-xs text-ink-muted">KLCW</p>
        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="font-bold text-green-text">
            {item.price != null ? formatRM(item.price) : "—"}
          </span>
          <Link href="/menu" className="text-sm font-semibold text-primary hover:underline">
            {t("pages.home.viewMenuArrow")}
          </Link>
        </div>
      </div>
    </article>
  );
}
