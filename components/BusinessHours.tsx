"use client";

import type { Location } from "@/data/locations";
import { DAY_KEYS, formatTime, nowInKL } from "@/lib/operating-status";
import { useLang } from "@/lib/i18n/LanguageProvider";

const DAY_LABEL_KEYS = [
  "pages.hours.day.sunday",
  "pages.hours.day.monday",
  "pages.hours.day.tuesday",
  "pages.hours.day.wednesday",
  "pages.hours.day.thursday",
  "pages.hours.day.friday",
  "pages.hours.day.saturday",
];

// English short-form day names (index 0 = Sunday). Malay/Chinese keep full names.
const EN_SHORT_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function BusinessHours({ location }: { location: Location }) {
  const { dayIndex } = nowInKL();
  const { t, lang } = useLang();
  return (
    <div className="rounded-2xl border border-line-light bg-white p-5">
      <h3 className="text-ink-primary font-semibold mb-3">{t("pages.hours.title")}</h3>
      <ul className="text-sm">
        {DAY_KEYS.map((key, i) => {
          const day = location.regularHours[key];
          const today = i === dayIndex;
          const text =
            day.status === "open" && day.open && day.close
              ? `${formatTime(day.open)} – ${formatTime(day.close)}`
              : t("pages.hours.closed");
          return (
            <li
              key={key}
              className={`flex items-start justify-between gap-3 py-1.5 border-b border-line-light last:border-0 ${
                today ? "font-semibold text-ink-primary" : "text-ink-secondary"
              }`}
            >
              <span className="flex flex-col leading-tight">
                <span>{lang === "en" ? EN_SHORT_DAYS[i] : t(DAY_LABEL_KEYS[i])}</span>
                {today && (
                  <span className="mt-0.5 text-xs font-medium text-green-text">{t("pages.hours.today")}</span>
                )}
              </span>
              <span className="text-right">{text}</span>
            </li>
          );
        })}
      </ul>
      <p className="mt-3 text-xs text-ink-muted">{t("pages.hours.holidayNote")}</p>
    </div>
  );
}
