import type { MenuItem } from "@/data/menu";
import type { LineItem } from "./meal-plan-store";
import { getLocation } from "@/data/locations";

// Configurable rates (not hardcoded into components).
export const SST_RATE = 0.06;
export const SERVICE_RATE = 0.1;

/** Canonical planner price list (the supplied KL Central Walk menu prices). */
export const plannerPrice = (item: MenuItem): number =>
  item.branchPrices["kl-central-walk"] ?? 0;

export const fmtRM = (n: number): string => `RM ${n.toFixed(2)}`;

export type Totals = {
  subtotal: number;
  sst: number;
  service: number;
  grandTotal: number;
};

export function computeTotals(items: LineItem[]): Totals {
  const subtotal = items.reduce((s, l) => s + (l.unitPrice ?? 0) * l.qty, 0);
  const sst = subtotal * SST_RATE;
  const service = subtotal * SERVICE_RATE;
  return { subtotal, sst, service, grandTotal: subtotal + sst + service };
}

const visitLabel = (
  mode: string | null,
  date: string | null,
  time: string | null
): string => {
  if (mode === "later") {
    if (date && time) return `Appointment · ${date} ${time}`;
    return "Appointment";
  }
  if (mode === "now") return "Going now";
  return "Not specified";
};

export function buildWhatsAppMessage(
  items: LineItem[],
  branchId: string | null,
  visitMode: string | null,
  visitDate: string | null,
  visitTime: string | null
): string {
  const branch = branchId ? getLocation(branchId) : undefined;
  const t = computeTotals(items);
  const lines: string[] = [];
  lines.push("*Menuu — Meal Planning List*");
  lines.push("");
  if (branch) lines.push(`Outlet: ${branch.shortName}`);
  lines.push(`Visit: ${visitLabel(visitMode, visitDate, visitTime)}`);
  lines.push("");
  items.forEach((l) => {
    const lineTotal = (l.unitPrice ?? 0) * l.qty;
    lines.push(
      `${l.qty} × ${l.name} (${fmtRM(l.unitPrice ?? 0)}) = ${fmtRM(lineTotal)}`
    );
  });
  lines.push("");
  lines.push(`Subtotal: ${fmtRM(t.subtotal)}`);
  lines.push(`SST (6%): ${fmtRM(t.sst)}`);
  lines.push(`Service Charge (10%): ${fmtRM(t.service)}`);
  lines.push(`*Grand Total: ${fmtRM(t.grandTotal)}*`);
  lines.push("");
  lines.push(
    "This is a meal-planning list to help us plan before arriving. It is not a confirmed preorder. Final availability, prices, tax and service charge will be confirmed by restaurant staff."
  );
  return lines.join("\n");
}

/** Encode the current plan into a shareable URL query string. */
export function buildShareUrl(
  items: LineItem[],
  branchId: string | null,
  visitMode: string | null
): string {
  const payload = {
    b: branchId,
    v: visitMode,
    i: items.map((l) => ({ id: l.itemId, q: l.qty })),
  };
  const encoded =
    typeof window !== "undefined"
      ? window.btoa(encodeURIComponent(JSON.stringify(payload)))
      : "";
  const base =
    typeof window !== "undefined"
      ? `${window.location.origin}${window.location.pathname}`
      : "";
  return `${base}?plan=${encoded}`;
}

export function decodeSharedPlan(
  param: string
): { b: string | null; v: string | null; i: { id: string; q: number }[] } | null {
  try {
    return JSON.parse(decodeURIComponent(window.atob(param)));
  } catch {
    return null;
  }
}
