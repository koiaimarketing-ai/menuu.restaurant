"use client";

import { useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import type { PointerEvent } from "react";
import { HeroBackground } from "./HeroBackground";
import { InteractiveLeaves } from "./InteractiveLeaves";
import { HeroContent } from "./HeroContent";
import { useIsDesktop } from "./useIsDesktop";

export function HeroSection() {
  const reduce = useReducedMotion() ?? false;
  const isDesktop = useIsDesktop();
  const motionEnabled = isDesktop && !reduce;

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 70, damping: 22, mass: 0.7 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 70, damping: 22, mass: 0.7 });

  const handlePointerMove = (e: PointerEvent<HTMLElement>) => {
    if (!motionEnabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(((e.clientX - rect.left) / rect.width - 0.5) * 2);
    mouseY.set(((e.clientY - rect.top) / rect.height - 0.5) * 2);
  };
  const handlePointerLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative isolate min-h-[720px] overflow-visible bg-cream md:min-h-[760px] lg:min-h-[820px]"
    >
      {/* clipped layer: background + leaves */}
      <div className="absolute inset-0 overflow-hidden">
        <HeroBackground />
        <InteractiveLeaves
          smoothMouseX={smoothMouseX}
          smoothMouseY={smoothMouseY}
          enabled={motionEnabled}
          reduce={reduce}
        />
      </div>

      <HeroContent />
    </section>
  );
}
