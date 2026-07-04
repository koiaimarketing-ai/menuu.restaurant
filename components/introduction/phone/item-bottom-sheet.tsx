"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Soup, Check } from "lucide-react";
import { SHEET, ALLERGIES, ADDONS, rm, type WjItem } from "@/lib/introduction/warung-menu";

type Props = {
  item: WjItem | null;
  initialQty: number;
  onClose: () => void;
  onConfirm: (qty: number) => void;
};

export function ItemBottomSheet({ item, initialQty, onClose, onConfirm }: Props) {
  return (
    <AnimatePresence>
      {item && <Sheet key={item.code} item={item} initialQty={initialQty} onClose={onClose} onConfirm={onConfirm} />}
    </AnimatePresence>
  );
}

function Sheet({ item, initialQty, onClose, onConfirm }: { item: WjItem } & Omit<Props, "item">) {
  const [qty, setQty] = useState(Math.max(1, initialQty));
  const [remark, setRemark] = useState("");
  const [allergies, setAllergies] = useState<Set<string>>(new Set());
  const [addons, setAddons] = useState<Set<string>>(new Set());

  const toggle = (set: Set<string>, val: string) => {
    const next = new Set(set);
    next.has(val) ? next.delete(val) : next.add(val);
    return next;
  };

  const addonTotal = ADDONS.filter((a) => addons.has(a.id)).reduce((s, a) => s + a.price, 0);
  const lineTotal = (item.price + addonTotal) * qty;

  return (
    <div className="absolute inset-0 z-40 flex flex-col justify-end">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="absolute inset-0 bg-navy/40 backdrop-blur-[1px]"
      />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 380, damping: 38 }}
        className="no-scrollbar relative max-h-[85%] overflow-y-auto rounded-t-[28px] bg-white"
      >
        <div className="sticky top-0 z-10 bg-white px-4 pb-2 pt-3">
          <div className="mx-auto h-1.5 w-10 rounded-full bg-border-blue" />
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="absolute right-3 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-soft-blue text-navy active:scale-90"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-4 pb-28">
          <div className="relative flex h-36 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-soft-blue via-white to-primary-accent/40">
            <div className="bg-grid absolute inset-0 opacity-20" />
            <Soup className="relative h-14 w-14 text-primary/70" />
          </div>

          <div className="mt-3 flex items-start justify-between gap-3">
            <div>
              <p className="text-[15px] font-bold leading-snug text-navy">
                <span className="mr-1 text-primary">[{item.code}]</span>
                {item.name}
              </p>
              {item.pcs && <p className="text-[11px] text-slate">{item.pcs}</p>}
              <p className="mt-1 text-sm font-bold text-primary">{rm(item.price)}</p>
            </div>
            <div className="flex items-center gap-1 rounded-[14px] border border-border-blue bg-white p-1">
              <button
                type="button"
                aria-label="Decrease"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-soft-blue text-primary active:scale-90"
              >
                –
              </button>
              <span className="min-w-[2rem] text-center text-base font-bold tabular-nums text-navy">{qty}</span>
              <button
                type="button"
                aria-label="Increase"
                onClick={() => setQty((q) => q + 1)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white hover:bg-primary-dark active:scale-90"
              >
                +
              </button>
            </div>
          </div>

          <div className="mt-5">
            <label className="text-xs font-bold uppercase tracking-wide text-slate">{SHEET.remark}</label>
            <textarea
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              rows={2}
              placeholder={SHEET.remarkPlaceholder}
              className="mt-1.5 w-full resize-none rounded-xl border border-border-blue bg-page px-3 py-2 text-sm text-navy placeholder:text-slate focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div className="mt-5">
            <label className="text-xs font-bold uppercase tracking-wide text-slate">{SHEET.allergy}</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {ALLERGIES.map((a) => {
                const on = allergies.has(a);
                return (
                  <button
                    key={a}
                    type="button"
                    onClick={() => setAllergies((s) => toggle(s, a))}
                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                      on ? "border-primary bg-primary text-white" : "border-border-blue bg-white text-ink hover:border-primary-accent"
                    }`}
                  >
                    {a}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-5">
            <label className="text-xs font-bold uppercase tracking-wide text-slate">{SHEET.addons}</label>
            <div className="mt-2 space-y-2">
              {ADDONS.map((a) => {
                const on = addons.has(a.id);
                return (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => setAddons((s) => toggle(s, a.id))}
                    className={`flex w-full items-center justify-between rounded-xl border px-3 py-2.5 text-sm transition-colors ${
                      on ? "border-primary bg-soft-blue" : "border-border-blue bg-white"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded-md border ${
                          on ? "border-primary bg-primary text-white" : "border-border-blue bg-white"
                        }`}
                      >
                        {on && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                      </span>
                      <span className="font-medium text-navy">{a.label}</span>
                    </span>
                    <span className="font-semibold text-slate">+{rm(a.price)}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 border-t border-border-blue bg-white p-3">
          <button
            type="button"
            onClick={() => onConfirm(qty)}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-bold text-white shadow-[var(--shadow-cta)] transition-colors hover:bg-primary-dark active:scale-[0.98]"
          >
            {SHEET.addToPlan} · {rm(lineTotal)}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
