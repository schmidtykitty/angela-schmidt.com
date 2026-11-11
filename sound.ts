let ctx: AudioContext | null = null;
function ac() {
  if (!ctx) {
    const C = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!C) return null;
    ctx = new C();
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function noise(c: AudioContext, dur: number) {
  const len = Math.floor(c.sampleRate * dur);
  const buf = c.createBuffer(1, len, c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const s = c.createBufferSource();
  s.buffer = buf;
  return s;
}

/** a short dry swish of card through air */
export function paperFlick() {
  const c = ac();
  if (!c) return;
  const s = noise(c, 0.16);
  const f = c.createBiquadFilter();
  f.type = "bandpass";
  f.Q.value = 0.9;
  f.frequency.setValueAtTime(900, c.currentTime);
  f.frequency.exponentialRampToValueAtTime(3200, c.currentTime + 0.14);
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, c.currentTime);
  g.gain.exponentialRampToValueAtTime(0.22, c.currentTime + 0.03);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.16);
  s.connect(f).connect(g).connect(c.destination);
  s.start();
}

/** the small metal tick of a brad turning */
export function bradTick() {
  const c = ac();
  if (!c) return;
  const o = c.createOscillator();
  o.type = "triangle";
  o.frequency.setValueAtTime(2400, c.currentTime);
  o.frequency.exponentialRampToValueAtTime(1300, c.currentTime + 0.05);
  const g = c.createGain();
  g.gain.setValueAtTime(0.12, c.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.07);
  o.connect(g).connect(c.destination);
  o.start();
  o.stop(c.currentTime + 0.08);
}

/** a soft wooden thump: the hanko meeting paper */
export function stampThump() {
  const c = ac();
  if (!c) return;
  const o = c.createOscillator();
  o.type = "sine";
  o.frequency.setValueAtTime(180, c.currentTime);
  o.frequency.exponentialRampToValueAtTime(70, c.currentTime + 0.12);
  const g = c.createGain();
  g.gain.setValueAtTime(0.35, c.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.18);
  o.connect(g).connect(c.destination);
  o.start();
  o.stop(c.currentTime + 0.2);
}

export type Genre = "disco" | "funk" | "soul" | "deephouse" | "techno" | "motown" | "boogie";

type Pattern = {
  label: string;
  bpm: number;
  swing?: number; // 0..0.5 of a sixteenth, pushes the off sixteenths late
  kick: string; snare: string; hat: string; open?: string; tamb?: string; clap?: string;
  bass: (number | null)[]; // midi per sixteenth, null = rest
  bassTone: "saw" | "slap" | "round";
  chords: { at: number; notes: number[]; len: number }[]; // per bar, length in sixteenths
  chordTone: "stab" | "organ" | "piano";
  bars?: number; // how many bars bass/chords span (default 1)
};

