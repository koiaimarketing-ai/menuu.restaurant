"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import { validateVoucher } from "./vouchers";

export type BranchId = "ss4" | "kl-central-walk";
export type VisitMode = "now" | "later";
export type PlanType = "going" | "delivery" | "rsvp";

export type LineItem = {
  lineId: string;
  itemId: string;
  name: string;
  unitPrice: number | null;
  qty: number;
  choices: Record<string, string>;
  note?: string;
};

type MealPlanState = {
  branchId: BranchId | null;
  visitMode: VisitMode | null;
  visitDate: string | null; // ISO yyyy-mm-dd
  visitTime: string | null; // HH:mm
  items: LineItem[];
  warningAck: boolean;
  updatedAt: number | null;
  /** Absolute expiry instant (ms). A plan is valid until the next 8:00 AM KL. */
  expiresAt: number | null;
  /** Applied voucher code (normalized upper-case), or null when none. */
  voucherCode: string | null;
  /** Visit plan chosen on the planning screen. */
  planType: PlanType | null;
};

/**
 * Next 8:00 AM in Asia/Kuala_Lumpur as an absolute timestamp (ms).
 * Malaysia is a fixed UTC+8 with no DST, so 08:00 KL == 00:00 UTC. The next
 * 8 AM KL is therefore the next UTC midnight strictly after now — independent
 * of the visitor's device timezone.
 */
function nextEightAmKL(): number {
  const now = Date.now();
  const d = new Date(now);
  let next = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0, 0);
  if (next <= now) {
    next = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1, 0, 0, 0, 0);
  }
  return next;
}

type Ctx = MealPlanState & {
  setBranch: (b: BranchId) => void;
  setVisit: (mode: VisitMode, date: string | null, time: string | null) => void;
  setPlanType: (t: PlanType) => void;
  addItem: (item: Omit<LineItem, "lineId">) => void;
  setQty: (lineId: string, qty: number) => void;
  removeLine: (lineId: string) => void;
  updateLine: (lineId: string, patch: Partial<LineItem>) => void;
  clearItems: () => void;
  /** Reset the whole plan (items, visit, date/time, outlet) to a clean initial state. */
  resetPlan: () => void;
  ackWarning: () => void;
  applyVoucher: (code: string) => void;
  removeVoucher: () => void;
  count: number;
  subtotal: number;
  /** Current voucher discount against the subtotal (0 if none / not valid now). */
  voucherDiscount: number;
  hydrated: boolean;
  expiresAt: number | null;
  // Shared receipt-modal UI state so any trigger (sidebar, navbar capsule)
  // opens the SAME single receipt modal without duplicating state.
  receiptOpen: boolean;
  receiptGeneratedAt: string;
  openReceipt: () => void;
  closeReceipt: () => void;
  // Shared checkout modal UI state.
  checkoutOpen: boolean;
  openCheckout: () => void;
  closeCheckout: () => void;
};

const KEY = "warung-jakarta-meal-plan-v1";

const MealPlanContext = createContext<Ctx | null>(null);

const lineKey = (itemId: string, choices: Record<string, string>) =>
  `${itemId}__${Object.entries(choices)
    .sort()
    .map(([k, v]) => `${k}:${v}`)
    .join("|")}`;

