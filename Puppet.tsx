import { useEffect, useImperativeHandle, useLayoutEffect, useRef, useState, forwardRef } from "react";
import { gsap } from "gsap";
import doll from "./doll-meta.json";
const J0 = doll.joints as Record<string, number[]>;
import dollIssey from "./doll-issey-f-meta.json";
import dollBallet from "./doll-ballet-f-meta.json";
import dollCycling from "./doll-cycling-f-meta.json";
import dollCeramics from "./doll-ceramics-f-meta.json";
import dollChef from "./doll-chef-f-meta.json";
import dollParty from "./doll-party-f-meta.json";
import cat from "./demon-meta.json";
import { img } from "./content";
import { paperFlick, bradTick, purr, pock } from "./sound";

export type SectionId = "hello" | "portfolio" | "writing" | "books" | "ballet" | "side" | "contact";
export type PoseId = SectionId | "bow" | "peek";

type Angles = { uaL: number; faL: number; uaR: number; faR: number; thL: number; shL: number; thR: number; shR: number; y: number; r: number };
type CatPose = { front: number; back: number; tail: number; y: number; r: number; x?: number };

export const POSES: Record<SectionId | "bow" | "peek", Angles> = {
  // a section is open: arms relaxed at her sides, leaning in from the edge to peek
  peek: { uaL: -58, faL: -8, uaR: 58, faR: 8, thL: 2, shL: 0, thR: -2, shR: 0, y: 0, r: 5 },
  hello: { uaL: 8, faL: 6, uaR: -8, faR: -6, thL: 0, shL: 0, thR: 0, shR: 0, y: 0, r: 0 },
  portfolio: { uaL: 98, faL: 22, uaR: 26, faR: 100, thL: -6, shL: 4, thR: 8, shR: -4, y: 0, r: -2 },
  writing: { uaL: 108, faL: -14, uaR: 30, faR: 62, thL: 46, shL: -66, thR: -24, shR: 66, y: -80, r: -6 },
  books: { uaL: -24, faL: -118, uaR: 24, faR: 118, thL: -9, shL: 5, thR: 18, shR: -26, y: 0, r: 0 },
  ballet: { uaL: 38, faL: 14, uaR: -104, faR: -24, thL: 78, shL: 2, thR: 3, shR: 0, y: -24, r: -5 },
  side: { uaL: 64, faL: 16, uaR: 70, faR: 150, thL: 100, shL: 6, thR: 6, shR: 0, y: -14, r: 8 },
  bow: { uaL: -28, faL: -24, uaR: -46, faR: -30, thL: -4, shL: 0, thR: -28, shR: 82, y: 18, r: -3 },
  contact: { uaL: 70, faL: 12, uaR: -62, faR: -70, thL: 0, shL: 0, thR: 10, shR: -8, y: 0, r: 2 },
};
// each outfit's own home pose, struck when she changes and held on About
const OUTFIT_POSES: Record<Outfit, Angles> = {
  // Issey, at work: both hands on her hips
  issey: { uaL: 2, faL: -86, uaR: -2, faR: 86, thL: -3, shL: 0, thR: 6, shR: 0, y: 0, r: -2 },
  // ballet: arms rounded overhead in fifth, one foot drawn up to the knee in retiré
  ballet: { uaL: 34, faL: -14, uaR: -34, faR: 14, thL: -2, shL: 0, thR: -40, shR: 124, y: -14, r: 1 },
  // bike ride: hands forward on the bars, one knee driving up on the pedal
  cycling: { uaL: -18, faL: -112, uaR: 18, faR: 112, thL: 32, shL: -78, thR: -4, shR: 4, y: -26, r: -3 },
  // ceramics: offering you the tea cup, kept level, the other hand on her hip
  ceramics: { uaL: 30, faL: -24, uaR: -2, faR: 86, thL: 0, shL: 0, thR: 4, shR: 0, y: 0, r: 2 },
  // soup day: bench scraper raised mid-chop, the other hand steadying the board
  chef: { uaL: 34, faL: 74, uaR: 18, faR: 104, thL: -2, shL: 0, thR: 2, shR: 0, y: 0, r: -1 },
  // the one dance-party look: all black, arms up and ready
  party: { uaL: 40, faL: 60, uaR: -40, faR: -60, thL: 4, shL: 0, thR: -4, shR: 0, y: 0, r: 0 },
};
// forearms turned over (1) so the back of the hand rests on the hip, thumb behind, like a real hand
const OUTFIT_FLIP: Record<Outfit, { L: number; R: number }> = {
  issey: { L: 0, R: 0 }, ballet: { L: 0, R: 0 }, cycling: { L: 0, R: 0 }, ceramics: { L: 0, R: 0 }, chef: { L: 0, R: 0 }, party: { L: 0, R: 0 },
};
// each forearm's own direction at rest, elbow to hand, so it can turn over along its length
const FA_AXIS = {
  L: (Math.atan2(J0.handL[1] - J0.elbowL[1], J0.handL[0] - J0.elbowL[0]) * 180) / Math.PI,
  R: (Math.atan2(J0.handR[1] - J0.elbowR[1], J0.handR[0] - J0.elbowR[0]) * 180) / Math.PI,
};
// her shoulder stand, from the upside-down photo: on her shoulders, arms flat on the floor, one foot pointed at the ceiling
const STAND: Angles = { uaL: 52, faL: 4, uaR: -52, faR: -4, thL: -24, shL: 0, thR: 18, shR: -110, y: -150, r: 180 };
// the dance floor: point up, hand on hip, swap, jumping jack
const DISCO: Angles[] = [
  { uaL: 34, faL: 104, uaR: -150, faR: -8, thL: 4, shL: 0, thR: -18, shR: 34, y: 0, r: 6 },
  { uaL: 150, faL: 8, uaR: -34, faR: -104, thL: 18, shL: -34, thR: -4, shR: 0, y: 0, r: -6 },
  { uaL: 34, faL: 104, uaR: -150, faR: -8, thL: 4, shL: 0, thR: -18, shR: 34, y: -10, r: 8 },
  { uaL: 120, faL: -30, uaR: -120, faR: 30, thL: 30, shL: -50, thR: -30, shR: 50, y: -60, r: 0 },
];
const PULL: Angles = { uaL: 112, faL: 12, uaR: -112, faR: -12, thL: 36, shL: -12, thR: -36, shR: 12, y: -10, r: 0 };