const _ = null;
export const GENRES: Record<Genre, Pattern> = {
  disco: {
    label: "Disco", bpm: 120,
    kick: "x...x...x...x...", snare: "....x.......x...", hat: "x.x.x.x.x.x.x.x.", open: "..x...x...x...x.",
    bass: [45, _, 57, _, 45, _, 57, _, 43, _, 55, _, 43, _, 55, _], bassTone: "saw",
    chords: [{ at: 2, notes: [69, 72, 76], len: 1 }, { at: 6, notes: [69, 72, 76], len: 1 }, { at: 10, notes: [67, 71, 74], len: 1 }, { at: 14, notes: [67, 71, 74], len: 1 }], chordTone: "stab",
  },
  funk: {
    label: "Funk", bpm: 102, swing: 0.12,
    kick: "x.....x..x......", snare: "....x..x.x..x..x", hat: "xxxxxxxxxxxxxxxx",
    bass: [40, _, _, 52, _, _, 40, _, 43, 40, _, _, 52, _, 50, 52], bassTone: "slap",
    chords: [{ at: 3, notes: [64, 67, 71, 74], len: 1 }, { at: 7, notes: [64, 67, 71, 74], len: 1 }, { at: 11, notes: [66, 69, 73, 76], len: 1 }], chordTone: "stab",
  },
  soul: {
    label: "Soul", bpm: 84, swing: 0.2,
    kick: "x.......x.x.....", snare: "....x.......x...", hat: "x.x.x.x.x.x.x.x.",
    bass: [48, _, _, _, _, _, 52, _, 45, _, _, _, 43, _, 47, _], bassTone: "round",
    chords: [{ at: 0, notes: [60, 64, 67, 71], len: 8 }, { at: 8, notes: [57, 60, 64, 67], len: 8 }], chordTone: "organ",
  },
  motown: {
    label: "Motown", bpm: 124,
    kick: "x...x...x...x...", snare: "x...x...x...x...", hat: "................", tamb: "x.x.x.x.x.x.x.x.", clap: "....x.......x...",
    bass: [43, _, _, 47, 50, _, _, 50, 48, _, _, 52, 55, _, 54, _], bassTone: "round",
    chords: [{ at: 2, notes: [67, 71, 74], len: 2 }, { at: 6, notes: [67, 71, 74], len: 2 }, { at: 10, notes: [72, 76, 79], len: 2 }, { at: 14, notes: [72, 76, 79], len: 2 }], chordTone: "piano",
  },
  deephouse: {
    label: "Deep house", bpm: 122,
    kick: "x...x...x...x...", snare: "................", hat: ".xxx.xxx.xxx.xxx", open: "..x...x...x...x.", clap: "....x.......x...",
    bass: [_, _, 45, _, _, _, 45, 48, _, _, 43, _, _, _, 43, _], bassTone: "round",
    chords: [{ at: 3, notes: [57, 60, 64, 67, 71], len: 2 }, { at: 10, notes: [57, 60, 64, 67, 71], len: 2 }, { at: 14, notes: [55, 59, 62, 65, 69], len: 2 }], chordTone: "organ",
  },
  techno: {
    label: "Techno", bpm: 130,
    kick: "x...x...x...x...", snare: "................", hat: "xxxxxxxxxxxxxxxx", open: "..x...x...x...x.", clap: "............x...",
    bass: [_, 33, 33, 45, _, 33, 33, 45, _, 33, 33, 45, _, 33, 36, 45], bassTone: "slap",
    chords: [{ at: 6, notes: [57, 60, 64], len: 1 }, { at: 14, notes: [57, 60, 63], len: 1 }], chordTone: "stab",
  },
  boogie: {
    label: "Boogie", bpm: 112, swing: 0.28,
    kick: "x...x...x...x...", snare: "....x.......x...", hat: "x.x.x.x.x.x.x.x.", clap: "....x.......x..x",
    bass: [38, _, 50, _, _, 38, 50, _, 41, _, 53, _, _, 41, 53, 52], bassTone: "saw",
    chords: [{ at: 0, notes: [62, 65, 69, 72], len: 3 }, { at: 6, notes: [62, 65, 69, 72], len: 2 }, { at: 8, notes: [65, 69, 72, 76], len: 3 }, { at: 14, notes: [65, 69, 72, 76], len: 2 }], chordTone: "stab",
  },
};
export const GENRE_ORDER: Genre[] = ["disco", "funk", "soul", "deephouse", "techno", "motown"];

const hz = (m: number) => 440 * Math.pow(2, (m - 69) / 12);

