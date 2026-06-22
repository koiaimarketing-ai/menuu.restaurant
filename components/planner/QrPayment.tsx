"use client";

import { MessageCircle } from "lucide-react";

/**
 * Reusable QR payment panel used by both the Going Now and Delivery Now flows.
 * Shows the restaurant QR, the estimated total, a unique reference, the manual
 * "WhatsApp Receipt Now" hand-off, and a clear "awaiting confirmation" status.
 * Payment is never auto-verified — the team confirms manually after the receipt.
 */
export function QrPayment({
  total,
  reference,
  waUrl,
}: {
  total: string;
  reference: string;
  waUrl: string;
}) {
  return (
    <div className="mt-3 rounded-2xl border border-line-warm bg-white p-4 shadow-soft">
      <p className="text-sm font-semibold text-heading">Scan &amp; pay</p>

      <div className="mt-3 flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        <div className="grid h-40 w-40 shrink-0 place-items-center rounded-xl border border-line-light bg-secondary">
          <QrPlaceholder />
        </div>

        <div className="w-full text-sm">
          <p className="text-ink-secondary">Estimated total</p>
          <p className="text-2xl font-extrabold text-green-text">{total}</p>

          <p className="mt-2 text-ink-secondary">Payment reference</p>
          <p className="font-mono font-semibold tracking-wide text-ink-primary">{reference}</p>

          <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#FFF4DE] px-2.5 py-1 text-xs font-medium text-[#A96513]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#A96513]" /> Awaiting receipt confirmation
          </span>
        </div>
      </div>

      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-whatsapp mt-4 w-full justify-center"
      >
        <MessageCircle className="h-4 w-4" /> WhatsApp Receipt Now
      </a>
      <p className="mt-2 text-center text-xs text-ink-muted">
        Scan with any DuitNow / banking app, then send your receipt — our team confirms payment
        manually.
      </p>
    </div>
  );
}

/* Lightweight placeholder QR (replace the asset with the real DuitNow QR). */
function QrPlaceholder() {
  // deterministic module pattern so it reads as a QR without SSR mismatch
  const cells = [
    "1111111","1000001","1011101","1011101","1011101","1000001","1111111",
  ];
  const modules: { x: number; y: number }[] = [];
  cells.forEach((row, y) =>
    row.split("").forEach((c, x) => c === "1" && modules.push({ x, y }))
  );
  // a few scattered modules in the body for a QR-like look
  const extra = [[2,2],[4,3],[1,5],[5,5],[3,1],[2,4],[4,5],[1,3]];
  return (
    <svg viewBox="0 0 7 7" className="h-28 w-28" shapeRendering="crispEdges" aria-label="Payment QR code">
      <rect width="7" height="7" fill="#fff" />
      {modules.map((m, i) => (
        <rect key={`m${i}`} x={m.x} y={m.y} width="1" height="1" fill="#2e1e17" />
      ))}
      {extra.map(([x, y], i) => (
        <rect key={`e${i}`} x={x} y={y} width="1" height="1" fill="#2e1e17" />
      ))}
    </svg>
  );
}
