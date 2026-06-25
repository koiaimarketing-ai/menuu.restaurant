"use client";

import { useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";

/**
 * Lightweight image preview overlay. Soft-blurred dark backdrop, centred image,
 * close button top-right. Closes on backdrop click and ESC. Locks body scroll
 * while open. Used by menu cards to preview the food photo without triggering
 * the card's Add action (the trigger calls stopPropagation).
 */
export function ImageLightbox({
  src,
  alt,
  onClose,
}: {
  src: string;
  alt: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      onClick={onClose}
      className="fixed inset-0 z-[9000] grid place-items-center bg-black/70 p-5 backdrop-blur-sm"
    >
      <button
        type="button"
        aria-label="Close preview"
        onClick={onClose}
        className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-ink-primary shadow-md transition-colors hover:bg-white"
      >
        <X className="h-5 w-5" />
      </button>
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative h-auto w-full max-w-[min(90vw,560px)] overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <Image
          src={src}
          alt={alt}
          width={1120}
          height={840}
          className="h-auto w-full object-contain"
        />
      </div>
    </div>
  );
}
