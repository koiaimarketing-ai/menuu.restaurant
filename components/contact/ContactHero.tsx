"use client";

import { GUEST_AVATARS } from "@/lib/avatars";
import { ReviewMeta } from "@/components/ReviewStrip";
import { useLang } from "@/lib/i18n/LanguageProvider";

const REVIEW_PLATFORMS = ["Google", "Facebook", "Instagram", "TripAdvisor"];

/** Contact page hero: editorial intro (left) + desktop review card (right). */
export function ContactHero() {
  const { t } = useLang();
  return (
    <section className="hero-glow scroll-mt-28">
      <div className="container-site pt-24 pb-6 md:pt-28">
        <div className="grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          {/* left: editorial intro */}
          <div>
            <div className="flex items-center gap-3">
              <span className="eyebrow">{t("pages.contact.eyebrow")}</span>
              <span className="h-px w-10 bg-primary/70" aria-hidden />
            </div>
            <h1 className="h-display mt-3 text-[clamp(2rem,5vw,3.5rem)]">
              {t("pages.contact.heading")}
            </h1>
            <p className="mt-4 max-w-xl text-body leading-relaxed">{t("pages.contact.intro")}</p>
          </div>

          {/* right: review card — desktop only; on mobile it moves above the map */}
          <div className="hidden rounded-3xl border border-line-warm bg-white/95 p-5 shadow-soft sm:p-6 lg:block">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2.5">
                {GUEST_AVATARS.map((src, i) => (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    key={i}
                    src={src}
                    alt="Warung Jakarta customer"
                    loading="lazy"
                    className="h-9 w-9 rounded-full border-2 border-white object-cover"
                  />
                ))}
              </div>
              <ReviewMeta />
            </div>
            <p className="mt-4 font-semibold text-heading">{t("pages.contact.lovedTitle")}</p>
            <p className="text-sm leading-relaxed text-body">{t("pages.contact.lovedDesc")}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {REVIEW_PLATFORMS.map((p) => (
                <span
                  key={p}
                  className="rounded-full border border-line-light bg-secondary px-2.5 py-1 text-[11px] font-medium text-ink-secondary"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
