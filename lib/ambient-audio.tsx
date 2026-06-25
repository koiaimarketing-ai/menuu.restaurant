"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

/**
 * Global ambient bird sound.
 *
 * The ambience is generated live with the Web Audio API rather than streamed
 * from a binary file. Very occasional, quiet sine "chirps" stand in for tropical
 * birds at randomised intervals. (Rain, wind, river and the gamelan/flute layers
 * were removed — bird ambience only.) Because it is generative it ships zero
 * audio bytes and can never "fail to load".
 *
 * A single engine instance is created lazily on the first real user gesture
 * (the entrance button, or any later interaction) — never autoplayed.
 */

const PREF_KEY = "wj-sound"; // localStorage: "on" | "off"
const TARGET_VOLUME = 0.08; // very soft, comfortable overall ambience (6–9%)

class AmbientEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private duck: GainNode | null = null;
  private birdTimer: ReturnType<typeof setTimeout> | null = null;
  built = false;

  private ensure() {
    if (this.ctx) return;
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    const ctx = new AC();
    const master = ctx.createGain();
    master.gain.value = 0;
    const duck = ctx.createGain();
    duck.gain.value = 1;
    master.connect(duck);
    duck.connect(ctx.destination);
    this.ctx = ctx;
    this.master = master;
    this.duck = duck;
    this.buildBed();
  }

  private buildBed() {
    // Bird ambience only — no rain, wind, river or music layers.
    this.built = true;
    this.scheduleBird();
  }

  private scheduleBird() {
    const delay = 7000 + Math.random() * 17000; // 7–24s, irregular
    this.birdTimer = setTimeout(() => {
      this.chirp();
      this.scheduleBird();
    }, delay);
  }

  private chirp() {
    const ctx = this.ctx;
    const out = this.master;
    if (!ctx || !out || document.hidden) return;
    const t = ctx.currentTime;
    const notes = 2 + Math.floor(Math.random() * 2);
    for (let n = 0; n < notes; n++) {
      const start = t + n * (0.11 + Math.random() * 0.07);
      const o = ctx.createOscillator();
      o.type = "sine";
      const base = 1700 + Math.random() * 1500;
      o.frequency.setValueAtTime(base, start);
      o.frequency.exponentialRampToValueAtTime(base * 1.16, start + 0.05);
      o.frequency.exponentialRampToValueAtTime(base * 0.9, start + 0.12);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, start);
      g.gain.exponentialRampToValueAtTime(0.075, start + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, start + 0.16);
      o.connect(g);
      g.connect(out);
      o.start(start);
      o.stop(start + 0.22);
    }
  }

  async start() {
    this.ensure();
    if (this.ctx!.state === "suspended") {
      try {
        await this.ctx!.resume();
      } catch {
        /* ignore */
      }
    }
  }

  fadeTo(value: number, seconds: number) {
    if (!this.ctx || !this.master) return;
    const now = this.ctx.currentTime;
    const g = this.master.gain;
    g.cancelScheduledValues(now);
    g.setValueAtTime(Math.max(g.value, 0.0001), now);
    g.linearRampToValueAtTime(Math.max(value, 0.0001), now + seconds);
  }

  setDucked(on: boolean) {
    if (!this.ctx || !this.duck) return;
    const now = this.ctx.currentTime;
    this.duck.gain.cancelScheduledValues(now);
    this.duck.gain.linearRampToValueAtTime(on ? 0.12 : 1, now + 0.6);
  }
}

type AmbientCtx = {
  /** true while ambience is audibly on (user has it enabled). */
  enabled: boolean;
  /** Start/resume the ambience and persist the "on" preference. */
  enable: (fadeSeconds?: number) => Promise<void>;
  /** Mute the ambience and persist the "off" preference. */
  disable: () => void;
  toggle: () => void;
};

const Ctx = createContext<AmbientCtx | null>(null);

export function AmbientAudioProvider({ children }: { children: React.ReactNode }) {
  const engineRef = useRef<AmbientEngine | null>(null);
  const [enabled, setEnabled] = useState(false);
  // Preference: "off" only if the user explicitly muted; otherwise treated as on.
  const prefRef = useRef<"on" | "off">("on");

  const getEngine = () => {
    if (!engineRef.current) engineRef.current = new AmbientEngine();
    return engineRef.current;
  };

  const enable = useCallback(async (fadeSeconds = 3) => {
    prefRef.current = "on";
    try {
      localStorage.setItem(PREF_KEY, "on");
    } catch {
      /* ignore */
    }
    try {
      const e = getEngine();
      await e.start();
      e.fadeTo(TARGET_VOLUME, fadeSeconds);
      setEnabled(true);
    } catch {
      // Audio unavailable (e.g. no Web Audio) — enter silently, no error.
      setEnabled(false);
    }
  }, []);

  const disable = useCallback(() => {
    prefRef.current = "off";
    try {
      localStorage.setItem(PREF_KEY, "off");
    } catch {
      /* ignore */
    }
    engineRef.current?.fadeTo(0, 0.8);
    setEnabled(false);
  }, []);

  const toggle = useCallback(() => {
    if (enabled) disable();
    else void enable(2);
  }, [enabled, disable, enable]);

  // Load the saved preference once.
  useEffect(() => {
    try {
      if (localStorage.getItem(PREF_KEY) === "off") prefRef.current = "off";
    } catch {
      /* ignore */
    }
  }, []);

  // Lower the ambience when the tab is hidden; restore it on return.
  useEffect(() => {
    const onVis = () => {
      const e = engineRef.current;
      if (!e || !enabled) return;
      e.fadeTo(document.hidden ? 0.0 : TARGET_VOLUME, document.hidden ? 1 : 1.5);
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [enabled]);

  // Duck the ambience when any other <audio>/<video> plays; resume after.
  useEffect(() => {
    const isMedia = (t: EventTarget | null) =>
      t instanceof HTMLElement && (t.tagName === "VIDEO" || t.tagName === "AUDIO");
    const onPlay = (e: Event) => {
      if (isMedia(e.target)) engineRef.current?.setDucked(true);
    };
    const onStop = (e: Event) => {
      if (isMedia(e.target)) engineRef.current?.setDucked(false);
    };
    document.addEventListener("play", onPlay, true);
    document.addEventListener("pause", onStop, true);
    document.addEventListener("ended", onStop, true);
    return () => {
      document.removeEventListener("play", onPlay, true);
      document.removeEventListener("pause", onStop, true);
      document.removeEventListener("ended", onStop, true);
    };
  }, []);

  // The entrance screen shows on every full load and is the gesture that starts
  // (or, per saved preference, keeps muted) the ambience — so no separate
  // autoplay-resume handler is needed here.

  return (
    <Ctx.Provider value={{ enabled, enable, disable, toggle }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAmbient(): AmbientCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAmbient must be used within AmbientAudioProvider");
  return ctx;
}