const CAT: Record<SectionId | "bow" | "bat" | "peek", CatPose> = {
  peek: { front: -6, back: 4, tail: 20, y: 0, r: 0 },
  hello: { front: 0, back: 0, tail: 0, y: 0, r: 0 },
  portfolio: { front: -12, back: 6, tail: -14, y: 0, r: -5 },
  writing: { front: -34, back: 30, tail: 18, y: -70, r: -8 },
  books: { front: -40, back: 34, tail: 10, y: 8, r: 2 },
  side: { front: -40, back: 0, tail: -30, y: 0, r: -3 },
  ballet: { front: -6, back: 10, tail: -22, y: 0, r: -2 },
  bow: { front: -8, back: 0, tail: -6, y: 0, r: 0 },
  contact: { front: -20, back: 4, tail: 24, y: 0, r: -2 },
  bat: { front: -70, back: 8, tail: 24, y: -6, r: -6 },
};

// stage box in doll pixel space
const OX = 220, OY = 180, SW = 1540, SH = 1840;
const PELVIS = { x: 516, y: 836 };
const STRING_END = 1462; // doll y where the tab hangs at rest
const MAX_PULL = 170; // doll px
const CAT_S = 0.29, CAT_X = 860, CAT_Y = 1328;

const J = doll.joints as Record<string, number[]>;
const P = doll.parts as Record<string, { x: number; y: number; w: number; h: number }>;
const CJ = cat.joints as Record<string, number[]>;
const CP = cat.parts as Record<string, { x: number; y: number; w: number; h: number }>;

export type Outfit = "issey" | "ballet" | "cycling" | "ceramics" | "chef" | "party";
type Parts = Record<string, { x: number; y: number; w: number; h: number }>;
const OUTFITS: Record<Outfit, { dir: string; parts: Parts }> = {
  issey: { dir: "doll-issey-f", parts: dollIssey.parts as Parts },
  ballet: { dir: "doll-ballet-f", parts: dollBallet.parts as Parts },
  cycling: { dir: "doll-cycling-f", parts: dollCycling.parts as Parts },
  ceramics: { dir: "doll-ceramics-f", parts: dollCeramics.parts as Parts },
  chef: { dir: "doll-chef-f", parts: dollChef.parts as Parts },
  party: { dir: "doll-party-f", parts: dollParty.parts as Parts },
};
function Piece({ name, alt = "", outfit = "issey", className = "" }: { name: string; alt?: string; outfit?: Outfit; className?: string }) {
  const o = OUTFITS[outfit];
  const p = o.parts[name] ?? o.parts.torso;
  return (
    <img
      className={`piece ${className}`}
      src={img(`${o.dir}/${name}.webp`)}
      alt={alt}
      draggable={false}
      style={{ left: p.x, top: p.y, width: p.w, height: p.h }}
    />
  );
}
function Brad({ at, size = 22 }: { at: number[]; size?: number }) {
  return <img className="brad" src={img("brad.webp")} alt="" draggable={false} style={{ left: at[0] - size / 2, top: at[1] - size / 2, width: size, height: size }} />;
}
function CatPiece({ name }: { name: string }) {
  const p = CP[name];
  return <img className="cat-piece" src={img(`demon/${name}.webp`)} alt="" draggable={false} style={{ left: p.x, top: p.y, width: p.w, height: p.h }} />;
}
const origin = (pt: number[]) => ({ transformOrigin: `${pt[0]}px ${pt[1]}px` });

