"use client";

import { useLang } from "@/components/introduction/providers/language-provider";
import { SectionHeading } from "@/components/introduction/ui/section";
import { Reveal } from "@/components/introduction/ui/reveal";
import { PhoneWorkload } from "@/components/introduction/sections/phone-workload";
import { BookDemoCTA } from "@/components/introduction/ui/book-demo-cta";

export function MarketProblem() {
  const { t } = useLang();
  const p = t.problem;

  return (
    <section id="problem" className="bg-mist-50 py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading tag={p.tag} heading={p.heading} sub={p.sub} />

        {/* Phone-orders workload card — nested inside this problem section */}
        <div className="mt-12">
          <PhoneWorkload />
        </div>

        {/* Big customer-journey image (CTA above scrolls here) */}
        <div id="customer-journey-image" className="mt-14 scroll-mt-24">
          <Reveal>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/introduction/problem-solution.png"
              alt="How customers search on Google and choose the restaurant with a menu"
              className="mx-auto hidden w-full rounded-3xl md:block"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/introduction/problem-solution-2.png"
              alt="How customers search on Google and choose the restaurant with a menu"
              className="mx-auto block w-full rounded-3xl md:hidden"
            />
          </Reveal>

          {/* Desktop-only Book Demo CTA above the bridge sentence */}
          <BookDemoCTA className="mt-8 mb-5" />

          {/* Bridge caption — plain sentence under the image */}
          <Reveal>
            <p className="mx-auto mt-6 max-w-[760px] text-center text-base font-semibold leading-relaxed text-navy md:text-lg">
              {p.bridge}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
