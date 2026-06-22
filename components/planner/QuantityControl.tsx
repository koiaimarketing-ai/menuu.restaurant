"use client";

import { useRef, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { useLang } from "@/lib/i18n/LanguageProvider";

/**
 * Subtle "bubble pulse" for the whole menu card when its quantity changes
 * (Add / + / −). Returns the `is-bubbling` flag and a `bubble()` trigger. The
 * double rAF restarts the CSS animation even on rapid repeated clicks.
 */
export function useCardBubble() {
  const [bubbling, setBubbling] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bubble = () => {
    setBubbling(false);
    requestAnimationFrame(() => requestAnimationFrame(() => setBubbling(true)));
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setBubbling(false), 700);
  };
  return { bubbling, bubble };
}

/**
 * Shared quantity stepper used by every menu card AND the Your Meal Plan panel,
 * so the design + interaction stay identical everywhere.
 *
 * Directional glow feedback is handled internally: clicking + sweeps a green
 * glow left→right, clicking − sweeps a red glow right→left (CSS in globals.css).
 * Re-keying on each click restarts the sweep even on rapid repeated taps. The
 * actual quantity update happens immediately via the supplied callbacks — the
 * glow is purely visual.
 */
export function QuantityControl({
  quantity,
  onIncrease,
  onDecrease,
  label,
  className = "",
}: {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  label?: string;
  className?: string;
}) {
  const { t } = useLang();
  const [glow, setGlow] = useState<{ dir: "increase" | "decrease"; k: number } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flash = (dir: "increase" | "decrease") => {
    setGlow((g) => ({ dir, k: (g?.k ?? 0) + 1 }));
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setGlow(null), 650);
  };

  const inc = () => {
    flash("increase");
    onIncrease();
  };
  const dec = () => {
    flash("decrease");
    onDecrease();
  };

  return (
    <div
      key={glow?.k ?? "idle"}
      className={`quantity-control ${glow?.dir === "increase" ? "glow-increase" : ""} ${
        glow?.dir === "decrease" ? "glow-decrease" : ""
      } ${className}`}
    >
      <button
        type="button"
        className="quantity-action quantity-minus"
        onClick={dec}
        aria-label={label ? t("menu.qty.reduceOf").replace("{label}", label) : t("menu.qty.reduce")}
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className="quantity-value">{quantity}</span>
      <button
        type="button"
        className="quantity-action quantity-plus"
        onClick={inc}
        aria-label={label ? t("menu.qty.increaseOf").replace("{label}", label) : t("menu.qty.increase")}
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
