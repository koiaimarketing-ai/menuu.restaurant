"use client";

import { useEffect, useReducer, useRef } from "react";

/**
 * Native-feeling "pull down to dismiss" for bottom-sheet style modals.
 *
 * Uses real (non-passive) touch listeners so `preventDefault` can suppress the
 * browser's overscroll/rubber-band while the sheet follows the finger — which
 * is what makes the motion smooth on iOS Safari.
 *
 * Engages ONLY when the inner scroll container is at the top (scrollTop <= 0)
 * and the finger drags DOWNWARD, so normal scrolling keeps working and only a
 * top-overscroll pull dismisses. Past the threshold it closes; otherwise it
 * springs back with a smooth eased transition.
 *
 * Wire-up:
 *   const drag = useDragToClose(onClose);
 *   <div style={drag.backdropStyle} ...>            // backdrop
 *     <div ref={drag.shellRef} style={drag.shellStyle} className="popup-sheet">
 *       <div className="modal-drag-handle" />
 *       <div ref={drag.scrollRef} className="popup-scroll-area overflow-y-auto">…</div>
 *     </div>
 *   </div>
 */
export function useDragToClose(onClose: () => void, open = true, threshold = 100) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const shellRef = useRef<HTMLDivElement | null>(null);
  const dragY = useRef(0);
  const startY = useRef(0);
  const active = useRef(false);
  const exiting = useRef(false);
  const [, force] = useReducer((x: number) => x + 1, 0);

  useEffect(() => {
    const shell = shellRef.current;
    if (!shell || !open) return;
    const setY = (v: number) => {
      if (dragY.current === v) return;
      dragY.current = v;
      force();
    };

    const onStart = (e: TouchEvent) => {
      const sc = scrollRef.current;
      if (sc && sc.scrollTop > 0) {
        active.current = false;
        return;
      }
      startY.current = e.touches[0].clientY;
      active.current = true;
      exiting.current = false;
    };

    const onMove = (e: TouchEvent) => {
      if (!active.current) return;
      const sc = scrollRef.current;
      const diff = e.touches[0].clientY - startY.current;
      // Upward, or the content has scrolled → hand back to normal scrolling.
      if (diff <= 0 || (sc && sc.scrollTop > 0)) {
        if (dragY.current !== 0) setY(0);
        active.current = false;
        return;
      }
      // Following the finger downward from the top — own the gesture.
      e.preventDefault();
      setY(Math.min(diff * 0.8, 200));
    };

    const onEnd = () => {
      if (!active.current && dragY.current === 0) return;
      const wasActive = active.current;
      active.current = false;
      const dragged = dragY.current;
      // Decide ONLY on release. Past the threshold: keep the sheet mounted,
      // animate it the rest of the way down + fade, THEN unmount via onClose.
      if (wasActive && dragged > threshold) {
        exiting.current = true;
        force();
        window.setTimeout(() => {
          exiting.current = false;
          dragY.current = 0;
          onClose();
        }, 260);
        return;
      }
      // Not far enough → spring back smoothly.
      setY(0);
      force();
    };

    shell.addEventListener("touchstart", onStart, { passive: true });
    shell.addEventListener("touchmove", onMove, { passive: false });
    shell.addEventListener("touchend", onEnd);
    shell.addEventListener("touchcancel", onEnd);
    return () => {
      shell.removeEventListener("touchstart", onStart);
      shell.removeEventListener("touchmove", onMove);
      shell.removeEventListener("touchend", onEnd);
      shell.removeEventListener("touchcancel", onEnd);
    };
  }, [onClose, open, threshold]);

  const y = dragY.current;
  const isExiting = exiting.current;
  const dragging = active.current;
  const ease = "cubic-bezier(0.22, 1, 0.36, 1)";
  return {
    scrollRef,
    shellRef,
    shellStyle: {
      transform: isExiting ? "translateY(100%)" : y ? `translateY(${y}px)` : undefined,
      opacity: isExiting ? 0 : undefined,
      transition: dragging ? "none" : `transform 0.26s ${ease}, opacity 0.22s ease`,
      touchAction: "pan-y",
      willChange: "transform, opacity",
    } as React.CSSProperties,
    backdropStyle: {
      opacity: isExiting ? 0 : y ? Math.max(0.45, 1 - y / 300) : undefined,
      transition: dragging ? "none" : "opacity 0.24s ease",
    } as React.CSSProperties,
  };
}
