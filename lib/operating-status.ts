import type { Location } from "@/data/locations";

export type StatusKind =
  | "open"
  | "closing-soon"
  | "closed"
  | "opens-later"
  | "closed-day";

export type StatusResult = {
  kind: StatusKind;
  label: string;
  detail: string;
  open?: string;
  close?: string;
  nextOpen?: string; // human readable
};

const DAY_KEYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

const DAY_LABELS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

/** Current wall-clock time in Asia/Kuala_Lumpur as {dayIndex, minutes, dateISO}. */
export function nowInKL(): { dayIndex: number; minutes: number; dateISO: string } {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kuala_Lumpur",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);

  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const weekday = get("weekday");
  const dayMap: Record<string, number> = {
    Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
  };
  const hour = parseInt(get("hour"), 10) % 24;
  const minute = parseInt(get("minute"), 10);
  const dateISO = `${get("year")}-${get("month")}-${get("day")}`;
  return { dayIndex: dayMap[weekday] ?? 0, minutes: hour * 60 + minute, dateISO };
}

const toMinutes = (hhmm: string): number => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

export const formatTime = (hhmm: string): string => {
  const [h, m] = hhmm.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
};

/** Find the next day (and time) the branch opens, starting from dayIndex. */
function findNextOpening(loc: Location, fromDayIndex: number): string | undefined {
  for (let i = 1; i <= 7; i++) {
    const idx = (fromDayIndex + i) % 7;
    const day = loc.regularHours[DAY_KEYS[idx]];
    if (day?.status === "open" && day.open) {
      const when = i === 1 ? DAY_LABELS[idx] : DAY_LABELS[idx];
      return `${when} at ${formatTime(day.open)}`;
    }
  }
  return undefined;
}

/**
 * Compute operating status for a branch.
 * dayIndex 0=Sunday..6=Saturday, minutes = minutes since midnight.
 * dateISO used only to match special-hours overrides.
 */
export function getStatus(
  loc: Location,
  dayIndex: number,
  minutes: number,
  dateISO?: string
): StatusResult {
  // 1. Special-hours override
  const special = dateISO
    ? loc.specialHours.find((s) => s.date === dateISO && s.branchId === loc.id)
    : undefined;

  let day = loc.regularHours[DAY_KEYS[dayIndex]];
  let labelPrefix = "";
  if (special) {
    if (special.status === "closed") {
      return {
        kind: "closed-day",
        label: "Closed",
        detail: special.label,
        nextOpen: findNextOpening(loc, dayIndex),
      };
    }
    day = { status: "open", open: special.open ?? null, close: special.close ?? null };
    labelPrefix = `${special.label} · `;
  }

  // 2 + 3. Confirmed closed day / no regular hours
  if (!day || day.status === "closed" || !day.open || !day.close) {
    return {
      kind: "closed-day",
      label: "Closed today",
      detail: `${DAY_LABELS[dayIndex]} — closed`,
      nextOpen: findNextOpening(loc, dayIndex),
    };
  }

  const openMin = toMinutes(day.open);
  const closeMin = toMinutes(day.close);

  // 4. Before opening
  if (minutes < openMin) {
    return {
      kind: "opens-later",
      label: "Opens later today",
      detail: `${labelPrefix}Opens at ${formatTime(day.open)}`,
      open: day.open,
      close: day.close,
    };
  }

  // 7. After closing
  if (minutes >= closeMin) {
    return {
      kind: "closed",
      label: "Closed",
      detail: `${labelPrefix}Closed at ${formatTime(day.close)}`,
      nextOpen: findNextOpening(loc, dayIndex),
    };
  }

  // 6. Closing soon
  if (closeMin - minutes <= loc.closingSoonMinutes) {
    return {
      kind: "closing-soon",
      label: "Closing soon",
      detail: `${labelPrefix}Closes at ${formatTime(day.close)} — less than one hour left`,
      open: day.open,
      close: day.close,
    };
  }

  // 5. Open
  return {
    kind: "open",
    label: "Open",
    detail: `${labelPrefix}Closes at ${formatTime(day.close)}`,
    open: day.open,
    close: day.close,
  };
}

export function getLiveStatus(loc: Location): StatusResult {
  const { dayIndex, minutes, dateISO } = nowInKL();
  return getStatus(loc, dayIndex, minutes, dateISO);
}

export function todayHoursLabel(loc: Location): string {
  const { dayIndex } = nowInKL();
  const day = loc.regularHours[DAY_KEYS[dayIndex]];
  if (!day || day.status === "closed" || !day.open || !day.close) return "Closed today";
  return `${formatTime(day.open)} – ${formatTime(day.close)}`;
}

/**
 * Compact one-line status/time label (mobile outlet rows). Uses the branch's
 * actual configured hours:
 *   before opening -> "Opens 10:00 AM"
 *   during hours   -> "Closes 10:00 PM"
 *   after closing  -> "Closed · Opens tomorrow 10:00 AM"
 */
export function getOutletTimeLabel(loc: Location): string {
  const { dayIndex, minutes } = nowInKL();
  const today = loc.regularHours[DAY_KEYS[dayIndex]];
  if (today && today.status === "open" && today.open && today.close) {
    const openMin = toMinutes(today.open);
    const closeMin = toMinutes(today.close);
    if (minutes < openMin) return `Opens ${formatTime(today.open)}`;
    if (minutes < closeMin) return `Closes ${formatTime(today.close)}`;
  }
  for (let i = 1; i <= 7; i++) {
    const idx = (dayIndex + i) % 7;
    const d = loc.regularHours[DAY_KEYS[idx]];
    if (d?.status === "open" && d.open) {
      const when = i === 1 ? "tomorrow" : DAY_LABELS[idx];
      return `Closed · Opens ${when} ${formatTime(d.open)}`;
    }
  }
  return "Closed";
}

export { DAY_KEYS, DAY_LABELS };
