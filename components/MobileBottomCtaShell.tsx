"use client";

import type { ReactNode } from "react";

/**
 * Shared frosted-glass shell for the mobile bottom CTA — the single source of
 * truth for the floating bottom bar on EVERY page. The menu page (MobileMealBar)
 * and all other pages (MobileMenuCta) render their green pill inside this shell
 * so the bar looks and sits identically everywhere.
 *
 * Both this shell and the BackToTop button are mounted at (or near) the document
 * root — never inside a transformed/filtered ancestor — so `position: fixed`
 * resolves against the viewport on Android Chrome as well as iOS Safari.
 *
 * Layer order: page content < this shell (z-80) < BackToTop (z-90) < modals.
 */
export function MobileBottomCtaShell({
  hidden = false,
  children,
}: {
  hidden?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={`mobile-bottom-cta-wrap lg:hidden ${hidden ? "is-hidden" : ""}`}>
      <div className="mx-auto max-w-md">{children}</div>
    </div>
  );
}
