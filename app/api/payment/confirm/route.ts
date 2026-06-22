import { NextResponse } from "next/server";
import { sbUpdate, supabaseConfigured } from "@/lib/supabase";

export const runtime = "nodejs";

/**
 * Marks a payment confirmed. ONLY an admin (matching ADMIN_CONFIRM_TOKEN) or a
 * verified payment webhook may call this — clicking the WhatsApp button never
 * confirms payment. On success the order advances to "preparing_delivery".
 */
export async function POST(req: Request) {
  if (!supabaseConfigured()) {
    return NextResponse.json({ error: "not_configured" }, { status: 501 });
  }

  const token = req.headers.get("x-admin-token");
  if (!process.env.ADMIN_CONFIRM_TOKEN || token !== process.env.ADMIN_CONFIRM_TOKEN) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: { reference?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  if (!body.reference) return NextResponse.json({ error: "missing_reference" }, { status: 400 });

  const ok = await sbUpdate(
    "orders",
    { reference: body.reference },
    { payment_status: "payment_confirmed", delivery_status: "preparing_delivery", confirmed_at: new Date().toISOString() }
  );
  if (!ok) return NextResponse.json({ error: "update_failed" }, { status: 502 });

  return NextResponse.json({ reference: body.reference, paymentStatus: "payment_confirmed", deliveryStatus: "preparing_delivery" });
}
