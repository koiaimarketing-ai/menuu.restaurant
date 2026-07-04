"use client";

import { useLang } from "@/components/introduction/providers/language-provider";
import { Reveal } from "@/components/introduction/ui/reveal";
import { Button } from "@/components/introduction/ui/button";
import { Gift, Zap, Clock } from "lucide-react";

export function Offer() {
  const { t } = useLang();
  const o = t.offer;

  return (
    <section id="offer" className="bg-white py-14 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.25rem] bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 px-6 py-12 text-center text-white shadow-[var(--shadow-float)] sm:px-12 sm:py-16">
            <div className="bg-grid absolute inset-0 opacity-10" />
            <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-brand-300/20 blur-2xl" />

            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wider ring-1 ring-white/20">
                <Gift className="h-4 w-4" /> {o.tag}
              </span>
              <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-extrabold leading-tight !text-white sm:text-4xl md:text-5xl">
                {o.heading}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base text-brand-100 sm:text-lg">{o.sub}</p>

              <div className="mx-auto mt-8 flex max-w-md flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-brand-700">
                  <Zap className="h-4 w-4 fill-brand-500 text-brand-500" /> {o.slots}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold text-white ring-1 ring-white/20">
                  <Clock className="h-4 w-4" /> {o.urgency}
                </span>
              </div>

              {/* slots progress */}
              <div className="mx-auto mt-6 max-w-md">
                <div className="h-2.5 overflow-hidden rounded-full bg-white/20">
                  <div className="h-full w-[64%] rounded-full bg-white" />
                </div>
                <p className="mt-2 text-xs text-brand-100">32 / 50</p>
              </div>

              <div className="mt-8">
                <Button href="#contact" size="lg" variant="white">
                  {o.cta}
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
