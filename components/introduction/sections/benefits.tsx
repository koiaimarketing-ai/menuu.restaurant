"use client";

import dynamic from "next/dynamic";
import { useLang } from "@/components/introduction/providers/language-provider";
import { SectionHeading } from "@/components/introduction/ui/section";
import { BenefitsHoverGallery } from "@/components/introduction/ui/benefits-hover-gallery";

// Three.js layer loads client-side only, after hydration — no SSR, no layout shift.
const SparkleField = dynamic(
  () => import("@/components/introduction/effects/sparkle-field").then((m) => m.SparkleField),
  { ssr: false }
);

export function Benefits() {
  const { t } = useLang();
  const b = t.benefits;

  return (
    <section id="benefits" className="relative overflow-hidden bg-white py-14 sm:py-20">
      {/* Three.js sparkle layer — behind content, never blocks clicks */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <SparkleField />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading tag={b.tag} heading={b.heading} sub={b.sub} />
        <BenefitsHoverGallery items={b.items} />
      </div>
    </section>
  );
}
