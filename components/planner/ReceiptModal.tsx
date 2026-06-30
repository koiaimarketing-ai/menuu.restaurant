"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { toPng } from "html-to-image";
import Image from "next/image";
import { X, ImageDown, MessageCircle } from "lucide-react";
import { useMealPlan } from "@/lib/meal-plan-store";
import { menu } from "@/data/menu";
import { describeLine, sortLines } from "./menu-options";
import { getLocation, waHref } from "@/data/locations";
import { computeTotals, fmtRM } from "@/lib/planner";
import { useBackdropDismiss } from "@/lib/use-backdrop-dismiss";
import { useDragToClose } from "@/lib/use-drag-to-close";
import { useLang } from "@/lib/i18n/LanguageProvider";
import { translations } from "@/lib/i18n/translations";

export function ReceiptModal({
  open,
  onClose,
  generatedAt,
}: {
  open: boolean;
  onClose: () => void;
  generatedAt: string;
}) {
  const plan = useMealPlan();
  const { t: tr, lang } = useLang();
  const branch = getLocation(plan.branchId ?? "ss4");
  const t = computeTotals(plan.items);
  const finalTotal = Math.max(0, t.grandTotal - plan.voucherDiscount);
  const totalItems = plan.items.reduce((n, l) => n + l.qty, 0);

  // Only portal after mount (document.body exists) — the modal opens via a
  // client interaction so this never blocks first paint.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const backdrop = useBackdropDismiss(onClose);
  const drag = useDragToClose(onClose, open);

  // Capture target: ONLY the receipt card (not the modal chrome / buttons).
  const receiptRef = useRef<HTMLDivElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  // The WhatsApp hand-off only appears AFTER the receipt image has been
  // generated + saved. We also keep the generated file so supported mobile
  // browsers can offer it via the Web Share API.
  const [saved, setSaved] = useState(false);
  const lastFileRef = useRef<File | null>(null);

  // Editing the plan invalidates a previously-saved image → require a re-save
  // before the WhatsApp hand-off reappears.
  useEffect(() => {
    setSaved(false);
    lastFileRef.current = null;
  }, [plan.items]);

  const saveReceiptImage = async () => {
    const node = receiptRef.current;
    if (!node || isSaving) return;
    try {
      setIsSaving(true);
      await document.fonts.ready;

      const dataUrl = await toPng(node, {
        pixelRatio: 3,
        cacheBust: true,
        backgroundColor: "#ffffff", // solid white receipt surface, never transparent
        skipFonts: false,
      });

      const blob = await (await fetch(dataUrl)).blob();

      // menuu-meal-plan-<OUTLET>-<YYYY-MM-DD>.png
      const safeBranch = (branch?.shortName ?? "outlet").replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "");
      const date = new Date().toISOString().split("T")[0];
      const filename = `menuu-meal-plan-${safeBranch}-${date}.png`;
      const file = new File([blob], filename, { type: "image/png" });
      // Image generated successfully → keep it and reveal the WhatsApp hand-off.
      lastFileRef.current = file;
      setSaved(true);

      const ua = navigator.userAgent;
      const isMobile = /Android|iPhone|iPad|iPod/i.test(ua);
      const isIOS = /iPhone|iPad|iPod/i.test(ua);

      // Mobile: native share/save sheet when available.
      if (isMobile && navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: "Menuu Meal Plan" });
        return;
      }

      const url = URL.createObjectURL(blob);

      // iOS Safari blocks programmatic downloads — open the PNG in a clean tab
      // so the customer can press-and-hold to save it.
      if (isIOS) {
        window.open(url, "_blank");
        setTimeout(() => URL.revokeObjectURL(url), 4000);
        return;
      }

      // Desktop + other fallback: direct download (never the print dialogue).
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      console.error("Unable to save receipt image:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Send the full meal plan to the correct outlet's WhatsApp as a TEXT message
  // (no image) — the greeting matches the chosen visit type when one is set.
  const sendReceiptWhatsApp = () => {
    const w = (key: keyof (typeof translations)["en"]) =>
      translations[lang][key] ?? translations.en[key];
    const greeting =
      plan.planType === "rsvp"
        ? w("wa.rsvpGreeting")
        : plan.planType === "going"
        ? w("wa.goingGreeting")
        : plan.planType === "delivery"
        ? w("wa.deliveryGreeting")
        : w("wa.planGreeting");
    const message = [
      greeting,
      "",
      w("wa.preSelected"),
      "",
      ...sortLines(plan.items).map((l) => {
        const code = menu.find((m) => m.id === l.itemId)?.code;
        return `- ${l.qty}× ${code ? `[${code}] ` : ""}${l.name}`;
      }),
      "",
      `${w("wa.estimatedTotal")}: ${fmtRM(finalTotal)}`,
    ].join("\n");

    const base = branch?.whatsapp ? waHref(branch.whatsapp) : "https://wa.me/";
    window.open(`${base}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  };

  // Escape to close + lock background scroll while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open || !mounted) return null;

  // Render at document.body so the modal escapes the sticky aside's stacking
  // context — otherwise the sticky capsule bar / navbar would paint over it.
  return createPortal(
    <div
      className="fixed inset-0 z-[1000] flex items-end justify-center overflow-hidden bg-[rgba(8,17,39,0.42)] p-4 backdrop-blur-[6px] sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={tr("receipt.title")}
      {...backdrop}
      style={drag.backdropStyle}
    >
      <div
        ref={drag.shellRef}
        className="popup-sheet relative z-[1010] flex max-h-[calc(100dvh-32px)] w-full max-w-[400px] flex-col overflow-hidden rounded-t-3xl border border-line-light bg-white p-4 shadow-[0_24px_70px_rgba(8,17,39,0.16)] sm:max-h-[calc(100dvh-48px)] sm:rounded-3xl"
        style={drag.shellStyle}
      >
        <div className="modal-drag-handle sm:hidden" />
        <button
          onClick={onClose}
          aria-label={tr("nav.closeMenu")}
          className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-secondary text-ink-secondary transition-colors hover:bg-line-light"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Scrollable region — the panel is capped to the viewport; only this
            scrolls so the title (top) and close button stay reachable. */}
        <div ref={drag.scrollRef} className="-mr-1 flex-1 min-h-0 overflow-y-auto overscroll-contain pr-1">
        {plan.items.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-line-medium bg-secondary/40 px-5 py-12 text-center">
            <p className="text-lg font-bold text-ink-primary">{tr("receipt.empty")}</p>
            <p className="mt-2 text-sm text-ink-secondary">{tr("receipt.emptyHint")}</p>
          </div>
        ) : (
        <>
        <div ref={receiptRef} className="receipt-content mt-2">
          <div className="receipt-header">
            <h2>{tr("receipt.title")}</h2>
            <span className="receipt-count">{totalItems} {totalItems === 1 ? tr("checkout.item") : tr("checkout.items")}</span>
          </div>

          <div className="receipt-items">
            {sortLines(plan.items).map((l) => {
              const code = menu.find((m) => m.id === l.itemId)?.code;
              const details = describeLine(l.choices, l.note);
              return (
                <div className="receipt-item" key={l.lineId}>
                  <div className="receipt-item-left">
                    <div className="receipt-item-name">{code ? `[${code}] ` : ""}{l.name}</div>
                    <div className="receipt-item-price">{fmtRM(l.unitPrice ?? 0)} · {tr("checkout.qty")} {l.qty}</div>
                    {details.map((d, i) => (
                      <div key={i} className="receipt-item-detail">{d.label}: {d.value}</div>
                    ))}
                  </div>
                  <div className="receipt-item-right">
                    <div className="receipt-item-total">{fmtRM((l.unitPrice ?? 0) * l.qty)}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="receipt-summary">
            <div><span>{tr("checkout.subtotal")}</span><strong>{fmtRM(t.subtotal)}</strong></div>
            <div><span>{tr("checkout.sst")}</span><strong>{fmtRM(t.sst)}</strong></div>
            <div><span>{tr("checkout.service")}</span><strong>{fmtRM(t.service)}</strong></div>
            {plan.voucherDiscount > 0 && (
              <div><span>Voucher ({plan.voucherCode})</span><strong>-{fmtRM(plan.voucherDiscount)}</strong></div>
            )}
          </div>

          <div className="receipt-grand-total">
            <span>{tr("checkout.grandTotal")}</span>
            <strong className="total-whatsapp">{fmtRM(finalTotal)}</strong>
          </div>

          <p className="receipt-note">{tr("receipt.note")}</p>

          <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-ink-muted">
            <Image src="/images/logo.png" alt="Menuu" width={121} height={22} className="h-[22px] w-auto" />
            <span>{branch?.shortName} · {generatedAt || "…"}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={sendReceiptWhatsApp}
          className="btn btn-whatsapp cta-shine mt-4 h-[52px] w-full justify-center !rounded-full font-extrabold"
        >
          <MessageCircle className="h-4 w-4" aria-hidden="true" /> {tr("receipt.whatsappUsNow")}
        </button>

        <button
          type="button"
          onClick={saveReceiptImage}
          disabled={isSaving}
          aria-label={tr("receipt.saveImage")}
          className="receipt-secondary-btn mt-2.5 flex w-full items-center justify-center gap-2 disabled:opacity-60"
        >
          <ImageDown className="h-4 w-4" aria-hidden="true" />
          <span>{isSaving ? tr("receipt.savingImage") : tr("receipt.saveImage")}</span>
        </button>

        <p className="mt-3 text-center text-xs text-ink-muted">
          {saved ? tr("receipt.hintSaved") : tr("receipt.hintDefault")}
        </p>
        </>
        )}
        </div>
      </div>
    </div>,
    document.body
  );
}
