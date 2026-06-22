"use client";

import { useMealPlan } from "@/lib/meal-plan-store";
import { ReceiptModal } from "./ReceiptModal";

/**
 * Renders the ONE shared receipt modal app-wide, driven by the meal-plan store.
 * Any trigger (sidebar Receipt button, navbar meal-plan capsule) calls
 * `openReceipt()` and this single instance shows it — no duplicate modals/state.
 */
export function ReceiptHost() {
  const plan = useMealPlan();
  return (
    <ReceiptModal
      open={plan.receiptOpen}
      onClose={plan.closeReceipt}
      generatedAt={plan.receiptGeneratedAt}
    />
  );
}
