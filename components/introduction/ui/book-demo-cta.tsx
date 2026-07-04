"use client";

import { CalendarCheck } from "lucide-react";
import { useLang } from "@/components/introduction/providers/language-provider";
import { Button } from "@/components/introduction/ui/button";

/**
 * Desktop/tablet-only "Book Demo" CTA.
 *
 * Hidden below `md` because mobile already carries the sticky bottom CTA bar —
 * this avoids duplicating the action on small screens. Reuses the primary
 * <Button> (rounded-full, brand-600, white text, soft blue shadow, hover-lift)
 * and points at the same `#contact` target + trilingual label (`nav.demo`) as
 * the navbar Book Demo button, so behaviour stays in one place.
 */
export function BookDemoCTA({
  className = "",
  size = "lg",
}: {
  className?: string;
  size?: "md" | "lg";
}) {
  const { t } = useLang();
  return (
    <div className={`hidden justify-center md:flex ${className}`}>
      <Button href="#contact" size={size}>
        <CalendarCheck className="h-5 w-5" />
        {t.nav.demo}
      </Button>
    </div>
  );
}
