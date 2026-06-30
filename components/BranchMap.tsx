"use client";

import type { Location } from "@/data/locations";
import { useLang } from "@/lib/i18n/LanguageProvider";

export function BranchMap({ location }: { location: Location }) {
  const { t } = useLang();
  const q = encodeURIComponent(location.mapQuery);
  // q=ADDRESS&output=embed renders a Google map centred on the geocoded address
  // with a visible red marker — no API key required.
  const mapSrc = `https://www.google.com/maps?q=${q}&output=embed`;
  const googleDir = `https://www.google.com/maps/dir/?api=1&destination=${q}`;
  const wazeUrl = location.wazeUrl;

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-line-light bg-white shadow-soft">
      <div className="relative w-full flex-1" style={{ minHeight: 240 }}>
        <iframe
          title={`Google Map location for ${location.name}`}
          src={mapSrc}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>

      {/* navigation actions */}
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <span className="text-sm font-medium text-ink-secondary">{t("pages.map.getDirections")}</span>
        <div className="flex items-center gap-3">
          <a
            href={googleDir}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${location.name} in Google Maps`}
            title="Open in Google Maps"
            className="grid h-[46px] w-[46px] place-items-center rounded-full border border-line-warm bg-white/85 shadow-[0_6px_18px_rgba(8,17,39,0.08)] transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:scale-[1.04] hover:shadow-[0_10px_24px_rgba(8,17,39,0.13)] active:scale-95 motion-reduce:transform-none"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icons/google-maps.svg" alt="" className="h-6 w-6 object-contain" />
          </a>
          <a
            href={wazeUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${location.name} in Waze`}
            title="Open in Waze"
            className="grid h-[46px] w-[46px] place-items-center rounded-full border border-line-warm bg-white/85 shadow-[0_6px_18px_rgba(8,17,39,0.08)] transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:scale-[1.04] hover:shadow-[0_10px_24px_rgba(8,17,39,0.13)] active:scale-95 motion-reduce:transform-none"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icons/waze.svg" alt="" className="h-6 w-6 object-contain" />
          </a>
        </div>
      </div>
    </div>
  );
}
