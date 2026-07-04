"use client";

import { useEffect, useRef, useState } from "react";
import { locations, telHref, waHref, type Location } from "@/data/locations";
import { BusinessHours } from "./BusinessHours";
import { BranchMap } from "./BranchMap";
import { LiveStatus } from "./LiveStatus";
import { MapPin, Phone, Mail, ArrowRight, Images } from "lucide-react";
import { ReviewMeta } from "@/components/ReviewStrip";

// Official-style WhatsApp glyph (phone in a speech bubble) — recognisable as
// WhatsApp, unlike the generic chat-bubble icon.
function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" className={className} aria-hidden="true">
      <path d="M16 3C9.4 3 4 8.4 4 15c0 2.1.6 4.2 1.6 6L4 29l8.2-1.6c1.8 1 3.8 1.5 5.8 1.4 6.6 0 12-5.4 12-12S22.6 3 16 3zm0 21.8c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.4.7.7-3.3-.2-.4c-1-1.6-1.5-3.4-1.5-5.2 0-5.4 4.4-9.8 9.8-9.8s9.8 4.4 9.8 9.8-4.4 9.8-9.8 9.8zm5.4-7.3c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.2-.2.3-.7.8-.9 1-.2.2-.3.2-.6.1-1.7-.8-2.8-1.5-3.9-3.4-.3-.5.3-.5.8-1.5.1-.2 0-.4 0-.6l-1-2.3c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.3 5.2 4.6 2.9 1.2 2.9.8 3.5.8.5 0 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3z" />
    </svg>
  );
}
import Link from "next/link";
import Image from "next/image";
import { AboutPromotionMarquee } from "./planner/PromotionMarquee";
import { GUEST_AVATARS } from "@/lib/avatars";
import { useLang } from "@/lib/i18n/LanguageProvider";

// Outlet photo card auto-rotates between the interior and exterior shots.
const LOCATION_IMAGES = [
  { src: "/images/loc-interior.png", alt: "Restaurant interior" },
  { src: "/images/loc-exterior.png", alt: "Restaurant exterior" },
];

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
      {/* segmented branch toggle — only when there is more than one outlet */}
      {locations.length > 1 && (
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
      )}

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

          <a
            href="mailto:sales@menuu.asia"
            className="mt-3 flex items-center gap-2.5 text-body transition-colors hover:text-primary"
          >
            <Mail className="h-5 w-5 shrink-0 text-primary" /> sales@menuu.asia
          </a>

          <div className="mt-5 flex items-center gap-3">
            {active.phone ? (
              <a href={telHref(active.phone)} className="btn btn-secondary !min-h-0 flex h-[56px] flex-1 items-center justify-center !py-2.5 text-sm sm:h-auto sm:flex-none">
                <Phone className="h-4 w-4" /> {active.phone}
              </a>
            ) : (
              <span className="btn btn-secondary !min-h-0 flex h-[56px] flex-1 cursor-default items-center justify-center !py-2.5 text-sm opacity-60 sm:h-auto sm:flex-none">
                {t("pages.contact.phoneComingSoon")}
              </span>
            )}
            {waUrl && (
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t("pages.contact.whatsapp")}
                className="btn btn-whatsapp !min-h-0 flex h-[56px] w-[56px] shrink-0 items-center justify-center !rounded-full !p-0 text-sm sm:h-auto sm:w-auto sm:flex-none sm:!rounded-full sm:!px-4 sm:!py-2.5"
              >
                <WhatsAppGlyph className="h-7 w-7 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">{t("pages.contact.whatsapp")}</span>
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
  const [idx, setIdx] = useState(0);
  // Cross-fade between interior/exterior every 5s.
  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % LOCATION_IMAGES.length), 5000);
    return () => clearInterval(id);
  }, []);
  void active; // single outlet — both photos apply
  return (
    <div className={`relative overflow-hidden rounded-[24px] shadow-soft ${className}`}>
      <div className="relative aspect-[16/10] w-full lg:aspect-auto lg:h-full">
        {LOCATION_IMAGES.map((img, i) => (
          <Image
            key={img.src}
            src={img.src}
            alt={img.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 620px"
            priority={i === 0}
            className={`object-cover transition-opacity duration-700 ease-in-out ${
              i === idx ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>
      <a
        href={LOCATION_IMAGES[idx].src}
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
              alt="Menuu customer"
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
  );
}
