"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Footprints, Bike, Info, MessageCircle } from "lucide-react";
import { useMealPlan } from "@/lib/meal-plan-store";
import { getLocation, waHref } from "@/data/locations";
import { computeTotals, fmtRM } from "@/lib/planner";
import { DeliveryAddressAutocomplete, type VerifiedAddress } from "./DeliveryAddressAutocomplete";
import { mapsConfigured } from "@/lib/google-maps-loader";
import { useBackdropDismiss } from "@/lib/use-backdrop-dismiss";
import { useLang } from "@/lib/i18n/LanguageProvider";
import { translations, type Lang } from "@/lib/i18n/translations";

/** Single shared checkout modal (mounted once by CheckoutHost). */
export function CheckoutModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const plan = useMealPlan();
  const { t: tr } = useLang();
  const branch = getLocation(plan.branchId ?? "ss4")!;
  const t = computeTotals(plan.items);
  const foodPayable = Math.max(0, t.grandTotal - plan.voucherDiscount);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const backdrop = useBackdropDismiss(onClose);

  // Customer details (shared)
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [notes, setNotes] = useState("");

  // Lock background scroll + Escape to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open || !mounted) return null;

  const planType = plan.planType;
  const customer = { name, setName, contact, setContact, notes, setNotes };

  return createPortal(
    <div
      className="fixed inset-0 z-[1000] flex items-start justify-center overflow-y-auto bg-[rgba(32,24,20,0.42)] p-4 py-8 backdrop-blur-[6px] sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label={tr("checkout.title")}
      {...backdrop}
    >
      <div
        className="relative z-[1010] w-full max-w-[820px] rounded-[24px] border border-[#EADDD4] bg-white p-5 shadow-[0_24px_70px_rgba(58,43,36,0.18)] sm:p-6"
      >
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-lg font-bold text-[#3B2A24]">
            <MessageCircle className="h-5 w-5 text-[#E24A34]" /> {tr("checkout.title")} · {branch.shortName}
          </h3>
          <button
            onClick={onClose}
            aria-label={tr("nav.closeMenu")}
            className="grid h-9 w-9 place-items-center rounded-full bg-[#F4E8E0] text-[#7A5D51] transition-colors hover:bg-[#EADDD4]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {plan.items.length === 0 ? (
          <p className="mt-6 text-sm text-ink-secondary">{tr("checkout.empty")}</p>
        ) : planType === "going" ? (
          <GoingNowCheckout branch={branch} foodPayable={foodPayable} customer={customer} />
        ) : planType === "delivery" ? (
          <DeliveryCheckout branch={branch} foodPayable={foodPayable} customer={customer} />
        ) : planType === "rsvp" ? (
          <RsvpCheckout branch={branch} foodPayable={foodPayable} customer={customer} />
        ) : (
          <ChoosePlanPrompt />
        )}
      </div>
    </div>,
    document.body
  );
}

/* ------------------------- shared bits ------------------------- */

type Customer = {
  name: string; setName: (v: string) => void;
  contact: string; setContact: (v: string) => void;
  notes: string; setNotes: (v: string) => void;
};

type Branch = ReturnType<typeof getLocation> & {};

function Field({ label, value, onChange, placeholder, optional, error }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; optional?: boolean; error?: string }) {
  const { t: tr } = useLang();
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-xs font-medium text-[#9A766B]">
        {label} {optional && <span className="text-[#b39a8f]">{tr("checkout.optional")}</span>}
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`h-11 w-full rounded-[11px] border bg-white px-3 text-sm text-[#3B2A24] outline-none placeholder:text-[#A08478] focus:ring-2 ${
          error ? "border-[#E24A34] focus:border-[#E24A34] focus:ring-[#E24A34]/15" : "border-[#EADDD4] focus:border-[#E24A34] focus:ring-[#E24A34]/10"
        }`}
      />
      {error && <span className="mt-1 block text-xs font-medium text-[#E24A34]">{error}</span>}
    </label>
  );
}

