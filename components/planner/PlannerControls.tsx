"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { MapPin, Footprints, CalendarDays, Bike, Check } from "lucide-react";
import { locations, getLocation, type Location } from "@/data/locations";
import { useMealPlan, type BranchId, type PlanType } from "@/lib/meal-plan-store";
import { getLiveStatus, todayHoursLabel } from "@/lib/operating-status";
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
  const [outletCollapsed, setOutletCollapsed] = useState(false);
  const [planCollapsed, setPlanCollapsed] = useState(false);

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

  // Same bubble-absorb behaviour as the outlet selector: pick → collapse the
  // others into the chosen card; clicking the collapsed card reopens the choices.
  const handlePlanClick = (id: PlanType) => {
    if (planCollapsed) {
      setPlanCollapsed(false);
      return;
    }
    plan.setPlanType(id);
    setPlanCollapsed(true);
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

        {/* ---- Whats ur plan? ---- */}
        <section className="plan-selector">
          <p className="selector-label">{t("planner.whatsYourPlan")}</p>
          <div className={`plan-options ${planCollapsed ? "is-collapsed" : "is-expanded"}`}>
            {PLANS.map((p) => (
              <PlanCard
                key={p.id}
                icon={p.icon}
                label={t(p.labelKey)}
                selected={planType === p.id}
                onClick={() => handlePlanClick(p.id)}
              />
            ))}
          </div>
        </section>
      </div>

      {(planType === "going" || planType === "delivery") && (
        <p className="text-xs text-ink-secondary">{t("planner.addDishesHint")}</p>
      )}

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
function OutletCard({ loc, selected, onSelect }: { loc: Location; selected: boolean; onSelect: () => void }) {
  const status = getLiveStatus(loc);
  const scheduleBadge = loc.id === "ss4" ? "Open Daily" : "Mon–Sat";
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
        <MapPin className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2">
          <span className="font-bold text-ink-primary">{loc.shortName}</span>
          <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-ink-secondary">
            {scheduleBadge}
          </span>
          <StatusBadge status={status} />
        </span>
        <span className="mt-0.5 block text-sm text-ink-secondary">{todayHoursLabel(loc)}</span>
      </span>
      <span
        className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border ${
          selected ? "border-primary bg-primary text-white" : "border-line-medium"
        }`}
        aria-hidden
      >
        {selected && <Check className="h-3.5 w-3.5" />}
      </span>
    </button>
  );
}

/* ---------------- plan card ---------------- */
function PlanCard({ icon, label, selected, onClick }: { icon: React.ReactNode; label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`plan-card ${selected ? "is-selected" : "is-unselected"} flex flex-col items-center justify-center gap-1.5`}
    >
      <span
        className={`grid h-8 w-8 place-items-center rounded-full ${
          selected ? "bg-primary text-white" : "bg-primary-soft text-primary"
        }`}
      >
        {icon}
      </span>
      <span className={`text-[12px] font-bold leading-tight ${selected ? "text-primary" : "text-ink-primary"}`}>
        {label}
      </span>
    </button>
  );
}
