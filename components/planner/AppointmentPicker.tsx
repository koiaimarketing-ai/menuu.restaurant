"use client";

import { useState } from "react";
import { Check, CalendarDays, MapPin, AlertTriangle } from "lucide-react";
import type { Location } from "@/data/locations";
import { DAY_KEYS, formatTime, nowInKL } from "@/lib/operating-status";
import { Calendar } from "./Calendar";
import { useLang } from "@/lib/i18n/LanguageProvider";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const WEEKDAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

const toMin = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

function prettyDate(isoDate: string) {
  const [y, m, d] = isoDate.split("-").map(Number);
  const wd = WEEKDAYS[new Date(y, m - 1, d).getDay()];
  return `${wd}, ${d} ${MONTHS[m - 1]} ${y}`;
}

function buildSlots(branch: Location, isoDate: string) {
  const [y, m, d] = isoDate.split("-").map(Number);
  const dayKey = DAY_KEYS[new Date(y, m - 1, d).getDay()];
  const day = branch.regularHours[dayKey];
  if (!day || day.status === "closed" || !day.open || !day.close) return [];
  const openMin = toMin(day.open);
  const closeMin = toMin(day.close);
  const { dateISO, minutes } = nowInKL();
  const isToday = isoDate === dateISO;
  const out: { value: string; label: string; disabled: boolean }[] = [];
  for (let t = openMin; t <= closeMin - 30; t += 30) {
    const hh = String(Math.floor(t / 60)).padStart(2, "0");
    const mm = String(t % 60).padStart(2, "0");
    out.push({
      value: `${hh}:${mm}`,
      label: formatTime(`${hh}:${mm}`),
      disabled: isToday && t <= minutes,
    });
  }
  return out;
}

function closingSoon(branch: Location, isoDate: string): string | null {
  const [y, m, d] = isoDate.split("-").map(Number);
  const dayKey = DAY_KEYS[new Date(y, m - 1, d).getDay()];
  const day = branch.regularHours[dayKey];
  if (!day || day.status === "closed" || !day.close) return null;
  const { dateISO, minutes } = nowInKL();
  if (isoDate !== dateISO) return null;
  const closeMin = toMin(day.close);
  if (closeMin - minutes <= 60 && closeMin - minutes > 0)
    return formatTime(day.close);
  return null;
}

export function AppointmentPicker({
  branch,
  date,
  time,
  onChange,
}: {
  branch: Location;
  date: string | null;
  time: string | null;
  onChange: (date: string | null, time: string | null) => void;
}) {
  const { t } = useLang();
  const [editing, setEditing] = useState(false);
  const complete = !!date && !!time && !editing;

  if (complete) {
    return (
      <div className="w-full rounded-[28px] border border-line-light bg-white p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-supporting">{t("misc.appt.yourVisit")}</p>
        <div className="mt-2 space-y-1 text-sm">
          <p className="flex items-center gap-2 font-semibold text-ink-primary">
            <MapPin className="h-4 w-4 text-primary" /> {branch.shortName}
          </p>
          <p className="flex items-center gap-2 text-ink-secondary">
            <CalendarDays className="h-4 w-4 text-primary" /> {prettyDate(date!)} · {formatTime(time!)}
          </p>
        </div>
        <button
          onClick={() => setEditing(true)}
          className="mt-3 text-sm font-semibold text-primary hover:underline"
        >
          {t("misc.appt.change")}
        </button>
      </div>
    );
  }

  const slots = date ? buildSlots(branch, date) : [];
  const warn = date ? closingSoon(branch, date) : null;

  return (
    <div className="grid gap-4 md:grid-cols-2 md:items-stretch">
      {/* Calendar card */}
      <div className="h-full md:min-h-[390px]">
        <Calendar
          branch={branch}
          value={date}
          onSelect={(d) => {
            onChange(d, null);
            setEditing(false);
          }}
        />
      </div>

      {/* Time card */}
      <div className="flex h-full flex-col rounded-[28px] border border-line-light bg-white p-4 md:min-h-[390px]">
        <p className="text-sm font-semibold text-ink-primary">{t("misc.appt.chooseTime")}</p>
        {warn && (
          <p className="mt-2 flex items-start gap-2 rounded-lg bg-[#FFF4DE] px-3 py-2 text-xs text-[#A96513]">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {t("misc.appt.closesSoon").replace("{time}", warn)}
          </p>
        )}
        {!date ? (
          <div className="flex flex-1 items-center justify-center text-center text-sm text-ink-muted">
            {t("misc.appt.chooseDateFirst")}
          </div>
        ) : slots.length === 0 ? (
          <div className="flex flex-1 items-center justify-center text-sm text-ink-muted">
            {t("misc.appt.noTimes")}
          </div>
        ) : (
          <div className="mt-3 grid flex-1 content-start grid-cols-3 gap-2.5 xl:grid-cols-4">
            {slots.map((s) => {
              const selected = time === s.value;
              return (
                <button
                  key={s.value}
                  disabled={s.disabled}
                  onClick={() => {
                    onChange(date, s.value);
                    setEditing(false);
                  }}
                  aria-pressed={selected}
                  className={`inline-flex min-h-[42px] items-center justify-center gap-1 rounded-[10px] border px-2 text-[13px] transition-colors ${
                    selected
                      ? "border-primary bg-primary font-semibold text-white"
                      : s.disabled
                      ? "cursor-not-allowed border-line-light bg-secondary text-ink-muted/50"
                      : "border-line-medium bg-white text-ink-primary hover:border-primary/50 hover:bg-primary-soft"
                  }`}
                >
                  {selected && <Check className="h-3.5 w-3.5" />}
                  {s.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
