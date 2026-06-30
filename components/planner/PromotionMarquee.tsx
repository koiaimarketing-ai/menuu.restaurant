"use client";

import { useLang } from "@/lib/i18n/LanguageProvider";

/**
 * Auto-scrolling promotion banners shown above the first menu category on the
 * Menu & Planner page and on the Contact/Location page. Images live in
 * /public/promotions/ (lowercase, no spaces: promotion-1.png .. promotion-6.png).
 * The list is duplicated so the right→left loop (translateX(-50%)) is seamless.
 * No text/overlay is added — banners show as-is. Pauses on hover (desktop);
 * respects reduced-motion (CSS in globals.css).
 *
 * To update: drop new banners in /public/promotions/ and edit this array.
 */
export const promotions = [
  "/promotions/promotion-1.png",
  "/promotions/promotion-2.png",
  "/promotions/promotion-3.png",
  "/promotions/promotion-4.png",
  "/promotions/promotion-5.png",
  "/promotions/promotion-6.png",
];

export function PromotionMarquee() {
  const { t } = useLang();
  return (
    <section className="promotion-section" aria-label={t("misc.promo.section")}>
      <div className="promotion-marquee">
        <div className="promotion-track">
          {[...promotions, ...promotions].map((src, index) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={`${src}-${index}`}
              src={src}
              alt={`${t("misc.promo.imageAlt")} ${(index % promotions.length) + 1}`}
              className="promotion-image"
              loading="lazy"
              draggable={false}
              aria-hidden={index >= promotions.length || undefined}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/** Same banners, sized for the About page (replaces the old branch card). */
export function AboutPromotionMarquee() {
  const { t } = useLang();
  return (
    <section className="about-promotion-section" aria-label={t("misc.promo.section")}>
      <div className="about-promotion-marquee">
        <div className="about-promotion-track">
          {[...promotions, ...promotions].map((src, index) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={`${src}-${index}`}
              src={src}
              alt={`${t("misc.promo.imageAlt")} ${(index % promotions.length) + 1}`}
              className="about-promotion-image"
              loading="lazy"
              draggable={false}
              aria-hidden={index >= promotions.length || undefined}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
