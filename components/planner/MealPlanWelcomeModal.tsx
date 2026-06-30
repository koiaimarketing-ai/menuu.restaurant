"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { MapPin, Footprints, CalendarDays, UtensilsCrossed } from "lucide-react";
import { useMealPlan } from "@/lib/meal-plan-store";
import { computeTotals, fmtRM } from "@/lib/planner";
import { getLocation } from "@/data/locations";
import { useBackdropDismiss } from "@/lib/use-backdrop-dismiss";
import { useLang } from "@/lib/i18n/LanguageProvider";

/**
 * "Continue your previous meal plan?" modal — shown once per fresh entry to the
 * Menu & Planner page, but ONLY when a genuine, non-empty, unexpired saved plan
 * exists. An expired plan (past the next 8 AM KL) is deleted silently with no
 * popup; an empty / first-time plan shows nothing. This is a planning list,
 * never an order, so all wording uses "meal plan".
 */
export function MealPlanWelcomeModal() {
  const plan = useMealPlan();
  const { t: tr } = useLang();
  const reduce = useReducedMotion() ?? false;
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const decided = useRef(false);
  const backdrop = useBackdropDismiss(() => setOpen(false));

  useEffect(() => setMounted(true), []);

  // Decide once per mount (i.e. per fresh entry to the route), after hydration.
  useEffect(() => {
    if (decided.current || !plan.hydrated) return;
    decided.current = true;

    // Arriving via a shared-plan link is an explicit intent — don't interrupt.
    try {
      if (new URLSearchParams(window.location.search).has("plan")) return;
    } catch {
      /* ignore */
    }

    if (plan.items.length === 0) return; // first time / empty → no popup

    // Expired (past the next 8 AM KL)? Delete silently, no popup.
    if (plan.expiresAt != null && Date.now() >= plan.expiresAt) {
      plan.resetPlan();
      return;
    }

    setOpen(true); // valid, non-empty, unexpired
  }, [plan.hydrated, plan.items.length, plan.expiresAt]); // eslint-disable-line react-hooks/exhaustive-deps

  // Lock background scrolling while open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Escape dismisses (keeps the saved plan intact).
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const t = computeTotals(plan.items);
  const branch = plan.branchId ? getLocation(plan.branchId) : null;
  const visitLabel =
    plan.visitMode === "later"
      ? tr("saved.planningAhead")
      : plan.visitMode === "now"
      ? tr("planner.goingNow")
      : tr("saved.notSetYet");

  const continuePlan = () => {
    setOpen(false);
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
  };
  const startNew = () => {
    plan.resetPlan(); // immediate, no second confirmation
    setOpen(false);
    requestAnimationFrame(() => window.scrollTo({ top: 0 }));
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="meal-plan-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="meal-welcome-heading"
          {...backdrop}
        >
          <motion.div
            className="meal-plan-modal"
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 8 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            drag={reduce ? false : "y"}
            dragDirectionLock
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.7 }}
            onDragEnd={(_e, info) => {
              if (info.offset.y > 110) setOpen(false);
            }}
            style={{ touchAction: "pan-y" }}
          >
            <div className="modal-drag-handle sm:hidden" />
            <div className="flex items-start justify-between gap-3">
              <h2 id="meal-welcome-heading" className="text-[1.3rem] font-extrabold leading-tight text-[#3B2A24]">
                {tr("saved.title")}
              </h2>
              <span className="mt-0.5 shrink-0 rounded-full bg-[#F8E8E4] px-3 py-1 text-[11px] font-semibold text-[#7A5048]">
                {tr("saved.badge")}
              </span>
            </div>
            <p className="mt-2 text-[14px] leading-relaxed text-[#9A766B]">{tr("saved.desc")}</p>

            <div className="mt-5 text-left">
              <SummaryRow icon={<MapPin className="h-4 w-4" />} label={tr("saved.outlet")} value={branch?.shortName ?? tr("saved.notSelected")} />
              <SummaryRow
                icon={plan.visitMode === "later" ? <CalendarDays className="h-4 w-4" /> : <Footprints className="h-4 w-4" />}
                label={tr("saved.visitType")}
                value={visitLabel}
              />
              <SummaryRow icon={<UtensilsCrossed className="h-4 w-4" />} label={tr("saved.itemsSelected")} value={`${plan.count}`} />
              <div className="mt-3 flex items-center justify-between border-t border-[#E8DDD5] pt-3">
                <span className="text-base font-extrabold text-[#3B2A24]">{tr("saved.estimatedTotal")}</span>
                <span className="text-2xl font-extrabold text-[#16A34A]">{fmtRM(t.grandTotal)}</span>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={continuePlan}
                autoFocus
                className="cta-whatsapp cta-shine inline-flex min-h-[52px] w-full items-center justify-center rounded-full px-6 text-[15px] font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A]/40 focus-visible:ring-offset-2"
              >
                {tr("saved.continue")}
              </button>
              <button
                type="button"
                onClick={startNew}
                className="inline-flex min-h-[52px] w-full items-center justify-center rounded-full border border-[#E8DDD5] bg-white px-6 text-[15px] font-semibold text-[#3B2A24] transition-colors hover:border-[#E94A36]/50 hover:bg-[#FFF0EC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E94A36]/30 focus-visible:ring-offset-2"
              >
                {tr("saved.startFresh")}
              </button>
            </div>

            <p className="mt-4 text-center text-xs leading-relaxed text-[#9A766B]">{tr("saved.note")}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

function SummaryRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-[#E8DDD5] py-2.5">
      <span className="flex items-center gap-2 text-sm text-[#9A766B]">
        <span className="text-[#E94A36]">{icon}</span>
        {label}
      </span>
      <span className="text-sm font-semibold text-[#3B2A24]">{value}</span>
    </div>
  );
}
