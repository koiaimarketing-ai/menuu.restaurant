"use client";

import { useLang } from "@/components/introduction/providers/language-provider";
import { Eyebrow } from "@/components/introduction/ui/section";
import { Reveal } from "@/components/introduction/ui/reveal";

export function Market() {
  const { t } = useLang();
  const m = t.market;

  return (
    <section id="market" className="relative overflow-hidden bg-gradient-to-br from-ink-900 via-ink-900 to-brand-900 py-20 text-white sm:py-28">
      <div className="bg-grid absolute inset-0 opacity-[0.07]" />
      <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-brand-500/20 blur-3xl" />
      <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-brand-400/20 blur-3xl" />

      <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6">
        <Reveal>
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-100 ring-1 ring-white/15">
              {m.tag}
            </span>
          </div>
          <h2 className="mx-auto mt-5 max-w-3xl text-3xl font-extrabold leading-[1.12] !text-white sm:text-4xl md:text-5xl">
            {m.heading}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-brand-100 sm:text-lg">{m.sub}</p>
        </Reveal>

        <div className="mx-auto mt-12 grid max-w-[980px] gap-5 sm:grid-cols-3">
          {m.points.map((p, i) => {
            const solid = i === 1; // center card (Simple): white bg + MENUU blue text
            return (
              <Reveal key={i} delay={i * 0.12}>
                <div
                  className={`flex h-full flex-col items-center justify-center rounded-3xl border p-7 text-center backdrop-blur transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[0_20px_60px_rgba(37,99,235,0.25)] ${
                    solid
                      ? "border-brand-100 bg-white hover:border-white"
                      : "border-white/10 bg-white/5 hover:border-primary-accent hover:bg-white/10"
                  }`}
                >
                  <p className={`text-4xl font-extrabold sm:text-5xl ${solid ? "text-primary" : "!text-white"}`}>{p.stat}</p>
                  <p className={`mt-2 text-sm ${solid ? "font-medium text-primary/80" : "text-brand-100"}`}>{p.label}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
