"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useMealPlan } from "@/lib/meal-plan-store";
import { plannerPrice, fmtRM } from "@/lib/planner";
import { showVegLeaf, showFishIcon, showBeefIcon } from "./sections";
import { FoodTags } from "./FoodTags";
import { QuantityControl, useCardBubble } from "./QuantityControl";
import { CustomisationModal, type DraftAdd } from "./CustomisationModal";
import { RemoveSelectionModal } from "./RemoveSelectionModal";
import { useMenuCardCart } from "./useMenuCardCart";
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

  const { totalQty, needsModal, quickAdd, decrement } = useMenuCardCart(item);
  const qty = totalQty;

  const nameKey = `menu.item.${item.id}.name`;
  const itemName = t(nameKey) === nameKey ? item.name : t(nameKey);

  const { bubbling, bubble } = useCardBubble();
  const [detail, setDetail] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);

  // "+" — Mie Ayam / Bakso / required-choice items always open the modal;
  // everything else quick-adds a default line.
  const plus = () => {
    bubble();
    if (needsModal) setDetail(true);
    else quickAdd();
  };
  // "−" — one line decrements directly; multiple lines open the remove picker.
  const minus = () => {
    bubble();
    if (decrement() === "pick") setRemoveOpen(true);
  };

  const veg = showVegLeaf(item);
  const fish = showFishIcon(item);
  const beef = showBeefIcon(item);

  return (
    <div
      data-selected={qty > 0}
      onClick={() => setDetail(true)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        // Only react to the card itself — never swallow keys (e.g. Space) that
        // originate from the portaled modal's inputs, which bubble through React.
        if (e.target !== e.currentTarget) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setDetail(true);
        }
      }}
      className={`menu-item-card ${qty > 0 ? "is-selected" : ""} ${bubbling ? "is-bubbling" : ""} flex min-h-[78px] min-w-0 cursor-pointer flex-col rounded-[12px] border border-[rgba(58,30,26,0.12)] bg-white/95 p-2.5 shadow-[0_4px_14px_rgba(58,30,26,0.05)]`}
    >
      {detail && (
        <span onClick={(e) => e.stopPropagation()}>
          <CustomisationModal
            item={item}
            branchId="kl-central-walk"
            onClose={() => setDetail(false)}
            onConfirm={(d: DraftAdd) => {
              plan.addItem(d);
              setDetail(false);
            }}
          />
        </span>
      )}
      {removeOpen && (
        <span onClick={(e) => e.stopPropagation()}>
          <RemoveSelectionModal item={item} onClose={() => setRemoveOpen(false)} />
        </span>
      )}
      <p className="text-[13.5px] font-semibold leading-snug text-ink-primary">
        <span className="line-clamp-2">
          {item.code && <span className="text-primary">[{item.code}]</span>} {itemName}
        </span>
      </p>

      {/* second row: quantity (pcs) + ingredient icons, inline & centred */}
      {(item.portion || item.spicy || veg || fish || beef) && (
        <div className="mt-1 flex min-h-[16px] items-center gap-1.5 text-[11px] leading-none text-ink-muted">
          {item.portion && <span>{item.portion}</span>}
          <FoodTags spicy={item.spicy} veg={veg} fish={fish} beef={beef} />
        </div>
      )}

      <div className="mt-auto flex items-center justify-between gap-2 pt-2">
        <span className="min-w-0 truncate text-[14px] font-bold text-ink-primary">{fmtRM(price)}</span>

        {qty === 0 ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              plus();
            }}
            aria-label={t("menu.card.addAria").replace("{name}", item.name)}
            className="inline-flex h-8 shrink-0 items-center gap-1 rounded-lg bg-green px-3 text-[13px] font-semibold text-white transition-colors hover:bg-green-hover active:scale-95"
          >
            <Plus className="h-3.5 w-3.5" /> {t("menu.card.add")}
          </button>
        ) : (
          <span className="shrink-0" onClick={(e) => e.stopPropagation()}>
            <QuantityControl quantity={qty} onIncrease={plus} onDecrease={minus} label={item.name} />
          </span>
        )}
      </div>
    </div>
  );
}
