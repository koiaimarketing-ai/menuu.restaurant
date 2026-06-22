"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Star, MapPin } from "lucide-react";
import { GUEST_AVATARS as AVATARS } from "@/lib/avatars";
import { useLang } from "@/lib/i18n/LanguageProvider";

export function HeroContent() {
  const { t, lang } = useLang();
  return (
    <div className="relative z-[3] mx-auto flex w-full max-w-site items-start min-h-[560px] px-[18px] pb-44 pt-28 sm:min-h-[640px] sm:px-8 sm:pb-56 sm:pt-28 md:min-h-[680px] md:pb-64 md:pt-32 lg:min-h-[720px] lg:px-12 lg:pb-72 lg:pt-36">
      <div className="max-w-[600px]">
        <span className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3.5 py-1.5 text-sm font-semibold text-primary">
          <Sparkles className="h-4 w-4" />
          {t("hero.badge")}
        </span>
        <h1 className={`h-display mt-6 text-[clamp(2.75rem,7vw,5.25rem)] ${lang === "zh" ? "whitespace-nowrap" : ""}`}>
          {t("hero.titleTop")}
          <br />
          {t("hero.titlePre")}<span className="text-primary">{t("hero.titleAccent")}</span>
        </h1>
        <p className="mt-6 text-lg text-body max-w-md leading-relaxed">
          {t("hero.subtitle")}
        </p>
        <div className="mt-8 flex flex-col items-start gap-3.5">
          <Link href="/menu" className="btn btn-primary">
            {t("nav.exploreMenuNow")} <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/our-story" className="read-story-link">
            {t("hero.ourStory")} <span className="arrow" aria-hidden="true">→</span>
          </Link>
        </div>
        <div className="mt-9 space-y-3 text-sm text-body">
          {/* Review / social proof (single component, above the location capsules) */}
          <div>
            <p className="text-heading">{t("hero.loved")}</p>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2">
              <div className="flex -space-x-2">
                {AVATARS.map((src, i) => (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    key={i}
                    src={src}
                    alt="Warung Jakarta customer"
                    loading="lazy"
                    className="h-8 w-8 rounded-full border-2 border-cream bg-secondary object-cover sm:h-[30px] sm:w-[30px]"
                  />
                ))}
              </div>
              <span className="inline-flex items-center gap-1.5 font-semibold text-heading">
                <Star className="h-4 w-4 fill-primary text-primary" />
                4.6
              </span>
              <span className="text-ink-secondary">(376 {t("hero.reviewsSuffix")})</span>
            </div>
            <p className="mt-2.5 text-ink-secondary">{t("hero.perPerson")}</p>
          </div>
          {/* Location capsules: SS4 and KLCW together on one row (all breakpoints) */}
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/70 border border-line-warm px-3 py-1 font-medium text-heading">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              SS4
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/70 border border-line-warm px-3 py-1 font-medium text-heading">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              KLCW
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
