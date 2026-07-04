"use client";

import { useMemo, useRef, useState } from "react";
import {
  Menu as Burger,
  Star,
  MapPin,
  Check,
  Leaf,
  ShoppingBag,
  Soup,
  UtensilsCrossed,
  CookingPot,
  Sandwich,
  CupSoda,
  Salad,
  Drumstick,
  PlusCircle,
  type LucideIcon,
} from "lucide-react";
import { WJ, BRANCHES, MODES, CATEGORIES, ITEM_BY_CODE, rm, type WjItem } from "@/lib/introduction/warung-menu";
import { WarungItemRow } from "./warung-item-row";
import { ItemBottomSheet } from "./item-bottom-sheet";

const CAT_ICON: Record<string, LucideIcon> = {
  "mie-ayam": Soup,
  bakso: CookingPot,
  "set-nasi": UtensilsCrossed,
  "a-la-carte": Drumstick,
  "sayur-lauk": Salad,
  gorengan: Drumstick,
  "roti-bakar": Sandwich,
  minuman: CupSoda,
  tambahan: PlusCircle,
};

export function RestaurantMenuPreview() {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [branch, setBranch] = useState("SS4");
  const [mode, setMode] = useState("datang");
  const [veg, setVeg] = useState(false);
  const [activeCat, setActiveCat] = useState(CATEGORIES[0].id);
  const [openCode, setOpenCode] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const setQty = (code: string, n: number) =>
    setCart((c) => {
      const next = { ...c };
      if (n <= 0) delete next[code];
      else next[code] = n;
      return next;
    });

  const { totalQty, totalPrice } = useMemo(() => {
    let q = 0;
    let p = 0;
    for (const [code, n] of Object.entries(cart)) {
      q += n;
      p += n * (ITEM_BY_CODE[code]?.price ?? 0);
    }
    return { totalQty: q, totalPrice: p };
  }, [cart]);

  const goCat = (id: string) => {
    setActiveCat(id);
    scrollRef.current?.querySelector(`#wj-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const rowFor = (it: WjItem) => {
    const qty = cart[it.code] ?? 0;
    return (
      <WarungItemRow
        key={it.code}
        item={it}
        qty={qty}
        onAdd={() => setQty(it.code, 1)}
        onInc={() => setQty(it.code, qty + 1)}
        onDec={() => setQty(it.code, qty - 1)}
        onOpen={() => setOpenCode(it.code)}
      />
    );
  };

  const openItem = openCode ? ITEM_BY_CODE[openCode] : null;

  return (
    <div className="relative flex h-full flex-col bg-page">
      {/* scroll area */}
      <div ref={scrollRef} className="no-scrollbar flex-1 overflow-y-auto overscroll-contain scroll-smooth pb-24">
        {/* top restaurant image banner */}
        <div className="relative h-[92px] bg-gradient-to-br from-navy via-primary-dark to-primary">
          <div className="bg-grid absolute inset-0 opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/30 to-transparent" />
        </div>

        {/* floating navbar */}
        <div className="sticky top-2 z-30 mx-3 -mt-12 mb-4 flex h-14 items-center justify-between rounded-full border border-border-blue/90 bg-white/85 px-2.5 shadow-[var(--shadow-soft)] backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-[10px] font-extrabold text-white">
              WJ
            </span>
            <div className="leading-tight">
              <p className="text-[12px] font-extrabold text-navy">{WJ.brand}</p>
              <p className="text-[7px] font-semibold tracking-wider text-slate">{WJ.brandSub}</p>
            </div>
          </div>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-soft-blue text-primary">
            <Burger className="h-4 w-4" />
          </span>
        </div>

        {/* hero card */}
        <div className="px-3">
          <div className="rounded-[28px] border border-border-blue bg-white p-4 text-center shadow-[var(--shadow-card)]">
            <span className="inline-flex items-center gap-1 rounded-full bg-soft-blue px-2.5 py-1 text-[9px] font-bold text-primary">
              ✦ {WJ.eyebrow}
            </span>
            <h2 className="mt-2 font-display text-[19px] font-bold leading-[1.12] text-navy">
              {WJ.titleA} {WJ.titleB}
            </h2>
            <p className="mx-auto mt-2 max-w-[230px] text-[10.5px] leading-relaxed text-ink">{WJ.desc}</p>
            <div className="mx-auto mt-3 inline-flex items-center gap-2 rounded-2xl border border-border-blue bg-page px-3 py-2">
              <span className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-primary text-primary" />
                ))}
              </span>
              <span className="text-xs font-extrabold text-navy">{WJ.rating}</span>
              <span className="text-[10px] text-primary">{WJ.reviews}</span>
            </div>
          </div>
        </div>

        {/* branch picker */}
        <div className="px-3 pt-4">
          <p className="text-[9px] font-bold uppercase tracking-wider text-slate">{WJ.branchHeading}</p>
          <div className="mt-2 space-y-2">
            {BRANCHES.map((b) => {
              const on = branch === b.id;
              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setBranch(b.id)}
                  className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-colors ${
                    on ? "border-primary bg-primary text-white" : "border-border-blue bg-white"
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                      on ? "bg-white/20 text-white" : "bg-soft-blue text-primary"
                    }`}
                  >
                    <MapPin className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1.5">
                      <span className={`text-[13px] font-extrabold ${on ? "text-white" : "text-navy"}`}>{b.id}</span>
                      <span
                        className={`rounded px-1.5 py-0.5 text-[8px] font-bold ${
                          on ? "bg-white/20 text-white" : "bg-soft-blue text-slate"
                        }`}
                      >
                        {b.badge}
                      </span>
                      <span className={`text-[10px] font-bold ${on ? "text-white/90" : b.open ? "text-primary" : "text-slate"}`}>
                        • {b.status}
                      </span>
                    </span>
                    <span className={`mt-0.5 block text-[11px] ${on ? "text-white/80" : "text-ink"}`}>{b.hours}</span>
                  </span>
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                      on ? "border-white bg-white text-primary" : "border-border-blue"
                    }`}
                  >
                    {on && <Check className="h-3 w-3" strokeWidth={3} />}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* order mode tabs */}
        <div className="px-3 pt-4">
          <p className="text-[9px] font-bold uppercase tracking-wider text-slate">{WJ.modeHeading}</p>
          <div className="mt-2 grid grid-cols-3 gap-1 rounded-full bg-soft-blue p-1">
            {MODES.map((m) => {
              const on = mode === m.id;
              const Icon = m.icon;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMode(m.id)}
                  className={`flex items-center justify-center gap-1.5 rounded-full py-2 text-[11px] font-bold transition-colors ${
                    on ? "bg-primary text-white shadow-[var(--shadow-cta)]" : "text-ink"
                  }`}
                >
                  <Icon className="h-4 w-4" /> {m.label}
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-[9.5px] leading-relaxed text-slate">{WJ.modeNote}</p>
        </div>

        {/* category chips */}
        <div className="mt-4 px-3">
          <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => goCat(c.id)}
                className={`shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-[11px] font-bold transition-colors ${
                  activeCat === c.id ? "bg-primary text-white" : "border border-border-blue bg-white text-ink"
                }`}
              >
                {c.name}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setVeg((v) => !v)}
              className={`flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-3 py-1.5 text-[11px] font-bold transition-colors ${
                veg ? "bg-primary text-white" : "border border-border-blue bg-white text-ink"
              }`}
            >
              <Leaf className="h-3 w-3" /> {WJ.veg}
            </button>
          </div>
          <p className="mt-1.5 text-[9px] text-slate">{WJ.chipsNote}</p>
        </div>

        {/* categories */}
        <div className="space-y-6 px-3 pt-3">
          {CATEGORIES.map((c) => {
            const Icon = CAT_ICON[c.id] ?? Soup;
            return (
              <section key={c.id} id={`wj-${c.id}`} className="scroll-mt-4">
                <h3 className="font-display text-[17px] font-bold text-navy">{c.name}</h3>
                <p className="mt-1 text-[10.5px] leading-relaxed text-slate">{c.desc}</p>

                {/* large category food image */}
                <div className="relative mt-2.5 flex h-[120px] items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-soft-blue via-white to-primary-accent/30">
                  <div className="bg-grid absolute inset-0 opacity-20" />
                  <Icon className="relative h-12 w-12 text-primary/70" />
                  <span className="absolute bottom-2 left-2 rounded-full bg-white/90 px-2 py-0.5 text-[9px] font-bold text-primary shadow-sm">
                    {c.name}
                  </span>
                </div>

                <div className="mt-3 space-y-2">
                  {c.items?.map(rowFor)}
                  {c.groups?.map((g) => (
                    <div key={g.label} className="space-y-2">
                      <p className="pt-1 text-[11px] font-bold text-primary">{g.label}</p>
                      {g.items.map(rowFor)}
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>

      {/* sticky meal plan button */}
      <div className="absolute inset-x-0 bottom-0 z-30 bg-gradient-to-t from-page via-page/95 to-transparent p-3 pt-6">
        <button
          type="button"
          className="flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-primary text-[13px] font-bold text-white shadow-[var(--shadow-cta)] transition-colors hover:bg-primary-dark active:scale-[0.98]"
        >
          <ShoppingBag className="h-4 w-4" />
          View Meal Plan
          <span className="ml-1 rounded-full bg-white/20 px-2 py-0.5 tabular-nums">
            {totalQty > 0 ? `${totalQty} · ${rm(totalPrice)}` : rm(0)}
          </span>
        </button>
      </div>

      {/* item detail bottom sheet */}
      <ItemBottomSheet
        item={openItem}
        initialQty={openCode ? cart[openCode] ?? 1 : 1}
        onClose={() => setOpenCode(null)}
        onConfirm={(qty) => {
          if (openCode) setQty(openCode, qty);
          setOpenCode(null);
        }}
      />
    </div>
  );
}
