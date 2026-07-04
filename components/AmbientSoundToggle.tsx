"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Volume2, VolumeX } from "lucide-react";
import { useAmbient } from "@/lib/ambient-audio";
import { useMealPlan } from "@/lib/meal-plan-store";
import { useLang } from "@/lib/i18n/LanguageProvider";

/**
 * Small global ambient-sound control, fixed near the bottom-right and respecting
 * the safe-area inset. On small screens it lifts above the mobile meal-plan bar
 * (which appears once items are added) so it never overlaps floating controls.
 * Breathes gently while sound is playing; still while muted.
 */
export function AmbientSoundToggle() {
  const { enabled, toggle } = useAmbient();
  const { t } = useLang();
  const plan = useMealPlan();
  const pathname = usePathname();

  // Compact = viewport where the mobile meal bar / floating controls live.
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const update = () => setCompact(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // The bottom "View Meal Plan" capsule only exists on the planner page (mobile,
  // once items are added). Lift the toggle clear above it there so they never
  // overlap; everywhere else it stays at the normal bottom-right.
  const raised =
    compact && plan.hydrated && plan.count > 0 && pathname.startsWith("/menu");

  // /introduction is a standalone landing page — hide the restaurant chrome.
  if (pathname.startsWith("/introduction")) return null;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={enabled}
      aria-label={
        enabled ? t("misc.ambient.onActivateMute") : t("misc.ambient.offActivatePlay")
      }
      title={enabled ? t("misc.ambient.on") : t("misc.ambient.off")}
      className="ambient-toggle"
      style={raised ? { bottom: "calc(96px + env(safe-area-inset-bottom, 0px))" } : undefined}
    >
      <span className={`ambient-toggle__icon ${enabled ? "ambient-breathe" : ""}`}>
        {enabled ? (
          <Volume2 className="h-5 w-5" aria-hidden="true" />
        ) : (
          <VolumeX className="h-5 w-5" aria-hidden="true" />
        )}
      </span>
    </button>
  );
}
