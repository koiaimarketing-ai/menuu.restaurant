"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useLang } from "@/components/introduction/providers/language-provider";
import { Reveal } from "@/components/introduction/ui/reveal";
import {
  Star,
  Clock3,
  ClipboardList,
  UserRound,
  ChevronLeft,
  Video,
  Phone,
  Plus,
  Camera,
  Mic,
  SmilePlus,
  CalendarClock,
  CheckCheck,
  SignalHigh,
  Wifi,
} from "lucide-react";

/* Exact section palette (scoped here per design spec) */
const C = {
  primary: "#234EDC",
  secondary: "#2F5BEE",
  bg: "#F3F5FA",
  accent: "#DCE5FA",
  glow: "#AFC4FF",
  white: "#FFFFFF",
};
/* Rotating multilingual reply — fixed 5 languages, independent of UI language */
const REPLIES = ["Alright Boss", "Baik Boss", "好的，老板", "好的，老闆", "சரி பாஸ்"];

function RotatingReply() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setI((v) => (v + 1) % REPLIES.length), 2200);
    return () => clearInterval(id);
  }, [reduce]);

  if (reduce) return <span className="font-semibold text-[#111]">{REPLIES[0]}</span>;

  return (
    <span className="relative inline-block h-[16px] min-w-[86px] overflow-hidden align-bottom">
      <AnimatePresence initial={false}>
        <motion.span
          key={i}
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -16, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="absolute left-0 top-0 whitespace-nowrap font-semibold text-[#111]"
        >
          {REPLIES[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/* Dotted decoration — dots vanish inner→outer then return (staggered delays) */
function Dots() {
  return (
    <div aria-hidden="true" className="grid grid-cols-5 gap-2.5">
      {Array.from({ length: 20 }).map((_, n) => {
        const r = Math.floor(n / 5);
        const c = n % 5;
        return (
          <span
            key={n}
            className="h-1.5 w-1.5 rounded-full bg-white/50 animate-[wa-dot_3.6s_ease-in-out_infinite]"
            style={{ animationDelay: `${(4 - c + (3 - r)) * 0.18}s` }}
          />
        );
      })}
    </div>
  );
}

/* Expanding signal rings */
function Rings() {
  return (
    <div aria-hidden="true" className="relative h-56 w-56">
      {[0, 1, 2].map((n) => (
        <span
          key={n}
          className="absolute inset-0 rounded-full border-2 border-white/25 animate-[wa-ripple_4s_ease-out_infinite]"
          style={{ animationDelay: `${n * 1.3}s` }}
        />
      ))}
    </div>
  );
}

const FEATURE_ICONS = [Clock3, ClipboardList, UserRound];
const EASE = [0.22, 1, 0.36, 1] as const;

export function WhatsappOrder() {
  const { t } = useLang();
  const w = t.waOrder;
  const reduce = useReducedMotion();

  // Scroll-in choreography (reduced-motion → opacity only)
  const fadeUp = reduce
    ? { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.4 } } }
    : { hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } } };
  const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } };
  const panelIn = reduce
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : { hidden: { opacity: 0, scale: 0.96 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: EASE } } };
  const phoneUp = reduce
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : { hidden: { opacity: 0, y: 80, scale: 0.96 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: EASE, delay: 0.15 } } };
  const boxIn = reduce
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: EASE, delay: 0.35 } } };

  return (
    <section id="whatsapp-order" className="overflow-hidden py-14 sm:py-20" style={{ background: C.bg }}>
      {/* top-center badge */}
      <Reveal className="mb-10 flex justify-center px-4">
        <span
          className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[13px] font-semibold uppercase tracking-wider"
          style={{ background: "#EEF4FF", color: C.primary }}
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: C.primary }} />
          {w.badge}
        </span>
      </Reveal>

      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:gap-10">
        {/* ================= LEFT ================= */}
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
          <motion.span
            variants={fadeUp}
            className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold shadow-[var(--shadow-soft)]"
            style={{ color: C.primary }}
          >
            <Star className="h-4 w-4" style={{ fill: C.primary, color: C.primary }} /> {w.pill}
          </motion.span>

          <motion.p variants={fadeUp} className="mt-5 text-xs font-extrabold uppercase tracking-[0.2em]" style={{ color: C.primary }}>
            {w.tag}
          </motion.p>

          <motion.h2 variants={fadeUp} className="mt-3 text-4xl font-extrabold leading-[1.05] sm:text-5xl">{w.heading}</motion.h2>
          <motion.p variants={fadeUp} className="mt-4 text-lg text-body">{w.sub}</motion.p>

          <motion.div variants={stagger} className="mt-8">
            {w.features.map((f, i) => {
              const Icon = FEATURE_ICONS[i];
              return (
                <motion.div variants={fadeUp} key={i} className={`flex items-start gap-4 py-4 ${i > 0 ? "border-t border-line" : ""}`}>
                  <span
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white shadow-[var(--shadow-soft)]"
                    style={{ color: C.primary }}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-base font-bold text-heading">{f.title}</span>
                    <span className="mt-0.5 block text-sm text-body">{f.desc}</span>
                  </span>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>

        {/* ================= RIGHT ================= */}
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
          <div className="relative">
            {/* blue panel */}
            <motion.div
              variants={panelIn}
              className="relative overflow-hidden rounded-[2.5rem] px-6 pb-10 pt-8 shadow-[0_30px_80px_-20px_rgba(35,78,220,0.45)] sm:px-10"
              style={{ background: `linear-gradient(140deg, ${C.secondary}, ${C.primary})` }}
            >
              {/* dots decoration */}
              <div className="absolute left-7 top-24 hidden sm:block">
                <Dots />
              </div>
              {/* signal rings */}
              <div className="absolute -right-16 top-1/2 hidden -translate-y-1/2 sm:block">
                <Rings />
              </div>

              {/* panel header */}
              <div className="relative flex flex-col items-center gap-2">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-md">
                  {/* WhatsApp mark */}
                  <svg viewBox="0 0 24 24" className="h-7 w-7" fill={C.primary} aria-hidden="true">
                    <path d="M12 2a9.9 9.9 0 0 0-8.5 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3.1.8.8-3-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.6-6.1c-.3-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.6 0a6.7 6.7 0 0 1-2-1.2 7.4 7.4 0 0 1-1.4-1.7c-.1-.3 0-.4.1-.6l.4-.5c.1-.1.2-.3.3-.5a.5.5 0 0 0 0-.5c0-.1-.6-1.4-.8-1.9s-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4 15 15 0 0 0 1.5.6 3.6 3.6 0 0 0 1.7.1 2.8 2.8 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.3-.2-.6-.3Z" />
                  </svg>
                </span>
                <p className="text-lg font-bold !text-white text-white">{w.panelLabel}</p>
              </div>

              {/* iPhone mockup — slim vertical proportion, no home indicator */}
              <motion.div variants={phoneUp} className="relative z-10 mx-auto mt-6 w-[min(66vw,258px)]">
                <div className="animate-[wa-float_4s_ease-in-out_infinite]">
                <div className="rounded-[2.9rem] bg-[#2b2f38] p-[7px] shadow-[0_24px_60px_rgba(8,17,39,0.45)] ring-1 ring-black/30">
                  <div className="overflow-hidden rounded-[2.5rem] bg-white">
                    {/* status bar — clean: time · dynamic island · signal/wifi/5G/battery */}
                    <div className="relative flex items-center justify-between bg-[#f6f6f6] px-5 pb-1 pt-2.5">
                      <span className="z-10 text-[11px] font-bold text-black">9:41</span>
                      <span className="absolute left-1/2 top-1.5 h-[20px] w-[70px] -translate-x-1/2 rounded-full bg-black" />
                      <span className="z-10 flex items-center gap-1 text-black">
                        <SignalHigh className="h-3 w-3" />
                        <Wifi className="h-3 w-3" />
                        <span className="text-[9px] font-bold">5G</span>
                        <span className="relative ml-0.5 inline-block h-[10px] w-[17px] rounded-[3px] border border-black/50">
                          <span className="absolute inset-[1.5px] rounded-[1px] bg-black/70" />
                          <span className="absolute -right-[3px] top-1/2 h-[4px] w-[1.5px] -translate-y-1/2 rounded-sm bg-black/40" />
                        </span>
                      </span>
                    </div>

                    {/* WA header */}
                    <div className="flex items-center gap-2 border-b border-black/5 bg-[#f6f6f6] px-3 py-2">
                      <ChevronLeft className="h-4 w-4 text-[#007aff]" />
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-[12px] font-bold text-white">
                        M
                      </span>
                      <span className="min-w-0 flex-1 leading-tight">
                        <span className="block text-[12px] font-bold text-black">Menuu</span>
                        <span className="block text-[9px] text-black/50">online</span>
                      </span>
                      <Video className="h-4 w-4 text-[#007aff]" />
                      <Phone className="ml-2 h-3.5 w-3.5 text-[#007aff]" />
                    </div>

                    {/* chat */}
                    <div className="space-y-2 bg-[#eef1f6] px-3 py-3">
                      <div className="mx-auto w-fit rounded-md bg-white px-2 py-0.5 text-[8px] font-semibold text-black/50 shadow-sm">
                        Today
                      </div>

                      {/* customer order bubble */}
                      <div className="ml-auto w-[88%] rounded-xl rounded-tr-sm bg-[#dcf8c6] p-2.5 text-[8.5px] leading-[1.5] text-black/85 shadow-sm">
                        <p>Hi Menuu, I&apos;m on the way to your branch.</p>
                        <p className="mt-1.5">
                          Name: Richard
                          <br />Contact: 0123456789
                          <br />Outlet: Taman Sea
                          <br />Status: Now · Pax: 2
                          <br />Notes: 5 min arrive
                        </p>
                        <p className="mt-1.5 font-semibold">Order Details:</p>
                        <p>
                          1× [A1] Curry Chicken Mee — RM 23.90
                          <br />• Yellow Mee · Normal spice
                          <br />• Dry Curry Sauce · Sambal x1 · No Onion
                        </p>
                        <p className="mt-1">
                          1× [C1] Nasi Lemak Ayam Rendang — RM 28.90
                          <br />1× [F3] Vegetable Pakora — RM 9.90
                          <br />1× [H1] Teh Tarik — RM 9.00 · Cold, less sweet
                        </p>
                        <p className="mt-1.5">
                          Subtotal: RM 71.70
                          <br />SST (6%): RM 4.30 · Svc (10%): RM 7.17
                        </p>
                        <p className="mt-1 text-[9px] font-bold">Grand Total: RM 83.17</p>
                        <p className="mt-1 flex items-center justify-end gap-1 text-[7.5px] text-black/45">
                          7:07 PM <CheckCheck className="h-2.5 w-2.5 text-[#34b7f1]" />
                        </p>
                      </div>

                      {/* Menuu rotating reply */}
                      <div className="w-fit max-w-[70%] rounded-xl rounded-tl-sm bg-white px-3 py-2 text-[11px] shadow-sm">
                        <RotatingReply />
                        <span className="ml-2 align-bottom text-[7.5px] text-black/40">7:08 PM</span>
                      </div>
                    </div>

                    {/* input bar — clean bottom edge, no swipe-up line */}
                    <div className="flex items-center gap-2 bg-[#f6f6f6] px-3 py-2.5">
                      <Plus className="h-4 w-4 text-[#007aff]" />
                      <span className="flex h-7 flex-1 items-center justify-end rounded-full border border-black/10 bg-white px-2">
                        <SmilePlus className="h-3.5 w-3.5 text-black/35" />
                      </span>
                      <Camera className="h-4 w-4 text-[#007aff]" />
                      <Mic className="h-4 w-4 text-[#007aff]" />
                    </div>
                  </div>
                </div>
                </div>
              </motion.div>
            </motion.div>

            {/* floating "Order received" card — center-left over the phone, scaled down */}
            <div className="absolute left-[6%] top-[30%] z-20 origin-left -translate-y-1/2 scale-[0.46] md:left-[3%] md:top-[46%] md:origin-center md:scale-[0.7]">
              <motion.div variants={boxIn}>
                <div className="animate-[wa-float_3.5s_ease-in-out_infinite]">
              <div className="flex items-center gap-3 rounded-2xl bg-white p-3.5 pr-5 shadow-[0_18px_45px_rgba(8,17,39,0.18)]">
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-xl text-white"
                  style={{ background: C.primary }}
                >
                  <CalendarClock className="h-5 w-5" />
                </span>
                <span className="leading-tight">
                  <span className="block text-sm font-bold text-heading">{w.received}</span>
                  <span className="block text-xs text-slate">{w.receivedNote}</span>
                </span>
              </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
