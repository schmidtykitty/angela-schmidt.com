import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Puppet, type IdleStage, type Outfit, type PuppetHandle, type SectionId } from "./Puppet";
const HASHES: Record<string, string> = { hello: "about", portfolio: "work", ballet: "performance", side: "side-quests", contact: "contact" };
import { Ballet, Books, Contact, Hello, Lightbox, Portfolio, Side, Spaces, Writing, type Shot } from "./sections";
import { MA_LINES, SECTIONS, profile } from "./content";
import { stampThump, unlock } from "./sound";

// the party plays real songs from SoundCloud: Stevie Wonder in deep house
const PARTY_TRACKS = [
  { title: "Stevie Wonder, Sir Duke (SJUR remix)", url: "https://soundcloud.com/officialsjur/sir-duke-sjur-remix" },
  { title: "Stevie Wonder, Superstition (deep mix by DJ Max Valentin)", url: "https://soundcloud.com/dj-max-valentin/superstition-deep-mix-stevie-wonder" },
  { title: "Stevie Wonder house remixes", url: "https://soundcloud.com/jenelle-jackson-2/sets/stevie-wonder-house-remixes" },
];

gsap.registerPlugin(useGSAP);

// the SoundCloud widget API, loaded once
type ScWidget = { play: () => void; pause: () => void; bind: (e: string, f: () => void) => void; unbind: (e: string) => void };
type ScApi = { Widget: ((el: HTMLIFrameElement) => ScWidget) & { Events: Record<string, string> } };
let scApi: Promise<ScApi | null> | null = null;
function loadSc(): Promise<ScApi | null> {
  const w = window as unknown as { SC?: ScApi };
  if (w.SC) return Promise.resolve(w.SC);
  if (!scApi) {
    scApi = new Promise((res) => {
      const s = document.createElement("script");
      s.src = "https://w.soundcloud.com/player/api.js";
      s.onload = () => res((window as unknown as { SC?: ScApi }).SC ?? null);
      s.onerror = () => { scApi = null; res(null); };
      document.head.appendChild(s);
    });
  }
  return scApi;
}

