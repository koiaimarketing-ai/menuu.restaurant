import { NextResponse } from "next/server";
import { getStoredQuote } from "@/lib/delivery-quote-store";
import { sbInsert, supabaseConfigured } from "@/lib/supabase";

export const runtime = "nodejs";

/**
 * Issues a unique payment reference once the checkout total is final. For
 * Delivery Now a valid (unexpired) server quote id is required so the fee can
 * never be removed or altered client-side. Order status starts at
 * "awaiting_receipt_confirmation" and is only persisted when Supabase exists.
 */
export async function POST(req: Request) {
  let body: { visitType?: string; quoteId?: string; foodSubtotal?: number; customer?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  let deliveryFee = 0;
  let totalPayable = Number(body.foodSubtotal) || 0;

  if (body.visitType === "Delivery Now") {
    if (!body.quoteId) return NextResponse.json({ error: "missing_quote" }, { status: 400 });
    const stored = getStoredQuote(body.quoteId);
    if (!stored) return NextResponse.json({ error: "quote_expired" }, { status: 409 });
    deliveryFee = stored.quote.finalDeliveryFee;
    totalPayable = stored.quote.totalPayable;
  }

  const reference =
    "WJ-" + Date.now().toString(36).slice(-5).toUpperCase() + "-" + Math.random().toString(36).slice(2, 5).toUpperCase();
  const paymentStatus = "awaiting_receipt_confirmation";

  if (supabaseConfigured()) {
    try {
      await sbInsert("orders", {
        reference,
        visit_type: body.visitType,
        quote_id: body.quoteId ?? null,
        delivery_fee: deliveryFee,
        total_payable: totalPayable,
        payment_status: paymentStatus,
        created_at: new Date().toISOString(),
      });
    } catch {
      // persistence failure must not block reference issuance
    }
  }

  return NextResponse.json({ reference, paymentStatus, deliveryFee, totalPayable });
}