/** All selected lines — name + unit price + qty on the left, line total on the right. */
function OrderItems() {
  const plan = useMealPlan();
  const { t: tr } = useLang();
  return (
    <>
      {plan.items.map((l) => (
        <div key={l.lineId} className="order-summary-row">
          <div className="min-w-0">
            <div className="order-summary-item-name">{l.name}</div>
            <div className="order-summary-item-subtext">
              {fmtRM(l.unitPrice ?? 0)} · {tr("checkout.qty")} {l.qty}
            </div>
          </div>
          <div className="order-summary-price">{fmtRM((l.unitPrice ?? 0) * l.qty)}</div>
        </div>
      ))}
    </>
  );
}

function ChoosePlanPrompt() {
  const plan = useMealPlan();
  const { t: tr } = useLang();
  return (
    <div className="mt-6">
      <p className="text-sm text-ink-secondary">{tr("checkout.chooseHowReceive")}</p>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <button onClick={() => plan.setPlanType("going")} className="flex flex-col items-center gap-2 rounded-2xl border border-line-light bg-white p-4 hover:border-primary/40">
          <Footprints className="h-6 w-6 text-primary" /> <span className="text-sm font-semibold">{tr("planner.goingNow")}</span>
        </button>
        <button onClick={() => plan.setPlanType("delivery")} className="flex flex-col items-center gap-2 rounded-2xl border border-line-light bg-white p-4 hover:border-primary/40">
          <Bike className="h-6 w-6 text-primary" /> <span className="text-sm font-semibold">{tr("planner.deliveryNow")}</span>
        </button>
      </div>
    </div>
  );
}

/* ------------------------- message helpers ------------------------- */

function itemLines(items: ReturnType<typeof useMealPlan>["items"]) {
  return items.map((l) => `- ${l.qty}× ${l.name}`).join("\n");
}

