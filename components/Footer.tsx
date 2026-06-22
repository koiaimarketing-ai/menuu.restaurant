"use client";

import Link from "next/link";
import Image from "next/image";
import { locations, telHref } from "@/data/locations";
import { Instagram, Facebook, MapPin, Send } from "lucide-react";
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
              {[Instagram, Facebook].map((Icon, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={i === 0 ? "Instagram (coming soon)" : "Facebook (coming soon)"}
                  className="grid h-9 w-9 place-items-center rounded-full border border-line-warm text-body transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                >
                  <Icon className="h-4 w-4" />
                </button>
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

          {/* Newsletter */}
          <div className="text-sm">
            <h3 className="mb-4 font-semibold text-heading">{t("footer.newsletter")}</h3>
            <p className="leading-relaxed text-body">{t("footer.newsletterText")}</p>
            <div className="mt-4 flex gap-2">
              <input
                type="email"
                placeholder={t("footer.emailPlaceholder")}
                aria-label="Email address"
                className="h-10 min-w-0 flex-1 rounded-lg border border-line-warm bg-white px-3 text-sm text-ink-primary outline-none placeholder:text-ink-muted focus:border-primary focus:ring-2 focus:ring-primary/15"
              />
              <button
                type="button"
                aria-label="Subscribe to the newsletter"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary text-white transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
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