/** the jointed doll; drawn twice: once in paper, once as her shadow on the wall */
function Rig({ R, p, outfit, face }: { R: (k: string) => (el: HTMLDivElement | null) => void; p: string; outfit: Outfit; face?: { tongue: boolean; on: (v: boolean) => void; flip: () => void } }) {
  return (
    <div className="layer" ref={R(p + "body")} style={origin([PELVIS.x, PELVIS.y])}>
      {/* legs sit behind the torso */}
      <div className="layer" ref={R(p + "thL")} style={origin(J.hipL)}>
        <Piece name="thighL" outfit={outfit} />
        <div className="layer" ref={R(p + "shL")} style={origin(J.kneeL)}>
          <Piece name="shinL" outfit={outfit} />
          <Brad at={J.kneeL} />
        </div>
      </div>
      <div className="layer" ref={R(p + "thR")} style={origin(J.hipR)}>
        <Piece name="thighR" outfit={outfit} />
        <div className="layer" ref={R(p + "shR")} style={origin(J.kneeR)}>
          <Piece name="shinR" outfit={outfit} />
          <Brad at={J.kneeR} />
        </div>
      </div>
      <Piece name="torso" outfit={outfit} />
      {face && <Piece name="torso-tongue" outfit={outfit} className={`tongue-torso ${face.tongue ? "is-on" : ""}`} />}
      {face && (
        <>
          {/* her face: point at it and she sticks her tongue out; double-tap her and she flips into a shoulder stand */}
          <div className="face-hit" style={{ left: 430, top: 150, width: 190, height: 250 }} onPointerEnter={() => face.on(true)} onPointerLeave={() => face.on(false)} onTouchStart={() => face.on(true)} onDoubleClick={face.flip} title="Double-tap me" />
          <div className="face-hit" style={{ left: 400, top: 420, width: 250, height: 400 }} onDoubleClick={face.flip} title="Double-tap me" />
        </>
      )}
      <Brad at={J.hipL} />
      <Brad at={J.hipR} />
      <div className="layer" ref={R(p + "uaL")} style={origin(J.shoulderL)}>
        <Piece name="upperarmL" outfit={outfit} />
        <div className="layer" ref={R(p + "faL")} style={origin(J.elbowL)}>
          <div className="layer" ref={R(p + "flL")} style={origin(J.elbowL)}>
            <Piece name="forearmL" outfit={outfit} />
          </div>
          <Brad at={J.elbowL} />
        </div>
        <Brad at={J.shoulderL} />
      </div>
      <div className="layer" ref={R(p + "uaR")} style={origin(J.shoulderR)}>
        <Piece name="upperarmR" outfit={outfit} />
        <div className="layer" ref={R(p + "faR")} style={origin(J.elbowR)}>
          <div className="layer" ref={R(p + "flR")} style={origin(J.elbowR)}>
            <Piece name="forearmR" outfit={outfit} />
          </div>
          <Brad at={J.elbowR} />
        </div>
        <Brad at={J.shoulderR} />
      </div>
    </div>
  );
}

export type PuppetHandle = { pose: (s: SectionId | "bow") => void; home: () => void };

/** 0 busy · 1 her shadow wanders off on its own · 2 Demon comes to play with the string · 3 Demon leaves the stage */
export type IdleStage = 0 | 1 | 2 | 3;
type Props = { section: SectionId | "bow"; nextLabel: string; onPulled: () => void; sound: boolean; onPullProgress?: (p: number) => void; idle?: IdleStage; disco?: boolean; peek?: boolean; bpm?: number; onSurprise?: () => void; outfit?: Outfit };

