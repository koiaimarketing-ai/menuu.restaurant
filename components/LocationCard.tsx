"use client";

import Image from "next/image";
import type { Location } from "@/data/locations";
import { waHref } from "@/data/locations";
import { LiveStatus } from "./LiveStatus";
import { MapPin, MessageCircle } from "lucide-react";
import { useLang } from "@/lib/i18n/LanguageProvider";

const BRANCH_IMAGE: Record<string, string> = {
  ss4: "/images/ss4-branch.png",
  "kl-central-walk": "/images/klcw-branch.png",
};

const directionsHref = (loc: Location) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.mapQuery)}`;

export function LocationCard({ location }: { location: Location }) {
  const { t } = useLang();
  const isSS4 = location.id === "ss4";
  const waUrl = location.whatsapp ? waHref(location.whatsapp) : null;
  const img = BRANCH_IMAGE[location.id];

  return (
    <article
      className="flex h-full flex-col overflow-hidden rounded-[20px] border border-[rgba(83,48,30,0.12)] bg-[rgba(255,251,246,0.97)] shadow-[0_18px_45px_rgba(71,39,24,0.10)] transition-transform duration-200 hover:-translate-y-[3px]"
    >
      {/* Location photo + branch badge */}
      <div className="relative h-[190px] w-full sm:h-[200px]">
        <Image
          src={img}
          alt={`${location.name} restaurant`}
          fill
          sizes="(max-width: 1024px) 100vw, 360px"
          className="object-cover"
        />
        <span
          className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-bold text-white shadow-sm ${
            isSS4 ? "bg-green" : "bg-primary"
          }`}
        >
          {location.shortName}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-xl text-heading" style={{ fontFamily: "var(--font-fraunces)" }}>
          {location.name}
        </h3>

        <div className="mt-2">
          <LiveStatus location={location} showDetail />
        </div>

        <address className="mt-3 flex gap-2 not-italic text-[13px] leading-relaxed text-ink-secondary">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <span>
            {location.addressLines.slice(0, 3).map((l) => (
              <span key={l} className="block">
                {l}
              </span>
            ))}
          </span>
        </address>

        <div className="mt-auto flex flex-wrap gap-2 pt-5">
          <a
            href={directionsHref(location)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary !min-h-0 flex-1 justify-center whitespace-nowrap !px-3.5 !py-2.5 text-sm"
          >
            <MapPin className="h-4 w-4" /> {t("pages.locationCard.getDirections")}
          </a>
          {waUrl && (
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp !min-h-0 flex-1 justify-center whitespace-nowrap !px-3.5 !py-2.5 text-sm"
            >
              <MessageCircle className="h-4 w-4" /> {t("pages.locationCard.whatsapp")}
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
