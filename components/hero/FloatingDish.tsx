"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import type { PointerEvent } from "react";
import { useIsDesktop } from "./useIsDesktop";

/**
 * Dedicated hero -> Our Story TRANSITION layer.
 * Rendered as a sibling BETWEEN the two sections (not inside either), so it is
 * not trapped in the hero's stacking context and paints above both backgrounds.
 *
 * Layering:
 *   - outer wrapper: height 0, sits at the section boundary, z-20, pointer-events:none
 *   - positioning layer: absolute, centred + lifted (static transforms only)
 *   - ambient layer: float animation
 *   - tilt layer: cursor/hover transforms (pointer-events:auto)
 */
export function FloatingDish() {
  const reduce = useReducedMotion() ?? false;
  const isDesktop = useIsDesktop();

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const dishLift = useMotionValue(0);

  const smoothRotateX = useSpring(rotateX, { stiffness: 120, damping: 18, mass: 0.5 });
  const smoothRotateY = useSpring(rotateY, { stiffness: 120, damping: 18, mass: 0.5 });
  const smoothDishLift = useSpring(dishLift, { stiffness: 140, damping: 20 });

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce || !isDesktop) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    rotateY.set((x - 0.5) * 6);
    rotateX.set((0.5 - y) * 5);
    dishLift.set(-6);
  };

  const reset = () => {
    rotateX.set(0);
    rotateY.set(0);
    dishLift.set(0);
  };

  return (
    // TRANSITION WRAPPER — height 0, anchored at the hero/story boundary, above both sections.
    <div className="relative z-20 h-0 pointer-events-none" aria-hidden="false">
      {/* POSITIONING LAYER — static transforms only (centring + vertical anchor).
          translateY ≈ -47% → ~45% of the dish sits in the hero, ~55% over the story. */}
      <div
        className="
          absolute left-1/2 top-0
          -translate-x-1/2 -translate-y-[50%]
          w-[120vw] max-w-[560px]
          sm:w-[86vw] sm:max-w-[700px]
          md:w-[clamp(600px,77vw,1216px)] md:max-w-none
        "
      >
        {/* AMBIENT FLOAT */}
        <motion.div
          className="will-change-transform"
          animate={reduce ? { y: 0, rotate: 0 } : { y: [0, -10, 0], rotate: [0, 0.6, 0] }}
          transition={{ duration: 5.5, repeat: reduce ? 0 : Infinity, ease: "easeInOut" }}
        >
          {/* CURSOR TILT + HOVER */}
          <motion.div
            onPointerMove={handlePointerMove}
            onPointerLeave={reset}
            style={{
              rotateX: smoothRotateX,
              rotateY: smoothRotateY,
              y: smoothDishLift,
              transformPerspective: 1200,
            }}
            whileHover={reduce ? undefined : { scale: 1.015, y: -14, transition: { duration: 0.35 } }}
            className="pointer-events-auto will-change-transform"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/signature-dish.png"
              alt="Warung Jakarta signature meal — sambal grilled fish with rice, kerupuk, soup and traditional accompaniments"
              width={1448}
              height={1086}
              draggable={false}
              className="h-auto w-full select-none object-contain drop-shadow-[0_24px_32px_rgba(58,30,26,0.22)] drop-shadow-[0_8px_12px_rgba(58,30,26,0.10)]"
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