function openWhatsApp(branchWa: string | undefined, text: string) {
  const base = branchWa ? waHref(branchWa) : "https://wa.me/";
  window.open(`${base}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
}

/** Clean white notice card explaining the WhatsApp payment hand-off. */
function PaymentNotice() {
  const { t: tr } = useLang();
  return (
    <div className="flex items-start gap-2.5 rounded-2xl border border-[#EADDD4] bg-white p-3.5 text-sm">
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#E24A34]" aria-hidden="true" />
      <div className="text-[#3B302C]">
        <p className="font-semibold">{tr("checkout.noticeTitle")}</p>
        <p className="mt-1 text-[#9B7B70]">{tr("checkout.noticeBody")}</p>
      </div>
    </div>
  );
}

/** Big WhatsApp-green CTA used by every checkout type. */
function WhatsAppCTA({ disabled, onClick, label }: { disabled?: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="btn btn-whatsapp cta-shine h-[52px] w-full justify-center rounded-2xl font-extrabold disabled:!bg-[#EADDD4] disabled:!text-[#9B7B70]"
    >
      <MessageCircle className="h-4 w-4" aria-hidden="true" /> {label}
    </button>
  );
}

/** A native pax dropdown (1–120). */
function PaxSelect({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-xs font-medium text-[#9A766B]">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-[11px] border border-[#EADDD4] bg-white px-3 text-sm text-[#3B2A24] outline-none focus:border-[#16A34A] focus:ring-2 focus:ring-[#16A34A]/15"
      >
        {Array.from({ length: 120 }, (_, i) => i + 1).map((n) => (
          <option key={n} value={String(n)}>
            {n}
          </option>
        ))}
      </select>
    </label>
  );
}

/* ------------------------- RSVP (reservation) ------------------------- */

function RsvpCheckout({ branch, foodPayable, customer }: { branch: Branch; foodPayable: number; customer: Customer }) {
  const plan = useMealPlan();
  const { t: tr, lang } = useLang();
  const [date, setDate] = useState(plan.visitDate ?? "");
  const [time, setTime] = useState(plan.visitTime ?? "");
  const [pax, setPax] = useState("2");
  const [notes, setNotes] = useState("");

  const canConfirm =
    customer.name.trim() !== "" && customer.contact.trim() !== "" && date !== "" && time !== "";

  const confirmReservation = () => {
    if (!canConfirm) return;
    const w = waText(lang);
    const text = [
      w("wa.rsvpGreeting"),
      "",
      `${w("wa.name")}: ${customer.name}`,
      `${w("wa.contact")}: ${customer.contact}`,
      `${w("wa.outlet")}: ${branch!.shortName}`,
      `${w("wa.date")}: ${date}`,
      `${w("wa.time")}: ${time}`,
      `${w("wa.pax")}: ${pax}`,
      `${w("wa.notes")}: ${notes || "-"}`,
      "",
      itemLines(plan.items),
      "",
      `${w("wa.estimatedTotal")}: ${fmtRM(foodPayable)}`,
    ].join("\n");
    openWhatsApp(branch!.whatsapp, text);
  };

  return (
    <div className="mt-5 grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
      {/* left: details + reservation */}
      <div className="space-y-4">
        <Section title={tr("checkout.yourDetails")}>
          <div className="grid gap-2.5 sm:grid-cols-2">
            <Field label={tr("checkout.name")} value={customer.name} onChange={customer.setName} placeholder={tr("checkout.namePlaceholder")} />
            <Field label={tr("checkout.contact")} value={customer.contact} onChange={customer.setContact} placeholder={tr("checkout.contactPlaceholder")} />
          </div>
        </Section>

        <Section title={tr("checkout.reservationDetails")}>
          <div className="grid gap-2.5 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-1 block text-xs font-medium text-[#9A766B]">{tr("checkout.date")}</span>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="h-11 w-full rounded-[11px] border border-[#EADDD4] bg-white px-3 text-sm text-[#3B2A24] outline-none focus:border-[#E24A34] focus:ring-2 focus:ring-[#E24A34]/10"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-xs font-medium text-[#9A766B]">{tr("checkout.time")}</span>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="h-11 w-full rounded-[11px] border border-[#EADDD4] bg-white px-3 text-sm text-[#3B2A24] outline-none focus:border-[#E24A34] focus:ring-2 focus:ring-[#E24A34]/10"
              />
            </label>
          </div>
          <div className="mt-2.5">
            <PaxSelect value={pax} onChange={setPax} label={tr("checkout.pax")} />
          </div>
          <div className="mt-2.5">
            <Field label={tr("checkout.notes")} value={notes} onChange={setNotes} placeholder={tr("checkout.rsvpNotesPlaceholder")} optional />
          </div>
        </Section>

        <p className="rounded-2xl border border-[#EADDD4] bg-white px-3.5 py-3 text-xs text-[#9B7B70]">
          {tr("checkout.rsvpNotice")}
        </p>
      </div>

      {/* right: summary + confirm */}
      <div className="space-y-3">
        <OrderSummary total={foodPayable} outlet={branch!.shortName} visitType={tr("planner.rsvp")} />
        <WhatsAppCTA disabled={!canConfirm} onClick={confirmReservation} label={tr("checkout.whatsappUsNow")} />
        <p className="text-center text-xs text-[#9A766B]">
          {canConfirm ? tr("checkout.rsvpHintReady") : tr("checkout.rsvpHintMissing")}
        </p>
      </div>
    </div>
  );
}

/* ------------------------- GOING NOW ------------------------- */

function GoingNowCheckout({ branch, foodPayable, customer }: { branch: Branch; foodPayable: number; customer: Customer }) {
  const plan = useMealPlan();
  const { t: tr, lang } = useLang();
  const [pax, setPax] = useState("2");

  const canConfirm = customer.name.trim() !== "" && customer.contact.trim() !== "";

  const confirmGoing = () => {
    if (!canConfirm) return;
    const w = waText(lang);
    const text = [
      w("wa.goingGreeting"),
      "",
      `${w("wa.name")}: ${customer.name}`,
      `${w("wa.contact")}: ${customer.contact}`,
      `${w("wa.outlet")}: ${branch!.shortName}`,
      `${w("wa.status")} : ${tr("planner.goingNow")}`,
      `${w("wa.pax")}: ${pax}`,
      `${w("wa.notes")}: ${customer.notes || "-"}`,
      "",
      itemLines(plan.items),
      "",
      `${w("wa.estimatedTotal")}: ${fmtRM(foodPayable)}`,
    ].join("\n");
    openWhatsApp(branch!.whatsapp, text);
  };

  return (
    <div className="mt-5 grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
      {/* left: details */}
      <div className="space-y-4">
        <Section title={tr("checkout.yourDetails")}>
          <div className="grid gap-2.5 sm:grid-cols-2">
            <Field label={tr("checkout.name")} value={customer.name} onChange={customer.setName} placeholder={tr("checkout.namePlaceholder")} />
            <Field label={tr("checkout.contact")} value={customer.contact} onChange={customer.setContact} placeholder={tr("checkout.contactPlaceholder")} />
          </div>
          <div className="mt-2.5 grid gap-2.5 sm:grid-cols-2">
            <PaxSelect value={pax} onChange={setPax} label={tr("checkout.pax")} />
            <Field label={tr("checkout.notes")} value={customer.notes} onChange={customer.setNotes} placeholder={tr("checkout.notesPlaceholder")} optional />
          </div>
        </Section>

        <PaymentNotice />
      </div>

      {/* right: summary + confirm */}
      <div className="space-y-3">
        <OrderSummary total={foodPayable} outlet={branch!.shortName} visitType={tr("planner.goingNow")} />
        <WhatsAppCTA disabled={!canConfirm} onClick={confirmGoing} label={tr("checkout.whatsappUsNow")} />
        <p className="text-center text-xs text-[#9A766B]">
          {canConfirm ? tr("checkout.goingHintReady") : tr("checkout.goingHintMissing")}
        </p>
      </div>
    </div>
  );
}

/* ------------------------- DELIVERY NOW ------------------------- */

function DeliveryCheckout({ branch, foodPayable, customer }: { branch: Branch; foodPayable: number; customer: Customer }) {
  const plan = useMealPlan();
  const { t: tr, lang } = useLang();
  const liveMaps = mapsConfigured();
  const outletCoords =
    branch!.latitude != null && branch!.longitude != null
      ? { lat: branch!.latitude, lng: branch!.longitude }
      : null;

  const [address, setAddress] = useState(""); // manual fallback text
  const [selected, setSelected] = useState<VerifiedAddress | null>(null);
  const [unit, setUnit] = useState("");
  const [landmark, setLandmark] = useState("");
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [attempted, setAttempted] = useState(false);

  const addressText = selected?.address ?? address;

  const missing = {
    name: customer.name.trim() === "",
    contact: customer.contact.trim() === "",
    address: addressText.trim() === "",
    unit: unit.trim() === "",
    landmark: landmark.trim() === "",
  };
  const canConfirm = !Object.values(missing).some(Boolean);

  const confirmDelivery = () => {
    setAttempted(true);
    if (!canConfirm) return;
    const w = waText(lang);
    const mapsLink =
      selected?.lat != null && selected?.lng != null
        ? `https://maps.google.com/?q=${selected.lat},${selected.lng}`
        : null;
    const text = [
      w("wa.deliveryGreeting"),
      "",
      `${w("wa.name")}: ${customer.name}`,
      `${w("wa.contact")}: ${customer.contact}`,
      `${w("wa.outlet")}: ${branch!.shortName}`,
      `${w("wa.address")} : ${addressText}`,
      `${w("wa.unit")} : ${unit}`,
      `${w("wa.landmark")} : ${landmark}`,
      `${w("wa.status")} : ${tr("planner.deliveryNow")}`,
      `${w("wa.deliveryNotes")}: ${deliveryNotes || "-"}`,
      mapsLink ? `${w("wa.location")}: ${mapsLink}` : null,
      "",
      itemLines(plan.items),
      "",
      `${w("wa.estimatedTotal")}: ${fmtRM(foodPayable)}`,
    ]
      .filter((l) => l !== null)
      .join("\n");
    openWhatsApp(branch!.whatsapp, text);
  };

  return (
    <div className="mt-5 grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
      {/* left: customer + exact delivery location */}
      <div className="space-y-4">
        <Section title={tr("checkout.yourDetails")}>
          <div className="grid gap-2.5 sm:grid-cols-2">
            <Field label={tr("checkout.name")} value={customer.name} onChange={customer.setName} placeholder={tr("checkout.namePlaceholder")} error={attempted && missing.name ? tr("err.name") : undefined} />
            <Field label={tr("checkout.contact")} value={customer.contact} onChange={customer.setContact} placeholder={tr("checkout.contactPlaceholder")} error={attempted && missing.contact ? tr("err.contact") : undefined} />
          </div>
        </Section>

        <Section title={tr("checkout.deliveryAddress")}>
          <p className="mb-2.5 text-xs text-[#9B7B70]">{tr("checkout.deliveryAddressHelp")}</p>
          {liveMaps ? (
            <>
              <DeliveryAddressAutocomplete outlet={outletCoords} onSelect={setSelected} />
              {attempted && missing.address && (
                <span className="mt-1 block text-xs font-medium text-[#E24A34]">{tr("err.address")}</span>
              )}
            </>
          ) : (
            <Field
              label={tr("checkout.searchAddress")}
              value={address}
              onChange={setAddress}
              placeholder={tr("checkout.searchAddress")}
              error={attempted && missing.address ? tr("err.address") : undefined}
            />
          )}
          <div className="mt-2.5 grid gap-2.5 sm:grid-cols-2">
            <Field label={tr("checkout.unit")} value={unit} onChange={setUnit} placeholder={tr("checkout.unitPlaceholder")} error={attempted && missing.unit ? tr("err.unit") : undefined} />
            <Field label={tr("checkout.landmark")} value={landmark} onChange={setLandmark} placeholder={tr("checkout.landmarkPlaceholder")} error={attempted && missing.landmark ? tr("err.landmark") : undefined} />
          </div>
          <div className="mt-2.5">
            <Field label={tr("checkout.deliveryNotes")} value={deliveryNotes} onChange={setDeliveryNotes} placeholder={tr("checkout.deliveryNotesPlaceholder")} optional />
          </div>
        </Section>

        <PaymentNotice />
      </div>

      {/* right: summary + WhatsApp CTA */}
      <div className="space-y-3">
        <OrderSummary total={foodPayable} outlet={branch!.shortName} visitType={tr("planner.deliveryNow")} deliveryNote={tr("checkout.paidByCustomer")} payNowLabel={tr("checkout.payNow")} />
        <WhatsAppCTA disabled={attempted && !canConfirm} onClick={confirmDelivery} label={tr("checkout.whatsappUsNow")} />
        <p className="text-center text-xs text-[#9A766B]">{tr("checkout.deliveryHint")}</p>
      </div>
    </div>
  );
}

