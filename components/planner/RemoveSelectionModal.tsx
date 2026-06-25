"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { useMealPlan } from "@/lib/meal-plan-store";
import { fmtRM } from "@/lib/planner";
import { describeLine } from "./menu-options";
import { QuantityControl } from "./QuantityControl";
import { useLang } from "@/lib/i18n/LanguageProvider";
import type { MenuItem } from "@/data/menu";

/**
 * Shown when the user taps "−" on a menu card that has more than one cart line
 * (same food, different options). Lists every line under that food code and lets
 * the user pick which one to reduce/remove. Auto-closes when none remain.
 */
export function RemoveSelectionModal({ item, onClose }: { item: MenuItem; onClose: () => void }) {
  const { t } = useLang();
  const plan = useMealPlan();
  const lines = plan.items.filter((l) => l.itemId === item.id);

  // Close only when there are no more lines of this item to adjust.
  useEffect(() => {
    if (lines.length === 0) onClose();
  }, [lines.length, onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  // Plus increases this exact line; minus reduces it (store removes it at 0).
  const dec = (lineId: string, qty: number) => plan.setQty(lineId, qty - 1);
  const inc = (lineId: string, qty: number) => plan.setQty(lineId, qty + 1);

  const nameKey = `menu.item.${item.id}.name`;
  const itemName = t(nameKey) === nameKey ? item.name : t(nameKey);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t("misc.remove.title").replace("{code}", item.code ?? "")}
      onClick={onClose}
      className="fixed inset-0 z-[2100] flex items-end justify-center bg-black/65 p-0 backdrop-blur-sm sm:items-center sm:p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[calc(100dvh-24px)] w-full flex-col overflow-hidden rounded-t-[28px] bg-white sm:max-h-[calc(100dvh-48px)] sm:max-w-[460px] sm:rounded-3xl"
      >
        <div className="flex items-center justify-between gap-3 border-b border-line-light p-5">
          <h2 className="text-base font-semibold text-ink-primary">
            {t("misc.remove.title").replace("{code}", item.code ?? "")}
          </h2>
          <button
            onClick={onClose}
            aria-label={t("misc.remove.close")}
            className="grid h-9 w-9 place-items-center rounded-full bg-surface-soft hover:bg-line-light"
          >
            <X className="h-5 w-5 text-ink-secondary" />
          </button>
        </div>

        <div className="space-y-2.5 overflow-y-auto p-4 sm:p-5">
          {lines.map((l) => {
            const details = describeLine(l.choices, l.note, t);
            return (
              <div
                key={l.lineId}
                className="flex items-center justify-between gap-3 rounded-2xl border border-line-light p-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink-primary">
                    {item.code && <span className="text-primary">[{item.code}]</span>} {itemName}
                  </p>
                  <p className="text-xs text-ink-muted">
                    {t("misc.remove.qty")} {l.qty} · {fmtRM(l.unitPrice ?? 0)}
                  </p>
                  {details.map((d, i) => (
                    <p key={i} className="text-[11px] leading-snug text-ink-secondary">
                      <span className="font-medium">{d.label}:</span> {d.value}
                    </p>
                  ))}
                </div>
                <span className="shrink-0">
                  <QuantityControl
                    quantity={l.qty}
                    onIncrease={() => inc(l.lineId, l.qty)}
                    onDecrease={() => dec(l.lineId, l.qty)}
                    label={itemName}
                  />
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>,
    document.body
  );
}
