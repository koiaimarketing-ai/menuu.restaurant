"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Star, Store, UtensilsCrossed, CalendarCheck } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { PicksCarousel } from "@/components/PicksCarousel";
import { ReviewMarquee } from "@/components/ReviewMarquee";
import { LocationCard } from "@/components/LocationCard";
import { locations, restaurant } from "@/data/locations";
import { GUEST_AVATARS } from "@/lib/avatars";
import { useLang } from "@/lib/i18n/LanguageProvider";

type PickItem = {
  id: string;
  name: string;
  image?: string;
  price: number | null;
};

export function HomeContent({ picks }: { picks: PickItem[] }) {
  const { t } = useLang();

  // Cross-page hash links (e.g. Our Story → /#from-our-guests) should land
  // smoothly on the matching section even after a client navigation/reload.
  useEffect(() => {
    if (!window.location.hash) return;
    const el = document.querySelector(window.location.hash);
    if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 150);
  }, []);

  const planFeatures = [
    { Icon: Store, title: t("pages.home.planFeat1Title"), desc: t("pages.home.planFeat1Desc") },
    { Icon: UtensilsCrossed, title: t("pages.home.planFeat2Title"), desc: t("pages.home.planFeat2Desc") },
    { Icon: CalendarCheck, title: t("pages.home.planFeat3Title"), desc: t("pages.home.planFeat3Desc") },
  ];

  return (
    <>
      {/* ===================== FEATURED DISHES ===================== */}
      <section className="section">
        <div className="container-site">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
              <div>
                <span className="eyebrow">{t("pages.home.picksEyebrow")}</span>
                <h2 className="h-display mt-3 text-[clamp(2rem,4.5vw,3.5rem)]">
                  {t("pages.home.picksTitle1")}
                  <br className="hidden sm:block" /> {t("pages.home.picksTitle2")}
                </h2>
                <p className="mt-4 text-body max-w-2xl">
                  {t("pages.home.picksDesc")}{" "}
                  <span className="text-heading font-semibold">
                    {t("pages.home.picksDescStrong")}
                  </span>
                </p>
              </div>
              <Link
                href="/menu"
                className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap text-sm font-semibold text-primary hover:underline"
              >
                {t("pages.home.viewFullMenu")} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        </div>

        <div className="container-site mt-6 pb-8 sm:pb-0">
          <PicksCarousel items={picks} />
        </div>
      </section>

      {/* ===================== PLAN YOUR MEAL ===================== */}
      <section className="section">
        <div className="container-site">
          <Reveal>
            <div
              className="relative overflow-hidden rounded-[28px] border border-line-warm bg-secondary px-6 py-9 sm:px-10 lg:px-12"
              style={{
                backgroundImage: "url(/images/plan-your-meal.png)",
                backgroundSize: "cover",
                backgroundPosition: "right center",
                backgroundRepeat: "no-repeat",
              }}
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#FAF4EC]/92 via-[#FAF4EC]/68 to-[#FAF4EC]/38"
              />
              <div className="relative z-10 grid gap-9 lg:grid-cols-[minmax(0,1fr)_1.25fr] lg:items-center lg:gap-12">
                <div>
                  <span className="eyebrow">{t("pages.home.planEyebrow")}</span>
                  <h2 className="h-display mt-3 text-[clamp(1.8rem,3.6vw,2.75rem)]">
                    {t("pages.home.planTitle")}
                  </h2>
                  <p className="mt-4 max-w-md leading-relaxed text-body">
                    {t("pages.home.planDesc")}
                  </p>
                  <Link href="/menu" className="btn btn-primary mt-6">
                    {t("pages.home.planCta")} <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-line-warm">
                  {planFeatures.map(({ Icon, title, desc }) => (
                    <div
                      key={title}
                      className="flex items-start gap-3.5 sm:flex-col sm:px-6 sm:first:pl-0 sm:last:pr-0"
                    >
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#F04438] text-white shadow-[0_8px_20px_rgba(240,68,56,0.22)]">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div className="sm:mt-3.5">
                        <p className="font-semibold text-heading">{title}</p>
                        <p className="mt-0.5 text-sm text-body">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===================== REVIEWS ===================== */}
      <section id="from-our-guests" className="section scroll-mt-28 bg-[#2A1612] text-white">
        <div className="container-site">
          <Reveal>
            <span className="eyebrow !text-coral">{t("pages.home.reviewsEyebrow")}</span>
            <h2
              className="mt-3 text-[clamp(1.9rem,4vw,3rem)] text-white"
              style={{ fontFamily: "var(--font-fraunces)", lineHeight: 1.05 }}
            >
              {t("pages.home.reviewsTitle")}
            </h2>
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2.5">
              <div className="flex items-center pl-2.5">
                {GUEST_AVATARS.map((src, i) => (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    key={i}
                    src={src}
                    alt="Warung Jakarta customer"
                    loading="lazy"
                    className="-ml-2.5 h-[34px] w-[34px] rounded-full border-2 border-[#2A1612] object-cover first:ml-0 sm:h-[38px] sm:w-[38px]"
                  />
                ))}
              </div>
              <span className="text-4xl font-bold">{restaurant.rating}</span>
              <div>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-coral text-coral" />
                  ))}
                </div>
                <p className="text-sm text-white/60 mt-1">
                  {t("pages.home.reviewsBasedOn1")} {t("misc.review.combined")}
                </p>
              </div>
            </div>
          </Reveal>
          <div className="mt-12">
            <ReviewMarquee />
          </div>
        </div>
      </section>

      {/* ===================== LOCATIONS ===================== */}
      <section className="section home-locations-section relative overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
          <Image
            src="/images/location.png"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-left"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-cream/30 via-cream/55 to-cream/85" />
        </div>

        <div className="container-site relative z-10">
          <div className="grid items-center gap-10 lg:grid-cols-[35%_minmax(0,1fr)] lg:gap-12">
            <Reveal>
              <div>
                <span className="eyebrow">{t("pages.home.locationsEyebrow")}</span>
                <h2 className="h-display mt-3 text-[clamp(2.1rem,4vw,3.6rem)]">
                  {t("pages.home.locationsTitle1")}
                  <br className="hidden sm:block" /> {t("pages.home.locationsTitle2")}
                </h2>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 items-stretch">
              {locations.map((loc, i) => (
                <Reveal key={loc.id} delay={i * 0.08} className="h-full">
                  <LocationCard location={loc} />
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
