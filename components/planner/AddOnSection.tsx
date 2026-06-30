"use client";

import { Plus } from "lucide-react";
import { useMealPlan } from "@/lib/meal-plan-store";
import { plannerPrice, fmtRM } from "@/lib/planner";
import { sectionItems, showVegLeaf, showFishIcon, showBeefIcon, type PlannerSection } from "./sections";
import { FoodTags } from "./FoodTags";
import { QuantityControl, useCardBubble } from "./QuantityControl";
import type { MenuItem } from "@/data/menu";
import { useLang } from "@/lib/i18n/LanguageProvider";

/**
 * Add-On / Sides section — a SEPARATE compact card layout with NO food image,
 * placeholder, empty thumbnail box, fork-and-spoon icon, or reserved image
 * column. Each card holds: name, quantity (when present), spicy/veg icon row,
 * price and the green Add button. Only used for the Add-On section — standard
 * food categories keep their own card with thumbnails.
 */
export function AddOnSection({ section, vegOnly }: { section: PlannerSection; vegOnly?: boolean }) {
  const { t } = useLang();
  const items = sectionItems(section).filter((m) => (vegOnly ? showVegLeaf(m) : true));
  if (!items.length) return null;

  const labelKey = `menu.section.${section.id}.label`;
  const blurbKey = `menu.section.${section.id}.blurb`;
  const label = t(labelKey) === labelKey ? section.label : t(labelKey);
  const blurb = t(blurbKey) === blurbKey ? section.blurb : t(blurbKey);

  return (
    <section id={`sec-${section.id}`} data-section={section.id} className="scroll-mt-32 pt-2">
      <h2 className="text-[clamp(1.4rem,2vw,1.6rem)] text-heading" style={{ fontFamily: "var(--font-fraunces)" }}>
        {label}
      </h2>
      <p className="mt-1 text-sm text-ink-secondary">{blurb}</p>

      {/* 3 cols ≥900px · 2 cols ≥600px · 1 col on mobile */}
      <div className="mt-4 grid grid-cols-1 gap-3 min-[600px]:grid-cols-2 min-[900px]:grid-cols-3">
        {items.map((item) => (
          <AddOnCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}

function AddOnCard({ item }: { item: MenuItem }) {
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
    <article
      data-selected={qty > 0}
      className={`menu-item-card ${qty > 0 ? "is-selected" : ""} ${bubbling ? "is-bubbling" : ""} flex min-h-[84px] min-w-0 flex-col justify-between gap-2 rounded-2xl border border-line-light bg-white p-3 max-[600px]:min-h-[76px]`}
    >
      <div className="min-w-0">
        <h3 className="text-[14px] font-semibold leading-snug text-ink-primary [overflow-wrap:anywhere]">
          {itemName}
        </h3>
        {/* second row: quantity (pcs) + ingredient icons, inline & centred */}
        {(item.portion || item.spicy || veg || fish || beef) && (
          <div className="mt-1 flex min-h-[18px] items-center gap-2 text-[11px] leading-none text-ink-muted">
            {item.portion && <span>{item.portion}</span>}
            <FoodTags spicy={item.spicy} veg={veg} fish={fish} beef={beef} />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-2">
        <span className="whitespace-nowrap text-[14px] font-bold text-ink-primary">{fmtRM(price)}</span>

        {qty === 0 ? (
          <button
            onClick={add}
            aria-label={t("menu.card.addAria").replace("{name}", item.name)}
            className="inline-flex h-8 shrink-0 items-center gap-1 whitespace-nowrap rounded-full bg-green px-3.5 text-[13px] font-semibold text-white transition-colors hover:bg-green-hover"
          >
            <Plus className="h-3.5 w-3.5" /> {t("menu.card.add")}
          </button>
        ) : (
          <QuantityControl quantity={qty} onIncrease={add} onDecrease={dec} label={item.name} />
        )}
      </div>
    </article>
  );
}
