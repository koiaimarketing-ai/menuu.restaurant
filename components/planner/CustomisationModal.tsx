"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import type { MenuItem } from "@/data/menu";
import type { BranchId } from "@/lib/meal-plan-store";
import { formatRM } from "@/lib/currency";
import { X, Minus, Plus, Flame } from "lucide-react";
import { useBackdropDismiss } from "@/lib/use-backdrop-dismiss";
import { useLang } from "@/lib/i18n/LanguageProvider";
import { getAddOns, getFoodOptions, getBeverageGroups } from "./menu-options";

const splitVals = (s?: string) =>
  (s ?? "").split(", ").map((v) => v.trim()).filter(Boolean);

// Display-only translation for noodle/variation choice values (e.g. Chinese
// modal shows 粉丝/米粉) while the STORED value stays the original backend string
// so pricing + cart identity never change.
const CHOICE_VALUE_KEY: Record<string, string> = {
  "Soo Hoon": "misc.cval.sooHoon",
  Mihun: "misc.cval.mihun",
  Mie: "misc.cval.mie",
  Bihun: "misc.cval.bihun",
};

// Parse stored add-on string "rice x2, egg x1" → { rice: 2, egg: 1 }.
const parseAddOnQty = (s?: string): Record<string, number> => {
  const out: Record<string, number> = {};
  for (const part of splitVals(s)) {
    const m = part.match(/^(.+?)\s*x\s*(\d+)$/i);
    if (m) out[m[1].trim()] = Number(m[2]);
    else out[part] = 1;
  }
  return out;
};

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

  const addOns = useMemo(() => getAddOns(item), [item]);
  const foodOpts = useMemo(() => getFoodOptions(item), [item]);
  const beverageGroups = useMemo(() => getBeverageGroups(item), [item]);

  // Per-add-on quantity (0 = not selected) and free-form Option chips, both
  // seeded from the line being edited (stored comma-joined in `choices`).
  const [addOnQty, setAddOnQty] = useState<Record<string, number>>(
    () => parseAddOnQty(initial?.choices?.["Add-ons"])
  );
  const [selOption, setSelOption] = useState<Set<string>>(
    () => new Set(splitVals(initial?.choices?.["Option"]))
  );

  const addOnSum = addOns.reduce((s, a) => s + a.price * (addOnQty[a.key] ?? 0), 0);
  const setAddon = (key: string, n: number) =>
    setAddOnQty((q) => ({ ...q, [key]: Math.max(0, n) }));
  const toggleOption = (val: string) =>
    setSelOption((s) => {
      const next = new Set(s);
      next.has(val) ? next.delete(val) : next.add(val);
      return next;
    });

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

  // Translate a choice label (e.g. "Noodle" → "Mie" in Malay). Falls back to the
  // raw label when no translation key exists. The stored choice key stays the
  // English label so cart-line identity is language-independent.
  const cl = (label: string) => {
    const k = `misc.choice.${label}`;
    const v = t(k);
    return v === k ? label : v;
  };
  // Display label for a choice VALUE (stored value unchanged).
  const cval = (value: string) => {
    const k = CHOICE_VALUE_KEY[value];
    if (!k) return value;
    const v = t(k);
    return v === k ? value : v;
  };

  const requiredChoices = item.choices?.filter((c) => c.required) ?? [];

  const submit = () => {
    for (const c of requiredChoices) {
      if (!choices[c.label]) {
        setError(t("misc.cust.pleaseChoose").replace("{label}", cl(c.label).toLowerCase()));
        return;
      }
    }
    // Fold multi-selects into the choices map (sorted → order-independent line
    // key). The store splits cart lines by itemId + choices + note, so different
    // add-ons / allergy / beverage options become separate lines automatically.
    const finalChoices: Record<string, string> = { ...choices };
    const addOnStr = addOns
      .filter((a) => (addOnQty[a.key] ?? 0) > 0)
      .map((a) => `${a.key} x${addOnQty[a.key]}`)
      .sort()
      .join(", ");
    if (addOnStr) finalChoices["Add-ons"] = addOnStr;
    else delete finalChoices["Add-ons"];
    if (selOption.size) finalChoices["Option"] = [...selOption].sort().join(", ");
    else delete finalChoices["Option"];

    onConfirm({
      itemId: item.id,
      name: item.name,
      unitPrice: price != null ? price + addOnSum : null,
      qty,
      choices: finalChoices,
      note: note.trim() || undefined,
    });
  };

  const lineTotal = ((price ?? 0) + addOnSum) * qty;

  // Block adding until every required choice (e.g. Mie / Bihun) is selected.
  const requiredUnmet = requiredChoices.filter((c) => !choices[c.label]);
  const blocked = requiredUnmet.length > 0;
  const helper = blocked
    ? t("misc.cust.chooseBefore").replace(
        "{opts}",
        requiredUnmet[0].options.join(` ${t("misc.cust.or")} `)
      )
    : "";

  if (typeof document === "undefined") return null;

  return createPortal(
    // Portaled to <body> so the fixed overlay can't be trapped (and mis-clipped)
    // by a transformed/animated ancestor card — the cause of the overlap bug.
    <div
      className="fixed inset-0 z-[2000] flex items-end sm:items-center justify-center bg-black/65 p-0 backdrop-blur-sm sm:p-4"
      {...backdrop}
      role="dialog"
      aria-modal="true"
      aria-label={t("misc.cust.customiseLabel").replace("{name}", item.name)}
    >
      <div
        ref={ref}
        className="flex max-h-[calc(100dvh-24px)] w-full flex-col overflow-hidden rounded-t-[28px] bg-white sm:max-h-[calc(100dvh-48px)] sm:max-w-[600px] sm:rounded-3xl"
      >
        {/* header */}
        <div className="flex items-start justify-between gap-3 p-5 sm:p-6 border-b border-line-light">
          <div>
            <h2 className="text-xl font-semibold text-ink-primary flex items-center gap-2">
              {item.code && <span className="text-primary">[{item.code}]</span>}
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
          {item.image && (
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-secondary">
              <Image
                src={item.image}
                alt={itemName}
                fill
                sizes="(max-width: 640px) 100vw, 600px"
                className="object-cover"
              />
            </div>
          )}
          {item.description && (
            <p className="text-sm text-ink-secondary leading-relaxed">
              {t(`menu.item.${item.id}.desc`) === `menu.item.${item.id}.desc`
                ? item.description
                : t(`menu.item.${item.id}.desc`)}
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
                {cl(c.label)}
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
                      {cval(opt)}
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

          {beverageGroups.map((g) => (
            <fieldset key={g.key}>
              <legend className="text-sm font-semibold text-ink-primary mb-2">{t(g.labelKey)}</legend>
              <div className="flex flex-wrap gap-2">
                {g.choices.map((opt) => {
                  const selected = choices[g.key] === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => setChoices((s) => ({ ...s, [g.key]: opt.value }))}
                      className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                        selected
                          ? "bg-green-soft border-green text-green-dark"
                          : "bg-white border-line-medium text-ink-primary hover:border-green"
                      }`}
                      style={selected ? { borderWidth: 1.5 } : undefined}
                    >
                      {t(opt.labelKey)}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          ))}

          {addOns.length > 0 && (
            <fieldset>
              <legend className="text-sm font-semibold text-ink-primary mb-2">{t("misc.cust.addOns")}</legend>
              {/* Compact, text-only add-on rows with per-add-on quantity. */}
              <div className="space-y-1.5">
                {addOns.map((a) => {
                  const n = addOnQty[a.key] ?? 0;
                  return (
                    <div
                      key={a.key}
                      className={`flex min-h-[46px] items-center justify-between gap-3 rounded-xl border px-3 py-2 transition-colors ${
                        n > 0 ? "border-green bg-green-soft" : "border-line-medium bg-white"
                      }`}
                    >
                      <div className="flex min-w-0 items-baseline gap-2">
                        <span className="truncate text-[13.5px] font-medium text-ink-primary">{t(a.labelKey)}</span>
                        <span className="shrink-0 text-[11.5px] text-ink-muted">
                          {a.price > 0 ? `+${formatRM(a.price)}` : t("misc.opt.free")}
                        </span>
                      </div>
                      {n === 0 ? (
                        <button
                          type="button"
                          onClick={() => setAddon(a.key, 1)}
                          className="h-[34px] shrink-0 rounded-full bg-green px-4 text-xs font-semibold text-white hover:bg-green-hover"
                        >
                          {t("menu.card.add")}
                        </button>
                      ) : (
                        <div className="flex h-[34px] w-[86px] shrink-0 items-center justify-between rounded-full border border-line-medium bg-white px-1">
                          <button
                            type="button"
                            onClick={() => setAddon(a.key, n - 1)}
                            aria-label={t("misc.cust.decreaseQty")}
                            className="grid h-7 w-6 place-items-center rounded-full text-green-dark hover:bg-green-soft"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <output className="text-[13px] font-semibold text-green-dark">{n}</output>
                          <button
                            type="button"
                            onClick={() => setAddon(a.key, n + 1)}
                            aria-label={t("misc.cust.increaseQty")}
                            className="grid h-7 w-6 place-items-center rounded-full text-green-dark hover:bg-green-soft"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </fieldset>
          )}

          {foodOpts.length > 0 && (
            <fieldset>
              <legend className="text-sm font-semibold text-ink-primary mb-2">{t("misc.cust.allergyOptions")}</legend>
              <div className="flex flex-wrap gap-2">
                {foodOpts.map((o) => {
                  const selected = selOption.has(o.value);
                  return (
                    <button
                      key={o.value}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => toggleOption(o.value)}
                      className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                        selected
                          ? "bg-green-soft border-green text-green-dark"
                          : "bg-white border-line-medium text-ink-primary hover:border-green"
                      }`}
                      style={selected ? { borderWidth: 1.5 } : undefined}
                    >
                      {t(o.labelKey)}
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
              placeholder={
                t(`menu.item.${item.id}.remark`) === `menu.item.${item.id}.remark`
                  ? t("misc.cust.specialRequestPlaceholder")
                  : t(`menu.item.${item.id}.remark`)
              }
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
        <div className="border-t border-line-light p-4 sm:p-5 bg-white">
          {blocked && (
            <p className="mb-2.5 text-xs font-semibold text-primary">{helper}</p>
          )}
          <div className="flex items-center gap-3">
          <div className="flex h-12 items-center gap-1 rounded-full bg-surface-soft border border-line-medium px-1">
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
          <button
            onClick={submit}
            disabled={blocked}
            className="btn btn-green h-12 min-h-[48px] flex-1 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="hidden sm:inline">
              {t("misc.cust.addToMealPlan")}{price != null ? ` · ${formatRM(lineTotal)}` : ""}
            </span>
            <span className="sm:hidden">
              {t("menu.card.add")}{price != null ? ` · ${formatRM(lineTotal)}` : ""}
            </span>
          </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
