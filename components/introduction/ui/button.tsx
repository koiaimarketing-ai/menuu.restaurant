"use client";

import { type ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "white";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none select-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand-600 text-white shadow-[var(--shadow-cta)] hover:bg-brand-700 hover:-translate-y-0.5",
  secondary:
    "bg-white text-ink-900 ring-1 ring-line shadow-[var(--shadow-soft)] hover:ring-brand-300 hover:-translate-y-0.5",
  ghost: "bg-brand-50 text-brand-700 hover:bg-brand-100",
  white: "bg-white text-brand-700 shadow-[var(--shadow-soft)] hover:-translate-y-0.5",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-sm",
  lg: "h-[52px] px-7 text-base",
};

type Props = {
  children: ReactNode;
  href?: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  external?: boolean;
  onClick?: () => void;
  ariaLabel?: string;
};

export function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  className = "",
  external,
  onClick,
  ariaLabel,
}: Props) {
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`;
  if (href) {
    return (
      <a
        href={href}
        onClick={onClick}
        aria-label={ariaLabel}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className={cls}
      >
        {children}
      </a>
    );
  }
  return (
    <button onClick={onClick} aria-label={ariaLabel} className={cls}>
      {children}
    </button>
  );
}
