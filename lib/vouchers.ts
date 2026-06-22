/**
 * Voucher configuration + validation logic, kept separate from the receipt UI so
 * the static list below can later be swapped for a Supabase table or an API call
 * without touching any component. Components only call the exported functions.
 */

export type Voucher = {
  code: string;
  type: "percentage" | "fixed";
  value: number;
  minimumSpend?: number;
  maximumDiscount?: number;
  expiryDate?: string; // ISO yyyy-mm-dd
  isActive: boolean;
};

/**
 * Temporary in-memory voucher list for testing. Replace `getVoucher` with a
 * Supabase / API lookup when a real voucher backend exists — the return shape
 * (a `Voucher` or undefined) is all the rest of the app depends on.
 */
export const VOUCHERS: Voucher[] = [
  {
    code: "WEEKDAY10",
    type: "percentage",
    value: 10,
    minimumSpend: 20,
    maximumDiscount: 10,
    isActive: true,
  },
];

export type VoucherErrorReason =
  | "empty"
  | "invalid"
  | "inactive"
  | "expired"
  | "min-spend"
  | "used";

export type VoucherResult =
  | { ok: true; voucher: Voucher; discount: number }
  | { ok: false; reason: VoucherErrorReason; minimumSpend?: number };

const normalize = (code: string) => code.trim().toUpperCase();

/** Look a voucher up by code (case-insensitive, trimmed). */
export function getVoucher(code: string): Voucher | undefined {
  const c = normalize(code);
  return VOUCHERS.find((v) => v.code.toUpperCase() === c);
}

/** Discount amount for a voucher against a subtotal (rounded to 2 decimals). */
export function computeDiscount(voucher: Voucher, subtotal: number): number {
  let discount: number;
  if (voucher.type === "percentage") {
    discount = subtotal * (voucher.value / 100);
    if (voucher.maximumDiscount != null) discount = Math.min(discount, voucher.maximumDiscount);
  } else {
    discount = Math.min(voucher.value, subtotal);
  }
  discount = Math.max(0, Math.min(discount, subtotal));
  return Math.round(discount * 100) / 100;
}

/**
 * Validate a code against the current subtotal. `usedCodes` is optional customer
 * usage data — when absent the "already used" check is skipped.
 */
export function validateVoucher(
  code: string,
  subtotal: number,
  opts?: { usedCodes?: string[]; now?: number }
): VoucherResult {
  if (!code || code.trim() === "") return { ok: false, reason: "empty" };

  const voucher = getVoucher(code);
  if (!voucher) return { ok: false, reason: "invalid" };
  if (!voucher.isActive) return { ok: false, reason: "inactive" };

  if (voucher.expiryDate) {
    const now = opts?.now ?? Date.now();
    const expiry = new Date(`${voucher.expiryDate}T23:59:59`).getTime();
    if (!Number.isNaN(expiry) && now > expiry) return { ok: false, reason: "expired" };
  }

  if (opts?.usedCodes?.some((c) => normalize(c) === normalize(code))) {
    return { ok: false, reason: "used" };
  }

  if (voucher.minimumSpend != null && subtotal < voucher.minimumSpend) {
    return { ok: false, reason: "min-spend", minimumSpend: voucher.minimumSpend };
  }

  return { ok: true, voucher, discount: computeDiscount(voucher, subtotal) };
}

/** Short capsule label, e.g. "WEEKDAY10 — 10% OFF" or "SAVE5 — RM5 OFF". */
export function voucherLabel(voucher: Voucher | undefined, fallbackCode?: string | null): string {
  if (!voucher) return (fallbackCode ?? "").toUpperCase();
  const amount = voucher.type === "percentage" ? `${voucher.value}% OFF` : `RM${voucher.value} OFF`;
  return `${voucher.code} — ${amount}`;
}
