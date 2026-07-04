"use client";

import { type ReactNode } from "react";
import { Reveal } from "@/components/introduction/ui/reveal";

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-700">
      <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
      {children}
    </span>
  );
}

export function SectionHeading({
  tag,
  heading,
  sub,
  center = true,
  light = false,
}: {
  tag: string;
  heading: string;
  sub?: string;
  center?: boolean;
  light?: boolean;
}) {
  return (
    <Reveal className={`max-w-2xl ${center ? "mx-auto text-center" : ""}`}>
      <Eyebrow>{tag}</Eyebrow>
      <h2
        className={`mt-4 text-3xl font-extrabold leading-[1.1] sm:text-4xl md:text-[2.75rem] ${
          light ? "!text-white" : ""
        }`}
      >
        {heading}
      </h2>
      {sub && (
        <p className={`mt-4 text-base leading-relaxed sm:text-lg ${light ? "text-brand-100" : "text-body"}`}>
          {sub}
        </p>
      )}
    </Reveal>
  );
}