/** a little synthesized band that plays one genre on a loop. Returns stop(). */
export function startGroove(genre: Genre): () => void {
  const c = ac();
  if (!c) return () => {};
  const P = GENRES[genre];
  const out = c.createGain();
  out.gain.value = 0;
  out.gain.setTargetAtTime(0.5, c.currentTime, 0.05);
  out.connect(c.destination);
  const six = 60 / P.bpm / 4;
  let step = 0;
  let next = c.currentTime + 0.06;

  const kick = (t: number) => {
    const o = c.createOscillator(), g = c.createGain();
    o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(45, t + 0.12);
    g.gain.setValueAtTime(0.9, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
    o.connect(g).connect(out); o.start(t); o.stop(t + 0.25);
  };
  const snare = (t: number, v = 1) => {
    const s = noise(c, 0.18), f = c.createBiquadFilter(), g = c.createGain();
    f.type = "bandpass"; f.frequency.value = 1800; f.Q.value = 0.7;
    g.gain.setValueAtTime(0.32 * v, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
    s.connect(f).connect(g).connect(out); s.start(t);
    const o = c.createOscillator(), og = c.createGain();
    o.type = "triangle"; o.frequency.setValueAtTime(220, t); o.frequency.exponentialRampToValueAtTime(160, t + 0.08);
    og.gain.setValueAtTime(0.18 * v, t); og.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
    o.connect(og).connect(out); o.start(t); o.stop(t + 0.1);
  };
  const hiss = (t: number, dur: number, freq: number, vol: number, band = false) => {
    const s = noise(c, dur), f = c.createBiquadFilter(), g = c.createGain();
    f.type = band ? "bandpass" : "highpass"; f.frequency.value = freq; if (band) f.Q.value = 2;
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    s.connect(f).connect(g).connect(out); s.start(t);
  };
  const clap = (t: number) => { [0, 0.012, 0.026].forEach((d) => hiss(t + d, 0.09, 1400, 0.2, true)); };
  const bass = (t: number, m: number) => {
    const o = c.createOscillator(), f = c.createBiquadFilter(), g = c.createGain();
    const len = P.bassTone === "round" ? six * 1.8 : six * 0.9;
    o.type = P.bassTone === "round" ? "triangle" : P.bassTone === "slap" ? "square" : "sawtooth";
    o.frequency.value = hz(m);
    f.type = "lowpass";
    if (P.bassTone === "slap") { f.frequency.setValueAtTime(2200, t); f.frequency.exponentialRampToValueAtTime(300, t + 0.12); f.Q.value = 6; }
    else f.frequency.value = P.bassTone === "round" ? 700 : 480;
    const peak = P.bassTone === "round" ? 0.32 : 0.2;
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + 0.012); g.gain.exponentialRampToValueAtTime(0.001, t + len);
    o.connect(f).connect(g).connect(out); o.start(t); o.stop(t + len + 0.02);
  };
  const chord = (t: number, notes: number[], len: number) => {
    const dur = P.chordTone === "stab" ? Math.min(0.14, six * len) : six * len * 0.95;
    const g = c.createGain(), f = c.createBiquadFilter();
    f.type = "lowpass"; f.frequency.value = P.chordTone === "organ" ? 1800 : 3200;
    const vol = P.chordTone === "organ" ? 0.06 : 0.07;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + (P.chordTone === "organ" ? 0.06 : 0.008));
    if (P.chordTone === "organ") g.gain.setValueAtTime(vol, t + dur - 0.06);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    g.connect(f).connect(out);
    notes.forEach((m) => {
      const types: OscillatorType[] = P.chordTone === "organ" ? ["sine", "triangle"] : P.chordTone === "piano" ? ["triangle"] : ["sawtooth"];
      types.forEach((ty, k) => {
        const o = c.createOscillator();
        o.type = ty; o.frequency.value = hz(m) * (k ? 2 : 1); o.detune.value = (Math.random() - 0.5) * 8;
        o.connect(g); o.start(t); o.stop(t + dur + 0.02);
      });
    });
  };
  const on = (p: string | undefined, i: number) => !!p && p[i] === "x";

  const iv = window.setInterval(() => {
    while (next < c.currentTime + 0.2) {
      const i = step % 16;
      const t = next + (i % 2 ? (P.swing ?? 0) * six : 0);
      if (on(P.kick, i)) kick(t);
      if (on(P.snare, i)) snare(t, P.snare === "x...x...x...x..." && i % 8 === 0 ? 0.6 : i % 4 === 0 ? 1 : 0.45);
      if (on(P.hat, i)) hiss(t, 0.04, 7500, i % 4 === 0 ? 0.12 : 0.18);
      if (on(P.open, i)) hiss(t, 0.18, 6500, 0.14);
      if (on(P.tamb, i)) hiss(t, 0.11, 9000, 0.16, true);
      if (on(P.clap, i)) clap(t);
      const b = P.bass[i];
      if (b != null) bass(t, b);
      P.chords.forEach((ch) => { if (ch.at === i) chord(t, ch.notes, ch.len); });
      step++;
      next += six;
    }
  }, 40);
  return () => {
    window.clearInterval(iv);
    out.gain.setTargetAtTime(0, c.currentTime, 0.06);
    setTimeout(() => out.disconnect(), 400);
  };
}

/** a tennis ball off the strings: a hollow "pock", one of four slightly different pitches each time */
const POCKS = [
  { f: 620, n: 2300, d: 0.07 },
  { f: 560, n: 2000, d: 0.08 },
  { f: 690, n: 2600, d: 0.065 },
  { f: 520, n: 1800, d: 0.085 },
];
let lastPock = -1;
export function pock() {
  const c = ac();
  if (!c) return;
  let i = Math.floor(Math.random() * POCKS.length);
  if (i === lastPock) i = (i + 1) % POCKS.length;
  lastPock = i;
  const p = POCKS[i], t0 = c.currentTime;
  // the hollow body of the ball
  const o = c.createOscillator();
  o.type = "sine";
  o.frequency.setValueAtTime(p.f * 1.5, t0);
  o.frequency.exponentialRampToValueAtTime(p.f, t0 + 0.02);
  const og = c.createGain();
  og.gain.setValueAtTime(0.0001, t0);
  og.gain.exponentialRampToValueAtTime(0.5, t0 + 0.003);
  og.gain.exponentialRampToValueAtTime(0.0001, t0 + p.d);
  o.connect(og).connect(c.destination);
  o.start(t0); o.stop(t0 + p.d + 0.02);
  // the felt-and-strings snap
  const s = noise(c, 0.04);
  const f = c.createBiquadFilter();
  f.type = "bandpass"; f.frequency.value = p.n; f.Q.value = 1.4;
  const sg = c.createGain();
  sg.gain.setValueAtTime(0.35, t0);
  sg.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.03);
  s.connect(f).connect(sg).connect(c.destination);
  s.start(t0);
}

