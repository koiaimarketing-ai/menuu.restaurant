"use client";

import { useCallback, useRef, useState } from "react";

/**
 * Native-feeling "pull down to dismiss" for bottom-sheet style modals.
 *
 * Only engages when the inner scroll container is already at the top
 * (scrollTop <= 0) and the finger drags DOWNWARD — so normal scrolling inside
 * the modal keeps working and only a top-overscroll pull dismisses. Past the
 * threshold the modal closes; otherwise it springs back.
 *
 * Wire it up:
 *   const drag = useDragToClose(onClose);
 *   <div {...drag.backdropProps}>            // backdrop
 *     <div {...drag.shellProps}>             // modal shell (moves with finger)
 *       <div className="modal-drag-handle" /> // optional affordance
 *       <div ref={drag.scrollRef} className="overflow-y-auto">…</div>
 *     </div>
 *   </div>
 */
export function useDragToClose(onClose: () => void, threshold = 110) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const startY = useRef<number | null>(null);
  const active = useRef(false);
  const [dy, setDy] = useState(0);
  const [settling, setSettling] = useState(false);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const sc = scrollRef.current;
    if (sc && sc.scrollTop > 0) {
      startY.current = null;
      return;
    }
    startY.current = e.touches[0].clientY;
    active.current = false;
    setSettling(false);
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (startY.current == null) return;
    const delta = e.touches[0].clientY - startY.current;
    const sc = scrollRef.current;
    // Upward, or no longer at top → let the content scroll normally.
    if (delta <= 0 || (sc && sc.scrollTop > 0)) {
      if (active.current) setDy(0);
      active.current = false;
      startY.current = null;
      return;
    }
    active.current = true;
    // Mild resistance so the pull feels rubbery.
    setDy(delta > 0 ? delta * 0.85 : 0);
  }, []);

  const endDrag = useCallback(() => {
    if (startY.current == null && !active.current) return;
    const dragged = dy;
    startY.current = null;
    active.current = false;
    setSettling(true);
    if (dragged > threshold) {
      setDy(0);
      onClose();
    } else {
      setDy(0);
    }
  }, [dy, threshold, onClose]);

  const backdropOpacity = dy > 0 ? Math.max(0, 1 - dy / 360) : undefined;

  return {
    scrollRef,
    dragging: dy > 0,
    backdropProps: {
      style: {
        opacity: backdropOpacity,
        transition: settling ? "opacity 0.22s ease" : undefined,
      } as React.CSSProperties,
    },
    shellProps: {
      onTouchStart,
      onTouchMove,
      onTouchEnd: endDrag,
      onTouchCancel: endDrag,
      style: {
        transform: dy > 0 ? `translateY(${dy}px)` : undefined,
        transition: settling ? "transform 0.22s ease" : "none",
        touchAction: "pan-y",
        willChange: "transform",
      } as React.CSSProperties,
    },
  };
}
