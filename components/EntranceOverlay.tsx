"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useAmbient } from "@/lib/ambient-audio";
import { useLang } from "@/lib/i18n/LanguageProvider";

/**
 * Cinematic first-entry welcome shown on every full page load. A single seamless
 * background blends warmly from the centre (no hard split); on enter the whole
 * scene gently zooms forward and fades, revealing the Home page underneath like
 * stepping inside the restaurant. Visibility is gated pre-paint by the inline
 * script in the root layout (html[data-entrance="show"]).
 */

// Warm + dark gradient stack baked into each half so the tint splits with it.
const ENTRANCE_BG =
  "radial-gradient(120% 90% at 50% 22%, rgba(106,147,241,0.30), transparent 55%)," +
  "linear-gradient(180deg, rgba(8,17,39,0.55) 0%, rgba(8,17,39,0.32) 38%, rgba(8,17,39,0.72) 100%)," +
  "url('/images/welcome-exterior.png')," +
  "linear-gradient(160deg, #081127 0%, #6b7589 45%, #6b7589 100%)";

// Fixed (deterministic, SSR-safe) drifting dust particles.
const PARTICLES = [
  { l: 12, t: 28, s: 3, d: 14, delay: 0 },
  { l: 26, t: 64, s: 2, d: 18, delay: 2 },
  { l: 41, t: 18, s: 4, d: 22, delay: 1 },
  { l: 58, t: 72, s: 2, d: 16, delay: 3 },
  { l: 69, t: 34, s: 3, d: 20, delay: 0.5 },
  { l: 82, t: 58, s: 2, d: 24, delay: 2.5 },
  { l: 90, t: 22, s: 3, d: 19, delay: 1.5 },
  { l: 34, t: 46, s: 2, d: 21, delay: 4 },
  { l: 50, t: 84, s: 3, d: 17, delay: 1.2 },
  { l: 75, t: 78, s: 2, d: 23, delay: 3.5 },
];

export function EntranceOverlay() {
  const { enable } = useAmbient();
  const { t } = useLang();
  const pathname = usePathname();
  const [gone, setGone] = useState(false);
  const [exiting, setExiting] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  // The pre-paint gate decides whether to show (once per 09:00 day cycle). If it
  // didn't set the attribute, unmount immediately. Dismissed only by entering;
  // internal client navigations keep this unmounted, so it never reappears.
  useEffect(() => {
    if (document.documentElement.getAttribute("data-entrance") !== "show") {
      setGone(true);
    }
    const t = timers.current;
    return () => t.forEach(clearTimeout);
  }, []);

  const handleEnter = () => {
    if (exiting) return;

    // Remember the welcome was seen — next show is the upcoming 09:00 local time.
    try {
      const next = new Date();
      next.setHours(9, 0, 0, 0);
      if (Date.now() >= next.getTime()) next.setDate(next.getDate() + 1);
      localStorage.setItem("warung_welcome_next_show_at", String(next.getTime()));
    } catch {
      /* ignore — non-fatal if storage is unavailable */
    }

    // Start ambient sound unless the visitor previously muted it.
    let muted = false;
    try {
      muted = localStorage.getItem("wj-sound") === "off";
    } catch {
      /* ignore */
    }
    if (!muted) void enable(3);

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    setExiting(true);
    const duration = reduce ? 450 : 1950;
    timers.current.push(
      setTimeout(() => {
        document.documentElement.removeAttribute("data-entrance");
        window.scrollTo(0, 0);
        setGone(true);
      }, duration)
    );
  };

  if (gone || pathname?.startsWith("/introduction")) return null;

  return (
    <div
      id="entrance-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={t("misc.entrance.welcomeLabel")}
      className={`entrance-root ${exiting ? "entrance-exit" : ""}`}
    >
      {/* single seamless background (no centre split) */}
      <div className="entrance-bg" style={{ backgroundImage: ENTRANCE_BG }} aria-hidden="true" />

      {/* ambient mist + dust */}
      <div className="entrance-mist" aria-hidden="true" />
      <div className="entrance-particles" aria-hidden="true">
        {PARTICLES.map((p, i) => (
          <span
            key={i}
            style={{
              left: `${p.l}%`,
              top: `${p.t}%`,
              width: p.s,
              height: p.s,
              animationDuration: `${p.d}s`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>
      {/* mist that briefly gathers at the centre as the doors open */}
      <div className="entrance-center-mist" aria-hidden="true" />

      {/* centred welcome content */}
      <div className="entrance-content">
        <Image
          src="/images/logo.png"
          alt="Menuu"
          width={240}
          height={44}
          priority
          className="entrance-logo"
        />
        <p className="entrance-eyebrow">{t("misc.entrance.eyebrow")}</p>
        <h1 className="entrance-title">{t("misc.entrance.title")}</h1>
        <p className="entrance-sub">
          {t("misc.entrance.sub")}
        </p>

        <button type="button" className="entrance-btn" onClick={handleEnter}>
          <span>{t("misc.entrance.clickMe")}</span>
        </button>
      </div>
    </div>
  );
}
