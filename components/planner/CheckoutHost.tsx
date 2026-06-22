"use client";

import { useMealPlan } from "@/lib/meal-plan-store";
import { CheckoutModal } from "./CheckoutModal";

/** Renders the ONE shared checkout modal app-wide, driven by the meal-plan store. */
export function CheckoutHost() {
  const plan = useMealPlan();
  return <CheckoutModal open={plan.checkoutOpen} onClose={plan.closeCheckout} />;
}
