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
 * Global ambient nature sound.
 *
 * The ambience is generated live with the Web Audio API rather than streamed
 * from a binary file. Filtered brown-noise forms a distant river + soft wind
 * bed; very occasional, quiet sine "chirps" stand in for tropical birds at
 * randomised intervals. Because it is generative it loops forever with no
 * audible start/end seam, ships zero audio bytes, and can never "fail to load".
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
  private dropTimer: ReturnType<typeof setTimeout> | null = null;
  private musicTimer: ReturnType<typeof setTimeout> | null = null;
  // Soft pentatonic (slendro-inspired) set for the gentle gamelan/flute layer.
  private SLENDRO = [396, 462, 528, 594, 693];
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

  private noiseBuffer(ctx: AudioContext) {
    const len = ctx.sampleRate * 4;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < len; i++) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02; // brown-ish noise
      d[i] = last * 3.4;
    }
    return buf;
  }

  // A looping noise source through a filter into a gain, returned for further
  // modulation. Each layer gets its own source from the shared buffer.
  private layer(buf: AudioBuffer, type: BiquadFilterType, freq: number, q: number, gain: number) {
    const ctx = this.ctx!;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    const filt = ctx.createBiquadFilter();
    filt.type = type;
    filt.frequency.value = freq;
    filt.Q.value = q;
    const g = ctx.createGain();
    g.gain.value = gain;
    src.connect(filt);
    filt.connect(g);
    g.connect(this.master!);
    src.start();
    return { filt, g };
  }

  // A slow sine LFO added onto an AudioParam, for gentle natural variation.
  private lfo(freq: number, depth: number, target: AudioParam) {
    const ctx = this.ctx!;
    const osc = ctx.createOscillator();
    osc.frequency.value = freq;
    const amp = ctx.createGain();
    amp.gain.value = depth;
    osc.connect(amp);
    amp.connect(target);
    osc.start();
  }

  private buildBed() {
    const ctx = this.ctx!;
    const buf = this.noiseBuffer(ctx);

    // River — the calm, continuous foundation (most noticeable layer).
    this.layer(buf, "lowpass", 470, 0.5, 0.55);

    // Soft rain — light tropical drizzle, a supporting hiss that breathes slowly.
    const rain = this.layer(buf, "highpass", 1900, 0.4, 0.2);
    const rainLp = ctx.createBiquadFilter(); // tame the very top so it's warm, not sharp
    rainLp.type = "lowpass";
    rainLp.frequency.value = 6500;
    rain.filt.disconnect();
    rain.filt.connect(rainLp);
    rainLp.connect(rain.g);
    this.lfo(0.05, 0.06, rain.g.gain); // gentle softer/stronger waves

    // Leaves & branches — gentle foliage rustle in slow waves (replaces wind).
    const leaves = this.layer(buf, "bandpass", 2600, 0.6, 0.15);
    this.lfo(0.08, 0.09, leaves.g.gain); // rustle comes in gentle waves
    this.lfo(0.06, 600, leaves.filt.frequency); // subtle movement

    // (Standalone wind removed — no blowing-air audio. The foliage rustle above
    // still gives a gentle "trees & leaves moving" feel without a wind recording.)

    this.built = true;
    this.scheduleBird();
    this.scheduleDrop();
    this.scheduleMusic();
  }

  // ----- Raindrops landing on still water (occasional soft plips) -----
  private waterDrop() {
    const ctx = this.ctx;
    const out = this.master;
    if (!ctx || !out || document.hidden) return;
    const t = ctx.currentTime;
    const o = ctx.createOscillator();
    o.type = "sine";
    const f0 = 680 + Math.random() * 520;
    o.frequency.setValueAtTime(f0, t);
    o.frequency.exponentialRampToValueAtTime(f0 * 0.42, t + 0.09);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.05, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
    o.connect(g);
    g.connect(out);
    o.start(t);
    o.stop(t + 0.22);
  }
  private scheduleDrop() {
    const delay = 2200 + Math.random() * 4200; // irregular 2.2–6.4s
    this.dropTimer = setTimeout(() => {
      this.waterDrop();
      this.scheduleDrop();
    }, delay);
  }

  // ----- Subtle traditional Indonesian layer: gamelan bells + bamboo flute -----
  private gamelanNote(octave = 1) {
    const ctx = this.ctx;
    const out = this.master;
    if (!ctx || !out || document.hidden) return;
    const t = ctx.currentTime;
    const base = this.SLENDRO[Math.floor(Math.random() * this.SLENDRO.length)] * octave;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.03, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 1.7); // long, soft metallic decay
    ([
      [1, "triangle"],
      [2.01, "sine"],
      [2.76, "sine"],
    ] as [number, OscillatorType][]).forEach(([mult, type]) => {
      const o = ctx.createOscillator();
      o.type = type;
      o.frequency.value = base * mult;
      const og = ctx.createGain();
      og.gain.value = mult === 1 ? 0.6 : 0.16;
      o.connect(og);
      og.connect(g);
      o.start(t);
      o.stop(t + 1.8);
    });
    g.connect(out);
  }
  private fluteNote() {
    const ctx = this.ctx;
    const out = this.master;
    if (!ctx || !out || document.hidden) return;
    const t = ctx.currentTime;
    const base = this.SLENDRO[Math.floor(Math.random() * this.SLENDRO.length)] * 2;
    const o = ctx.createOscillator();
    o.type = "sine";
    o.frequency.value = base;
    const vib = ctx.createOscillator();
    vib.frequency.value = 5;
    const vibg = ctx.createGain();
    vibg.gain.value = 4;
    vib.connect(vibg);
    vibg.connect(o.frequency);
    vib.start(t);
    vib.stop(t + 1.7);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(0.022, t + 0.28); // breathy, soft attack
    g.gain.setValueAtTime(0.022, t + 1.0);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 1.6);
    o.connect(g);
    g.connect(out);
    o.start(t);
    o.stop(t + 1.7);
  }
  private scheduleMusic() {
    const delay = 6500 + Math.random() * 9000; // sparse 6.5–15.5s, no obvious beat
    this.musicTimer = setTimeout(() => {
      if (!document.hidden) {
        const r = Math.random();
        if (r < 0.45) {
          this.gamelanNote();
        } else if (r < 0.74) {
          this.gamelanNote();
          setTimeout(() => this.gamelanNote(), 420 + Math.random() * 320);
        } else if (r < 0.92) {
          this.fluteNote();
        } else {
          this.gamelanNote(0.5); // occasional warm low tone
        }
      }
      this.scheduleMusic();
    }, delay);
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
