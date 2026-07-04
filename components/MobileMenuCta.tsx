"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { useMealPlan } from "@/lib/meal-plan-store";
import { computeTotals, fmtRM } from "@/lib/planner";
import { useLang } from "@/lib/i18n/LanguageProvider";
import { MobileBottomCtaShell } from "@/components/MobileBottomCtaShell";

/**
 * Mobile-only sticky bottom CTA shown on every page EXCEPT /menu (which has its
 * own MobileMealBar). Frosted floating bar with the same green cart-summary pill
 * style + shine as the menu page. Links to the Menu page; when the cart already
 * has items it mirrors the menu summary (count · total). Lifts/hides when the
 * footer scrolls into view so it never blocks footer content.
 */
export function MobileMenuCta() {
  const pathname = usePathname();
  const plan = useMealPlan();
  const { t } = useLang();
  const [footerVisible, setFooterVisible] = useState(false);

  const onMenu = pathname.startsWith("/menu");

  useEffect(() => {
    if (onMenu) return;
    const footer = document.querySelector("footer");
    if (!footer) return;
    const io = new IntersectionObserver(
      ([entry]) => setFooterVisible(entry.isIntersecting),
      { threshold: 0 }
    );
    io.observe(footer);
    return () => io.disconnect();
  }, [onMenu, pathname]);

  if (onMenu || pathname.startsWith("/introduction")) return null;

  const totals = computeTotals(plan.items);
  const finalTotal = Math.max(0, totals.grandTotal - plan.voucherDiscount);
  const hasItems = plan.hydrated && plan.count > 0;

  return (
    <MobileBottomCtaShell hidden={footerVisible}>
      <Link
        href="/menu"
        aria-label={
          hasItems
            ? t("menu.mobile.viewAria")
                .replace("{count}", String(plan.count))
                .replace(
                  "{itemWord}",
                  plan.count === 1 ? t("menu.sidebar.item") : t("menu.sidebar.items")
                )
                .replace("{total}", fmtRM(finalTotal))
            : t("nav.exploreMenuNow")
        }
        className="mobile-mealplan-pill cta-pulse"
      >
        {hasItems ? (
          <>
            <span className="label">{t("menu.mobile.view")}</span>
            <span className="amount tabular-nums">
              {plan.count} · {fmtRM(finalTotal)}
            </span>
          </>
        ) : (
          <span className="label inline-flex items-center gap-2">
            {t("nav.exploreMenuNow")} <ArrowRight className="h-4 w-4" />
          </span>
        )}
      </Link>
    </MobileBottomCtaShell>
  );
}