/* ------------------------- shared layout helpers ------------------------- */

/** WhatsApp message lines follow the SELECTED language (independent of fallback). */
function waText(lang: Lang) {
  return (key: keyof (typeof translations)["en"]) => translations[lang][key] ?? translations.en[key];
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#9A8075]">{title}</p>
      {children}
    </div>
  );
}

/**
 * Premium order-summary receipt card. Shows every selected item (no scrolling).
 * `deliveryNote` renders a muted "Delivery fee: <note>" line; `payNowLabel`
 * overrides the grand-total label (e.g. "Pay now" for delivery).
 */
function OrderSummary({ total, outlet, visitType, deliveryNote, payNowLabel }: { total: number; outlet: string; visitType: string; deliveryNote?: string; payNowLabel?: string }) {
  const plan = useMealPlan();
  const { t: tr } = useLang();
  const t = computeTotals(plan.items);
  const count = plan.items.reduce((n, l) => n + l.qty, 0);
  return (
    <div className="order-summary-card">
      <div className="order-summary-header">
        <h3 className="order-summary-title">{tr("checkout.orderSummary")}</h3>
        <span className="order-summary-badge">{count} {count === 1 ? tr("checkout.item") : tr("checkout.items")}</span>
      </div>
      <p className="order-summary-meta">{visitType} · {outlet}</p>
      <div className="order-summary-items">
        <OrderItems />
      </div>
      <div className="order-summary-totals">
        <SummaryLine label={tr("checkout.subtotal")} value={fmtRM(t.subtotal)} />
        <SummaryLine label={tr("checkout.sst")} value={fmtRM(t.sst)} />
        <SummaryLine label={tr("checkout.service")} value={fmtRM(t.service)} />
        {plan.voucherDiscount > 0 && (
          <SummaryLine label={`Voucher (${plan.voucherCode})`} value={`- ${fmtRM(plan.voucherDiscount)}`} />
        )}
        {deliveryNote && <SummaryLine label={tr("checkout.deliveryFee")} value={deliveryNote} muted />}
      </div>
      <div className="order-summary-grand">
        <span className="lbl">{payNowLabel ?? tr("checkout.grandTotal")}</span>
        <span className="val">{fmtRM(total)}</span>
      </div>
    </div>
  );
}

/** One label/value row inside the premium order-summary totals block. */
function SummaryLine({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="order-summary-total-line">
      <span className="lbl">{label}</span>
      <span className={`val${muted ? " muted" : ""}`}>{value}</span>
    </div>
  );
}
