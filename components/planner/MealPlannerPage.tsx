"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { useMealPlan } from "@/lib/meal-plan-store";
import { menu } from "@/data/menu";
import { plannerPrice, decodeSharedPlan } from "@/lib/planner";
import { PlannerControls } from "./PlannerControls";
import { CategoryPills } from "./CategoryPills";
import { FeaturedMenuCategory } from "./FeaturedMenuCategory";
import { FeaturedThumbCategory } from "./FeaturedThumbCategory";
import { BeverageGroup } from "./BeverageGroup";
import { MealPlanSidebar } from "./MealPlanSidebar";
import { MobileMealBar } from "./MobileMealBar";
import { MealPlanWelcomeModal } from "./MealPlanWelcomeModal";
import { PromotionMarquee } from "./PromotionMarquee";
import { ReviewStrip } from "@/components/ReviewStrip";
import { FOOD_SECTIONS, ADDON_SECTION } from "./sections";
import { useLang } from "@/lib/i18n/LanguageProvider";

export function MealPlannerPage() {
  const plan = useMealPlan();
  const { t } = useLang();
  const didInit = useRef(false);
  const [vegOnly, setVegOnly] = useState(false);

  // Default outlet + decode a shared plan from the URL (once, after hydration).
  useEffect(() => {
    if (!plan.hydrated || didInit.current) return;
    didInit.current = true;

    const params = new URLSearchParams(window.location.search);
    const shared = params.get("plan");
    if (shared) {
      const data = decodeSharedPlan(shared);
      if (data) {
        if (data.b) plan.setBranch(data.b as "ss4" | "kl-central-walk");
        if (data.v) plan.setVisit(data.v as "now" | "later", null, null);
        plan.clearItems();
        data.i.forEach(({ id, q }) => {
          const item = menu.find((m) => m.id === id);
          if (item && q > 0)
            plan.addItem({ itemId: item.id, name: item.name, unitPrice: plannerPrice(item), qty: q, choices: {} });
        });
      }
      window.history.replaceState({}, "", window.location.pathname);
    }
    if (!plan.branchId) plan.setBranch("ss4");
  }, [plan.hydrated]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="relative">
      {/* faded landmark sketches */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px] opacity-[0.08]"
        aria-hidden="true"
        style={{
          backgroundImage: "url(/images/jakarta.png)",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "top right",
          backgroundSize: "640px auto",
        }}
      />

      <div className="container-site relative">
        {/* two-column planner — top padding clears the fixed navbar */}
        <div className="grid items-start gap-7 pt-28 sm:pt-28 lg:grid-cols-[minmax(0,1fr)_350px] lg:pt-32">
          {/* LEFT: controls + notice + pills + menu */}
          <div className="min-w-0">
            <PlannerControls />

            <div className="mt-4">
              <CategoryPills vegOnly={vegOnly} onToggleVeg={() => setVegOnly((v) => !v)} />
            </div>

            <PromotionMarquee />

            <div className="mt-3 space-y-6 pb-28 lg:pb-8">
              {FOOD_SECTIONS.map((s, i) => (
                <Fragment key={s.id}>
                  {s.presentation === "featured" ? (
                    <FeaturedMenuCategory section={s} vegOnly={vegOnly} />
                  ) : (
                    <FeaturedThumbCategory section={s} vegOnly={vegOnly} />
                  )}
                  {/* One review strip between the 3rd and 4th category sections —
                      same compact layout as the hero card (no trust text). */}
                  {i === 2 && (
                    <div className="text-center">
                      <ReviewStrip compact />
                    </div>
                  )}
                </Fragment>
              ))}
              <BeverageGroup vegOnly={vegOnly} />
              <FeaturedThumbCategory section={ADDON_SECTION} vegOnly={vegOnly} noImage />
            </div>
          </div>

          {/* RIGHT: sticky summary only — receipt now opens in a modal */}
          <aside className="sticky top-[88px] hidden max-h-[calc(100vh-104px)] self-start lg:flex lg:flex-col">
            <MealPlanSidebar />
          </aside>
        </div>
      </div>

      <MobileMealBar />
      <MealPlanWelcomeModal />
    </div>
  );
}
