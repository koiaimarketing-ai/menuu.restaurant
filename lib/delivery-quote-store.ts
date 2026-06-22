/**
 * Server-stored delivery quotes. The browser never sets the fee — it can only
 * reference a quote id the server issued. In-memory for now (single server /
 * dev); persist to Supabase `delivery_quotes` when configured for multi-instance.
 */
import type { DeliveryQuote } from "./delivery-pricing";
import { DELIVERY_QUOTE_VALID_MINUTES } from "./delivery-pricing";

export type StoredQuote = {
  id: string;
  createdAt: number;
  expiresAt: number;
  outletId: string;
  destination: unknown;
  quote: DeliveryQuote;
};

const store = new Map<string, StoredQuote>();

export function newQuoteId(): string {
  return "q_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function saveQuote(input: Omit<StoredQuote, "createdAt" | "expiresAt">): StoredQuote {
  const createdAt = Date.now();
  const expiresAt = createdAt + DELIVERY_QUOTE_VALID_MINUTES * 60 * 1000;
  const record: StoredQuote = { ...input, createdAt, expiresAt };
  store.set(record.id, record);
  return record;
}

export function getStoredQuote(id: string): StoredQuote | null {
  const q = store.get(id);
  if (!q) return null;
  if (Date.now() > q.expiresAt) {
    store.delete(id);
    return null;
  }
  return q;
}