/** one soft whoosh of air, like a blind rolling up */
export function whoosh(dur = 0.45) {
  const c = ac();
  if (!c) return;
  const t0 = c.currentTime;
  const s = noise(c, dur);
  const f = c.createBiquadFilter();
  f.type = "bandpass";
  f.Q.value = 0.8;
  f.frequency.setValueAtTime(500, t0);
  f.frequency.exponentialRampToValueAtTime(1800, t0 + dur * 0.5);
  f.frequency.exponentialRampToValueAtTime(700, t0 + dur);
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(0.3, t0 + dur * 0.4);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  s.connect(f).connect(g).connect(c.destination);
  s.start(t0);
}

/** a roller-blind cord: an airy swoosh with the quick ratchet clicks of the bead chain, rising down or falling up */
export function blindZip(dir: "down" | "up" = "down", dur = 0.4) {
  const c = ac();
  if (!c) return;
  const t0 = c.currentTime;
  const s = noise(c, dur + 0.05);
  const f = c.createBiquadFilter();
  f.type = "bandpass";
  f.Q.value = 1.2;
  const [a, b] = dir === "down" ? [700, 2600] : [2600, 600];
  f.frequency.setValueAtTime(a, t0);
  f.frequency.exponentialRampToValueAtTime(b, t0 + dur);
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(0.28, t0 + dur * 0.25);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  s.connect(f).connect(g).connect(c.destination);
  s.start(t0);
  // the chain's little clicks, bunched faster in the middle of the pull
  const n = Math.round(dur * 26);
  for (let i = 0; i < n; i++) {
    const k = i / n;
    const at = t0 + dur * (k + 0.06 * Math.sin(k * Math.PI));
    const o = c.createOscillator();
    o.type = "square";
    o.frequency.setValueAtTime((dir === "down" ? 1800 + k * 900 : 2700 - k * 1100), at);
    const cg = c.createGain();
    const lvl = 0.035 * Math.sin(Math.PI * Math.min(1, k + 0.1));
    cg.gain.setValueAtTime(Math.max(0.0001, lvl), at);
    cg.gain.exponentialRampToValueAtTime(0.0001, at + 0.012);
    o.connect(cg).connect(c.destination);
    o.start(at);
    o.stop(at + 0.015);
  }
}

/** a soft cat purr: low rumble that flutters about 24 times a second */
export function purr(dur = 0.9) {
  const c = ac();
  if (!c) return;
  const t0 = c.currentTime;
  // the rumble: a buzzy low tone, filtered so laptop and phone speakers still carry it
  const o = c.createOscillator();
  o.type = "sawtooth";
  o.frequency.setValueAtTime(110, t0);
  o.frequency.linearRampToValueAtTime(96, t0 + dur);
  const s = noise(c, dur);
  const f = c.createBiquadFilter();
  f.type = "lowpass";
  f.frequency.value = 900;
  f.Q.value = 0.7;
  // the flutter of a purr, about 26 times a second
  const g = c.createGain();
  g.gain.value = 0.5;
  const lfo = c.createOscillator();
  lfo.type = "sine";
  lfo.frequency.value = 26;
  const depth = c.createGain();
  depth.gain.value = 0.5;
  lfo.connect(depth).connect(g.gain);
  const nGain = c.createGain();
  nGain.gain.value = 0.5;
  const env = c.createGain();
  env.gain.setValueAtTime(0.0001, t0);
  env.gain.exponentialRampToValueAtTime(0.35, t0 + 0.12);
  env.gain.setValueAtTime(0.35, t0 + dur * 0.6);
  env.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(f);
  s.connect(nGain).connect(f);
  f.connect(g).connect(env).connect(c.destination);
  o.start(t0); lfo.start(t0); s.start(t0);
  o.stop(t0 + dur); lfo.stop(t0 + dur); s.stop(t0 + dur);
}

export function unlock() {
  ac();
}
