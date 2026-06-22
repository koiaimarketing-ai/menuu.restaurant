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

export function BusinessHours({ location }: { location: Location }) {
  const { dayIndex } = nowInKL();
  const { t } = useLang();
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
              className={`flex justify-between py-1.5 border-b border-line-light last:border-0 ${
                today ? "font-semibold text-ink-primary" : "text-ink-secondary"
              }`}
            >
              <span>
                {t(DAY_LABEL_KEYS[i])}
                {today && <span className="ml-2 text-xs text-green-text">{t("pages.hours.today")}</span>}
              </span>
              <span>{text}</span>
            </li>
          );
        })}
      </ul>
      <p className="mt-3 text-xs text-ink-muted">{t("pages.hours.holidayNote")}</p>
    </div>
  );
}
