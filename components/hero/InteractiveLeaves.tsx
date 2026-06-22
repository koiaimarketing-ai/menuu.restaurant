"use client";

import { motion, type MotionValue, useTransform } from "framer-motion";

const LEFT_PLANT = "/images/hero-plant-left.png";
const RIGHT_PLANT = "/images/hero-plant-right.png";

/**
 * Decorative greenery entering from outside the page edges. Each plant uses its
 * full transparent-PNG asset, positioned mostly off-screen so only ~30% peeks
 * in (the parent layer clips the hidden 70%). A very soft breeze sway moves them
 * gently left/right; an optional subtle cursor parallax adds life on desktop.
 */
export function InteractiveLeaves({
  smoothMouseX,
  smoothMouseY,
  enabled,
  reduce,
}: {
  smoothMouseX: MotionValue<number>;
  smoothMouseY: MotionValue<number>;
  enabled: boolean;
  reduce: boolean;
}) {
  // gentle cursor parallax (kept very small so it never distracts)
  const leftX = useTransform(smoothMouseX, [-1, 1], [5, -6]);
  const leftY = useTransform(smoothMouseY, [-1, 1], [4, -4]);
  const rightX = useTransform(smoothMouseX, [-1, 1], [6, -5]);
  const rightY = useTransform(smoothMouseY, [-1, 1], [4, -4]);

  const leftSway = reduce ? { x: 0, rotate: 0 } : { x: [0, 8, 0], rotate: [0, 0.6, 0] };
  const rightSway = reduce ? { x: 0, rotate: 0 } : { x: [0, -8, 0], rotate: [0, -0.6, 0] };

  return (
    <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden" aria-hidden="true">
      {/* LEFT plant — peeks in from the lower-left, ~30% visible */}
      <div className="hero-plant hero-plant-left">
        <motion.div
          className="will-change-transform"
          animate={leftSway}
          transition={{ duration: 6.5, repeat: reduce ? 0 : Infinity, ease: "easeInOut" }}
        >
          <motion.img
            src={LEFT_PLANT}
            alt=""
            draggable={false}
            style={enabled ? { x: leftX, y: leftY } : undefined}
            className="block h-auto w-full select-none"
          />
        </motion.div>
      </div>

      {/* RIGHT plant — peeks in from the mid/lower-right, ~30% visible */}
      <div className="hero-plant hero-plant-right">
        <motion.div
          className="will-change-transform"
          animate={rightSway}
          transition={{ duration: 7.2, repeat: reduce ? 0 : Infinity, ease: "easeInOut", delay: 0.5 }}
        >
          <motion.img
            src={RIGHT_PLANT}
            alt=""
            draggable={false}
            style={enabled ? { x: rightX, y: rightY } : undefined}
            className="block h-auto w-full select-none"
          />
        </motion.div>
      </div>
    </div>
  );
}
