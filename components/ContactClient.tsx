"use client";

import { useRef, useState } from "react";
import { locations, telHref, waHref, type Location } from "@/data/locations";
import { BusinessHours } from "./BusinessHours";
import { BranchMap } from "./BranchMap";
import { LiveStatus } from "./LiveStatus";
import { MapPin, Phone, MessageCircle, ArrowRight, Images, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { AboutPromotionMarquee } from "./planner/PromotionMarquee";
import { GUEST_AVATARS } from "@/lib/avatars";
import { useLang } from "@/lib/i18n/LanguageProvider";

const branchImage = (id: string) =>
  id === "ss4" ? "/images/ss4-branch.png" : "/images/klcw-branch.png";

const REVIEW_PLATFORMS = ["Google", "Facebook", "Instagram", "TripAdvisor"];

// Map known facility labels to translation keys; unknown labels fall back to raw.
const FACILITY_KEYS: Record<string, string> = {
  "Outdoor seating": "pages.contact.facility.outdoorSeating",
  "Vegetarian options": "pages.contact.facility.vegetarianOptions",
  "Dine-in": "pages.contact.facility.dineIn",
  Lunch: "pages.contact.facility.lunch",
  Dinner: "pages.contact.facility.dinner",
};

export function ContactClient() {
  const { t } = useLang();
  const [activeId, setActiveId] = useState(locations[0].id);
  const active = locations.find((l) => l.id === activeId)!;
  const waUrl = active.whatsapp ? waHref(active.whatsapp) : null;
  const mainRef = useRef<HTMLDivElement>(null);

  return (
    <div className="container-site pb-20">
      {/* segmented branch toggle */}
      <div
        role="tablist"
        aria-label="Choose a location"
        className="mx-auto grid max-w-md grid-cols-2 gap-1 rounded-full border border-line-light bg-white p-1 shadow-soft sm:mx-0 sm:inline-grid sm:w-auto sm:grid-flow-col"
      >
        {locations.map((l) => (
          <button
            key={l.id}
            role="tab"
            aria-selected={activeId === l.id}
            onClick={() => setActiveId(l.id)}
            className={`rounded-full px-6 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
              activeId === l.id ? "bg-primary text-white shadow-sm" : "text-body hover:text-heading"
            }`}
          >
            {l.shortName}
          </button>
        ))}
      </div>

      {/* MOBILE-ONLY: restaurant photo directly below the SS4 / KLCW tabs */}
      <div className="mt-6 lg:hidden">
        <BranchPhoto active={active} />
      </div>

      {/* main branch section */}
      <div ref={mainRef} className="mt-6 grid scroll-mt-28 items-start gap-6 lg:mt-7 lg:grid-cols-[0.92fr_1.08fr] lg:items-stretch">
        {/* LEFT: branch info card */}
        <div className="rounded-[26px] border border-line-warm bg-white p-6 shadow-soft sm:p-7">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />{" "}
            {t("pages.contact.ourBranch").replace("{branch}", active.shortName)}
          </p>
          <h2 className="h-display mt-2 text-[clamp(1.6rem,3vw,2.2rem)]">{active.name}</h2>

          <div className="mt-3">
            <LiveStatus location={active} showDetail />
          </div>

          <address className="mt-5 flex gap-2.5 not-italic text-body">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <span>
              {active.addressLines.map((l) => (
                <span key={l} className="block leading-relaxed">
                  {l}
                </span>
              ))}
            </span>
          </address>

          <div className="mt-5 flex flex-wrap gap-3">
            {active.phone ? (
              <a href={telHref(active.phone)} className="btn btn-secondary !min-h-0 flex-1 justify-center !py-2.5 text-sm sm:flex-none">
                <Phone className="h-4 w-4" /> {active.phone}
              </a>
            ) : (
              <span className="btn btn-secondary !min-h-0 flex-1 cursor-default justify-center !py-2.5 text-sm opacity-60 sm:flex-none">
                {t("pages.contact.phoneComingSoon")}
              </span>
            )}
            {waUrl && (
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp !min-h-0 flex-1 justify-center !py-2.5 text-sm sm:flex-none"
              >
                <MessageCircle className="h-4 w-4" /> {t("pages.contact.whatsapp")}
              </a>
            )}
          </div>

          {active.facilities.length > 0 && (
            <div className="mt-6">
              <h3 className="mb-2 text-sm font-semibold text-heading">{t("pages.contact.facilities")}</h3>
              <div className="flex flex-wrap gap-2">
                {active.facilities.map((f) => (
                  <span
                    key={f}
                    className="rounded-full border border-line-light bg-secondary px-3 py-1 text-xs text-body"
                  >
                    {FACILITY_KEYS[f] ? t(FACILITY_KEYS[f]) : f}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 rounded-2xl border border-line-warm bg-secondary/50 p-4">
            <BusinessHours location={active} />
          </div>

          <Link
            href="/menu"
            className="btn btn-primary group mt-6 w-full justify-between"
          >
            {t("pages.contact.viewMenuPlan")}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* RIGHT: photo + map media column — on desktop it matches the left card's
            height, split ~42% photo / ~58% map. On mobile the photo already shows
            above (below the SS4/KLCW tabs), so this copy is hidden there. */}
        <div className="branch-media-column space-y-5 lg:grid lg:h-full lg:min-h-0 lg:grid-rows-[42fr_58fr] lg:gap-4 lg:space-y-0">
          <div className="hidden lg:block lg:min-h-0">
            <BranchPhoto active={active} className="h-full" />
          </div>

          {/* MOBILE-ONLY: review / social proof, placed directly above the map */}
          <BranchReview className="lg:hidden" />

          {/* BranchMap supplies its own rounded card + Get directions / Open in Maps row */}
          <div className="min-w-0 lg:h-full lg:min-h-0">
            <BranchMap location={active} />
          </div>
        </div>
      </div>

      {/* promotion banners (replaces the old other-branch card) */}
      <AboutPromotionMarquee />
    </div>
  );
}

/** Restaurant photo card with the "View photos" pill (shared by the mobile copy
    below the tabs and the desktop media column). */
function BranchPhoto({ active, className = "" }: { active: Location; className?: string }) {
  const { t } = useLang();
  return (
    <div className={`relative overflow-hidden rounded-[24px] shadow-soft ${className}`}>
      <Image
        src={branchImage(active.id)}
        alt={`Warung Jakarta ${active.shortName} restaurant`}
        width={1556}
        height={1029}
        sizes="(max-width: 1024px) 100vw, 620px"
        className="aspect-[16/10] w-full object-cover lg:aspect-auto lg:h-full"
      />
      <a
        href={branchImage(active.id)}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-heading shadow-sm backdrop-blur transition-colors hover:bg-white"
      >
        <Images className="h-3.5 w-3.5" /> {t("pages.contact.viewPhotos")}
      </a>
    </div>
  );
}

/** Review / social-proof card. Shown in the hero on desktop; on mobile this copy
    renders inside ContactClient, directly above the map. */
function BranchReview({ className = "" }: { className?: string }) {
  const { t } = useLang();
  return (
    <div className={`rounded-3xl border border-line-warm bg-white/95 p-5 shadow-soft sm:p-6 ${className}`}>
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
        <div>
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-3.5 w-3.5 fill-[#E8943A] text-[#E8943A]" />
            ))}
          </div>
          <p className="mt-0.5 text-sm">
            <span className="font-bold text-heading">4.4</span>{" "}
            <span className="text-ink-secondary">{t("pages.contact.reviewsCount")}</span>
          </p>
        </div>
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
  );
}