export function App() {
  const [idx, setIdx] = useState(0);
  // before the first pull nothing is selected: she just says hello
  const [started, setStarted] = useState(false);
  const [open, setOpen] = useState(false);
  const [seen, setSeen] = useState<Set<string>>(new Set());
  const [sound, setSound] = useState(false);
  const [lb, setLb] = useState<{ list: Shot[]; i: number } | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const [stamped, setStamped] = useState(false);
  const [outfit, setOutfit] = useState<Outfit>("issey");
  const [chosen, setChosen] = useState<Outfit>("issey");
  const [closet, setCloset] = useState(false);
  useEffect(() => {
    if (!closet) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setCloset(false); };
    const onDown = (e: PointerEvent) => { if (!(e.target as HTMLElement).closest(".rail")) setCloset(false); };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => { window.removeEventListener("keydown", onKey); window.removeEventListener("pointerdown", onDown); };
  }, [closet]);
  const flyRef = useRef<HTMLImageElement>(null);
  // the paper doll trick: the chosen outfit flies off the rail onto her, tabs folding over
  const dress = (o: Outfit, e: React.MouseEvent<HTMLButtonElement>) => {
    if (o === chosen) return;
    setChosen(o);
    setTimeout(() => setCloset(false), 900);
    const from = (e.currentTarget.querySelector("img") as HTMLImageElement).getBoundingClientRect();
    const doll = document.querySelector(".puppet:not(.shadow-wall)")?.getBoundingClientRect();
    const fly = flyRef.current;
    if (!fly || !doll || window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setOutfit(o); return; }
    fly.src = `${import.meta.env.BASE_URL}${o}-real.webp`;
    const tw = doll.width * 0.34, th = tw * (from.height / from.width);
    const tx = doll.left + doll.width * 0.5 - tw / 2, ty = doll.top + doll.height * 0.2;
    gsap.killTweensOf(fly);
    gsap.timeline()
      .set(fly, { autoAlpha: 1, x: from.left, y: from.top, width: from.width, height: from.height, rotation: -8, rotationX: 0, transformPerspective: 800 })
      .to(fly, { x: tx, y: ty, width: tw, height: th, rotation: 6, duration: 0.7, ease: "power3.inOut" })
      .to(fly, { rotation: 0, duration: 0.15 })
      .add(() => setOutfit(o))
      .to(fly, { rotationX: 80, scaleY: 0.6, autoAlpha: 0, duration: 0.35, ease: "power2.in" });
  };
  const puppetRef = useRef<PuppetHandle>(null);
  // tapping her name puts everything back: Hello, lights up, Demon home
  const reset = () => {
    setDisco(false);
    setOpen(false);
    setLb(null);
    setIdx(0);
    setOutfit("issey");
    setChosen("issey");
    setCloset(false);
    lastInput.current = Date.now();
    setIdle(0);
    setMa(null);
    setTimeout(() => { puppetRef.current?.home(); puppetRef.current?.pose("hello"); }, 50);
  };
  const [disco, setDisco] = useState(false);
  const [music, setMusic] = useState(true);
  const [track, setTrack] = useState(0); // which party song is up
  // the SoundCloud player, driven through its widget API so the song starts on the bead pull
  const scRef = useRef<HTMLIFrameElement>(null);
  const scWidget = useRef<ScWidget | null>(null);
  const [scPlaying, setScPlaying] = useState(false);
  const [scBlocked, setScBlocked] = useState(false);
  const ballBtnRef = useRef<HTMLButtonElement>(null);
  const nextGenre = () => {
    unlock();
    setMusic(true);
    setTrack((t) => (t + 1) % PARTY_TRACKS.length);
    const b = ballBtnRef.current;
    if (b && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.fromTo(b, { rotation: -14 }, { rotation: 0, duration: 0.9, ease: "elastic.out(1, 0.35)", overwrite: true });
      const f = discoRef.current?.querySelector(".flecks");
      if (f) gsap.fromTo(f, { opacity: 0.3 }, { opacity: 1, duration: 0.6, ease: "power2.out" });
    }
  };
  const discoRef = useRef<HTMLDivElement>(null);
  const sealRef = useRef<HTMLSpanElement>(null);
  const [idle, setIdle] = useState<IdleStage>(0);
  const [ma, setMa] = useState<number | null>(null);
  const maRef = useRef<HTMLParagraphElement>(null);
  const lastInput = useRef(Date.now());
  const soundRef = useRef(sound);
  soundRef.current = sound;

  const cur = SECTIONS[idx];
  const next = started ? SECTIONS[(idx + 1) % SECTIONS.length] : SECTIONS[0];
  const section = cur.id as SectionId;
  const others = SECTIONS.filter((s) => s.id !== "hello").map((s) => s.id);
  const allSeen = others.every((s) => seen.has(s));
  const puppetPose = section === "hello" && allSeen ? "bow" : section;

  const go = useCallback((i: number) => {
    const n = (i + SECTIONS.length) % SECTIONS.length;
    setIdx(n);
    const id = SECTIONS[n].id;
    if (id !== "hello") setSeen((s) => new Set(s).add(id));
  }, []);
  // the named menu: she strikes the pose, then the section opens on its own
  const navTimer = useRef<number | undefined>(undefined);
  const navTo = (i: number) => {
    window.clearTimeout(navTimer.current);
    setStarted(true);
    setDisco(false);
    go(i);
    if (open) { setTimeout(() => document.querySelector(".drawer")?.scrollTo({ top: 0 }), 0); return; }
    navTimer.current = window.setTimeout(() => setOpen(true), window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 650);
  };

  // direct links: angela-schmidt.com/#work opens Professional Work, and so on
  const navRef = useRef(navTo);
  navRef.current = navTo;
  useEffect(() => {
    const fromHash = () => {
      const want = ({ performing: "performance", portfolio: "work" } as Record<string, string>)[window.location.hash.replace("#", "").toLowerCase()] ?? window.location.hash.replace("#", "").toLowerCase();
      const i = SECTIONS.findIndex((s) => HASHES[s.id] === want);
      if (i >= 0) navRef.current(i);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);
  // keep the address bar in step, so whatever is open can be copied and shared
  useEffect(() => {
    const h = open ? `#${HASHES[SECTIONS[idx].id]}` : "";
    if (window.location.hash !== h) history.replaceState(null, "", h || window.location.pathname + window.location.search);
  }, [open, idx]);

  // the first pull earns a red hanko beside her name
  const pulled = () => {
    if (!stamped) {
      setStamped(true);
      if (soundRef.current) setTimeout(stampThump, 520);
    }
    if (!started) { setStarted(true); go(0); return; }
    go(idx + 1);
  };
  useGSAP(
    () => {
      if (!stamped || !sealRef.current) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.timeline({ delay: 0.35 })
        .fromTo(sealRef.current, { scale: 2.4, autoAlpha: 0, rotation: -24 }, { scale: 0.92, autoAlpha: 1, rotation: -7, duration: 0.22, ease: "power4.in" })
        .to(sealRef.current, { scale: 1, duration: 0.25, ease: "power2.out" });
    },
    { dependencies: [stamped], scope: root },
  );

  // the secret string: lights down, ball drops, everybody dances
  const surprise = () => {
    unlock();
    void loadSc();
    setOpen(false);
    setDisco((d) => !d);
  };
  // start the song as soon as the player is ready; if the browser blocks it, offer a Play button
  useEffect(() => {
    setScPlaying(false);
    setScBlocked(false);
    if (!disco || !music) { scWidget.current = null; return; }
    let alive = true;
    let timer = 0;
    void loadSc().then((SC) => {
      const el = scRef.current;
      if (!alive || !SC || !el) { if (alive) setScBlocked(true); return; }
      const w = SC.Widget(el);
      scWidget.current = w;
      const ev = SC.Widget.Events;
      w.bind(ev.READY, () => { w.play(); });
      w.bind(ev.PLAY, () => { if (alive) { setScPlaying(true); setScBlocked(false); } });
      w.bind(ev.PAUSE, () => { if (alive) setScPlaying(false); });
      w.bind(ev.FINISH, () => { if (alive) setTrack((t) => (t + 1) % PARTY_TRACKS.length); });
      timer = window.setTimeout(() => { if (alive) setScBlocked(true); }, 3500);
    });
    return () => {
      alive = false;
      window.clearTimeout(timer);
      try { scWidget.current?.pause(); } catch { /* the player may already be gone */ }
    };
  }, [disco, music, track]);
  useGSAP(
    () => {
      if (!disco || !discoRef.current) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.fromTo(ballBtnRef.current, { yPercent: -120 }, { yPercent: 0, duration: 1.4, ease: "bounce.out" });
      gsap.fromTo(discoRef.current.querySelector(".flecks"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.2, delay: 0.9 });
    },
    { dependencies: [disco], scope: root },
  );

  // left alone, the page starts doing things on its own
  useEffect(() => {
    const wake = () => {
      lastInput.current = Date.now();
      setIdle((s) => (s === 0 ? s : 0));
      setMa((m) => (m === null ? m : null));
    };
    const evs = ["pointerdown", "pointermove", "keydown", "wheel", "touchstart"] as const;
    evs.forEach((e) => window.addEventListener(e, wake, { passive: true }));
    const iv = window.setInterval(() => {
      const s = (Date.now() - lastInput.current) / 1000;
      const blocked = open || !!lb || disco;
      if (blocked) { lastInput.current = Date.now(); return; }
      const stage: IdleStage = s >= 30 ? 3 : s >= 16 ? 2 : s >= 9 ? 1 : 0;
      setIdle((cur) => (cur === stage ? cur : stage));
      // Ma: from 5 s of stillness, a new line every 7 s
      if (s >= 5) {
        const n = Math.floor((s - 5) / 7);
        setMa((cur) => (cur === n % MA_LINES.length ? cur : n % MA_LINES.length));
      }
    }, 400);
    return () => { evs.forEach((e) => window.removeEventListener(e, wake)); window.clearInterval(iv); };
  }, [open, lb, disco]);

  useGSAP(
    () => {
      if (ma === null || !maRef.current) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { gsap.set(maRef.current, { autoAlpha: 1 }); return; }
      gsap.timeline()
        .fromTo(maRef.current, { autoAlpha: 0, y: 8, letterSpacing: "0.08em" }, { autoAlpha: 1, y: 0, letterSpacing: "0.01em", duration: 1.1, ease: "sine.out" })
        .to(maRef.current, { autoAlpha: 0, duration: 1, ease: "sine.in" }, "+=5");
    },
    { dependencies: [ma], scope: root },
  );

  // the section tag swaps like a card flipped on its string
  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.fromTo(tagRef.current, { autoAlpha: 0, y: -26, rotation: -4 }, { autoAlpha: 1, y: 0, rotation: 0, duration: 0.7, ease: "power3.out", delay: 0.28 });
      if (open && drawerRef.current) {
        drawerRef.current.scrollTo({ top: 0 });
        gsap.fromTo(drawerRef.current.querySelector(".sheet"), { autoAlpha: 0, x: 50 }, { autoAlpha: 1, x: 0, duration: 0.6, ease: "power3.out", delay: 0.15 });
      }
    },
    { dependencies: [idx, started], scope: root },
  );

  // opening a section: the doll steps aside and the page slides in beside her
  useGSAP(
    () => {
      const rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const desk = window.innerWidth >= 900;
      const d = rm ? 0 : 0.7;
      if (open) {
        // she ducks mostly out of view at the left edge and peeks in at the open section
        gsap.to(stageRef.current, { xPercent: desk ? -34 : -38, yPercent: desk ? 5 : 10, scale: desk ? 0.96 : 0.9, duration: d, ease: "power3.inOut" });
        gsap.fromTo(drawerRef.current, { xPercent: 100 }, { xPercent: 0, duration: d, ease: "power3.out" });
        drawerRef.current?.querySelector<HTMLButtonElement>(".drawer-close")?.focus();
      } else {
        gsap.to(stageRef.current, { xPercent: 0, yPercent: 0, scale: 1, duration: d, ease: "power3.inOut" });
      }
    },
    { dependencies: [open], scope: root },
  );

  // while pulling, the next section's name ghosts in under the current one
  const onPullProgress = useCallback((p: number) => {
    if (ghostRef.current) {
      ghostRef.current.style.opacity = String(Math.min(1, p * 1.4));
      ghostRef.current.style.transform = `translateY(${(1 - p) * -14}px)`;
    }
    if (tagRef.current && !gsap.isTweening(tagRef.current)) tagRef.current.style.opacity = String(1 - p * 0.6);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lb) return;
      if (e.key === "Escape" && disco) { setDisco(false); return; }
      if (e.key === "Escape" && open) { setOpen(false); setTimeout(() => openerRef.current?.focus(), 0); }
      const tag = (e.target as HTMLElement).tagName;
      if (open || tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "ArrowRight") go(idx + 1);
      if (e.key === "ArrowLeft") go(idx - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, idx, go, lb, disco]);

  const openLb = (list: Shot[], i: number) => { lastFocus.current = document.activeElement as HTMLElement; setLb({ list, i }); };
  const closeLb = useCallback(() => { setLb(null); setTimeout(() => lastFocus.current?.focus(), 0); }, []);
  const setLbIndex = useCallback((i: number) => setLb((l) => (l ? { ...l, i } : l)), []);
  const close = () => { setOpen(false); setTimeout(() => openerRef.current?.focus(), 0); };

  return (
    <div className={`app ${open ? "is-open" : ""} ${disco ? "is-disco" : ""} ${started ? "" : "is-intro"}`} ref={root}>
      {disco && (
        <div className="disco" ref={discoRef} aria-hidden="true">
          <div className="flecks" />
        </div>
      )}
      {disco && (
        <div className="ball-wrap">
          <button className="ball" ref={ballBtnRef} onClick={nextGenre} aria-label={`Next song. Now playing ${PARTY_TRACKS[track].title}`} data-showcase="ball">
            <img src={`${import.meta.env.BASE_URL}discoball.webp`} alt="" />
          </button>
          <p className="ball-caption">
            <span className="ball-hint">Tap the ball for the next song</span>
          </p>
          {music && (
            <iframe
              key={track}
              ref={scRef}
              className="ball-player sc-player"
              title={`${PARTY_TRACKS[track].title} on SoundCloud`}
              src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(PARTY_TRACKS[track].url)}&auto_play=true&color=%23c8102e&hide_related=true&show_comments=false&show_user=true&show_reposts=false&visual=false`}
              allow="autoplay; encrypted-media"
            />
          )}
        </div>
      )}
      <header className="corner">
        <span className="mark">
          <button className="mark-btn" onClick={reset} aria-label={`${profile.name}: back to the start`} title="Back to the start" data-showcase="reset">{profile.name}</button>
          {stamped && (
            <span className="hanko" ref={sealRef} role="img" aria-label="A red hanko seal with Angela's initials">
              <span>A</span><span>S</span>
            </span>
          )}
        </span>
        <nav className="menu" aria-label="Sections" data-showcase="menu">
          {SECTIONS.map((s, i) => (
            <button key={s.id} className={`menu-item ${started && i === idx ? "is-on" : ""}`} aria-current={started && i === idx ? "page" : undefined} onClick={() => navTo(i)} data-showcase={`menu-${s.id}`}>{s.label}</button>
          ))}
        </nav>
      </header>
      <button className={`rail-label sound-toggle ${sound ? "is-on" : ""}`} aria-pressed={sound} onClick={() => { unlock(); setSound((s) => !s); }} data-showcase="sound">
        Sound {sound ? "on" : "off"}
      </button>

      <div className="stage-wrap" ref={stageRef}>
        <Puppet ref={puppetRef} section={puppetPose} nextLabel={next.label} onPulled={pulled} sound={sound} onPullProgress={onPullProgress} idle={open || disco ? 0 : idle} disco={disco} peek={open} bpm={120} onSurprise={surprise} outfit={disco ? "party" : outfit} />
      </div>

      {disco && (
        <div className="party-bar" data-showcase="party">
          {music && scBlocked && !scPlaying && (
            <button className="mini on" onClick={() => { scWidget.current?.play(); }} data-showcase="play-music">Play music</button>
          )}
          <button className="mini" aria-pressed={music} onClick={() => setMusic((m) => !m)}>Music {music ? "on" : "off"}</button>
          <button className="mini" onClick={() => setDisco(false)} data-showcase="lights">Lights up</button>
        </div>
      )}

      <div className={`rail ${closet ? "is-open" : ""}`} aria-label="Wardrobe" role="group">
        <button className="rail-label" aria-expanded={closet} aria-controls="rail-items" onClick={() => setCloset((c) => !c)} data-showcase="rail">
          Wardrobe <span className="rail-caret" aria-hidden="true">{closet ? "−" : "+"}</span>
        </button>
        <div className="rail-items" id="rail-items" inert={!closet}>
          {([["ballet", "Ballet rehearsal"], ["cycling", "Bike ride"], ["ceramics", "Ceramics studio"], ["chef", "Soup day at home"], ["issey", "Issey Miyake today"]] as [Outfit, string][]).map(([o, label]) => (
            <button key={o} className={`garment ${chosen === o ? "is-on" : ""}`} onClick={(e) => dress(o, e)} aria-label={`Dress in ${label}`} aria-pressed={chosen === o} title={label} data-showcase={`outfit-${o}`}>
              <img src={`${import.meta.env.BASE_URL}${o}-real.webp`} alt="" />
            </button>
          ))}
        </div>
      </div>
      <img className="fly" ref={flyRef} alt="" aria-hidden="true" />

      {ma !== null && !open && !disco && (
        <p className="ma" ref={maRef} key={ma} aria-hidden="true">{MA_LINES[ma]}</p>
      )}

      <svg className="defs" aria-hidden="true" width="0" height="0">
        <filter id="ink">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" />
          <feDisplacementMap in="SourceGraphic" scale="2.4" />
        </filter>
      </svg>

      <div className="tag-zone" aria-live="polite">
        <div className="tag" ref={tagRef} key={started ? cur.id : "intro"}>
          {started ? (
            <>
              <button className="tag-title" ref={openerRef} onClick={() => setOpen(true)} aria-haspopup="dialog" data-showcase="open">
                {cur.label} <span className="tag-arrow" aria-hidden="true">→</span>
              </button>
            </>
          ) : (
            <p className="tag-line"><span className="tag-lead">Part investigator,<br />part storyteller.<br />Endlessly curious.</span></p>
          )}
        </div>
        <div className="ghost" ref={ghostRef} aria-hidden="true" />
      </div>

      {open && (
        <aside className="drawer" ref={drawerRef} role="dialog" aria-modal="false" aria-label={cur.label}>
          <div className="drawer-bar">
            <nav className="menu in-drawer" aria-label="Sections">
              {SECTIONS.map((s, i) => (
                <button key={s.id} className={`menu-item ${i === idx ? "is-on" : ""}`} aria-current={i === idx ? "page" : undefined} onClick={() => navTo(i)}>{s.label}</button>
              ))}
            </nav>
            <button className="mini drawer-close" onClick={close} data-showcase="close">Close</button>
          </div>
          <div className="sheet is-wide" data-showcase="sheet">
            {section === "hello" && <Hello onWork={() => navTo(1)} />}
            {section === "portfolio" && <Portfolio onOpen={openLb} />}
            {section === "ballet" && <Ballet onOpen={openLb} />}
            {section === "side" && (
              <>
                <Side onOpen={openLb} />
                <Spaces onOpen={openLb} />
                <Books />
                <Writing />
              </>
            )}
            {section === "contact" && <Contact allSeen={allSeen} />}
          </div>
        </aside>
      )}

      {lb && <Lightbox list={lb.list} index={lb.i} onClose={closeLb} onIndex={setLbIndex} />}
    </div>
  );
}
