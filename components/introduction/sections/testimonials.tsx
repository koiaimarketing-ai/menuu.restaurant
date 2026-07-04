"use client";

import { useState } from "react";
import { useLang } from "@/components/introduction/providers/language-provider";
import { SectionHeading } from "@/components/introduction/ui/section";
import { Star, Quote } from "lucide-react";
import { TESTIMONIALS, type Testimonial } from "@/lib/introduction/testimonials";

const AVATAR_GRADIENTS = [
  "from-brand-400 to-brand-600",
  "from-brand-500 to-brand-700",
  "from-brand-300 to-brand-500",
  "from-brand-600 to-brand-800",
];

function Avatar({ t, i }: { t: Testimonial; i: number }) {
  const [failed, setFailed] = useState(false);
  const showImage = t.image && !failed;
  return (
    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full">
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={t.image as string}
          alt={t.name}
          className="h-full w-full object-cover"
          loading="lazy"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length]} text-base font-bold text-white`}>
          {t.initial}
        </div>
      )}
    </div>
  );
}

function Card({ t, i }: { t: Testimonial; i: number }) {
  return (
    <figure className="flex w-[clamp(300px,82vw,400px)] shrink-0 flex-col rounded-[28px] border border-border-blue bg-white p-7 shadow-[0_22px_50px_rgba(34,88,218,0.10)] md:w-[380px]">
      <Quote className="h-8 w-8 text-brand-200" />
      <div className="mt-2 flex gap-0.5">
        {Array.from({ length: t.rating }).map((_, s) => (
          <Star key={s} className="h-4 w-4 fill-brand-500 text-brand-500" />
        ))}
      </div>
      <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-ink-800">“{t.review}”</blockquote>
      <figcaption className="mt-6 flex items-center gap-3">
        <Avatar t={t} i={i} />
        <div>
          <p className="text-sm font-bold text-ink-900">{t.name}</p>
          <p className="text-xs text-body">{t.role}</p>
        </div>
      </figcaption>
    </figure>
  );
}

export function Testimonials() {
  const { t } = useLang();
  const tm = t.testimonials;
  // Duplicate the list for a seamless infinite loop.
  const loop = [...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <section id="testimonials" className="overflow-hidden bg-white py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading tag={tm.tag} heading={tm.heading} sub={tm.sub} />
      </div>

      {/* edge-faded marquee */}
      <div className="marquee relative mt-10 py-12 [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
        <div className="marquee-track flex gap-6 px-3">
          {loop.map((item, i) => (
            <Card key={i} t={item} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
