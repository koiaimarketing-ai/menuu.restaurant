import { NextResponse } from "next/server";
import { sbInsert, supabaseConfigured } from "@/lib/supabase";

export const runtime = "nodejs";

/**
 * Persist an order record. Requires Supabase; returns 501 until configured so
 * we never pretend an order was stored. Status always begins at
 * "awaiting_receipt_confirmation".
 */
export async function POST(req: Request) {
  if (!supabaseConfigured()) {
    return NextResponse.json({ error: "not_configured" }, { status: 501 });
  }
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  // Allow-list the columns a client may set. Server-controlled fields
  // (payment_status, created_at, reference, totals) are NEVER taken from the
  // body — spreading `...body` previously let a caller spoof any column.
  const ALLOWED = [
    "reference",
    "visit_type",
    "quote_id",
    "branch",
    "customer_name",
    "customer_contact",
    "address",
    "unit",
    "landmark",
    "notes",
    "items",
    "food_subtotal",
  ] as const;
  const row: Record<string, unknown> = {};
  for (const key of ALLOWED) {
    if (body[key] !== undefined) row[key] = body[key];
  }

  try {
    const inserted = await sbInsert("orders", {
      ...row,
      payment_status: "awaiting_receipt_confirmation",
      created_at: new Date().toISOString(),
    });
    return NextResponse.json({ order: inserted });
  } catch {
    return NextResponse.json({ error: "insert_failed" }, { status: 502 });
  }
}
