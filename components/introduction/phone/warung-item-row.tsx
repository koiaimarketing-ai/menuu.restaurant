"use client";

import { Minus, Plus } from "lucide-react";
import { WJ, rm, type WjItem } from "@/lib/introduction/warung-menu";

type Props = {
  item: WjItem;
  qty: number;
  onAdd: () => void;
  onInc: () => void;
  onDec: () => void;
  onOpen: () => void;
};

export function WarungItemRow({ item, qty, onAdd, onInc, onDec, onOpen }: Props) {
  const active = qty > 0;
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onOpen()}
      className={`flex cursor-pointer items-center justify-between gap-3 rounded-2xl border bg-white p-3 transition-colors ${
        active ? "border-primary bg-soft-blue" : "border-border-blue hover:border-primary-accent"
      }`}
    >
      <div className="min-w-0 flex-1">
        <p className="text-[12.5px] font-semibold leading-snug text-navy">
          <span className="mr-1 font-extrabold text-primary">[{item.code}]</span>
          {item.name}
        </p>
        {item.pcs && <span className="mt-0.5 inline-block text-[11px] text-slate">{item.pcs}</span>}
        <p className="mt-1 text-[13px] font-extrabold text-navy">{rm(item.price)}</p>
      </div>

      {active ? (
        <div
          className="flex shrink-0 items-center gap-1 rounded-[14px] border border-border-blue bg-white p-1"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            aria-label="Decrease"
            onClick={onDec}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-soft-blue text-primary transition-transform active:scale-90"
          >
            <Minus className="h-4 w-4" strokeWidth={3} />
          </button>
          <span className="min-w-[1.25rem] text-center text-sm font-bold tabular-nums text-navy">{qty}</span>
          <button
            type="button"
            aria-label="Increase"
            onClick={onInc}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white transition-transform hover:bg-primary-dark active:scale-90"
          >
            <Plus className="h-4 w-4" strokeWidth={3} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onAdd();
          }}
          className="flex h-[42px] shrink-0 items-center gap-1 rounded-[14px] bg-primary px-4 text-xs font-bold text-white transition-colors hover:bg-primary-dark active:scale-95"
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={3} /> {WJ.add}
        </button>
      )}
    </div>
  );
}
