"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Location } from "@/data/locations";
import { DAY_KEYS, nowInKL } from "@/lib/operating-status";
import { useLang } from "@/lib/i18n/LanguageProvider";

const WD = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const iso = (y: number, m: number, d: number) =>
  `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

/** A date is closed if the branch's weekday is closed or a special full-day closure exists. */
function isClosed(branch: Location, y: number, m: number, d: number): boolean {
  const dayIdx = new Date(y, m, d).getDay();
  const day = branch.regularHours[DAY_KEYS[dayIdx]];
  if (!day || day.status === "closed") return true;
  return branch.specialHours.some(
    (s) => s.date === iso(y, m, d) && s.branchId === branch.id && s.status === "closed"
  );
}

export function Calendar({
  branch,
  value,
  onSelect,
}: {
  branch: Location;
  value: string | null;
  onSelect: (isoDate: string) => void;
}) {
  const { t } = useLang();
  const todayISO = nowInKL().dateISO;
  const [ty, tm] = todayISO.split("-").map(Number);
  const [view, setView] = useState(() => {
    if (value) {
      const [y, m] = value.split("-").map(Number);
      return { y, m: m - 1 };
    }
    return { y: ty, m: tm - 1 };
  });

  const first = new Date(view.y, view.m, 1);
  const startOffset = (first.getDay() + 6) % 7; // Mon-first
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const prev = () => setView((v) => (v.m === 0 ? { y: v.y - 1, m: 11 } : { ...v, m: v.m - 1 }));
  const next = () => setView((v) => (v.m === 11 ? { y: v.y + 1, m: 0 } : { ...v, m: v.m + 1 }));
  const atOrBeforeCurrentMonth = view.y < ty || (view.y === ty && view.m <= tm - 1);

  return (
    <div className="flex h-full flex-col rounded-2xl border border-line-light bg-white p-4">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-supporting">
          {t("misc.cal.chooseVisitDate")}
        </p>
        <p className="text-sm font-semibold text-primary">{branch.shortName}</p>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <button
          onClick={prev}
          disabled={atOrBeforeCurrentMonth}
          aria-label={t("misc.cal.prevMonth")}
          className="grid h-8 w-8 place-items-center rounded-full text-ink-secondary hover:bg-secondary disabled:opacity-30"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-sm font-semibold text-ink-primary">
          {MONTHS[view.m]} {view.y}
        </span>
        <button
          onClick={next}
          aria-label={t("misc.cal.nextMonth")}
          className="grid h-8 w-8 place-items-center rounded-full text-ink-secondary hover:bg-secondary"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[11px] font-medium text-ink-muted">
        {WD.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>

      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (d === null) return <span key={`e${i}`} />;
          const dISO = iso(view.y, view.m, d);
          const isPast = dISO < todayISO;
          const closed = isClosed(branch, view.y, view.m, d);
          const disabled = isPast || closed;
          const selected = value === dISO;
          const isToday = dISO === todayISO;
          return (
            <button
              key={dISO}
              onClick={() => !disabled && onSelect(dISO)}
              disabled={disabled}
              aria-label={`${d} ${MONTHS[view.m]} ${view.y}${closed ? ` (${t("misc.cal.closedSuffix")})` : ""}`}
              aria-pressed={selected}
              className={`relative grid h-9 place-items-center rounded-lg text-sm transition-colors ${
                selected
                  ? "bg-primary font-semibold text-white"
                  : disabled
                  ? "cursor-not-allowed text-ink-muted/40 line-through"
                  : "text-ink-primary hover:bg-primary-soft"
              }`}
            >
              {d}
              {isToday && !selected && (
                <span className="absolute bottom-1 h-1 w-1 rounded-full bg-primary" aria-hidden />
              )}
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-center text-[11px] text-ink-muted">
        {t("misc.cal.closedNote")}
      </p>
    </div>
  );
}

export { isClosed };