export const Puppet = forwardRef<PuppetHandle, Props>(function Puppet({ section, nextLabel, onPulled, sound, onPullProgress, idle = 0, disco = false, peek = false, bpm = 120, onSurprise, outfit = "issey" }, ref) {
  const dangleRef = useRef<HTMLDivElement>(null);
  const peekRef = useRef(peek);
  peekRef.current = peek;
  const discoRef = useRef(disco);
  discoRef.current = disco;
  const surpriseRef = useRef<HTMLButtonElement>(null);
  const progRef = useRef(onPullProgress);
  const leaping = useRef(false);
  progRef.current = onPullProgress;
  const box = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const refs = useRef<Record<string, HTMLDivElement | null>>({});
  const stringRef = useRef<HTMLDivElement>(null);
  const tabRef = useRef<HTMLButtonElement>(null);
  const cur = useRef<Angles>({ ...OUTFIT_POSES[outfit] });
  const outfitRef = useRef(outfit);
  const flip = useRef({ ...OUTFIT_FLIP[outfit] });
  const catCur = useRef<CatPose>({ ...CAT.hello, x: 0 });
  const catFlip = useRef(1);
  const catAway = useRef(false);
  const shCur = useRef<Angles>({ ...OUTFIT_POSES[outfit] });
  const shPull = useRef(0);
  const shSolo = useRef(false);
  const pull = useRef({ p: 0 });
  const scale = useRef(0.4);
  const soundRef = useRef(sound);
  soundRef.current = sound;
  const reduced = useRef(false);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const catTl = useRef<gsap.core.Timeline | null>(null);

  const render = () => {
    const a = cur.current, p = pull.current.p, r = refs.current;
    const v = (k: keyof Angles) => a[k] + PULL[k] * p;
    const set = (k: string, deg: number) => { const el = r[k]; if (el) el.style.transform = `rotate(${deg}deg)`; };
    set("uaL", v("uaL")); set("faL", v("faL")); set("uaR", v("uaR")); set("faR", v("faR"));
    set("thL", v("thL")); set("shL", v("shL")); set("thR", v("thR")); set("shR", v("shR"));
    if (r.body) r.body.style.transform = `translateY(${v("y")}px) rotate(${a.r}deg)`;
    const fl = (k: "L" | "R") => `rotate(${FA_AXIS[k]}deg) scaleY(${1 - 2 * flip.current[k]}) rotate(${-FA_AXIS[k]}deg)`;
    for (const pre of ["", "s_"]) {
      if (r[pre + "flL"]) r[pre + "flL"]!.style.transform = fl("L");
      if (r[pre + "flR"]) r[pre + "flR"]!.style.transform = fl("R");
    }
    if (!leaping.current) progRef.current?.(p);
    const pullPx = p * MAX_PULL;
    const top = PELVIS.y + v("y");
    if (stringRef.current) { stringRef.current.style.top = `${top}px`; stringRef.current.style.height = `${STRING_END + pullPx - top}px`; }
    if (tabRef.current) tabRef.current.style.transform = `translate(-50%, ${pullPx}px)`;
    const c = catCur.current, f = catFlip.current;
    if (r.cat) r.cat.style.transform = `translate(${CAT_X + (c.x ?? 0) + (f < 0 ? cat.w * CAT_S : 0)}px, ${CAT_Y + c.y}px) scale(${CAT_S * f}, ${CAT_S}) rotate(${c.r}deg)`;
    if (r.cFront) r.cFront.style.transform = `rotate(${c.front}deg)`;
    if (r.cBack) r.cBack.style.transform = `rotate(${c.back}deg)`;
    if (r.cTail) r.cTail.style.transform = `rotate(${c.tail + p * 25}deg)`;
  };

  // her shadow on the wall: it follows a beat late, and sometimes not at all
  const renderShadow = () => {
    const a = shCur.current, p = shPull.current, r = refs.current;
    const v = (k: keyof Angles) => a[k] + PULL[k] * p;
    const set = (k: string, deg: number) => { const el = r["s_" + k]; if (el) el.style.transform = `rotate(${deg}deg)`; };
    set("uaL", v("uaL")); set("faL", v("faL")); set("uaR", v("uaR")); set("faR", v("faR"));
    set("thL", v("thL")); set("shL", v("shL")); set("thR", v("thR")); set("shR", v("shR"));
    if (r.s_body) r.s_body.style.transform = `translateY(${v("y")}px) rotate(${a.r}deg)`;
  };
  useEffect(() => {
    let settled = false;
    const tick = () => {
      if (!shSolo.current) {
        const k = reduced.current ? 1 : 0.07;
        const a = shCur.current as Record<string, number>, b = cur.current as Record<string, number>;
        let d = Math.abs(pull.current.p - shPull.current) * 100;
        for (const key in a) { d += Math.abs(b[key] - a[key]); a[key] += (b[key] - a[key]) * k; }
        shPull.current += (pull.current.p - shPull.current) * k;
        if (d < 0.05) { if (settled) return; settled = true; } else settled = false;
      } else settled = false;
      renderShadow();
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // fit the stage to its box
  useLayoutEffect(() => {
    const el = box.current!;
    const fit = () => {
      const s = Math.min(el.clientWidth / SW, el.clientHeight / SH);
      scale.current = s;
      if (inner.current) inner.current.style.transform = `translate(-50%, -50%) scale(${s})`;
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reduced.current = mq.matches;
    render();
    // idle life: sway on the string, Demon's tail
    if (reduced.current) return;
    const sway = gsap.to(refs.current.sway, { rotation: 1.4, duration: 2.6, ease: "sine.inOut", yoyo: true, repeat: -1, transformOrigin: "516px 836px" });
    gsap.set(refs.current.sway, { rotation: -1.4 });
    const tail = gsap.to(refs.current.cTailIdle, { rotation: 9, duration: 1.4, ease: "sine.inOut", yoyo: true, repeat: -1, transformOrigin: `${CJ.tail[0]}px ${CJ.tail[1]}px` });
    return () => { sway.kill(); tail.kill(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const catTo = (name: keyof typeof CAT, jump = false) => {
    if (asleepRef.current) return; // let sleeping cats lie
    catTl.current?.kill();
    if (catAway.current) return;
    const target = { ...CAT[name], x: 0 };
    catFlip.current = 1;
    const t = gsap.timeline({ onUpdate: render });
    if (reduced.current) { Object.assign(catCur.current, target); render(); return; }
    if (jump) t.to(catCur.current, { y: -90, r: -10, front: -40, back: 34, duration: 0.25, ease: "power2.out" });
    t.to(catCur.current, { ...target, duration: 0.55, ease: "back.out(1.5)" });
    catTl.current = t;
  };

  const pose = (s: SectionId | "bow" | "peek") => {
    if (discoRef.current) return;
    tl.current?.kill();
    const target = s === "hello" ? OUTFIT_POSES[outfitRef.current] : POSES[s];
    const flipTo = s === "hello" ? OUTFIT_FLIP[outfitRef.current] : { L: 0, R: 0 };
    gsap.killTweensOf(flip.current);
    if (reduced.current) Object.assign(flip.current, flipTo);
    else gsap.to(flip.current, { ...flipTo, duration: 0.45, delay: 0.45, ease: "power2.inOut", onUpdate: render });
    if (reduced.current) { Object.assign(cur.current, target); pull.current.p = 0; render(); catTo(s); return; }
    leaping.current = true;
    progRef.current?.(0);
    const t = gsap.timeline({ onUpdate: render, onComplete: () => { leaping.current = false; }, onInterrupt: () => { leaping.current = false; } });
    // crouch, spring up through the jumping-jack, land in the new pose
    t.to(cur.current, { y: cur.current.y + 18, duration: 0.12, ease: "power1.in" })
      .to(pull.current, { p: 0.85, duration: 0.2, ease: "power2.out" }, ">")
      .to(cur.current, { y: Math.min(target.y, 0) - 110, duration: 0.24, ease: "power2.out" }, "<")
      .add(() => { if (soundRef.current) pock(); })
      .to(pull.current, { p: 0, duration: 0.5, ease: "power3.out" }, ">-0.04")
      .to(cur.current, { ...target, duration: 0.62, ease: "back.out(1.45)" }, "<");
    tl.current = t;
    catTo(s, s === "writing");
  };

  // Demon walks back to his spot from wherever he is
  const homeCall = useRef<gsap.core.Tween | null>(null);
  const comeHome = () => {
    homeCall.current?.kill();
    catTl.current?.kill();
    catAway.current = false;
    const x = catCur.current.x ?? 0;
    if (reduced.current || Math.abs(x) < 2) { Object.assign(catCur.current, CAT[section as keyof typeof CAT], { x: 0 }); catFlip.current = 1; render(); return; }
    const t = gsap.timeline({ onUpdate: render });
    catFlip.current = x > 0 ? 1 : -1;
    walk(t, 0, Math.min(2.4, Math.max(0.8, Math.abs(x) / 450)));
    t.add(() => { catFlip.current = 1; render(); });
    t.to(catCur.current, { ...CAT[section as keyof typeof CAT], x: 0, duration: 0.4 });
    catTl.current = t;
  };
  useImperativeHandle(ref, () => ({ pose, home: comeHome }));

  // party: she dances on the beat (120 bpm, a move every two beats) and Demon bobs
  useEffect(() => {
    if (!disco) return;
    tl.current?.kill();
    gsap.killTweensOf(flip.current);
    gsap.to(flip.current, { L: 0, R: 0, duration: 0.3, onUpdate: render });
    catTl.current?.kill();
    if (reduced.current) { Object.assign(cur.current, DISCO[0]); render(); return; }
    const beat = 60 / bpm;
    const d = gsap.timeline({ repeat: -1, onUpdate: render });
    DISCO.forEach((p, i) => {
      d.to(cur.current, { ...p, duration: beat * 0.55, ease: "power3.out" }, i * beat * 2)
        .to(cur.current, { y: p.y + 14, duration: beat * 0.5, ease: "sine.inOut", yoyo: true, repeat: 1 }, i * beat * 2 + beat * 0.55);
    });
    d.to(pull.current, { p: 0.5, duration: beat * 0.4, yoyo: true, repeat: 1, ease: "power2.out" }, beat * 6);
    tl.current = d;
    leaping.current = true;
    const c = gsap.timeline({ repeat: -1, onUpdate: render });
    c.to(catCur.current, { y: -18, front: -24, back: 18, r: -4, duration: beat / 2, ease: "power2.out" })
      .to(catCur.current, { y: 0, front: 0, back: 0, r: 2, duration: beat / 2, ease: "power2.in" });
    if (!catAway.current) catTl.current = c; else c.kill();
    return () => {
      d.kill(); c.kill();
      leaping.current = false;
      pull.current.p = 0;
      pose(section);
      if (Math.abs(catCur.current.x ?? 0) > 4 && !catAway.current) comeHome();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disco, bpm]);

  const offstageX = () => {
    const el = box.current;
    if (!el) return 900;
    return SW / 2 + el.clientWidth / (2 * scale.current) - CAT_X + 40;
  };
  // Demon's walk: legs scissor at the brads while he travels
  const walk = (t: gsap.core.Timeline, toX: number, dur: number) => {
    const steps = Math.max(2, Math.round(dur / 0.36));
    t.to(catCur.current, { x: toX, duration: dur, ease: "sine.inOut" }, "<");
    const legs = gsap.timeline({ repeat: steps - 1 });
    legs.to(catCur.current, { front: 22, back: -22, y: -6, duration: 0.18, ease: "sine.inOut" })
      .to(catCur.current, { front: -22, back: 22, y: 0, duration: 0.18, ease: "sine.inOut" });
    t.add(legs, "<");
    t.to(catCur.current, { front: 0, back: 0, y: 0, duration: 0.2 });
  };
  // the tassel swings like a pendulum when Demon bats it
  const swingTassel = (strength: number) => {
    if (!dangleRef.current) return;
    gsap.killTweensOf(dangleRef.current);
    gsap.fromTo(dangleRef.current, { rotation: strength }, { rotation: 0, duration: 2.2, ease: "elastic.out(1, 0.22)", transformOrigin: `${PELVIS.x}px ${PELVIS.y}px` });
  };
  // Demon pads over to the tassel, swats it twice and wanders back
  const playTassel = () => {
    if (catAway.current || discoRef.current) return;
    homeCall.current?.kill();
    catTl.current?.kill();
    const t = gsap.timeline({ onUpdate: render });
    catFlip.current = 1;
    const toTassel = PELVIS.x + 90 - CAT_X - 300 * CAT_S; // he sits beside the tassel and reaches for it, never on top of it
    if (Math.abs((catCur.current.x ?? 0) - toTassel) > 4) walk(t, toTassel, 1.4);
    t.to(catCur.current, { y: 6, r: 3, duration: 0.25, ease: "power2.out" })
      .to(catCur.current, { front: -84, r: -10, y: -10, duration: 0.13, ease: "power2.out" })
      .add(() => { swingTassel(10); if (soundRef.current) bradTick(); })
      .to(catCur.current, { front: -8, r: 0, y: 0, duration: 0.22 })
      .to(catCur.current, { front: -92, r: -12, y: -14, duration: 0.13, ease: "power2.out" }, "+=0.5")
      .add(() => { swingTassel(15); if (soundRef.current) bradTick(); })
      .to(catCur.current, { front: 0, r: 0, y: 0, duration: 0.24 })
      .to(catCur.current, { tail: 30, duration: 0.3, yoyo: true, repeat: 3, ease: "sine.inOut" }, "+=0.2")
      .add(() => { catFlip.current = -1; render(); });
    walk(t, 0, 1.4);
    t.add(() => { catFlip.current = 1; render(); });
    t.to(catCur.current, { ...CAT[section as keyof typeof CAT], x: 0, duration: 0.35 });
    catTl.current = t;
  };
  const prevIdle = useRef<IdleStage>(0);
  const naps = useRef(1);
  useEffect(() => {
    const was = prevIdle.current;
    prevIdle.current = idle;
    if (reduced.current || discoRef.current) return;
    if (idle === 1) {
      // the shadow strikes a pose she isn't doing
      shSolo.current = true;
      const alt = POSES[section === "side" ? "writing" : "side"];
      const st = gsap.timeline({ onComplete: () => { shSolo.current = false; } });
      st.to(shCur.current, { ...alt, duration: 0.9, ease: "power3.out" })
        .to(shCur.current, { uaR: alt.uaR - 40, duration: 0.35, yoyo: true, repeat: 3, ease: "sine.inOut" })
        .to({}, { duration: 1.2 });
    }
    if (idle === 2 && !catAway.current) { naps.current += 1; if (naps.current % 2 === 0) fallAsleep(); else playTassel(); }
    if (idle === 3 && !catAway.current && !asleepRef.current) {
      catTl.current?.kill();
      const t = gsap.timeline({ onUpdate: render });
      catFlip.current = -1;
      walk(t, offstageX(), 2.4);
      t.add(() => {
        catAway.current = true;
        // he never stays away for long
        homeCall.current = gsap.delayedCall(12, comeHome);
      });
      catTl.current = t;
    }
    if (idle === 0 && was === 3) {
      // back he comes when someone moves, even if he was only halfway out
      comeHome();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idle]);

  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; if (section !== "hello") pose(section); return; }
    pose(peek ? "peek" : section);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section, peek]);

  // a new outfit: she strikes its pose (held on About; other sections return to their own pose)
  useEffect(() => {
    if (outfitRef.current === outfit) return;
    outfitRef.current = outfit;
    if (peek || disco) return;
    pose("hello");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outfit]);

  // pulling the string
  const drag = useRef<{ y0: number; id: number; moved: boolean } | null>(null);
  const [dragging, setDragging] = useState(false);
  const onDown = (e: React.PointerEvent) => {
    tl.current?.kill();
    gsap.killTweensOf(pull.current);
    drag.current = { y0: e.clientY, id: e.pointerId, moved: false };
    setDragging(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    const dy = (e.clientY - drag.current.y0) / scale.current;
    if (Math.abs(dy) > 4) drag.current.moved = true;
    pull.current.p = Math.max(0, Math.min(1, dy / MAX_PULL));
    catCur.current.tail = CAT[section].tail;
    render();
  };
  const release = () => {
    const d = drag.current;
    drag.current = null;
    setDragging(false);
    if (!d) return;
    const p = pull.current.p;
    if (p > 0.55 || !d.moved) {
      if (!d.moved) {
        gsap.to(pull.current, { p: 1, duration: 0.22, ease: "power2.out", onUpdate: render, onComplete: onPulled });
      } else onPulled();
    } else {
      gsap.to(pull.current, { p: 0, duration: 0.5, ease: "back.out(2)", onUpdate: render });
    }
  };
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); gsap.to(pull.current, { p: 1, duration: 0.25, onUpdate: render, onComplete: onPulled }); }
  };
  const onTabClick = (e: React.MouseEvent) => {
    // keyboard activation (Enter/Space) arrives as a click with detail 0
    if (e.detail === 0) gsap.to(pull.current, { p: 1, duration: 0.22, onUpdate: render, onComplete: onPulled });
  };

  // ---- Demon's moods: asleep, being petted, and the leap for the red bead ----
  const [asleep, setAsleep] = useState(false);
  const asleepRef = useRef(false);
  const [purrs, setPurrs] = useState<{ id: number; dx: number }[]>([]);
  const strokes = useRef({ n: 0, dist: 0, last: null as null | { x: number; y: number }, moved: 0, t: 0 });
  const purrId = useRef(0);
  const wakeUp = (startle: boolean) => {
    asleepRef.current = false;
    setAsleep(false);
    catTl.current?.kill();
    const t = gsap.timeline({ onUpdate: render });
    if (startle && !reduced.current) {
      // a startled hop, all four legs out, then he shakes it off
      t.to(catCur.current, { y: -150, r: -12, front: -50, back: 50, tail: 60, duration: 0.22, ease: "power2.out" })
        .add(() => { if (soundRef.current) paperFlick(); })
        .to(catCur.current, { y: 0, r: 0, front: 0, back: 0, duration: 0.3, ease: "power2.in" })
        .to(catCur.current, { r: 4, duration: 0.07, yoyo: true, repeat: 5 })
        .to(catCur.current, { ...CAT[section as keyof typeof CAT], duration: 0.4 });
    } else {
      t.to(catCur.current, { ...CAT[section as keyof typeof CAT], duration: 0.5, ease: "power2.out" });
    }
    catTl.current = t;
  };
  const fallAsleep = () => {
    if (catAway.current || discoRef.current || asleepRef.current) return;
    homeCall.current?.kill();
    catTl.current?.kill();
    asleepRef.current = true;
    setAsleep(true);
    catFlip.current = 1;
    const t = gsap.timeline({ onUpdate: render });
    if (Math.abs(catCur.current.x ?? 0) > 4) walk(t, 0, 1);
    // a big stretch, then he folds down into a loaf and breathes slowly
    t.to(catCur.current, { front: -30, back: 30, y: 10, r: 6, tail: 50, duration: 0.6, ease: "sine.inOut" })
      .to(catCur.current, { front: 46, back: -46, y: 34, r: 0, tail: 12, duration: 0.9, ease: "power2.inOut" })
      .to(catCur.current, { y: 38, tail: 18, duration: 1.6, yoyo: true, repeat: -1, ease: "sine.inOut" });
    catTl.current = t;
  };
  const leapForBead = () => {
    if (catAway.current) return;
    homeCall.current?.kill();
    catTl.current?.kill();
    catFlip.current = 1;
    const phone = window.matchMedia("(max-width: 899px)").matches;
    const toX = 350 - (phone ? 170 : 0);
    const t = gsap.timeline({ onUpdate: render });
    if (reduced.current) { onSurprise?.(); return; }
    // wiggle, crouch, spring, swat at the top, and drop back down
    t.to(catCur.current, { x: toX - 60, duration: 0.6, ease: "sine.inOut" })
      .to(catCur.current, { back: 14, y: 14, r: 4, duration: 0.09, yoyo: true, repeat: 5, ease: "sine.inOut" })
      .to(catCur.current, { y: 26, front: 20, back: 24, duration: 0.18, ease: "power1.in" })
      .to(catCur.current, { x: toX, y: -1280, r: -22, front: -150, back: 40, tail: 70, duration: 0.55, ease: "power2.out" })
      .add(() => {
        if (soundRef.current) bradTick();
        if (surpriseRef.current) gsap.fromTo(surpriseRef.current, { y: 0, rotation: 0 }, { y: 70, rotation: 20, duration: 0.18, ease: "power2.out", yoyo: true, repeat: 1 });
      })
      .to(catCur.current, { front: -110, duration: 0.1, yoyo: true, repeat: 1 })
      .to(catCur.current, { y: 0, r: 6, front: -20, back: -10, tail: 20, duration: 0.5, ease: "power2.in" })
      .to(catCur.current, { y: 10, r: 0, duration: 0.1, yoyo: true, repeat: 1 })
      .to(catCur.current, { front: 0, back: 0, duration: 0.2 })
      .add(() => onSurprise?.());
    catTl.current = t;
  };
  // stroking him: every ~140px of pointer travel over his back is one stroke
  const onPet = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" && e.buttons === 0) return;
    const s = strokes.current, p = { x: e.clientX, y: e.clientY };
    if (s.last) { const d = Math.hypot(p.x - s.last.x, p.y - s.last.y); s.dist += d; s.moved += d; }
    s.last = p;
    if (s.dist < 140) return;
    s.dist = 0;
    if (asleepRef.current) { s.n = 0; wakeUp(false); return; }
    purrNow();
  };
  // a real recorded purr with a little chirp; one at a time, restarted on each tap
  const purrAudio = useRef<HTMLAudioElement | null>(null);
  const playPurr = () => {
    try {
      if (!purrAudio.current) { purrAudio.current = new Audio(img("audio/demon-purr.mp3")); purrAudio.current.volume = 0.6; }
      const a = purrAudio.current;
      if (!a.paused && a.currentTime < 1.2) return;
      a.currentTime = 0;
      void a.play().catch(() => purr(0.9));
    } catch { purr(0.9); }
  };
  useEffect(() => () => { purrAudio.current?.pause(); }, []);
  // one purr: a happy lean, a little "prrr", and the sound (a tap on him is a clear ask, so it plays)
  const purrNow = () => {
    const s = strokes.current;
    const now = performance.now();
    if (now - s.t > 2500) s.n = 0;
    s.t = now;
    s.n += 1;
    playPurr();
    const id = ++purrId.current;
    setPurrs((l) => [...l.slice(-4), { id, dx: Math.round(Math.random() * 160 - 80) }]);
    setTimeout(() => setPurrs((l) => l.filter((q) => q.id !== id)), 1500);
    if (catTl.current?.isActive() && s.n < 6) return;
    if (s.n >= 6 && !discoRef.current) { s.n = 0; leapForBead(); return; }
    // leans into the hand: tail up, a happy arch
    catTl.current?.kill();
    const t = gsap.timeline({ onUpdate: render });
    t.to(catCur.current, { y: 8, r: -3, tail: 45, back: 6, duration: 0.3, ease: "sine.out" })
      .to(catCur.current, { y: 0, r: 0, tail: 25, back: 0, duration: 0.5, ease: "sine.inOut" });
    catTl.current = t;
  };
  const petStart = (e: React.PointerEvent) => { strokes.current.last = { x: e.clientX, y: e.clientY }; strokes.current.moved = 0; };
  // ---- her face and the shoulder stand ----
  const [tongue, setTongue] = useState(false);
  const tongueTimer = useRef(0);
  const setTongueSafe = (v: boolean) => {
    window.clearTimeout(tongueTimer.current);
    setTongue(v);
    if (v) tongueTimer.current = window.setTimeout(() => setTongue(false), 2600);
  };
  const standing = useRef(false);
  const shoulderStand = () => {
    if (discoRef.current || peekRef.current || standing.current) return;
    standing.current = true;
    tl.current?.kill();
    const back = section === "hello" ? OUTFIT_POSES[outfitRef.current] : POSES[section];
    if (reduced.current) {
      Object.assign(cur.current, STAND); render();
      window.setTimeout(() => { Object.assign(cur.current, back); render(); standing.current = false; }, 2400);
      return;
    }
    leaping.current = true;
    const t = gsap.timeline({ onUpdate: render, onComplete: () => { leaping.current = false; standing.current = false; } });
    // a little hop, a full tip over onto her shoulders, a pointed foot to the ceiling, and back up
    t.to(cur.current, { y: cur.current.y + 16, duration: 0.12, ease: "power1.in" })
      .add(() => { if (soundRef.current) paperFlick(); })
      .to(cur.current, { ...STAND, duration: 0.85, ease: "power2.inOut" })
      .add(() => { if (soundRef.current) bradTick(); setTongueSafe(true); })
      .to(cur.current, { thL: STAND.thL - 6, duration: 0.5, yoyo: true, repeat: 3, ease: "sine.inOut" })
      .to(cur.current, { ...back, duration: 0.8, ease: "back.out(1.3)" }, "+=0.2");
    tl.current = t;
  };
  const bat = () => {
    if (strokes.current.moved > 20) { strokes.current.moved = 0; return; } // that was a stroke, not a tap
    if (asleepRef.current) { wakeUp(true); return; }
    purrNow();
  };
  useEffect(() => { if (disco && asleepRef.current) { asleepRef.current = false; setAsleep(false); } }, [disco]);

  const R = (k: string) => (el: HTMLDivElement | null) => { refs.current[k] = el; };

  return (
    <div className="stage" ref={box} data-showcase="stage">
      <div className="stage-inner" ref={inner} style={{ width: SW, height: SH }}>
        <div className="puppet shadow-wall" style={{ left: OX, top: OY }} aria-hidden="true">
          <Rig R={R} p="s_" outfit={outfit} />
        </div>
        <div className="puppet" style={{ left: OX, top: OY }}>
          <div className="layer" ref={R("sway")} style={{ zIndex: 2 }} role="img" aria-label="Angela as a jointed paper doll, pinned with brads and hung on a string">
            <Rig R={R} p="" outfit={outfit} face={{ tongue, on: setTongueSafe, flip: shoulderStand }} />
          </div>
          {/* the cord hangs from behind her and its bead-and-tassel pull swings gently below her feet */}
          <div className="layer" ref={dangleRef} style={{ ...origin([PELVIS.x, PELVIS.y]), zIndex: 1 }}>
          <div className={`layer dangle ${dragging ? "is-taut" : ""}`} style={origin([PELVIS.x, PELVIS.y])}>
            <div className="string" ref={stringRef} style={{ left: PELVIS.x - 4, backgroundImage: `url(${img("cord.webp")})` }} />
            <button
              ref={tabRef}
              className="pull-tab"
              style={{ left: PELVIS.x, top: STRING_END }}
              onPointerDown={onDown}
              onPointerMove={onMove}
              onPointerUp={release}
              onPointerCancel={release}
              onKeyDown={onKey}
              onClick={onTabClick}
              aria-label={`Pull the string to go to ${nextLabel}`}
              data-showcase="pull"
            >
              <img src={img("tassel.webp")} alt="" draggable={false} />
            </button>
          </div>
          </div>
        </div>

        <div className="cat" ref={R("cat")} style={{ width: cat.w, height: cat.h, left: OX, top: OY }}>
          <div className="layer" ref={R("cTail")} style={origin(CJ.tail)}>
            <div className="layer" ref={R("cTailIdle")}>
              <CatPiece name="tail" />
            </div>
          </div>
          <CatPiece name="body" />
          <div className="layer" ref={R("cFront")} style={origin(CJ.front)}>
            <CatPiece name="front" />
          </div>
          <div className="layer" ref={R("cBack")} style={origin(CJ.back)}>
            <CatPiece name="back" />
          </div>
          {asleep && <div className="cat-zzz" aria-hidden="true"><span>z</span><span>z</span><span>z</span></div>}
          {purrs.map((q) => <span key={q.id} className="cat-purr" style={{ left: 260 + q.dx }} aria-hidden="true">prrr</span>)}
          <button className="cat-hit" onClick={bat} onPointerEnter={petStart} onPointerDown={petStart} onPointerMove={onPet} title={asleep ? "Shh, he's napping. Tap to wake him" : "Pet Demon"} aria-label={asleep ? "Demon is asleep: tap to wake him" : "Demon the cat: tap or stroke him and he purrs"} data-showcase="demon" />
        </div>
        {/* the secret string: hangs from the ceiling with a little red bead */}
        <div className="surprise" style={{ left: `calc(${OX + 1260}px - var(--surprise-in, 0px))`, top: 0 }}>
          <div className="surprise-thread" />
          <button
            ref={surpriseRef}
            className="surprise-bead"
            onClick={() => {
              gsap.fromTo(surpriseRef.current, { y: 0 }, { y: 60, duration: 0.18, ease: "power2.out", yoyo: true, repeat: 1 });
              onSurprise?.();
            }}
            aria-label={disco ? "Pull the secret string again to stop the dance" : "A secret string. Pull it"}
            data-showcase="surprise"
          />
        </div>
      </div>
    </div>
  );
});
