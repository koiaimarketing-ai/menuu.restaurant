"use client";

import { useEffect, useState } from "react";
import { useMealPlan } from "@/lib/meal-plan-store";
import { getLocation } from "@/data/locations";
import { menu } from "@/data/menu";
import { formatRM } from "@/lib/currency";
import { buildListText } from "@/lib/share-meal-plan";
import { X, Copy, Check, MessageCircle, Share2, Monitor } from "lucide-react";
import { useBackdropDismiss } from "@/lib/use-backdrop-dismiss";
import { useLang } from "@/lib/i18n/LanguageProvider";

const itemCategory = (id: string) =>
  menu.find((m) => m.id === id)?.category ?? "other";

export function GeneratedListModal({
  visitLabel,
  hoursLabel,
  warning,
  onClose,
}: {
  visitLabel: string;
  hoursLabel: string;
  warning?: string;
  onClose: () => void;
}) {
  const { t } = useLang();
  const { items, branchId, subtotal } = useMealPlan();
  const branch = branchId ? getLocation(branchId) : undefined;
  const [copied, setCopied] = useState(false);
  const [displayMode, setDisplayMode] = useState(false);
  const backdrop = useBackdropDismiss(onClose);

  const finalNote = t("misc.gen.finalNote");
  const closingStatement = t("misc.gen.closingStatement");

  const text = buildListText(
    items,
    branch,
    visitLabel,
    hoursLabel,
    itemCategory,
    warning,
    finalNote,
    closingStatement
  );

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const shareWhatsApp = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(text)}`,
      "_blank"
    );
  };

  const deviceShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: t("misc.gen.shareTitle"), text });
      } catch {
        /* cancelled */
      }
    } else {
      copy();
    }
  };

  // group items by category for display
  const groups = new Map<string, typeof items>();
  items.forEach((l) => {
    const c = itemCategory(l.itemId);
    if (!groups.has(c)) groups.set(c, []);
    groups.get(c)!.push(l);
  });

  if (displayMode) {
    return (
      <div className="fixed inset-0 z-[95] bg-white overflow-y-auto">
        <div className="max-w-2xl mx-auto px-6 py-10">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-ink-primary">
              {t("misc.gen.displayHeading")}
            </h1>
            <button onClick={() => setDisplayMode(false)} className="btn btn-secondary !py-2 !px-4 text-sm">
              {t("misc.gen.editList")}
            </button>
          </div>
          {branch && (
            <p className="text-lg font-semibold text-ink-primary">{branch.name}</p>
          )}
          <p className="text-ink-secondary">{visitLabel}</p>
          <div className="mt-6 space-y-5">
            {Array.from(groups.entries()).map(([cat, group]) => (
              <div key={cat}>
                {group.map((l) => (
                  <div key={l.lineId} className="flex justify-between py-2 border-b border-line-light">
                    <div>
                      <p className="text-xl font-bold text-ink-primary">
                        {l.qty} × {l.name}
                      </p>
                      {Object.entries(l.choices).map(([k, v]) => (
                        <p key={k} className="text-ink-secondary">{k}: {v}</p>
                      ))}
                      {l.note && <p className="text-ink-muted">{t("misc.gen.note")} {l.note}</p>}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <p className="mt-8 text-sm text-ink-muted">{finalNote}</p>
          <p className="mt-2 text-sm text-ink-secondary font-medium">{closingStatement}</p>
          <button onClick={onClose} className="btn btn-secondary mt-8 w-full">{t("misc.gen.exit")}</button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-4"
      {...backdrop}
      role="dialog"
      aria-modal="true"
      aria-label={t("misc.gen.dialogLabel")}
    >
      <div
        className="w-full sm:max-w-[640px] bg-white rounded-t-[28px] sm:rounded-3xl max-h-[92vh] flex flex-col overflow-hidden"
      >
        <div className="flex items-center justify-between p-5 border-b border-line-light">
          <h2
            className="text-xl text-heading"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            {t("misc.gen.title")}
          </h2>
          <button onClick={onClose} aria-label={t("misc.gen.close")} className="h-10 w-10 grid place-items-center rounded-full bg-surface-soft">
            <X className="h-5 w-5 text-ink-secondary" />
          </button>
        </div>

        <div className="overflow-y-auto p-5 space-y-4">
          {branch && (
            <div className="text-sm">
              <p className="font-semibold text-ink-primary">{branch.name}</p>
              <p className="text-ink-secondary">{branch.addressLines.join(", ")}</p>
              <p className="text-ink-secondary mt-1">{t("misc.gen.plannedVisit")} {visitLabel}</p>
              <p className="text-ink-secondary">{t("misc.gen.businessHours")} {hoursLabel}</p>
            </div>
          )}
          {warning && (
            <p className="text-sm rounded-xl bg-[#FFF4DE] text-[#A96513] px-3 py-2 font-medium">
              {t("misc.gen.important")} {warning}
            </p>
          )}

          {Array.from(groups.entries()).map(([cat, group]) => (
            <div key={cat}>
              {group.map((l) => {
                const lt = (l.unitPrice ?? 0) * l.qty;
                return (
                  <div key={l.lineId} className="flex justify-between gap-3 py-2 border-b border-line-light">
                    <div className="text-sm">
                      <p className="font-medium text-ink-primary">
                        {l.qty} × {l.name}
                      </p>
                      {Object.entries(l.choices).map(([k, v]) => (
                        <p key={k} className="text-xs text-ink-muted">{k}: {v}</p>
                      ))}
                      {l.note && <p className="text-xs text-ink-muted">{t("misc.gen.note")} {l.note}</p>}
                    </div>
                    <span className="text-sm font-semibold text-green-text whitespace-nowrap">
                      {l.unitPrice != null ? formatRM(lt) : "—"}
                    </span>
                  </div>
                );
              })}
            </div>
          ))}

          <div className="flex justify-between items-center pt-2">
            <span className="text-sm text-ink-supporting">{t("misc.gen.subtotal")}</span>
            <span className="text-lg font-extrabold text-green-text">{formatRM(subtotal)}</span>
          </div>

          <p className="text-xs text-ink-muted leading-relaxed">{finalNote}</p>
          <p className="text-xs text-ink-secondary font-medium leading-relaxed">{closingStatement}</p>
        </div>

        <div className="border-t border-line-light p-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button onClick={copy} className="btn btn-secondary !py-2.5 text-sm">
            {copied ? <Check className="h-4 w-4 text-green" /> : <Copy className="h-4 w-4" />}
            {copied ? t("misc.gen.copied") : t("misc.gen.copy")}
          </button>
          <button onClick={shareWhatsApp} className="btn btn-whatsapp !py-2.5 text-sm">
            <MessageCircle className="h-4 w-4" /> {t("misc.gen.whatsapp")}
          </button>
          <button onClick={deviceShare} className="btn btn-secondary !py-2.5 text-sm">
            <Share2 className="h-4 w-4" /> {t("misc.gen.share")}
          </button>
          <button onClick={() => setDisplayMode(true)} className="btn btn-secondary !py-2.5 text-sm">
            <Monitor className="h-4 w-4" /> {t("misc.gen.show")}
          </button>
        </div>
      </div>
    </div>
  );
}
