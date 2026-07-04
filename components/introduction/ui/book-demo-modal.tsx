"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useLang } from "@/components/introduction/providers/language-provider";
import { waUrl } from "@/lib/introduction/content";
import { CalendarCheck, Check, X } from "lucide-react";
import { Button } from "@/components/introduction/ui/button";

const EASE = [0.22, 1, 0.36, 1] as const;

const TIME_SLOTS = [
  "10:00 AM",
  "11:00 AM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "7:00 PM",
  "8:00 PM",
  "9:00 PM",
  "10:00 PM",
  "11:00 PM",
];

type DateKey = "today" | "tomorrow";

/** "1:00 PM" -> minutes since midnight. */
const slotMinutes = (slot: string): number => {
  const [hm, period] = slot.split(" ");
  const [h, m] = hm.split(":").map(Number);
  const h24 = period === "PM" ? (h % 12) + 12 : h % 12;
  return h24 * 60 + m;
};

const BookDemoContext = createContext<{ openBookDemo: () => void } | null>(null);

export function useBookDemo() {
  const ctx = useContext(BookDemoContext);
  if (!ctx) throw new Error("useBookDemo must be used within BookDemoProvider");
  return ctx;
}

/** Hosts the Book Demo dialog once for the whole introduction page; every
 *  "Book Demo" CTA opens it via useBookDemo(). */
export function BookDemoProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const openBookDemo = useCallback(() => setOpen(true), []);
  const close = useCallback(() => setOpen(false), []);
  return (
    <BookDemoContext.Provider value={{ openBookDemo }}>
      {children}
      <BookDemoModal open={open} onClose={close} />
    </BookDemoContext.Provider>
  );
}

function BookDemoModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { lang, t } = useLang();
  const b = t.bookDemo;
  const reduce = useReducedMotion();
  const [dateKey, setDateKey] = useState<DateKey | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const submittedRef = useRef(false);
  const backdropPressRef = useRef(false);
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  // A slot on "today" that the clock has already passed can't be booked.
  const nowMinutes = new Date().getHours() * 60 + new Date().getMinutes();
  const isPastSlot = useCallback(
    (key: DateKey | null, slot: string) => key === "today" && slotMinutes(slot) <= nowMinutes,
    [nowMinutes]
  );

  // Fresh selection every time the dialog opens; move focus in and give it
  // back to the trigger on close.
  useEffect(() => {
    if (open) {
      setDateKey(null);
      setTime(null);
      setShowError(false);
      submittedRef.current = false;
      restoreFocusRef.current = document.activeElement as HTMLElement | null;
      // Panel is mounted by the time this effect runs; rAF only as fallback.
      if (panelRef.current) panelRef.current.focus();
      else requestAnimationFrame(() => panelRef.current?.focus());
    } else {
      restoreFocusRef.current?.focus?.();
      restoreFocusRef.current = null;
    }
  }, [open]);

  // Escape closes; Tab stays inside the dialog; background scroll locks.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab" && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement;
        if (e.shiftKey && (active === first || active === panelRef.current)) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  // The validation hint clears itself once both choices are made.
  useEffect(() => {
    if (dateKey && time) setShowError(false);
  }, [dateKey, time]);

  const dayLabel = useCallback(
    (key: DateKey) => {
      const d = new Date();
      if (key === "tomorrow") d.setDate(d.getDate() + 1);
      const locale = lang === "zh" ? "zh-CN" : lang === "ms" ? "ms-MY" : "en-GB";
      return d.toLocaleDateString(locale, { day: "numeric", month: "long" });
    },
    [lang]
  );

  const chooseDate = (key: DateKey) => {
    setDateKey(key);
    // A slot picked for tomorrow may already be gone today.
    setTime((prev) => (prev && isPastSlot(key, prev) ? null : prev));
  };

  const submit = () => {
    // Date text is built at submit time so a midnight rollover between
    // selecting and submitting can't send yesterday's date.
    if (!dateKey || !time || isPastSlot(dateKey, time)) {
      setShowError(true);
      return;
    }
    if (submittedRef.current) return;
    submittedRef.current = true;
    const label = dateKey === "today" ? b.today : b.tomorrow;
    const ds = dayLabel(dateKey);
    const dateText = lang === "zh" ? `${label}（${ds}）` : `${label}, ${ds}`;
    const message = b.waTemplate.replace("{date}", dateText).replace("{time}", time);
    const url = waUrl(message);
    const win = window.open(url, "_blank", "noopener,noreferrer");
    if (!win) window.location.href = url; // popup blocked — same-tab fallback
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="book-demo"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed inset-0 z-[80] flex items-end justify-center overscroll-contain bg-navy/45 p-4 backdrop-blur-sm sm:items-center"
          onPointerDown={(e) => {
            backdropPressRef.current = e.target === e.currentTarget;
          }}
          onClick={(e) => {
            // Close only when the press started AND ended on the backdrop, so
            // a drag that slips off the panel doesn't dismiss the dialog.
            if (e.target === e.currentTarget && backdropPressRef.current) onClose();
            backdropPressRef.current = false;
          }}
          role="presentation"
        >
          <motion.div
            ref={panelRef}
            tabIndex={-1}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.96, filter: "blur(6px)" }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98, filter: "blur(4px)" }}
            transition={{ type: "spring", duration: 0.45, bounce: 0 }}
            className="max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto overscroll-contain rounded-3xl border border-line bg-white p-5 shadow-[var(--shadow-card)] outline-none sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="book-demo-title"
          >
            {/* header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <CalendarCheck className="h-5 w-5" />
                </span>
                <h2 id="book-demo-title" className="text-lg font-extrabold text-navy">
                  {b.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label={b.cancel}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white text-ink-900 transition-colors hover:bg-mist-50 active:scale-[0.97]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* date */}
            <p id="book-demo-date-label" className="mt-5 text-xs font-bold uppercase tracking-[0.12em] text-slate">
              {b.dateLabel}
            </p>
            <div role="group" aria-labelledby="book-demo-date-label" className="mt-2 grid grid-cols-2 gap-2">
              {(["today", "tomorrow"] as DateKey[]).map((key) => {
                const on = dateKey === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => chooseDate(key)}
                    aria-pressed={on}
                    className={`rounded-2xl border px-3 py-3 text-left transition-colors duration-200 active:scale-[0.98] ${
                      on
                        ? "border-primary bg-soft-blue"
                        : "border-line bg-white hover:border-brand-300"
                    }`}
                  >
                    <span className="flex items-center justify-between gap-2">
                      <span className={`text-sm font-bold ${on ? "text-primary" : "text-ink-900"}`}>
                        {key === "today" ? b.today : b.tomorrow}
                      </span>
                      {on && <Check className="h-4 w-4 text-primary" strokeWidth={3} />}
                    </span>
                    <span className={`mt-0.5 block text-xs ${on ? "text-brand-700" : "text-body"}`}>
                      {dayLabel(key)}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* time */}
            <p id="book-demo-time-label" className="mt-5 text-xs font-bold uppercase tracking-[0.12em] text-slate">
              {b.timeLabel}
            </p>
            <div role="group" aria-labelledby="book-demo-time-label" className="mt-2 grid grid-cols-3 gap-2">
              {TIME_SLOTS.map((slot) => {
                const on = time === slot;
                const past = isPastSlot(dateKey, slot);
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setTime(slot)}
                    disabled={past}
                    aria-pressed={on}
                    className={`whitespace-nowrap rounded-xl border px-2 py-2.5 text-xs font-semibold transition-colors duration-200 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100 ${
                      on
                        ? "border-brand-600 bg-brand-600 text-white shadow-[0_10px_24px_rgba(37,99,235,0.25)]"
                        : "border-line bg-white text-ink-800 hover:border-brand-300 hover:text-brand-700"
                    }`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>

            {/* validation hint */}
            <AnimatePresence initial={false}>
              {showError && (
                <motion.p
                  role="alert"
                  initial={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
                  animate={reduce ? { opacity: 1 } : { opacity: 1, height: "auto" }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
                  transition={{ duration: 0.22, ease: EASE }}
                  className="overflow-hidden text-sm font-semibold text-red-500"
                >
                  <span className="block pt-3">{b.validation}</span>
                </motion.p>
              )}
            </AnimatePresence>

            {/* actions */}
            <div className="mt-6 flex flex-col-reverse gap-2.5 sm:flex-row">
              <Button variant="secondary" size="md" className="w-full sm:flex-1" onClick={onClose}>
                {b.cancel}
              </Button>
              <Button size="md" className="w-full sm:flex-[1.4]" onClick={submit}>
                <CalendarCheck className="h-4 w-4" />
                {b.submit}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
