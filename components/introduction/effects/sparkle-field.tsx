"use client";

import { memo, useMemo } from "react";

/**
 * SparkleField — lightweight CSS twinkle layer (blue + white) for the benefits
 * section. This replaces the original three.js / @react-three/fiber version so
 * the introduction page carries NO React-19-only 3D dependency (the host project
 * runs React 18). Positions are seeded deterministically so server and client
 * markup match (no hydration mismatch); animation is CSS and honours
 * prefers-reduced-motion via the shared reduce-motion rule in globals.css.
 */
function SparkleFieldInner({ density = "field" }: { density?: "field" | "focused" }) {
  const count = density === "focused" ? 28 : 46;

  const dots = useMemo(() => {
    // Deterministic LCG so the layout is stable across renders + SSR/CSR.
    let seed = density === "focused" ? 7 : 19;
    const rand = () => {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      return seed / 0x7fffffff;
    };
    return Array.from({ length: count }, (_, i) => {
      const highlight = i % 8 === 0;
      return {
        left: rand() * 100,
        top: rand() * 100,
        size: highlight ? 4 + rand() * 3 : 1.5 + rand() * 2.2,
        delay: rand() * 4,
        dur: 2.6 + rand() * 2.6,
        highlight,
      };
    });
  }, [count, density]);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {dots.map((d, i) => (
        <span
          key={i}
          className="intro-sparkle absolute rounded-full"
          style={{
            left: `${d.left}%`,
            top: `${d.top}%`,
            width: `${d.size}px`,
            height: `${d.size}px`,
            background: d.highlight ? "#ffffff" : "#93c5fd",
            boxShadow: d.highlight
              ? "0 0 8px 2px rgba(255,255,255,0.6)"
              : "0 0 6px 1px rgba(106,147,241,0.5)",
            animationDelay: `${d.delay}s`,
            animationDuration: `${d.dur}s`,
          }}
        />
      ))}
    </div>
  );
}

export const SparkleField = memo(SparkleFieldInner);
