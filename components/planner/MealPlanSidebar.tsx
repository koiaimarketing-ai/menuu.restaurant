"use client";

import { useEffect, useRef, useState } from "react";
import { X, Receipt, Lock, ShoppingBag } from "lucide-react";
import { useMealPlan } from "@/lib/meal-plan-store";
import { computeTotals, fmtRM } from "@/lib/planner";
import { QuantityControl } from "./QuantityControl";
import { menu } from "@/data/menu";
import { describeLine, sortLines } from "./menu-options";
import { useLang } from "@/lib/i18n/LanguageProvider";

export function MealPlanSidebar() {
  const { t } = useLang();
  const plan = useMealPlan();
  const totals = computeTotals(plan.items);
  const finalTotal = Math.max(0, totals.grandTotal - plan.voucherDiscount);
  const [pulse, setPulse] = useState(false);
  const prevTotal = useRef(finalTotal);

  useEffect(() => {
    if (prevTotal.current !== finalTotal) {
      setPulse(true);
      const id = setTimeout(() => setPulse(false), 600);
      prevTotal.current = finalTotal;
      return () => clearTimeout(id);
    }
  }, [finalTotal]);

  const empty = plan.items.length === 0;

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-3xl border border-line-light bg-white p-5 shadow-soft">
      <div className="flex shrink-0 items-center justify-between">
        <h2 className="text-lg font-bold text-ink-primary">{t("menu.sidebar.title")}</h2>
        <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-ink-secondary">
          {plan.count} {plan.count === 1 ? t("menu.sidebar.item") : t("menu.sidebar.items")}
        </span>
      </div>

      {empty ? (
        <div className="mt-6 shrink-0 rounded-2xl border border-dashed border-line-medium bg-secondary/40 px-4 py-8 text-center">
          <p className="text-base font-bold text-ink-primary">{t("menu.sidebar.emptyTitle")}</p>
          <p className="mt-1.5 text-sm text-ink-secondary">
            {t("menu.sidebar.emptyBody")}
          </p>
        </div>
      ) : (
        <>
          <ul className="mt-4 min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain pb-2 pr-1 [-webkit-overflow-scrolling:touch]">
            {sortLines(plan.items).map((l) => {
              const rowTotal = (l.unitPrice ?? 0) * l.qty;
              const code = menu.find((m) => m.id === l.itemId)?.code;
              const details = describeLine(l.choices, l.note, t);
              return (
                <li key={l.lineId} className="flex items-start gap-3 border-b border-line-light pb-3">
                  <QuantityControl
                    quantity={l.qty}
                    onIncrease={() => plan.setQty(l.lineId, l.qty + 1)}
                    onDecrease={() => plan.setQty(l.lineId, l.qty - 1)}
                    label={l.name}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-ink-primary">
                      {code && <span className="text-primary">[{code}]</span>} {l.name}
                    </p>
                    <p className="text-xs text-ink-muted">{fmtRM(l.unitPrice ?? 0)}</p>
                    {details.map((d, i) => (
                      <p key={i} className="text-[11px] leading-snug text-ink-secondary">
                        <span className="font-medium">{d.label}:</span> {d.value}
                      </p>
                    ))}
                  </div>
                  <span className="shrink-0 text-sm font-semibold text-ink-primary">{fmtRM(rowTotal)}</span>
                  <button
                    onClick={() => plan.removeLine(l.lineId)}
                    aria-label={t("menu.sidebar.removeAria").replace("{name}", l.name)}
                    className="shrink-0 text-ink-muted hover:text-[#B42318]"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="mt-4 shrink-0 space-y-1.5 text-sm">
            <Row label={t("menu.sidebar.subtotal")} value={fmtRM(totals.subtotal)} />
            <Row label={t("menu.sidebar.sst")} value={fmtRM(totals.sst)} />
            <Row label={t("menu.sidebar.service")} value={fmtRM(totals.service)} />
          </div>

          <div className="mt-4 flex shrink-0 items-center justify-between border-t border-line-light pt-4">
            <span className="text-lg font-bold text-ink-primary">{t("menu.sidebar.grandTotal")}</span>
            <span
              className={`total-whatsapp text-2xl font-extrabold transition-transform duration-300 ${
                pulse ? "scale-110" : "scale-100"
              }`}
            >
              {fmtRM(finalTotal)}
            </span>
          </div>
        </>
      )}

      {/* actions — Checkout is the primary action; Receipt opens the saveable summary */}
      <div className="mt-5 shrink-0 space-y-2.5">
        <button
          onClick={plan.openCheckout}
          disabled={empty}
          className={`${empty ? "" : "cta-whatsapp checkout-button cta-pulse"} flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-[15px] font-semibold text-white transition-transform hover:-translate-y-0.5 disabled:translate-y-0 disabled:bg-line-medium disabled:text-ink-muted disabled:shadow-none`}
        >
          <span className="checkout-button-content">
            <ShoppingBag className="h-4 w-4" /> {t("menu.sidebar.checkout")}
          </span>
        </button>
        <button
          onClick={plan.openReceipt}
          disabled={empty}
          className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-line-medium bg-white px-3 py-2.5 text-sm font-semibold text-ink-primary transition-colors hover:border-primary hover:bg-primary-soft disabled:opacity-50"
        >
          <Receipt className="h-4 w-4" /> {t("menu.sidebar.receipt")}
        </button>

        <p className="flex items-center justify-center gap-1.5 pt-1 text-xs text-ink-muted">
          <Lock className="h-3 w-3" /> {t("menu.sidebar.private")}
        </p>
      </div>
    </div>
  );
}

function Row({ label, value, discount }: { label: string; value: string; discount?: boolean }) {
  return (
    <div className={`flex justify-between gap-2 ${discount ? "text-green-text" : "text-ink-secondary"}`}>
      <span className={discount ? "min-w-0 truncate font-medium" : ""}>{label}</span>
      <span className={`shrink-0 font-medium ${discount ? "text-green-text" : "text-ink-primary"}`}>{value}</span>
    </div>
  );
}
