"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Soup, HeartHandshake, Sparkles, Check } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { GUEST_AVATARS } from "@/lib/avatars";
import { ReviewMeta } from "@/components/ReviewStrip";
import { useLang } from "@/lib/i18n/LanguageProvider";

const VALUES = [
  { Icon: Soup, titleKey: "pages.story.value1Title", bodyKey: "pages.story.value1Body" },
  { Icon: HeartHandshake, titleKey: "pages.story.value2Title", bodyKey: "pages.story.value2Body" },
  { Icon: Sparkles, titleKey: "pages.story.value3Title", bodyKey: "pages.story.value3Body" },
  { Icon: MapPin, titleKey: "pages.story.value4Title", bodyKey: "pages.story.value4Body" },
];

const COMMITMENTS = [
  { titleKey: "pages.story.commit1Title", bodyKey: "pages.story.commit1Body" },
  { titleKey: "pages.story.commit2Title", bodyKey: "pages.story.commit2Body" },
  { titleKey: "pages.story.commit3Title", bodyKey: "pages.story.commit3Body" },
  { titleKey: "pages.story.commit4Title", bodyKey: "pages.story.commit4Body" },
];

export function StoryContent() {
  const { t } = useLang();

  return (
    <>
      {/* ===================== HERO ===================== */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/interior.png"
            alt="Inside Warung Jakarta"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#2A1612]/85 via-[#2A1612]/70 to-[#2A1612]/92" />
        </div>
        <div className="container-site relative py-28 md:py-40 text-white">
          <Reveal>
            <span className="eyebrow !text-coral">{t("pages.story.heroEyebrow")}</span>
            <h1
              className="mt-4 max-w-3xl text-[clamp(2.6rem,6.5vw,5rem)] leading-[1.02]"
              style={{ fontFamily: "var(--font-fraunces)", fontWeight: 500, letterSpacing: "-0.02em" }}
            >
              {t("pages.story.heroTitle1")}
              <br />
              {t("pages.story.heroTitle2")}
            </h1>
            <div className="mt-7 max-w-2xl space-y-4 text-[17px] leading-relaxed text-white/85">
              <p>{t("pages.story.heroP1")}</p>
              <p>{t("pages.story.heroP2")}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===================== REVIEW STRIP (overlaps hero) ===================== */}
      <div className="container-site relative z-10 -mt-9 sm:-mt-11">
        <Reveal>
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 rounded-2xl border border-line-warm bg-white/95 px-5 py-4 shadow-soft sm:flex-row sm:gap-5 sm:px-6">
            <div className="flex shrink-0 items-center -space-x-2.5">
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
            <ReviewMeta className="shrink-0" />
            <p className="text-center text-sm leading-relaxed text-body sm:flex-1 sm:text-left">
              {t("pages.story.reviewQuote")}
            </p>
            <Link href="/#from-our-guests" className="shrink-0 text-sm font-semibold text-primary hover:underline">
              {t("pages.story.readReviews")}
            </Link>
          </div>
        </Reveal>
      </div>

      {/* ===================== SECTION 1 — WHERE OUR STORY BEGAN ===================== */}
      <section className="section">
        <div className="container-site grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <StoryImage src="/images/menu-mie-ayam.png" alt="A bowl of Mie Ayam" />
          </Reveal>
          <Reveal delay={0.1}>
            <span className="eyebrow">{t("pages.story.s1Eyebrow")}</span>
            <h2 className="h-display mt-3 text-[clamp(1.9rem,4vw,3rem)]">{t("pages.story.s1Title")}</h2>
            <div className="mt-5 space-y-4 text-body leading-relaxed">
              <p>{t("pages.story.s1P1")}</p>
              <p>{t("pages.story.s1P2")}</p>
              <p>{t("pages.story.s1P3")}</p>
              <p>{t("pages.story.s1P4")}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===================== SECTION 2 — THE PEOPLE BEHIND THE WARUNG ===================== */}
      <section className="section bg-secondary">
        <div className="container-site grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal className="lg:order-2">
            <StoryImage src="/images/signature-dish.png" alt="A Warung Jakarta signature dish" />
          </Reveal>
          <Reveal delay={0.1} className="lg:order-1">
            <span className="eyebrow">{t("pages.story.s2Eyebrow")}</span>
            <h2 className="h-display mt-3 text-[clamp(1.9rem,4vw,3rem)]">
              {t("pages.story.s2Title")}
            </h2>
            <div className="mt-5 space-y-4 text-body leading-relaxed">
              <p>{t("pages.story.s2P1")}</p>
              <p>{t("pages.story.s2P2")}</p>
              <p>{t("pages.story.s2P3")}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===================== SECTION 3 — WHY KUALA LUMPUR ===================== */}
      <section className="section">
        <div className="container-site grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <StoryImage src="/images/klcw-branch.png" alt="Warung Jakarta KL Central Walk branch" />
          </Reveal>
          <Reveal delay={0.1}>
            <span className="eyebrow">{t("pages.story.s3Eyebrow")}</span>
            <h2 className="h-display mt-3 text-[clamp(1.9rem,4vw,3rem)]">
              {t("pages.story.s3Title")}
            </h2>
            <div className="mt-5 space-y-4 text-body leading-relaxed">
              <p>{t("pages.story.s3P1")}</p>
              <p>{t("pages.story.s3P2")}</p>
              <p>{t("pages.story.s3P3")}</p>
              <p>{t("pages.story.s3P4")}</p>
              <p>{t("pages.story.s3P5")}</p>
              <p>{t("pages.story.s3P6")}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===================== SECTION 4 — TWO CULTURES, ONE TABLE ===================== */}
      <section className="relative overflow-hidden bg-[#2A1612] text-white">
        <div className="absolute inset-0 opacity-[0.18]">
          <Image src="/images/dish-window.png" alt="" fill className="object-cover" aria-hidden />
        </div>
        <div className="container-site relative py-12 md:py-16">
          <Reveal>
            <div className="mx-auto max-w-3xl text-center">
              <span className="eyebrow !text-coral">{t("pages.story.s4Eyebrow")}</span>
              <h2
                className="mt-4 text-[clamp(2rem,4.5vw,3.4rem)] leading-[1.05]"
                style={{ fontFamily: "var(--font-fraunces)", fontWeight: 500 }}
              >
                {t("pages.story.s4Title1")}
                <br />
                {t("pages.story.s4Title2")}
              </h2>
              <div className="mt-6 space-y-4 text-[17px] leading-relaxed text-white/85">
                <p>{t("pages.story.s4P1")}</p>
                <p>{t("pages.story.s4P2")}</p>
                <p>{t("pages.story.s4P3")}</p>
                <p>{t("pages.story.s4P4")}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===================== SECTION 5 — WHAT MAKES US SPECIAL ===================== */}
      <section className="section">
        <div className="container-site">
          <Reveal>
            <div className="max-w-3xl">
              <span className="eyebrow">{t("pages.story.s5Eyebrow")}</span>
              <h2 className="h-display mt-3 text-[clamp(1.9rem,4vw,3rem)]">
                {t("pages.story.s5Title")}
              </h2>
              <div className="mt-5 space-y-4 text-body leading-relaxed">
                <p>{t("pages.story.s5P1")}</p>
                <p>{t("pages.story.s5P2")}</p>
                <p>{t("pages.story.s5P3")}</p>
              </div>
            </div>
          </Reveal>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map(({ Icon, titleKey, bodyKey }, i) => (
              <Reveal key={titleKey} delay={i * 0.06}>
                <div className="h-full rounded-3xl border border-line-light bg-white p-6 shadow-soft">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary-soft text-primary">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold text-heading">{t(titleKey)}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-body">{t(bodyKey)}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== SECTION 6 — OUR COMMITMENT ===================== */}
      <section className="section bg-secondary">
        <div className="container-site grid gap-10 lg:grid-cols-[42%_minmax(0,1fr)] lg:gap-16">
          <Reveal>
            <span className="eyebrow">{t("pages.story.s6Eyebrow")}</span>
            <h2 className="h-display mt-3 text-[clamp(1.9rem,4vw,3rem)]">
              {t("pages.story.s6Title")}
            </h2>
            <div className="mt-5 space-y-4 text-body leading-relaxed">
              <p>{t("pages.story.s6P1")}</p>
              <p>{t("pages.story.s6P2")}</p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <ul className="space-y-4">
              {COMMITMENTS.map(({ titleKey, bodyKey }) => (
                <li
                  key={titleKey}
                  className="flex gap-4 rounded-2xl border border-line-warm bg-white p-5"
                >
                  <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary-soft text-primary">
                    <Check className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="font-semibold text-heading">{t(titleKey)}</p>
                    <p className="mt-1 text-sm leading-relaxed text-body">{t(bodyKey)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ===================== SECTION 7 — WHAT DRIVES US ===================== */}
      <section className="section">
        <div className="container-site">
          <Reveal>
            <div className="mx-auto max-w-3xl text-center">
              <span className="eyebrow">{t("pages.story.s7Eyebrow")}</span>
              <h2 className="h-display mt-3 text-[clamp(1.9rem,4vw,3rem)]">{t("pages.story.s7Title")}</h2>
              <div className="mt-5 space-y-4 text-body leading-relaxed">
                <p>{t("pages.story.s7P1")}</p>
                <p>{t("pages.story.s7P2")}</p>
                <p>{t("pages.story.s7P3")}</p>
                <p>{t("pages.story.s7P4")}</p>
              </div>
              <div className="mt-8 flex flex-col items-center gap-2 text-[clamp(1.3rem,2.6vw,1.9rem)] text-heading" style={{ fontFamily: "var(--font-fraunces)" }}>
                <span>{t("pages.story.s7Line1")}</span>
                <span>{t("pages.story.s7Line2")}</span>
                <span>{t("pages.story.s7Line3")}</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===================== CLOSING ===================== */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/dish-topdown.png" alt="" fill className="object-cover" aria-hidden />
          <div className="absolute inset-0 bg-[#2A1612]/85" />
        </div>
        <div className="container-site relative py-12 md:py-16 text-center text-white">
          <Reveal>
            <span className="eyebrow !text-coral">{t("pages.story.closingEyebrow")}</span>
            <h2
              className="mx-auto mt-4 max-w-3xl text-[clamp(2rem,5vw,3.6rem)] leading-[1.06]"
              style={{ fontFamily: "var(--font-fraunces)", fontWeight: 500 }}
            >
              {t("pages.story.closingTitle")}
            </h2>
            <div className="mx-auto mt-6 max-w-2xl space-y-4 text-[17px] leading-relaxed text-white/85">
              <p>{t("pages.story.closingP1")}</p>
              <p>{t("pages.story.closingP2")}</p>
            </div>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Link href="/menu" className="btn btn-primary">
                {t("pages.story.closingCta1")} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="btn bg-white/10 text-white border border-white/30 hover:bg-white/20"
              >
                {t("pages.story.closingCta2")}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function StoryImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div
      className="relative aspect-[4/3] w-full overflow-hidden rounded-[28px]"
      style={{ boxShadow: "0 22px 50px rgba(58,30,26,0.12), 0 4px 12px rgba(58,30,26,0.05)" }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 1024px) 100vw, 600px"
        className="object-cover"
      />
    </div>
  );
}
