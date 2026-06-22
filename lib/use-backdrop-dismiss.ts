"use client";

import { useRef } from "react";
import type { MouseEvent } from "react";

/**
 * Backdrop dismiss handlers that close a modal ONLY when a genuine click starts
 * AND ends on the backdrop itself. This prevents the common bug where pressing
 * inside the modal (e.g. selecting text in an input or scrolling) and releasing
 * the mouse outside on the backdrop fires a `click` and wrongly closes it.
 *
 * Spread the returned handlers onto the backdrop element and drop the old
 * `onClick={onClose}` (and the inner panel's `stopPropagation`).
 */
export function useBackdropDismiss(onClose: () => void) {
  const startedOnBackdrop = useRef(false);
  return {
    onMouseDown: (e: MouseEvent) => {
      startedOnBackdrop.current = e.target === e.currentTarget;
    },
    onMouseUp: (e: MouseEvent) => {
      if (startedOnBackdrop.current && e.target === e.currentTarget) onClose();
      startedOnBackdrop.current = false;
    },
  };
}
