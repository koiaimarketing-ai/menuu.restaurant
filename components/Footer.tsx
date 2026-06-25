"use client";

import Link from "next/link";
import Image from "next/image";
import { locations, telHref } from "@/data/locations";
import { Instagram, Facebook, MapPin, MessageCircle } from "lucide-react";

const WHATSAPP_COMMUNITY_URL =
  "https://wa.me/60104047058?text=Hi%20Warung%20Jakarta%2C%20I%20want%20to%20join%20the%20WhatsApp%20community";

// TikTok has no lucide icon — small inline brand glyph.
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M16.5 3a5.6 5.6 0 0 0 3.9 1.6v2.7a8.3 8.3 0 0 1-3.9-1v5.9a5.7 5.7 0 1 1-5.7-5.7c.3 0 .5 0 .8.05v2.8a2.9 2.9 0 1 0 2.1 2.8V3h2.7z" />
    </svg>
  );
}

const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://www.instagram.com/warungjakarta.kl/?hl=en", Icon: Instagram },
  { label: "TikTok", href: "https://www.tiktok.com/@warungjakarta.klcw", Icon: TikTokIcon },
  { label: "Facebook", href: "https://www.facebook.com/p/warungjakartaklcw-61563801992205/", Icon: Facebook },
] as const;
import { useLang } from "@/lib/i18n/LanguageProvider";

export function Footer() {
  const { t } = useLang();
  const ss4 = locations[0];
  const klcw = locations[1];
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line-warm bg-[#FAF4EC] text-body">
      <div className="mx-auto w-full max-w-[1280px] px-6 md:px-10 pt-12 pb-5">
        <div className="grid gap-x-12 gap-y-10 md:grid-cols-[1.4fr_0.8fr_1.2fr_1.2fr]">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <Image
                src="/images/logo.png"
                alt="Warung Jakarta"
                width={52}
                height={52}
                className="h-12 w-12 rounded-full"
              />
              <span className="text-lg text-heading" style={{ fontFamily: "var(--font-fraunces)" }}>
                Warung Jakarta
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-body">
              {t("footer.tagline")}
            </p>
            <div className="mt-5 flex gap-3">
              {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="grid h-9 w-9 place-items-center rounded-full border border-line-warm text-body transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <nav className="text-sm" aria-label="Footer navigation">
            <h3 className="mb-4 font-semibold text-heading">{t("footer.explore")}</h3>
            <ul className="space-y-2.5">
              <li><Link href="/" className="transition-colors hover:text-primary">{t("nav.home")}</Link></li>
              <li><Link href="/menu" className="transition-colors hover:text-primary">{t("nav.exploreMenu")}</Link></li>
              <li><Link href="/contact" className="transition-colors hover:text-primary">{t("footer.locations")}</Link></li>
              <li><Link href="/our-story" className="transition-colors hover:text-primary">{t("footer.aboutUs")}</Link></li>
              <li><Link href="/contact" className="transition-colors hover:text-primary">{t("footer.contact")}</Link></li>
              <li><Link href="/menu" className="transition-colors hover:text-primary">{t("footer.planYourMeal")}</Link></li>
            </ul>
          </nav>

          {/* Our Branches */}
          <div className="text-sm">
            <h3 className="mb-4 font-semibold text-heading">{t("footer.ourBranches")}</h3>
            <div className="space-y-4">
              {[
                { l: ss4, hours: t("footer.hoursSs4") },
                { l: klcw, hours: t("footer.hoursKlcw") },
              ].map(({ l, hours }) => (
                <address key={l.id} className="not-italic leading-relaxed">
                  <p className="flex items-start gap-1.5 font-semibold text-heading">
                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" /> {l.name}
                  </p>
                  <p className="text-body">{l.addressLines.slice(0, 2).join(", ")}</p>
                  <p className="text-ink-secondary">{hours}</p>
                  <a href={telHref(l.phone)} className="transition-colors hover:text-primary">
                    {l.phone}
                  </a>
                </address>
              ))}
            </div>
          </div>

          {/* WhatsApp community */}
          <div className="text-sm">
            <h3 className="mb-4 font-semibold text-heading">{t("footer.whatsappTitle")}</h3>
            <p className="leading-relaxed text-body">{t("footer.whatsappText")}</p>
            <a
              href={WHATSAPP_COMMUNITY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp mt-4 inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green/40"
            >
              <MessageCircle className="h-4 w-4" />
              {t("footer.joinWhatsapp")}
            </a>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-10 flex flex-col items-center gap-2 border-t border-line-warm pt-6 text-center text-xs text-ink-secondary sm:flex-row sm:justify-between sm:text-left">
          <span>© {year} Warung Jakarta. Rasa Original.</span>
          <span>{t("footer.bottomTagline")}</span>
        </div>
      </div>
    </footer>
  );
}
