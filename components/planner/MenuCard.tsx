"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, UtensilsCrossed } from "lucide-react";
import { ImageLightbox } from "./ImageLightbox";
import { CustomisationModal, type DraftAdd } from "./CustomisationModal";
import { RemoveSelectionModal } from "./RemoveSelectionModal";
import { useMenuCardCart } from "./useMenuCardCart";
import { useMealPlan } from "@/lib/meal-plan-store";
import { plannerPrice, fmtRM } from "@/lib/planner";
import { showVegLeaf, showFishIcon, showBeefIcon } from "./sections";
import { FoodTags } from "./FoodTags";
import { QuantityControl, useCardBubble } from "./QuantityControl";
import type { MenuItem } from "@/data/menu";
import { useLang } from "@/lib/i18n/LanguageProvider";

/**
 * Standard option card WITH a per-item thumbnail. Used by STANDARD categories
 * (Nasi Meals, À La Carte, Vegetables, Add-Ons) — the original card design.
 */
export function MenuCard({ item, noImage }: { item: MenuItem; noImage?: boolean }) {
  const { t } = useLang();
  const plan = useMealPlan();
  const price = plannerPrice(item);

  const { totalQty, needsModal, quickAdd, decrement } = useMenuCardCart(item);
  const qty = totalQty;

  const nameKey = `menu.item.${item.id}.name`;
  const itemName = t(nameKey) === nameKey ? item.name : t(nameKey);

  const { bubbling, bubble } = useCardBubble();
  const [preview, setPreview] = useState(false);
  const [detail, setDetail] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);

  const plus = () => {
    bubble();
    if (needsModal) setDetail(true);
    else quickAdd();
  };
  const minus = () => {
    bubble();
    if (decrement() === "pick") setRemoveOpen(true);
  };

  const veg = showVegLeaf(item);
  const fish = showFishIcon(item);
  const beef = showBeefIcon(item);

  return (
    <div
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
      className={`menu-item-card ${qty > 0 ? "is-selected" : ""} ${bubbling ? "is-bubbling" : ""} group flex min-w-0 cursor-pointer rounded-2xl border border-line-light bg-white p-3 hover:shadow-card ${
        noImage ? "min-h-[92px] flex-col" : "min-h-[104px] items-center gap-3.5"
      }`}
    >
      {!noImage && (
        <div className="relative h-[78px] w-[78px] shrink-0 overflow-hidden rounded-xl bg-secondary">
          {item.image ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setPreview(true);
              }}
              aria-label={`Preview ${item.name}`}
              className="relative block h-full w-full cursor-pointer"
            >
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="96px"
                loading="lazy"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </button>
          ) : (
            <div className="grid h-full w-full place-items-center text-ink-muted">
              <UtensilsCrossed className="h-6 w-6" />
            </div>
          )}
        </div>
      )}

      {preview && item.image && (
        <ImageLightbox src={item.image} alt={itemName} onClose={() => setPreview(false)} />
      )}

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

      <div className="flex min-w-0 flex-1 flex-col self-stretch">
        <p className="text-[14px] font-semibold leading-snug text-ink-primary">
          <span className="line-clamp-2">
            {item.code && <span className="text-primary">[{item.code}]</span>} {itemName}
          </span>
        </p>

        {/* second row: quantity (pcs) + ingredient icons, inline & centred */}
        {(item.portion || item.spicy || veg || fish || beef) && (
          <div className="mt-1 flex min-h-[18px] items-center gap-2 text-[11px] leading-none text-ink-muted">
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
              className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-green px-2.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-green-hover"
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
    </div>
  );
}
