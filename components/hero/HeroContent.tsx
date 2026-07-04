"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, MapPin } from "lucide-react";
import { GUEST_AVATARS as AVATARS } from "@/lib/avatars";
import { ReviewMeta } from "@/components/ReviewStrip";
import { useLang } from "@/lib/i18n/LanguageProvider";

function ReviewBlock({ align = "left" }: { align?: "left" | "right" }) {
  const { t } = useLang();
  const right = align === "right";
  return (
    <div className={right ? "text-right" : undefined}>
      <p className="text-heading">{t("hero.loved")}</p>
      <div className={`mt-2 flex flex-wrap items-center gap-x-3 gap-y-2 ${right ? "justify-end" : ""}`}>
        <div className="flex -space-x-2">
          {AVATARS.map((src, i) => (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              key={i}
              src={src}
              alt="Menuu customer"
              loading="lazy"
              className="h-8 w-8 rounded-full border-2 border-cream bg-secondary object-cover sm:h-[30px] sm:w-[30px]"
            />
          ))}
        </div>
        <ReviewMeta />
      </div>
      <p className="mt-2.5 text-ink-secondary">{t("hero.perPerson")}</p>
    </div>
  );
}

function LocationPills({ align = "left" }: { align?: "left" | "right" }) {
  return (
    <div className={`flex flex-wrap gap-2 ${align === "right" ? "justify-end" : ""}`}>
      {["Taman Sea, PJ"].map((b) => (
        <span
          key={b}
          className="inline-flex items-center gap-1.5 rounded-full bg-white/70 border border-line-warm px-3 py-1 font-medium text-heading"
        >
          <MapPin className="h-3.5 w-3.5 text-primary" />
          {b}
        </span>
      ))}
    </div>
  );
}

export function HeroContent() {
  const { t, lang } = useLang();

  const ourStory = (
    <Link href="/our-story" className="read-story-link">
      {t("hero.ourStory")} <span className="arrow" aria-hidden="true">→</span>
    </Link>
  );

  return (
    <div className="relative z-[3] mx-auto flex w-full max-w-site items-start min-h-[420px] px-[18px] pb-28 pt-24 sm:min-h-[520px] sm:px-8 sm:pb-40 sm:pt-28 md:min-h-[600px] md:pb-52 md:pt-32 lg:min-h-[660px] lg:px-12 lg:pb-64 lg:pt-28">
      <div className="w-full lg:grid lg:grid-cols-[minmax(0,1fr)_330px] lg:items-start lg:gap-10">
        {/* LEFT — badge + heading + paragraph (+ mobile-only CTA/review/location) */}
        <div className="max-w-[600px]">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3.5 py-1.5 text-sm font-semibold text-primary">
            <Sparkles className="h-4 w-4" />
            {t("hero.badge")}
          </span>
          <h1 className={`h-display mt-5 text-[clamp(2.1rem,6vw,5.25rem)] sm:mt-6 ${lang === "zh" ? "whitespace-nowrap" : ""}`}>
            {t("hero.titleTop")}
            <br />
            {t("hero.titlePre")}<span className="text-primary">{t("hero.titleAccent")}</span>
          </h1>
          <p className="mt-4 text-base text-body max-w-md leading-relaxed sm:mt-6 sm:text-lg">
            {t("hero.subtitle")}
          </p>

          {/* MOBILE / tablet only — unchanged from before (desktop uses the right column) */}
          <div className="lg:hidden">
            <div className="mt-8 flex flex-col items-start gap-3.5">
              <Link href="/menu" className="btn btn-primary hidden lg:inline-flex">
                {t("nav.exploreMenuNow")} <ArrowRight className="h-4 w-4" />
              </Link>
              {ourStory}
            </div>
            <div className="mt-9 space-y-3 text-sm text-body">
              <ReviewBlock align="left" />
              <LocationPills align="left" />
            </div>
          </div>
        </div>

        {/* RIGHT — desktop only: review → location → Explore → Our Story.
            Centred in its column (pulled inward off the edge) and pushed lower so
            the button row lines up near the end of the left paragraph. */}
        <div className="hidden flex-col items-end gap-5 pb-2 pr-6 text-right text-sm text-body lg:flex lg:self-end">
          <ReviewBlock align="right" />
          <LocationPills align="right" />
          <Link href="/menu" className="btn btn-primary !rounded-full px-7">
            {t("nav.exploreMenuNow")} <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/our-story" className="read-story-link">
            {t("hero.ourStory")} <span className="arrow" aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
