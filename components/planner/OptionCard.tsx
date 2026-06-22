"use client";

import { Plus } from "lucide-react";
import { useMealPlan } from "@/lib/meal-plan-store";
import { plannerPrice, fmtRM } from "@/lib/planner";
import { showVegLeaf, showFishIcon, showBeefIcon } from "./sections";
import { FoodTags } from "./FoodTags";
import { QuantityControl, useCardBubble } from "./QuantityControl";
import type { MenuItem } from "@/data/menu";
import { useLang } from "@/lib/i18n/LanguageProvider";

/**
 * Text-only option card (no thumbnail) used by FEATURED categories, where the
 * dish photo lives in the section's standalone hero image.
 * Layout: name (upper-left) → meta (portion + veg) → price (lower-left) +
 * Add/stepper (lower-right). All Meal-Plan logic is unchanged.
 */
export function OptionCard({ item }: { item: MenuItem }) {
  const { t } = useLang();
  const plan = useMealPlan();
  const price = plannerPrice(item);

  const line = plan.items.find(
    (l) => l.itemId === item.id && Object.keys(l.choices).length === 0
  );
  const qty = line?.qty ?? 0;

  const nameKey = `menu.item.${item.id}.name`;
  const itemName = t(nameKey) === nameKey ? item.name : t(nameKey);

  const { bubbling, bubble } = useCardBubble();
  const add = () => {
    bubble();
    if (line) plan.setQty(line.lineId, line.qty + 1);
    else plan.addItem({ itemId: item.id, name: item.name, unitPrice: price, qty: 1, choices: {} });
  };
  const dec = () => {
    bubble();
    if (line) plan.setQty(line.lineId, line.qty - 1);
  };

  const veg = showVegLeaf(item);
  const fish = showFishIcon(item);
  const beef = showBeefIcon(item);

  return (
    <div
      data-selected={qty > 0}
      className={`menu-item-card ${qty > 0 ? "is-selected" : ""} ${bubbling ? "is-bubbling" : ""} flex min-h-[78px] min-w-0 flex-col rounded-[12px] border border-[rgba(58,30,26,0.12)] bg-white/95 p-2.5 shadow-[0_4px_14px_rgba(58,30,26,0.05)]`}
    >
      <p className="text-[13.5px] font-semibold leading-snug text-ink-primary">
        <span className="line-clamp-2">{itemName}</span>
      </p>

      {/* second row: quantity (pcs) + ingredient icons, inline & centred */}
      {(item.portion || item.spicy || veg || fish || beef) && (
        <div className="mt-1 flex min-h-[16px] items-center gap-1.5 text-[11px] leading-none text-ink-muted">
          {item.portion && <span>{item.portion}</span>}
          <FoodTags spicy={item.spicy} veg={veg} fish={fish} beef={beef} />
        </div>
      )}

      <div className="mt-auto flex items-center justify-between gap-2 pt-2">
        <span className="text-[14px] font-bold text-ink-primary">{fmtRM(price)}</span>

        {qty === 0 ? (
          <button
            onClick={add}
            aria-label={t("menu.card.addAria").replace("{name}", item.name)}
            className="inline-flex h-8 items-center gap-1 rounded-lg bg-green px-3 text-[13px] font-semibold text-white transition-colors hover:bg-green-hover active:scale-95"
          >
            <Plus className="h-3.5 w-3.5" /> {t("menu.card.add")}
          </button>
        ) : (
          <QuantityControl quantity={qty} onIncrease={add} onDecrease={dec} label={item.name} />
        )}
      </div>
    </div>
  );
}
