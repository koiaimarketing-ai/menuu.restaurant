"use client";

import { useEffect, useRef, useState } from "react";
import type { MenuItem } from "@/data/menu";
import type { BranchId } from "@/lib/meal-plan-store";
import { formatRM } from "@/lib/currency";
import { X, Minus, Plus, Flame } from "lucide-react";
import { useBackdropDismiss } from "@/lib/use-backdrop-dismiss";
import { useLang } from "@/lib/i18n/LanguageProvider";

export type DraftAdd = {
  itemId: string;
  name: string;
  unitPrice: number | null;
  qty: number;
  choices: Record<string, string>;
  note?: string;
};

export function CustomisationModal({
  item,
  branchId,
  initial,
  onClose,
  onConfirm,
}: {
  item: MenuItem;
  branchId: BranchId;
  initial?: { qty: number; choices: Record<string, string>; note?: string };
  onClose: () => void;
  onConfirm: (d: DraftAdd) => void;
}) {
  const { t } = useLang();
  const price = item.branchPrices[branchId];
  const [qty, setQty] = useState(initial?.qty ?? 1);
  const [choices, setChoices] = useState<Record<string, string>>(
    initial?.choices ?? {}
  );
  const [note, setNote] = useState(initial?.note ?? "");
  const [error, setError] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const backdrop = useBackdropDismiss(onClose);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const nameKey = `menu.item.${item.id}.name`;
  const itemName = t(nameKey) === nameKey ? item.name : t(nameKey);

  const requiredChoices = item.choices?.filter((c) => c.required) ?? [];

  const submit = () => {
    for (const c of requiredChoices) {
      if (!choices[c.label]) {
        setError(t("misc.cust.pleaseChoose").replace("{label}", c.label.toLowerCase()));
        return;
      }
    }
    onConfirm({
      itemId: item.id,
      name: item.name,
      unitPrice: price,
      qty,
      choices,
      note: note.trim() || undefined,
    });
  };

  const lineTotal = (price ?? 0) * qty;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-4"
      {...backdrop}
      role="dialog"
      aria-modal="true"
      aria-label={t("misc.cust.customiseLabel").replace("{name}", item.name)}
    >
      <div
        ref={ref}
        className="w-full sm:max-w-[680px] bg-white rounded-t-[28px] sm:rounded-3xl max-h-[92vh] sm:max-h-[88vh] flex flex-col overflow-hidden"
      >
        {/* header */}
        <div className="flex items-start justify-between gap-3 p-5 sm:p-6 border-b border-line-light">
          <div>
            <h2 className="text-xl font-semibold text-ink-primary flex items-center gap-2">
              {itemName}
              {item.spicy && <Flame className="h-4 w-4 text-primary" aria-label={t("misc.cust.spicy")} />}
            </h2>
            {item.portion && (
              <p className="text-xs text-ink-muted mt-1">{item.portion}</p>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label={t("misc.cust.close")}
            className="h-10 w-10 grid place-items-center rounded-full bg-surface-soft hover:bg-line-light"
          >
            <X className="h-5 w-5 text-ink-secondary" />
          </button>
        </div>

        {/* body */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-6">
          {item.description && (
            <p className="text-sm text-ink-secondary leading-relaxed">
              {item.description}
            </p>
          )}
          {item.complimentaryItem && (
            <p className="text-sm rounded-xl bg-green-soft text-green-dark px-3 py-2">
              {t("misc.cust.complimentary").replace("{item}", item.complimentaryItem)}
            </p>
          )}

          {item.choices?.map((c) => (
            <fieldset key={c.label}>
              <legend className="text-sm font-semibold text-ink-primary mb-2">
                {c.label}
                {c.required && <span className="text-primary"> *</span>}
              </legend>
              <div className="flex flex-wrap gap-2">
                {c.options.map((opt) => {
                  const selected = choices[c.label] === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      aria-checked={selected}
                      role="radio"
                      onClick={() => {
                        setChoices((s) => ({ ...s, [c.label]: opt }));
                        setError(null);
                      }}
                      className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                        selected
                          ? "bg-green-soft border-green text-green-dark"
                          : "bg-white border-line-medium text-ink-primary hover:border-green"
                      }`}
                      style={selected ? { borderWidth: 1.5 } : undefined}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          ))}

          {item.availableHotCold && (
            <fieldset>
              <legend className="text-sm font-semibold text-ink-primary mb-2">
                {t("misc.cust.temperature")}
              </legend>
              <div className="flex gap-2">
                {[
                  { value: "Hot", label: t("misc.cust.hot") },
                  { value: "Cold", label: t("misc.cust.cold") },
                ].map(({ value: opt, label }) => {
                  const selected = choices["Temperature"] === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() =>
                        setChoices((s) => ({ ...s, Temperature: opt }))
                      }
                      className={`px-4 py-2 rounded-full text-sm font-medium border ${
                        selected
                          ? "bg-green-soft border-green text-green-dark"
                          : "bg-white border-line-medium text-ink-primary"
                      }`}
                      style={selected ? { borderWidth: 1.5 } : undefined}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          )}

          <div>
            <label htmlFor="note" className="text-sm font-semibold text-ink-primary">
              {t("misc.cust.specialRequest")}
            </label>
            <p className="text-xs text-ink-muted mb-2">
              {t("misc.cust.specialRequestNote")}
            </p>
            <input
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t("misc.cust.specialRequestPlaceholder")}
              className="w-full rounded-xl border border-line-medium px-3 py-2.5 text-sm focus:border-green focus:outline-none"
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-[#B42318] font-medium">
              {error}
            </p>
          )}
        </div>

        {/* footer */}
        <div className="border-t border-line-light p-4 sm:p-5 flex items-center gap-4 bg-white">
          <div className="flex items-center gap-1 rounded-full bg-surface-soft border border-line-medium p-1">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              aria-label={t("misc.cust.decreaseQty")}
              className="h-9 w-9 grid place-items-center rounded-full hover:bg-green-soft text-green-dark"
            >
              <Minus className="h-4 w-4" />
            </button>
            <output className="w-8 text-center font-semibold text-green-dark">{qty}</output>
            <button
              onClick={() => setQty((q) => q + 1)}
              aria-label={t("misc.cust.increaseQty")}
              className="h-9 w-9 grid place-items-center rounded-full hover:bg-green-soft text-green-dark"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <button onClick={submit} className="btn btn-green flex-1">
            {t("misc.cust.addToMealPlan")}{price != null ? ` · ${formatRM(lineTotal)}` : ""}
          </button>
        </div>
      </div>
    </div>
  );
}