export function MealPlanProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<MealPlanState>({
    branchId: null,
    visitMode: null,
    visitDate: null,
    visitTime: null,
    items: [],
    warningAck: false,
    updatedAt: null,
    expiresAt: null,
    voucherCode: null,
    planType: null,
  });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setState((s) => ({ ...s, ...JSON.parse(raw) }));
    } catch {
      /* ignore corrupt storage */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* ignore quota */
    }
  }, [state, hydrated]);

  const setBranch = useCallback((b: BranchId) => {
    setState((s) => ({ ...s, branchId: b, warningAck: false, updatedAt: Date.now() }));
  }, []);

  const setVisit = useCallback(
    (mode: VisitMode, date: string | null, time: string | null) => {
      setState((s) => ({
        ...s,
        visitMode: mode,
        visitDate: date,
        visitTime: time,
        warningAck: false,
        updatedAt: Date.now(),
      }));
    },
    []
  );

  const setPlanType = useCallback((t: PlanType) => {
    setState((s) => ({
      ...s,
      planType: t,
      visitMode: t === "rsvp" ? "later" : "now",
      visitDate: t === "rsvp" ? s.visitDate : null,
      visitTime: t === "rsvp" ? s.visitTime : null,
      warningAck: false,
      updatedAt: Date.now(),
    }));
  }, []);

  const addItem = useCallback((item: Omit<LineItem, "lineId">) => {
    setState((s) => {
      const key = lineKey(item.itemId, item.choices);
      const existingIdx = s.items.findIndex(
        (l) => lineKey(l.itemId, l.choices) === key && (l.note ?? "") === (item.note ?? "")
      );
      let items: LineItem[];
      if (existingIdx >= 0) {
        items = s.items.map((l, i) =>
          i === existingIdx ? { ...l, qty: l.qty + item.qty } : l
        );
      } else {
        items = [
          ...s.items,
          { ...item, lineId: `${key}__${s.items.length}__${item.qty}` + Math.round(Math.random()*1e6) },
        ];
      }
      // Set the expiry once, when the plan goes from empty → non-empty. Editing
      // quantities or notes afterwards must NOT extend it.
      const expiresAt = s.items.length === 0 ? nextEightAmKL() : s.expiresAt;
      return { ...s, items, updatedAt: Date.now(), expiresAt };
    });
  }, []);

  const setQty = useCallback((lineId: string, qty: number) => {
    setState((s) => {
      const items =
        qty <= 0
          ? s.items.filter((l) => l.lineId !== lineId)
          : s.items.map((l) => (l.lineId === lineId ? { ...l, qty } : l));
      return {
        ...s,
        items,
        updatedAt: Date.now(),
        expiresAt: items.length === 0 ? null : s.expiresAt,
      };
    });
  }, []);

  const removeLine = useCallback((lineId: string) => {
    setState((s) => {
      const items = s.items.filter((l) => l.lineId !== lineId);
      return {
        ...s,
        items,
        updatedAt: Date.now(),
        expiresAt: items.length === 0 ? null : s.expiresAt,
      };
    });
  }, []);

  const updateLine = useCallback((lineId: string, patch: Partial<LineItem>) => {
    setState((s) => ({
      ...s,
      items: s.items.map((l) => (l.lineId === lineId ? { ...l, ...patch } : l)),
      updatedAt: Date.now(),
    }));
  }, []);

  const clearItems = useCallback(() => {
    setState((s) => ({ ...s, items: [], expiresAt: null, updatedAt: Date.now() }));
  }, []);

  const resetPlan = useCallback(() => {
    setState((s) => ({
      ...s,
      branchId: "ss4", // clean initial-visit default outlet
      visitMode: null,
      visitDate: null,
      visitTime: null,
      items: [],
      warningAck: false,
      expiresAt: null,
      voucherCode: null,
      planType: null,
      updatedAt: Date.now(),
    }));
  }, []);

  const ackWarning = useCallback(() => {
    setState((s) => ({ ...s, warningAck: true }));
  }, []);

  const applyVoucher = useCallback((code: string) => {
    setState((s) => ({ ...s, voucherCode: code.trim().toUpperCase(), updatedAt: Date.now() }));
  }, []);

  const removeVoucher = useCallback(() => {
    setState((s) => ({ ...s, voucherCode: null, updatedAt: Date.now() }));
  }, []);

  // Receipt modal — single shared instance (rendered once by ReceiptHost).
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [receiptGeneratedAt, setReceiptGeneratedAt] = useState("");
  const openReceipt = useCallback(() => {
    setReceiptGeneratedAt(
      new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Kuala_Lumpur",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date())
    );
    setReceiptOpen(true);
  }, []);
  const closeReceipt = useCallback(() => setReceiptOpen(false), []);

  // Checkout modal — single shared instance (rendered once by CheckoutHost).
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const openCheckout = useCallback(() => setCheckoutOpen(true), []);
  const closeCheckout = useCallback(() => setCheckoutOpen(false), []);

  const count = useMemo(
    () => state.items.reduce((n, l) => n + l.qty, 0),
    [state.items]
  );
  const subtotal = useMemo(
    () =>
      state.items.reduce((sum, l) => sum + (l.unitPrice ?? 0) * l.qty, 0),
    [state.items]
  );

  // Re-validate the applied voucher against the live subtotal every change, so a
  // qty edit that drops below the minimum spend silently yields 0 discount
  // (the capsule stays; the UI surfaces the reason and re-applies when eligible).
  const voucherDiscount = useMemo(() => {
    if (!state.voucherCode) return 0;
    const res = validateVoucher(state.voucherCode, subtotal);
    return res.ok ? res.discount : 0;
  }, [state.voucherCode, subtotal]);

  // Memoize so the Provider value keeps a stable identity between renders.
  // This provider wraps the whole app, so an unmemoized object would re-render
  // every consumer on each render. Callbacks are already stable (useCallback).
  const value: Ctx = useMemo(
    () => ({
      ...state,
      setBranch,
      setVisit,
      setPlanType,
      addItem,
      setQty,
      removeLine,
      updateLine,
      clearItems,
      resetPlan,
      ackWarning,
      applyVoucher,
      removeVoucher,
      count,
      subtotal,
      voucherDiscount,
      hydrated,
      receiptOpen,
      receiptGeneratedAt,
      openReceipt,
      closeReceipt,
      checkoutOpen,
      openCheckout,
      closeCheckout,
    }),
    [
      state,
      setBranch,
      setVisit,
      setPlanType,
      addItem,
      setQty,
      removeLine,
      updateLine,
      clearItems,
      resetPlan,
      ackWarning,
      applyVoucher,
      removeVoucher,
      count,
      subtotal,
      voucherDiscount,
      hydrated,
      receiptOpen,
      receiptGeneratedAt,
      openReceipt,
      closeReceipt,
      checkoutOpen,
      openCheckout,
      closeCheckout,
    ]
  );

  return (
    <MealPlanContext.Provider value={value}>{children}</MealPlanContext.Provider>
  );
}

export function useMealPlan(): Ctx {
  const ctx = useContext(MealPlanContext);
  if (!ctx) throw new Error("useMealPlan must be used within MealPlanProvider");
  return ctx;
}
