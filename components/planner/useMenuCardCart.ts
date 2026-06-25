"use client";

import { useMealPlan } from "@/lib/meal-plan-store";
import { plannerPrice } from "@/lib/planner";
import { itemNeedsModal } from "./menu-options";
import type { MenuItem } from "@/data/menu";

/**
 * Shared cart logic for menu cards (thumbnail + text variants), so behaviour
 * stays identical everywhere:
 *  - totalQty counts every cart line for this item (all option combos).
 *  - needsModal: Mie Ayam / Bakso / any required-choice item → always modal.
 *  - quickAdd: default line (no options) for quick-add categories.
 *  - decrement: lines.length > 1 → caller shows the remove picker; otherwise
 *    decrement the single line directly (store removes it at qty 0).
 */
export function useMenuCardCart(item: MenuItem) {
  const plan = useMealPlan();
  const lines = plan.items.filter((l) => l.itemId === item.id);
  const totalQty = lines.reduce((s, l) => s + l.qty, 0);
  const needsModal = itemNeedsModal(item);

  const quickAdd = () =>
    plan.addItem({ itemId: item.id, name: item.name, unitPrice: plannerPrice(item), qty: 1, choices: {} });

  /** Returns "pick" when the caller should open the remove-selection modal. */
  const decrement = (): "pick" | "done" => {
    if (lines.length > 1) return "pick";
    if (lines.length === 1) plan.setQty(lines[0].lineId, lines[0].qty - 1);
    return "done";
  };

  return { lines, totalQty, needsModal, quickAdd, decrement };
}
