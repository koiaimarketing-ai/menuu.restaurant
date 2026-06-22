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
  try {
    const row = await sbInsert("orders", {
      ...body,
      payment_status: "awaiting_receipt_confirmation",
      created_at: new Date().toISOString(),
    });
    return NextResponse.json({ order: row });
  } catch {
    return NextResponse.json({ error: "insert_failed" }, { status: 502 });
  }
}
