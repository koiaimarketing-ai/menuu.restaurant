"use client";

import { useEffect, useState } from "react";
import type { Location } from "@/data/locations";
import { getLiveStatus, type StatusResult } from "@/lib/operating-status";
import { StatusBadge } from "./StatusBadge";
import { useLang } from "@/lib/i18n/LanguageProvider";

/** Renders live status only after mount to avoid SSR/client time drift. */
export function LiveStatus({
  location,
  showDetail = false,
}: {
  location: Location;
  showDetail?: boolean;
}) {
  const [status, setStatus] = useState<StatusResult | null>(null);
  const { t } = useLang();

  useEffect(() => {
    setStatus(getLiveStatus(location));
    const t = setInterval(() => setStatus(getLiveStatus(location)), 60_000);
    return () => clearInterval(t);
  }, [location]);

  if (!status) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-ink-muted">
        {t("pages.status.checking")}
      </span>
    );
  }

  return (
    <span className="inline-flex flex-wrap items-center gap-2">
      <StatusBadge status={status} />
      {showDetail && (
        <span className="text-xs text-ink-secondary">{status.detail}</span>
      )}
    </span>
  );
}
