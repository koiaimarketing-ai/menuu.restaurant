"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  ArrowRight,
  Plus,
  Flame,
  Phone,
  MessageCircle,
  Pencil,
  Check,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import { useMealPlan, type BranchId } from "@/lib/meal-plan-store";
import { locations, getLocation } from "@/data/locations";
import { categories, getMenuByCategory, menu, type MenuItem } from "@/data/menu";
import { QuantityControl, useCardBubble } from "./QuantityControl";
import { formatRM } from "@/lib/currency";
import {
  getLiveStatus,
  getStatus,
  nowInKL,
  todayHoursLabel,
  formatTime,
  type StatusResult,
} from "@/lib/operating-status";
import { StatusBadge } from "../StatusBadge";
import { CustomisationModal, type DraftAdd } from "./CustomisationModal";
import { GeneratedListModal } from "./GeneratedListModal";
import { useLang } from "@/lib/i18n/LanguageProvider";

const DAY_KEYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

function dayIndexFromISO(iso: string): number {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).getDay();
}

export function MenuPlanner() {
  const { t } = useLang();
  const plan = useMealPlan();
  const { hydrated, branchId, visitMode, visitDate, visitTime } = plan;

  const [modalItem, setModalItem] = useState<{ item: MenuItem; lineId?: string } | null>(null);
  const [showList, setShowList] = useState(false);
  const [activeCat, setActiveCat] = useState(categories[0].id);
  const [now, setNow] = useState(() => nowInKL());

  // local visit form
  const [laterDate, setLaterDate] = useState(visitDate ?? "");
  const [laterTime, setLaterTime] = useState(visitTime ?? "");

  useEffect(() => {
    const t = setInterval(() => setNow(nowInKL()), 60_000);
    return () => clearInterval(t);
  }, []);

  const branch = branchId ? getLocation(branchId) : undefined;

  // ---- status for the chosen visit ----
  const visitStatus: StatusResult | null = useMemo(() => {
    if (!branch) return null;
    if (visitMode === "now") {
      return getStatus(branch, now.dayIndex, now.minutes, now.dateISO);
    }
    if (visitMode === "later" && visitDate && visitTime) {
      const di = dayIndexFromISO(visitDate);
      const [h, m] = visitTime.split(":").map(Number);
      return getStatus(branch, di, h * 60 + m, visitDate);
    }
    return null;
  }, [branch, visitMode, visitDate, visitTime, now]);

  const altBranch = branch
    ? locations.find((l) => l.id !== branch.id)
    : undefined;
  const altStatus = altBranch ? getStatus(altBranch, now.dayIndex, now.minutes, now.dateISO) : null;

  const plannerActive =
    !!visitStatus && (visitStatus.kind === "open" || visitStatus.kind === "closing-soon");

  const visitLabel = useMemo(() => {
    if (visitMode === "now") return t("menu.planner.goingNow");
    if (visitDate && visitTime) {
      const di = dayIndexFromISO(visitDate);
      const dayName = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][di];
      return `${dayName}, ${formatTime(visitTime)}`;
    }
    return "";
  }, [visitMode, visitDate, visitTime, t]);

  const hoursLabel = branch ? todayHoursLabel(branch) : "";

  // ---- category rail intersection observer ----
  const railRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!plannerActive && branchId !== "kl-central-walk") return;
    const headings = document.querySelectorAll<HTMLElement>("[data-cat-section]");
    if (!headings.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveCat(visible[0].target.getAttribute("data-cat-section")!);
      },
      { rootMargin: "-180px 0px -65% 0px" }
    );
    headings.forEach((h) => obs.observe(h));
    return () => obs.disconnect();
  }, [plannerActive, branchId]);

  const jumpTo = (id: string) => {
    const el = document.getElementById(`cat-${id}`);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 150;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  if (!hydrated) {
    return <div className="container-site py-20 text-center text-ink-muted">{t("menu.planner.loading")}</div>;
  }

  // ============ STEP 1: BRANCH ============
  if (!branchId) {
    return (
      <div className="container-site pb-24">
        <BranchStep onSelect={(b) => plan.setBranch(b)} now={now} />
      </div>
    );
  }

  // ============ STEP 2: VISIT TIME ============
  if (!visitMode) {
    return (
      <div className="container-site pb-24 max-w-2xl">
        <CollapsedVisit branch={branch!} onChangeBranch={() => plan.setBranch(branchId)} editBranch />
        <h2 className="h-display text-3xl mt-8">{t("menu.planner.whenVisit")}</h2>
        <div className="mt-6 grid sm:grid-cols-2 gap-4">
          <button
            onClick={() => plan.setVisit("now", null, null)}
            className="rounded-2xl border border-line-light bg-white p-6 text-left hover:border-green transition-colors"
          >
            <p className="font-semibold text-ink-primary text-lg">{t("menu.planner.goingNow")}</p>
            <p className="text-sm text-ink-secondary mt-1">
              {t("menu.planner.goingNowDesc")}
            </p>
          </button>
          <div className="rounded-2xl border border-line-light bg-white p-6">
            <p className="font-semibold text-ink-primary text-lg">{t("menu.planner.planLater")}</p>
            <div className="mt-3 space-y-2">
              <input
                type="date"
                value={laterDate}
                min={now.dateISO}
                onChange={(e) => setLaterDate(e.target.value)}
                className="w-full rounded-lg border border-line-medium px-3 py-2 text-sm"
              />
              <input
                type="time"
                value={laterTime}
                onChange={(e) => setLaterTime(e.target.value)}
                className="w-full rounded-lg border border-line-medium px-3 py-2 text-sm"
              />
              <button
                disabled={!laterDate || !laterTime}
                onClick={() => plan.setVisit("later", laterDate, laterTime)}
                className="btn btn-green w-full !py-2.5 text-sm mt-1"
              >
                {t("menu.planner.continue")}
              </button>
            </div>
            <p className="text-xs text-ink-muted mt-2">
              {t("menu.planner.laterNote")}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ============ STEP 3: MENU + PLANNER ============
  const isSS4 = branchId === "ss4";

  return (
    <div className="container-site pb-32 lg:pb-16">
      <CollapsedVisit
        branch={branch!}
        status={visitStatus}
        visitLabel={visitLabel}
        onChangeBranch={() => plan.setBranch(isSS4 ? "kl-central-walk" : "ss4")}
        onChangeTime={() => plan.setVisit(null as never, null, null)}
      />

      {/* status banner */}
      {visitStatus && visitStatus.kind !== "open" && (
        <StatusBanner
          status={visitStatus}
          branchName={branch!.name}
          altBranch={altBranch?.name}
          altStatus={altStatus}
          onSwitch={() => plan.setBranch(isSS4 ? "kl-central-walk" : "ss4")}
          onChangeTime={() => plan.setVisit(null as never, null, null)}
        />
      )}

      {/* SS4 menu pending */}
      {isSS4 ? (
        <div className="mt-8 rounded-3xl bg-white border border-line-light p-8 text-center max-w-xl mx-auto">
          <h2 className="h-display text-2xl">{t("menu.planner.ss4Updating")}</h2>
          <p className="mt-3 text-body">
            {t("menu.planner.ss4Body")}
          </p>
          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            <a href={`tel:${branch!.phone.replace(/\s/g, "")}`} className="btn btn-secondary">
              <Phone className="h-4 w-4" /> {t("menu.planner.callSS4")}
            </a>
            <a
              href={`https://wa.me/6${branch!.whatsapp.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noreferrer"
              className="btn btn-whatsapp"
            >
              <MessageCircle className="h-4 w-4" /> {t("menu.planner.waSS4")}
            </a>
            <button onClick={() => plan.setBranch("kl-central-walk")} className="btn btn-secondary">
              {t("menu.planner.viewKLMenu")}
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-6 lg:grid lg:grid-cols-[1fr_320px] lg:gap-8 lg:items-start">
          {/* menu column */}
          <div>
            {/* tax notice */}
            <p className="text-xs text-ink-muted bg-secondary border border-line-warm rounded-xl px-4 py-2.5 mb-4">
              {t("menu.planner.taxNotice")}
            </p>

            {/* sticky category rail */}
            <div className="sticky top-[84px] z-30 -mx-4 px-4 py-2 bg-cream/95 backdrop-blur">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => railRef.current?.scrollBy({ left: -200, behavior: "smooth" })}
                  className="hidden md:grid h-9 w-9 place-items-center rounded-full bg-white border border-line-light shrink-0"
                  aria-label={t("menu.planner.scrollLeft")}
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <div ref={railRef} className="flex gap-2 overflow-x-auto no-scrollbar py-1 scroll-px-4">
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => jumpTo(c.id)}
                      data-active={activeCat === c.id}
                      className={`shrink-0 px-4 h-9 rounded-full text-sm font-medium border whitespace-nowrap transition-colors ${
                        activeCat === c.id
                          ? "bg-green text-white border-green"
                          : "bg-white text-ink-primary border-line-light hover:border-green"
                      }`}
                    >
                      {t(`menu.cat.${c.id}.label`) === `menu.cat.${c.id}.label`
                        ? c.label
                        : t(`menu.cat.${c.id}.label`)}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => railRef.current?.scrollBy({ left: 200, behavior: "smooth" })}
                  className="hidden md:grid h-9 w-9 place-items-center rounded-full bg-white border border-line-light shrink-0"
                  aria-label={t("menu.planner.scrollRight")}
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* sections */}
            <div className="mt-4 space-y-10">
              {categories.map((c) => {
                const items =
                  c.id === "recommended"
                    ? menu.filter((m) => m.recommended)
                    : getMenuByCategory(c.id);
                if (!items.length) return null;
                return (
                  <section key={c.id} id={`cat-${c.id}`} data-cat-section={c.id} className="scroll-mt-40">
                    <h2 className="text-2xl text-heading" style={{ fontFamily: "var(--font-fraunces)" }}>
                      {t(`menu.cat.${c.id}.label`) === `menu.cat.${c.id}.label`
                        ? c.label
                        : t(`menu.cat.${c.id}.label`)}
                    </h2>
                    {c.blurb && (
                      <p className="text-sm text-ink-secondary mt-1">
                        {t(`menu.cat.${c.id}.blurb`) === `menu.cat.${c.id}.blurb`
                          ? c.blurb
                          : t(`menu.cat.${c.id}.blurb`)}
                      </p>
                    )}
                    <div className="mt-4 grid sm:grid-cols-2 xl:grid-cols-2 gap-3">
                      {items.map((item) => (
                        <MenuRow
                          key={`${c.id}-${item.id}`}
                          item={item}
                          branchId={branchId as BranchId}
                          disabled={!plannerActive}
                          onCustomise={() => setModalItem({ item })}
                        />
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          </div>

          {/* desktop summary */}
          <DesktopSummary
            visitLabel={visitLabel}
            status={visitStatus}
            disabled={!plannerActive}
            onReview={() => setShowList(true)}
            onEdit={(lineId) => {
              const li = plan.items.find((l) => l.lineId === lineId);
              const mi = menu.find((m) => m.id === li?.itemId);
              if (li && mi) setModalItem({ item: mi, lineId });
            }}
          />
        </div>
      )}

      {/* mobile meal bar */}
      {!isSS4 && plan.count > 0 && (
        <div className="lg:hidden fixed left-3 right-3 bottom-3 z-50 rounded-[20px] bg-white/95 backdrop-blur border border-line-light shadow-card px-4 py-3 flex items-center gap-3">
          <div className="flex-1">
            <p className="text-xs text-ink-supporting">
              {(plan.count === 1 ? t("menu.planner.itemCountOne") : t("menu.planner.itemCountMany")).replace("{count}", String(plan.count))}
            </p>
            <p className="font-bold text-green-text">{formatRM(plan.subtotal)}</p>
          </div>
          <button onClick={() => setShowList(true)} className="btn btn-green !py-2.5 text-sm">
            {t("menu.planner.reviewList")} <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* modals */}
      {modalItem && (
        <CustomisationModal
          item={modalItem.item}
          branchId={branchId as BranchId}
          initial={
            modalItem.lineId
              ? (() => {
                  const l = plan.items.find((x) => x.lineId === modalItem.lineId)!;
                  return { qty: l.qty, choices: l.choices, note: l.note };
                })()
              : undefined
          }
          onClose={() => setModalItem(null)}
          onConfirm={(d: DraftAdd) => {
            if (modalItem.lineId) {
              plan.updateLine(modalItem.lineId, {
                qty: d.qty,
                choices: d.choices,
                note: d.note,
              });
            } else {
              plan.addItem(d);
            }
            setModalItem(null);
          }}
        />
      )}

      {showList && (
        <GeneratedListModal
          visitLabel={visitLabel}
          hoursLabel={hoursLabel}
          warning={
            visitStatus?.kind === "closing-soon"
              ? t("menu.planner.closesSoon")
              : undefined
          }
          onClose={() => setShowList(false)}
        />
      )}
    </div>
  );
}

/* ---------------- Branch selection ---------------- */
function BranchStep({
  onSelect,
  now,
}: {
  onSelect: (b: BranchId) => void;
  now: ReturnType<typeof nowInKL>;
}) {
  const { t } = useLang();
  return (
    <>
      <h2 className="h-display text-3xl">{t("menu.planner.whichBranch")}</h2>
      <p className="mt-2 text-body">{t("menu.planner.branchSub")}</p>
      <div className="mt-6 grid sm:grid-cols-2 gap-4">
        {locations.map((loc) => {
          const status = getStatus(loc, now.dayIndex, now.minutes, now.dateISO);
          return (
            <div key={loc.id} className="rounded-3xl border border-line-light bg-white p-6">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-xl font-semibold text-ink-primary">{loc.shortName}</h3>
                <StatusBadge status={status} />
              </div>
              <p className="text-sm text-ink-secondary mt-2">{loc.addressLines.join(", ")}</p>
              <p className="text-sm text-ink-secondary mt-1">{status.detail}</p>
              <button onClick={() => onSelect(loc.id)} className="btn btn-green w-full mt-5">
                {t("menu.planner.select").replace("{name}", loc.shortName)}
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
}

/* ---------------- Collapsed visit summary ---------------- */
function CollapsedVisit({
  branch,
  status,
  visitLabel,
  onChangeBranch,
  onChangeTime,
  editBranch,
}: {
  branch: { name: string; shortName: string };
  status?: StatusResult | null;
  visitLabel?: string;
  onChangeBranch: () => void;
  onChangeTime?: () => void;
  editBranch?: boolean;
}) {
  const { t } = useLang();
  return (
    <div className="rounded-2xl bg-white border border-line-light p-4 flex flex-wrap items-center gap-x-4 gap-y-2">
      <span className="font-semibold text-ink-primary">{branch.shortName}</span>
      {visitLabel && <span className="text-sm text-ink-secondary">· {visitLabel}</span>}
      {status && <StatusBadge status={status} />}
      <div className="ml-auto flex gap-3 text-sm font-semibold">
        <button onClick={onChangeBranch} className="text-green-text hover:underline">
          {editBranch ? t("menu.planner.changeBranch") : t("menu.planner.switchBranch")}
        </button>
        {onChangeTime && (
          <button onClick={onChangeTime} className="text-green-text hover:underline">
            {t("menu.planner.changeTime")}
          </button>
        )}
      </div>
    </div>
  );
}

/* ---------------- Status banner ---------------- */
function StatusBanner({
  status,
  branchName,
  altBranch,
  altStatus,
  onSwitch,
  onChangeTime,
}: {
  status: StatusResult;
  branchName: string;
  altBranch?: string;
  altStatus: StatusResult | null;
  onSwitch: () => void;
  onChangeTime: () => void;
}) {
  const { t } = useLang();
  const danger = status.kind === "closed" || status.kind === "closed-day";
  return (
    <div
      className={`mt-4 rounded-2xl border p-4 ${
        danger ? "bg-[#FDECEA] border-[#f5c6c0]" : "bg-[#FFF4DE] border-[#f0dca8]"
      }`}
    >
      <div className="flex gap-3">
        <AlertTriangle className={`h-5 w-5 shrink-0 ${danger ? "text-[#B42318]" : "text-[#A96513]"}`} />
        <div className="text-sm">
          <p className="font-semibold text-ink-primary">
            {status.kind === "closing-soon" && t("menu.planner.bannerClosingSoon").replace("{branch}", branchName)}
            {status.kind === "closed" && t("menu.planner.bannerClosed").replace("{branch}", branchName)}
            {status.kind === "closed-day" && t("menu.planner.bannerClosed").replace("{branch}", branchName)}
            {status.kind === "opens-later" && t("menu.planner.bannerOpensLater").replace("{branch}", branchName)}
          </p>
          <p className="text-ink-secondary mt-0.5">{status.detail}</p>
          {status.nextOpen && (
            <p className="text-ink-secondary">{t("menu.planner.nextOpening").replace("{time}", status.nextOpen)}</p>
          )}
          {danger && altBranch && altStatus && (altStatus.kind === "open" || altStatus.kind === "closing-soon") && (
            <p className="text-ink-secondary mt-1">
              {t("menu.planner.altOpen").replace("{branch}", altBranch).replace("{detail}", altStatus.detail)}
            </p>
          )}
          <div className="mt-3 flex flex-wrap gap-3 font-semibold">
            {altBranch && (
              <button onClick={onSwitch} className="text-green-text hover:underline">
                {t("menu.planner.switchTo").replace("{branch}", altBranch)}
              </button>
            )}
            <button onClick={onChangeTime} className="text-green-text hover:underline">
              {t("menu.planner.changeVisitTime")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Menu row ---------------- */
function MenuRow({
  item,
  branchId,
  disabled,
  onCustomise,
}: {
  item: MenuItem;
  branchId: BranchId;
  disabled: boolean;
  onCustomise: () => void;
}) {
  const { t } = useLang();
  const plan = useMealPlan();
  const price = item.branchPrices[branchId];
  const descKey = `menu.item.${item.id}.desc`;
  const trDesc = t(descKey);
  const desc = trDesc === descKey ? item.description : trDesc;
  const nameKey = `menu.item.${item.id}.name`;
  const itemName = t(nameKey) === nameKey ? item.name : t(nameKey);
  const hasRequired = (item.choices?.some((c) => c.required) ?? false) || item.availableHotCold;

  // simple line (no required choices): track quantity directly
  const simpleLine = !hasRequired
    ? plan.items.find((l) => l.itemId === item.id && Object.keys(l.choices).length === 0 && !l.note)
    : undefined;
  const configuredQty = hasRequired
    ? plan.items.filter((l) => l.itemId === item.id).reduce((n, l) => n + l.qty, 0)
    : 0;

  const { bubbling, bubble } = useCardBubble();
  const addSimple = () => {
    bubble();
    plan.addItem({ itemId: item.id, name: item.name, unitPrice: price, qty: 1, choices: {} });
  };

  const selected = Boolean(simpleLine) || configuredQty > 0;

  return (
    <div className={`menu-item-card ${selected ? "is-selected" : ""} ${bubbling ? "is-bubbling" : ""} rounded-2xl bg-white border border-line-light p-3 flex gap-3 items-center`}>
      {item.image && (
        <div className="relative h-20 w-20 sm:h-24 sm:w-24 shrink-0 rounded-xl overflow-hidden bg-secondary">
          <Image src={item.image} alt={item.name} fill sizes="96px" className="object-cover" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-ink-primary leading-snug flex items-center gap-1.5">
          <span className="truncate">{itemName}</span>
          {item.spicy && <Flame className="h-3.5 w-3.5 text-primary shrink-0" aria-label="Spicy" />}
        </p>
        {item.portion && <p className="text-xs text-ink-muted">{item.portion}</p>}
        {desc && (
          <p className="text-xs text-ink-secondary mt-0.5 line-clamp-2">{desc}</p>
        )}
        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="font-bold text-green-text text-sm">
            {price != null ? formatRM(price) : "—"}
          </span>

          {disabled ? (
            <span className="text-xs text-ink-muted">{t("menu.card.viewOnly")}</span>
          ) : simpleLine ? (
            <QuantityControl
              quantity={simpleLine.qty}
              onIncrease={() => {
                bubble();
                plan.setQty(simpleLine.lineId, simpleLine.qty + 1);
              }}
              onDecrease={() => {
                bubble();
                plan.setQty(simpleLine.lineId, simpleLine.qty - 1);
              }}
              label={item.name}
            />
          ) : hasRequired && configuredQty > 0 ? (
            <button
              onClick={onCustomise}
              className="inline-flex items-center gap-1 text-sm font-semibold text-green-dark"
            >
              <Check className="h-4 w-4" /> {t("menu.card.addedEdit")}
            </button>
          ) : (
            <button
              onClick={hasRequired ? onCustomise : addSimple}
              aria-label={t("menu.card.addToPlanAria").replace("{name}", item.name)}
              className="h-10 w-10 grid place-items-center rounded-full bg-green text-white hover:bg-green-hover"
            >
              <Plus className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Desktop summary ---------------- */
function DesktopSummary({
  visitLabel,
  status,
  disabled,
  onReview,
  onEdit,
}: {
  visitLabel: string;
  status: StatusResult | null;
  disabled: boolean;
  onReview: () => void;
  onEdit: (lineId: string) => void;
}) {
  const { t } = useLang();
  const plan = useMealPlan();
  return (
    <aside className="hidden lg:block sticky top-[100px]">
      <div className="rounded-2xl bg-white border border-line-light shadow-card p-5">
        <p className="text-xs font-bold tracking-wider text-ink-supporting">{t("menu.planner.yourMealPlan")}</p>
        <p className="text-sm text-ink-primary mt-1 font-semibold">{plan.branchId === "ss4" ? "SS4" : "KL Central Walk"}</p>
        <p className="text-xs text-ink-secondary">{visitLabel}</p>
        {status && <div className="mt-2"><StatusBadge status={status} /></div>}

        {plan.count === 0 ? (
          <p className="mt-5 text-sm text-ink-secondary">
            {t("menu.planner.emptyAside")}
          </p>
        ) : (
          <>
            <div className="mt-4 space-y-2 max-h-[280px] overflow-y-auto no-scrollbar">
              {plan.items.map((l) => (
                <div
                  key={l.lineId}
                  className="rounded-xl bg-white border border-line-light p-2.5 flex items-start gap-2"
                  style={{ boxShadow: "0 4px 14px rgba(21,63,40,0.05)" }}
                >
                  <span className="text-xs font-semibold rounded-md bg-green-soft text-green-text px-1.5 py-0.5">
                    {l.qty}×
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-ink-primary truncate">{l.name}</p>
                    {Object.values(l.choices).length > 0 && (
                      <p className="text-xs text-ink-supporting truncate">
                        {Object.values(l.choices).join(", ")}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => onEdit(l.lineId)}
                    aria-label={t("menu.planner.editAria").replace("{name}", l.name)}
                    className="text-ink-muted hover:text-green-text"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-between items-center">
              <span className="text-sm text-ink-supporting">{t("menu.planner.estSubtotal")}</span>
              <span className="text-lg font-extrabold text-green-text">{formatRM(plan.subtotal)}</span>
            </div>
          </>
        )}

        <button
          onClick={onReview}
          disabled={disabled || plan.count === 0}
          className="btn btn-green w-full mt-5"
        >
          {t("menu.planner.reviewList")} <ArrowRight className="h-4 w-4" />
        </button>
        {plan.count > 0 && (
          <button
            onClick={() => {
              if (confirm(t("menu.planner.clearConfirm"))) plan.clearItems();
            }}
            className="w-full mt-2 text-sm text-ink-supporting hover:text-green-text underline"
          >
            {t("menu.planner.clearList")}
          </button>
        )}
      </div>
    </aside>
  );
}
