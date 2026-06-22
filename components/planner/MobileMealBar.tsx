"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useMealPlan } from "@/lib/meal-plan-store";
import { computeTotals, fmtRM } from "@/lib/planner";
import { MealPlanSidebar } from "./MealPlanSidebar";
import { useBackdropDismiss } from "@/lib/use-backdrop-dismiss";
import { useLang } from "@/lib/i18n/LanguageProvider";

export function MobileMealBar() {
  const { t } = useLang();
  const plan = useMealPlan();
  const totals = computeTotals(plan.items);
  const finalTotal = Math.max(0, totals.grandTotal - plan.voucherDiscount);
  const [open, setOpen] = useState(false);
  const backdrop = useBackdropDismiss(() => setOpen(false));

  // Lock body scroll only while the sheet is open; always restore on close/unmount.
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // If the viewport grows to desktop while the sheet is open, close it so the
  // body scroll-lock can never get stuck (the sheet itself is lg:hidden).
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => mq.matches && setOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  if (plan.count === 0) return null;

  return (
    <>
      <div className="mobile-mealplan-sticky lg:hidden">
        <div className="mx-auto max-w-md">
          <button
            onClick={() => setOpen(true)}
            aria-label={t("menu.mobile.viewAria")
              .replace("{count}", String(plan.count))
              .replace("{itemWord}", plan.count === 1 ? t("menu.sidebar.item") : t("menu.sidebar.items"))
              .replace("{total}", fmtRM(finalTotal))}
            className="mobile-mealplan-pill cta-pulse"
          >
            <span className="label">{t("menu.mobile.view")}</span>
            <span className="amount tabular-nums">
              {plan.count} · {fmtRM(finalTotal)}
            </span>
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-[60] flex flex-col justify-end bg-black/40 lg:hidden" {...backdrop}>
          <div
            className="flex max-h-[92dvh] flex-col overflow-hidden rounded-t-3xl bg-cream p-4 pb-[max(16px,env(safe-area-inset-bottom))]"
          >
            <div className="mb-2 flex shrink-0 items-center justify-between">
              <span className="mx-auto h-1.5 w-10 rounded-full bg-line-medium" />
              <button onClick={() => setOpen(false)} aria-label={t("menu.mobile.close")} className="grid h-9 w-9 place-items-center rounded-full bg-white">
                <X className="h-5 w-5 text-ink-secondary" />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-hidden">
              <MealPlanSidebar />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
