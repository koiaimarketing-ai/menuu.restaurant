"use client";

import { useEffect, useState } from "react";

const BASE = "https://menuurestaurant.vercel.app/menu?preview=1&embed=1&demo=true&fresh=true";

/** Phone frame showing the real interactive MENUU menu page via iframe.
 *  On every page load a fresh cache-busting param is added so the demo starts
 *  as a new visitor. The actual saved-state clearing (?demo=true) must be
 *  handled inside the menu app itself. */
export function PhonePreview({ className = "" }: { className?: string }) {
  const [src, setSrc] = useState(BASE);

  // Client-only cache-buster (avoids SSR hydration mismatch) → iframe reloads fresh each visit.
  useEffect(() => {
    setSrc(`https://menuurestaurant.vercel.app/menu?preview=1&embed=1&demo=true&fresh=${Date.now()}`);
  }, []);

  return (
    <div className={`relative mx-auto ${className}`}>
      {/* soft floor shadow */}
      <div className="absolute -bottom-6 left-1/2 h-10 w-3/4 -translate-x-1/2 rounded-[50%] bg-navy/20 blur-2xl" />

      {/* phone frame — clean, no notch */}
      <div className="phone-preview-frame relative mx-auto h-[760px] w-[min(92vw,390px)] rounded-[48px] bg-navy p-3 shadow-[var(--shadow-float)] ring-1 ring-black/10 sm:h-[820px] sm:w-[410px]">
        <div className="h-full w-full overflow-hidden rounded-[38px] bg-white">
          <iframe
            key={src}
            src={src}
            title="MENUU interactive menu preview"
            loading="lazy"
            className="h-full w-full border-0"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />
        </div>
      </div>
    </div>
  );
}
