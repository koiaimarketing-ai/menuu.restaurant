"use client";

import type { StatusResult } from "@/lib/operating-status";
import { useLang } from "@/lib/i18n/LanguageProvider";

const LABEL_KEY: Record<string, string> = {
  open: "pages.status.open",
  "closing-soon": "pages.status.closingSoon",
  closed: "pages.status.closed",
  "opens-later": "pages.status.opensLater",
  "closed-day": "pages.status.closedToday",
};

const styles: Record<string, string> = {
  open: "bg-green-soft text-green-dark",
  "closing-soon": "bg-[#eef3ff] text-[#2258da]",
  closed: "bg-[#FDECEA] text-[#B42318]",
  "opens-later": "bg-[#eef3ff] text-[#2258da]",
  "closed-day": "bg-[#FDECEA] text-[#B42318]",
};

const dot: Record<string, string> = {
  open: "bg-green",
  "closing-soon": "bg-[#2258da]",
  closed: "bg-[#B42318]",
  "opens-later": "bg-[#2258da]",
  "closed-day": "bg-[#B42318]",
};

export function StatusBadge({ status }: { status: StatusResult }) {
  const { t } = useLang();
  const labelKey = LABEL_KEY[status.kind];
  const isOpen = status.kind === "open" || status.kind === "closing-soon";
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status.kind]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dot[status.kind]}`} aria-hidden />
      {/* Desktop: full status. Mobile: just Open / Closed to stay on one line. */}
      <span className="hidden md:inline">{labelKey ? t(labelKey) : status.label}</span>
      <span className="md:hidden">{t(isOpen ? "pages.status.open" : "pages.status.closed")}</span>
    </span>
  );
}
