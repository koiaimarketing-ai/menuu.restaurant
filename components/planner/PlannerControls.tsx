"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { MapPin, Footprints, CalendarDays, Bike, Check } from "lucide-react";
import { locations, getLocation, type Location } from "@/data/locations";
import { useMealPlan, type BranchId, type PlanType } from "@/lib/meal-plan-store";
import {
  getLiveStatus,
  todayHoursLabel,
  getOutletStatusInfo,
  type OutletStatusState,
} from "@/lib/operating-status";
import { StatusBadge } from "../StatusBadge";
import { AppointmentPicker } from "./AppointmentPicker";
import { isClosed } from "./Calendar";
import { useLang } from "@/lib/i18n/LanguageProvider";
import type { TKey } from "@/lib/i18n/translations";

const PLANS: { id: PlanType; labelKey: TKey; icon: React.ReactNode }[] = [
  { id: "going", labelKey: "planner.goingNow", icon: <Footprints className="h-4 w-4" /> },
  { id: "delivery", labelKey: "planner.deliveryNow", icon: <Bike className="h-4 w-4" /> },
  { id: "rsvp", labelKey: "planner.rsvp", icon: <CalendarDays className="h-4 w-4" /> },
];

export function PlannerControls() {
  const plan = useMealPlan();
  const { t } = useLang();
  const reduce = useReducedMotion() ?? false;
  const branch = getLocation(plan.branchId ?? "ss4")!;
  const planType = plan.planType;

  // Bubble-absorb UI state. The actual selection still lives in the store
  // (branchId / planType) — these only control the collapse/expand visuals so
  // no business logic changes.
  // With 2+ outlets start collapsed so the card reads as a "select location"
  // dropdown trigger; tapping it expands the options with the existing motion.
  const [outletCollapsed, setOutletCollapsed] = useState(locations.length > 1);

  const chooseBranch = (id: BranchId) => {
    if (id !== plan.branchId) {
      plan.setBranch(id);
      if (plan.visitDate) {
        const [y, m, d] = plan.visitDate.split("-").map(Number);
        if (isClosed(getLocation(id)!, y, m - 1, d)) {
          plan.setVisit(plan.visitMode ?? "now", null, null);
        }
      }
    }
  };

  // Expanded → pick an outlet then absorb the rest. Collapsed → reopen choices.
  const handleOutletClick = (id: BranchId) => {
    if (outletCollapsed) {
      setOutletCollapsed(false);
      return;
    }
    chooseBranch(id);
    setOutletCollapsed(true);
  };

  return (
    <div className="space-y-5">
      <div className="visit-selection-layout">
        {/* ---- Outlet selector ---- */}
        <section className="outlet-selector">
          <p className="selector-label">{t("planner.selectOutlet")}</p>
          <div
            role="radiogroup"
            aria-label="Select your preferred outlet"
            className={`outlet-options ${outletCollapsed ? "is-collapsed" : "is-expanded"}`}
          >
            {locations.map((l) => (
              <OutletCard
                key={l.id}
                loc={l}
                selected={branch.id === l.id}
                onSelect={() => handleOutletClick(l.id)}
              />
            ))}
          </div>
        </section>

        {/* ---- Whats ur plan? — rounded segmented control ---- */}
        <section className="plan-selector">
          <p className="selector-label">{t("planner.whatsYourPlan")}</p>
          <div className="visit-segment" role="tablist" aria-label="What's your plan?">
            {PLANS.map((p) => {
              const active = planType === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => plan.setPlanType(p.id)}
                  className={`visit-seg-option ${active ? "is-active" : ""}`}
                >
                  {active && (
                    <motion.span
                      layoutId="activePlanPill"
                      className="visit-seg-pill"
                      transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }}
                      aria-hidden
                    />
                  )}
                  <span className="visit-seg-label">
                    {p.icon}
                    <span>{t(p.labelKey)}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      </div>

      {/* ---- RSVP: existing reservation / appointment flow ---- */}
      <AnimatePresence initial={false}>
        {planType === "rsvp" && plan.visitMode === "later" && (
          <motion.div
            initial={reduce ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={reduce ? undefined : { opacity: 0, height: 0 }}
            transition={{ duration: 0.32, ease: [0.22, 0.8, 0.2, 1] }}
            className="overflow-hidden"
          >
            <AppointmentPicker
              branch={branch}
              date={plan.visitDate}
              time={plan.visitTime}
              onChange={(d, t) => plan.setVisit("later", d, t)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------------- outlet card ---------------- */

// Real green for open (the `green` Tailwind token maps to brand blue), brand
// blue for the friendly Opening Soon, amber warning for Closing Soon.
const OUTLET_STATUS_COLOR: Record<OutletStatusState, string> = {
  open: "text-[#16A34A]",
  closed: "text-[#B42318]",
  "opening-soon": "text-[#2258DA]",
  "closing-soon": "text-[#D97706]",
};

function OutletCard({ loc, selected, onSelect }: { loc: Location; selected: boolean; onSelect: () => void }) {
  const status = getLiveStatus(loc);
  const outletStatus = getOutletStatusInfo(loc);
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={`outlet-card ${selected ? "is-selected" : "is-unselected"} flex items-center gap-3`}
    >
      <span
        className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${
          selected ? "bg-primary text-white" : "bg-primary-soft text-primary"
        }`}
      >
        <MapPin className="h-[18px] w-[18px]" />
      </span>
      {/* Mobile: name alone, vertically centred. */}
      <span className="min-w-0 flex-1 truncate font-bold leading-tight text-ink-primary md:hidden">
        {loc.shortName}
      </span>
      {/* Mobile: one row — coloured status, then neutral time — before the
          check circle. */}
      <span className="flex shrink-0 items-center gap-1.5 md:hidden">
        <span
          className={`text-[12px] font-semibold leading-tight ${OUTLET_STATUS_COLOR[outletStatus.state]}`}
        >
          {outletStatus.statusText}
        </span>
        {outletStatus.timeText && (
          <span className="text-[11px] font-medium leading-tight text-ink-secondary">
            {outletStatus.timeText}
          </span>
        )}
      </span>
      {/* Desktop: name + status badge + full range inline. */}
      <span className="hidden min-w-0 flex-1 items-center gap-2 md:flex">
        <span className="truncate font-bold text-ink-primary">{loc.shortName}</span>
        <StatusBadge status={status} />
        <span className="ml-auto shrink-0 whitespace-nowrap text-[13px] text-ink-secondary">
          {todayHoursLabel(loc)}
        </span>
      </span>
      <span
        className={`grid h-[26px] w-[26px] shrink-0 place-items-center rounded-full border ${
          selected ? "border-primary bg-primary text-white" : "border-line-medium"
        }`}
        aria-hidden
      >
        {selected && <Check className="h-3.5 w-3.5" />}
      </span>
    </button>
  );
}

