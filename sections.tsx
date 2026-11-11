import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import { about, ballet, bio, bioLead, built, spaces, spacesAlso, tagline, books, highlights, img, profile, studio, works, writing, type Highlight } from "./content";

export type Shot = { src: string; alt: string; title?: string; caption?: string; youtube?: string };
type Open = (list: Shot[], i: number) => void;

function Unfold({ open, children, id }: { open: boolean; children: React.ReactNode; id: string }) {
  return (
    <div className={`unfold ${open ? "is-open" : ""}`} id={id} aria-hidden={!open}>
      <div className="unfold-in">{children}</div>
    </div>
  );
}

/* ---------------- Hello ---------------- */
export function Hello({ onWork }: { onWork: () => void }) {
  return (
    <section aria-labelledby="h-hello">
      <div className="ahead"><h1 id="h-hello" className="atitle">{profile.name}</h1><span className="apill">About</span></div>
      <div className="profile about-profile">
        <figure className="profile-photo">
          <img src={img("about-blazer.jpg")} alt="Angela in tortoiseshell glasses and a black blazer, laughing as she looks over her shoulder" width={1000} height={1500} />
          <img className="about-second" src={img("work/glasses.jpg")} alt="Black and white photo: Angela in glasses and knee-high boots, hips forward and leaning back with her arms clasped behind her" width={1000} height={1500} loading="lazy" />
        </figure>
        <div className="profile-main">
          <p className="about-tag">{tagline}</p>
          <p className="profile-bio">{bio}</p>
          <p className="profile-bio">{bioLead}</p>
          <p><button className="text-btn" onClick={onWork}>See my work →</button></p>
          <h2 className="profile-label">What I believe</h2>
          <ol className="beliefs">
            {about.beliefs.map((b) => <li key={b}>{b}</li>)}
          </ol>
          <h2 className="profile-label">Path</h2>
          <ul className="path-list" data-showcase="path">
            {about.path.map((p) => (
              <li key={p.year + p.what}><span className="path-year">{p.year}</span><span>{p.what}</span><span className="path-where">{p.where}</span></li>
            ))}
          </ul>
          <h2 className="profile-label">Boards</h2>
          <ul className="path-list">
            {about.boards.map((p) => (
              <li key={p.where}><span className="path-year">{p.year}</span><span>{p.what}</span><span className="path-where">{p.where}</span></li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Contact ---------------- */
export function Contact({ allSeen }: { allSeen: boolean }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(profile.email); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { setCopied(false); }
  };
  return (
    <section aria-labelledby="h-contact">
      <div className={`contact ${allSeen ? "is-lit" : ""}`} id="contact">
        <div className="contact-grid">
          <div>
            <h2 id="h-contact" className="display">{about.contactTitle}</h2>
            <p className="body">{about.contactText}</p>
          </div>
          <figure className="contact-face" tabIndex={0} aria-label="Angela smiling; point or tap for her silly face" data-showcase="contact-face">
            <img className="face-a" src={img("work/contact-smile.jpg")} alt="Angela smiling in a black silk top" width={1000} height={1500} loading="lazy" />
            <img className="face-b" src={img("work/contact-silly.jpg")} alt="" width={1000} height={1500} loading="lazy" />
          </figure>
        </div>
        <dl className="contact-list">
          <dt>Email</dt>
          <dd><a href={`mailto:${profile.email}`}>{profile.email}</a> <button className="mini" onClick={copy}>{copied ? "Copied" : "Copy address"}</button></dd>
          <dt>CV</dt>
          <dd><a href={`mailto:${profile.email}?subject=${encodeURIComponent("CV request")}`}>Email me for my CV</a></dd>
          <dt>NDA work</dt>
          <dd>Deeper case studies available under NDA for certain projects — ask by email.</dd>
          <dt>LinkedIn</dt>
          <dd><a href={profile.linkedin} target="_blank" rel="noreferrer">linkedin.com/in/angelamschmidt ↗</a></dd>
          <dt>Writing</dt>
          <dd><a href={profile.substack} target="_blank" rel="noreferrer">substack.com/@schmidtykitty ↗</a></dd>
        </dl>
        <p className="small">{about.note}</p>
      </div>
    </section>
  );
}

/* Project images: same grid, tiles and captions as the Work grid */
function ShotGrid({ list, title, onOpen }: { list: { src: string; alt: string }[]; title: string; onOpen: Open }) {
  const shots: Shot[] = list.map((x) => ({ ...x, title, caption: x.alt }));
  return (
    <>
      <div className="ahead section-gap"><h3 className="atitle">Images</h3><span className="apill">{list.length}</span></div>
      <ul className="agrid shot-grid">
        {list.map((x, i) => (
          <li key={x.src}>
            <button className="atile" onClick={() => onOpen(shots, i)} aria-label={`Open image: ${x.alt}`}>
              <span className="atile-art"><img src={img(x.src)} alt={x.alt} loading="lazy" decoding="async" /></span>
              <span className="atile-client">{x.alt}</span>
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}

/* ---------------- Portfolio ---------------- */
function HighlightBlock({ h, idx, onOpen, kicker }: { h: Highlight; idx: number; onOpen: Open; kicker: string }) {
  return (
    <article className="highlight" id={`hl-${idx}`}>
      <p className="kicker">{kicker}</p>
      <h2 className="h2">{h.title}</h2>
      <p className="lede pd-sum">{h.summary}</p>
      <dl className="facts">
        <dt>Role</dt><dd>{h.role}</dd>
        <dt>Scope</dt><dd>{h.scope}</dd>
        <dt>Outcome</dt><dd>{h.outcome}</dd>
      </dl>
      <div className="pd-text">
        {h.story.map((st, i) => (
          <div key={i} className="story-part">
            {st.heading && <h4 className="h4">{st.heading}</h4>}
            {st.paras.map((p) => <p key={p.slice(0, 20)} className="body">{p}</p>)}
          </div>
        ))}
      </div>
      {h.link && <p><a className="text-btn" href={h.link.href} target="_blank" rel="noreferrer">{h.link.label}</a></p>}
      <ShotGrid list={h.slides} title={h.title} onOpen={onOpen} />
    </article>
  );
}

type Tile = {
  key: string; title: string; client: string; year: string; tag: string; sum: string; cover?: string; pos?: string; tone?: "ink" | "paper"; big?: boolean; role?: string; scope?: string; outcome?: string;
  hl?: number; text?: string; extra?: string; video?: { src: string; poster: string; label: string }; shots?: { src: string; alt: string }[]; link?: { label: string; href: string }; nda?: string;
};

export function Portfolio({ onOpen }: { onOpen: Open }) {
  const [sel, setSel] = useState<string | null>(null);
  const [story, setStory] = useState(true);
  const w = (n: number) => works.find((x) => x.no === n)!;
  const fromWork = (n: number, tag: string, extra: Partial<Tile> = {}): Tile => {
    const x = w(n);
    return { key: `w${n}`, title: x.title, client: x.client.split(" · ")[0], year: x.years, tag, sum: x.sum ?? "", text: x.text, ...extra };
  };
  const fromBuilt = (i: number, cover: string): Tile => {
    const b = built[i];
    return { key: `b${i}`, title: b.title, client: b.where.split(" · ")[0], year: b.year, tag: "Build", sum: b.sum, text: b.text, shots: b.shots, link: b.link, cover,
      nda: b.onRequest ? "Under NDA, so the live site and real figures are shared on request." : undefined };
  };
  const sh = (src: string, alt: string) => ({ src, alt });
  const NDA = "Under NDA, so the details are shared on request.";
  const tiles: Tile[] = [
    { key: "h0", title: highlights[0].title, client: "Microsoft", year: "2026", tag: "Research", sum: highlights[0].summary, cover: "work/cx-01.jpg", pos: "88% 50%", hl: 0 , big: true },
    { key: "h1", title: highlights[1].title, client: "Microsoft", year: "2025–26", tag: "AI product", sum: highlights[1].summary, cover: "work/frontier-1-start.jpg", hl: 1 , big: true },
    fromWork(3, "AI storytelling", { role: "Led the framework, the studio playbook and the video series, with production partners", scope: "Sovereignty & Digital Resilience Studios across global markets", outcome: "A playbook used across 18 languages and 20 Sovereign Cloud videos localized for markets around the world",  cover: "cover-sovereignty.jpg", extra: undefined,
      video: { src: "sovereign-cloud-en.mp4", poster: "cover-sovereignty.jpg", label: "Microsoft Sovereign Cloud, English" } }),
    fromWork(4, "AI storytelling", { role: "NVIDIA’s point of contact; led the explainer series from first requirements to brand review", scope: "Interactive kiosks in all 39 Innovation Hubs, timed for NVIDIA’s tentpole events", outcome: "Used in 500+ customer engagements, with equal Microsoft and NVIDIA visibility",  cover: "nvidia-station.jpg", extra: undefined, shots: [
      sh("nvidia-station.jpg", "Rendering of the Microsoft and NVIDIA Omniverse station: a wall screen, a touch table with architecture diagrams and a chip display"),
      sh("nvidia-architecture.jpg", "Touch-table screens mapping a digital-twin architecture from edge to cloud with NVIDIA Omniverse"),
    ] }),
    fromWork(10, "Research", { role: "Design Research Manager; managed two researchers and owned the research plan", scope: "The guest journey in the app and on site, including a nationwide guest survey of 178 completed responses", outcome: "A domestic pilot of new parking and breakfast services generated $2M+ in net profit, and a ranked shortlist of services to build next",  cover: "cover-sonder.jpg", pos: "50% 45%", shots: [
      sh("cover-sonder.jpg", "Sonder guest survey email: The whole truth. And nothing but."),
      sh("sonder-survey-objective.jpg", "Survey objective: understand guest preferences on services and amenities, with the launch email"),
      sh("sonder-survey-method.jpg", "Methodology: 2,670+ emails sent and 178 surveys answered, with the recruitment mix"),
      sh("sonder-survey-ranking.jpg", "Service category ranking: comfort and convenience first, then food and grocery, health and wellness, business and work, culture and experience"),
      sh("sonder-survey-love-like.jpg", "Which service categories guests love, like or don’t need"),
      sh("sonder-survey-painpoint.jpg", "Biggest service pain point in the app: limited information on services and amenities"),
      sh("sonder-top-services.jpg", "Top services: daily breakfast and snacks first, then bringing a pet, easy access parking and grocery delivery"),
      sh("sonder-brand-moment.jpg", "A brand-education screen tested with travelers: A world of choice"),
      sh("sonder-perceptions.jpg", "Positive guest perceptions: easy and inviting, good design, higher standards than Airbnb, technology-forward, standout services"),
      sh("sonder-opportunity.jpg", "Biggest opportunity: guests were still unsure whether Sonder is a hotel or a rental"),
      sh("sonder-service-journey.jpg", "Service journey: motivations, ideal outcomes and touchpoints from awareness to feedback"),
    ] }),
    fromWork(6, "Product & space", { role: "Client lead; the design studio BUMP led the design", scope: "A modular furniture system for 39 Innovation Hubs: four core units plus secondary units",  cover: "fds-cover.jpg", shots: [
      sh("fds-1.jpg", "Flexible Design System guideline cover: furniture units arranged for a demo, with visitors"),
      sh("fds-2.jpg", "The core units: demo node, signage node, productivity node and connector node"),
      sh("fds-3.jpg", "A growing system: the units reconfigured into new pieces"),
    ] }),
    fromWork(12, "Research", { cover: "cover-beautyhaven.jpg", pos: "50% 0%", role: "Senior Design Strategist; led the research, then concepted, project-managed and operationalized both services", scope: "Beauty Haven in Los Angeles, Newport Beach, Seattle and Oakbrook; research and a Fragrance Finder for the 7,500 sq ft New York beauty floor; the Havenly partnership in California and New Jersey", outcome: "+$15 average Beauty transaction and +9% Home category sales, scaled across 112 stores", shots: [
      sh("cover-beautyhaven.jpg", "Beauty Haven at Nordstrom: a blush-pink salon with velvet chairs and arched windows"),
      sh("nord-cover.jpg", "Nordstrom Beauty Haven, July 2018 – August 2019: how to modernize services to drive trips and spend on experiences"),
      sh("nord-realms.jpg", "The Four Realms of Experience framework, used to frame the opportunity"),
      sh("nord-primary-research.jpg", "Part 1 primary qualitative research: 10 interviews with Self-Care Moderns in LA, 7 Selfcare Moderns, 10 dscout diary studies, influencers and consumers"),
      sh("nord-retail-visits.jpg", "Retail visits: a landscape study of top beauty service destinations"),
      sh("nord-internet-cant.jpg", "The strategic frame: ‘The internet can’t do this. But Nordstrom can. With 119 stores and 11.4 million sq ft of self-care space.’"),
      sh("nord-millennial.jpg", "Target: the social-media-obsessed Millennial customer driving the growth of the beauty industry"),
      sh("nord-imperatives.jpg", "Design imperatives for the service"),
      sh("nord-concept.jpg", "Beauty Haven concept: a judgement-free zone, a one-stop beauty services destination with a new Concierge role"),
      sh("nord-service-components.jpg", "Service components: nail bar, brow bar, blow-out bar, trending service, health food and drinks, shareable moment"),
      sh("nord-branding.jpg", "Branding exploration: look and feel for Beauty Haven"),
      sh("nord-haven-moodboard.jpg", "Beauty Haven moodboard: products, textures and inspiration for the space"),
      sh("nord-haven-floorplan.jpg", "Beauty Haven floorplan for the pilot store"),
      sh("nord-flow.jpg", "Customer flow through the pilot space"),
      sh("nord-haven-collage.jpg", "Beauty Haven in store: the salon, product shelves, the neon sign and services"),
      sh("nord-haven-chair.jpg", "A Beauty Haven service chair beside a Treat Yo Self mirror"),
      sh("nord-haven-neon.jpg", "Beauty Haven neon sign over palm-leaf wallpaper, with the salon and a digital shade finder"),
      sh("nord-feedback.jpg", "Pilot feedback: customers found it more intimate and welcoming; employees said the new environment set them up to be more successful"),
      sh("nord-next-steps.jpg", "Next steps: expand across target doors"),
      sh("nord-fragrance-render.jpg", "Rendering of the Fragrance Finder station on the New York beauty floor"),
      sh("nord-fragrance-finder.jpg", "The Fragrance Finder installed in store"),
    ] }),
    fromWork(15, "Research", { role: "Strategy Director at VML; led research and launch strategy", scope: "Website and product pages for Acura’s first EV", outcome: "2,500+ early-interest signups and a 2–6% engagement lift",  cover: "cover-acura.jpg", shots: [
      sh("cover-acura.jpg", "Acura’s glowing grille under the word Electrified"),
      sh("acura-challenges.jpg", "Three challenges in the current car-buying experience: fragmented, unclear what to expect, not ready to buy solely online"),
      sh("acura-persona.jpg", "Persona: the first-time buyer, intrigued by EVs but not yet confident, with needs, concerns and Acura opportunities"),
      sh("acura-journey.jpg", "The first-time buyer’s journey from awareness through ownership and advocacy"),
      sh("acura-principles.jpg", "UX guiding principles: customer first, mobile enabled, task effectiveness, sophisticated experience"),
      sh("acura-personalization.jpg", "Personalization concepts for returning visitors: concierge help, shopping tools for the car they last viewed, and tailored brand content"),
      sh("acura-ownership.jpg", "Post-purchase concepts: an order-status tray and MyGarage"),
    ] }),
    fromWork(9, "Research", { role: "Lead Design Researcher; ran the research, wrote the launch narrative and facilitated executive workshops", scope: "National research with 100+ students, educators and policy stakeholders, behind the Foundation’s first U.S. education Grand Challenge", outcome: "416 applications from 26 countries; 15 planning grants and 11 pilots of up to $1M", cover: "cover-gates.jpg", pos: "50% 30%", shots: [
      sh("cover-gates.jpg", "Introducing Balance the Equation, a Grand Challenge for Algebra 1"),
      sh("gates-materials.jpg", "Design research materials: scenarios, cultural activities, discussion guide and post-it note field kit"),
      sh("gates-activity-booklet.jpg", "Personalized pre-interview booklet and activities sent to students and teachers"),
      sh("gates-diary.jpg", "Diary studies: students and teachers uploaded created material to a personalized booklet and Drive folder"),
      sh("gates-students.jpg", "21 priority students from CA, FL, GA, MD, NY, TX, VA and WA, all affected by the Algebra 1 gap"),
      sh("gates-interviews.jpg", "25+ student and educator interviews across 10 states, each 60–90 minutes on Zoom, each synthesized onto a postcard"),
      sh("gates-workshop.jpg", "Two-day virtual ideation workshop with 54 subject-matter experts in 9 breakout groups"),
      sh("gates-workshop-activities.jpg", "Workshop activities: stakeholder mapping, student-centered mapping and opportunity ideation"),
      sh("gates-workshop-feedback.jpg", "Workshop feedback: 76% of participants rated it very good or excellent"),
      sh("gates-miro.jpg", "Synthesis in Miro: 600+ digital stickies from the workshop organized into themes and pillars of intervention"),
      sh("gates-advisory.jpg", "Advisory council and working sessions after synthesis"),
      sh("gates-grand-challenge-final.jpg", "The launched Grand Challenge: Balance the Equation"),
    ] }),
    fromWork(8, "Retail design", { role: "Supported the creation of physical store design elements", scope: "Amazon Go and Amazon Go Grocery stores", outcome: "Shared on request", cover: "cover-amazongo-store.jpg", pos: "50% 40%", nda: NDA, text: undefined, shots: [sh("cover-amazongo-store.jpg", "Inside Amazon Go Grocery: a wall reading Use your app to enter, Bag as you shop, Just walk out"), sh("cover-amazongo.jpg", "Amazon Go Grocery is now open, shown as a story ad on a phone")] }),
    fromWork(7, "Research", { role: "Research frameworks and workshop materials (freelance)", scope: "Meta’s Responsible Innovation team and the product teams it partners with", outcome: "Principles turned into practical prompts teams use in their own planning",  cover: "cover-meta.jpg", pos: "50% 0%", shots: [sh("cover-meta.jpg", "Responsible Innovation Dimensions: It’s dangerous to go alone, take this")] }),
    fromWork(13, "Content strategy", { role: "Content strategy, at AKQA", scope: "IWC’s The Journal and the launch of Montblanc’s Summit smartwatch", outcome: "Shared on request",  title: "IWC & Montblanc", cover: "cover-iwc.jpg", pos: "50% 20%", nda: NDA, text: undefined, shots: [
      sh("cover-iwc.jpg", "IWC’s The Journal landing page with a kitesurfer and latest articles"),
      sh("cover-montblanc.jpg", "Montblanc Summit smartwatch launch page: Don’t just move forward. Be ahead."),
    ] }),
    fromWork(11, "Research", { role: "Research and UX strategy (freelance), with surefoot", scope: "10 moderated usability interviews across mobile and desktop, scored page by page", outcome: "11 prioritized opportunities, from homepage positioning to cart and delivery clarity", title: "Divi", cover: "cover-divi.jpg", pos: "50% 30%", shots: [
      sh("divi-cover.jpg", "Divi Original: a usability test of the Divi website, July–September 2022"),
      sh("divi-methodology.jpg", "Methodology: 10 users on mobile and desktop, each scoring task ease from 1 to 4 for an Average and Total Pain score"),
      sh("divi-scorecard-overview.jpg", "Scorecard overview: each participant’s 1–4 difficulty ratings for every task, with high-pain hotspots"),
      sh("divi-didnt-know.jpg", "Finding: participants didn’t know what Divi sold or that there was more than one product"),
      sh("divi-howto-mobile.jpg", "Finding: ‘How to’ was not optimized and illegible on a mobile device"),
      sh("divi-no-clarity.jpg", "Finding: no immediate clarity on function and use"),
      sh("divi-reviews.jpg", "Finding: skepticism around the trustworthiness and applicability of reviews"),
      sh("divi-payment-delivery.jpg", "Finding: insufficient information on payment and delivery before checkout"),
      sh("divi-quote.jpg", "Takeaway: site usability was good; Divi brand strategy and education have opportunities to expand"),
      sh("divi-opportunities-matrix.jpg", "Areas of opportunity plotted by business value and effort, with recommended strategic initiatives"),
    ] }),
    fromWork(14, "Environmental graphics", { role: "Environmental graphics, with Pentagram", scope: "The interior redesign of a home for jazz performance, archives and education", cover: "cover-rosehall.jpg", pos: "50% 55%", shots: [sh("cover-rosehall.jpg", "Jazz at Lincoln Center’s illuminated sign at dusk on Columbus Circle")] }),
  ];
  const talks: Tile[] = [
    { key: "t0", title: "Beyond the Prompt", client: "BrandsXCreators Summit", year: "2026", tag: "Speaking", cover: "speak-badge.jpg", pos: "50% 30%",
      sum: "A panel on storytelling and crafting impactful content in an automated world",
      role: "Panelist, speaking for Microsoft on content and storytelling",
      scope: "A one-day summit by Aeone at the AWS Skills Center, Seattle, for 250 senior marketing and sales leaders, founders and creators",
      text: "On July 30, 2026, I joined the content and storytelling panel at the BrandsXCreators Summit, hosted by the Seattle AI startup Aeone with the AWS Skills Center. The summit brought together marketing leaders, creators and technology teams from Amazon, YouTube, Microsoft and others to talk about how AI is changing the way brands reach audiences and how content is made and measured. Our panel, “Beyond the Prompt,” took on what good storytelling looks like when so much content can be automated.",
      shots: [{ src: "speak-badge.jpg", alt: "Angela’s speaker badge for the BrandsXCreators Summit, July 30, Seattle" }, { src: "speak-panel.jpg", alt: "Angela speaking into a microphone on the Beyond the Prompt panel, with the speaker badges on screen behind" }] },
  ];
  const aiTiles: Tile[] = [
    { ...fromBuilt(1, "built-yearbook-1.jpg"), role: "Concept, structure and every line of copy; Claude wrote the code", scope: "The Innovation Hub’s FY26 programs, as one interactive page" },
    { ...fromBuilt(0, "built-joe-1.jpg"), role: "Designed the experience and wrote every word; Claude wrote the code", scope: "Six days, seven neighborhoods, one-tap calendar adds", outcome: "Live, and used for the trip" },
    { ...fromBuilt(2, "cover-site.jpg"), role: "Concept, poses and writing; built with AI coding tools", scope: "Five sections, six outfits and one cat", outcome: "Live at angela-schmidt.com" },
  ];
  const nda = works.filter((x) => x.group === "nda");
  const all = [...tiles, ...talks, ...aiTiles];
  const i = all.findIndex((t) => t.key === sel);
  const t = i >= 0 ? all[i] : null;
  const toTop = () => setTimeout(() => document.querySelector(".drawer")?.scrollTo({ top: 0 }), 0);
  const open = (k: string | null) => { setSel(k); setStory(true); toTop(); };
  // every page change slides in the same way as switching sections
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = document.querySelector(".drawer .sheet");
    if (el) gsap.fromTo(el, { autoAlpha: 0, x: 50 }, { autoAlpha: 1, x: 0, duration: 0.6, ease: "power3.out" });
  }, [sel]);

  const Grid = ({ list }: { list: Tile[] }) => (
    <ul className="agrid">
      {list.map((x) => (
        <li key={x.key}>
          <button className="atile" onClick={() => open(x.key)} aria-label={[x.title, x.client, x.year].filter(Boolean).join(", ")}>
            <span className={`atile-art ${x.cover ? "" : `is-type tone-${x.tone ?? "paper"}`}`}>
              {x.cover ? <img src={img(x.cover)} alt="" loading="lazy" style={x.pos ? { objectPosition: x.pos } : undefined} /> : <span className="ptile-word">{x.client}</span>}
            </span>
            <span className="atile-cap"><span className="atile-title">{x.title}</span><span className="atile-year">{x.year}</span></span>
            <span className="atile-client">{x.client}</span>
          </button>
        </li>
      ))}
    </ul>
  );
  if (t) {
    const next = all[(i + 1) % all.length];
    return (
      <section aria-labelledby="h-portfolio" className="pdetail">
        <button className="text-btn pback" onClick={() => open(null)}>← All work</button>
        {t.hl !== undefined ? (
          <HighlightBlock h={highlights[t.hl]} idx={t.hl} onOpen={onOpen} kicker={`${t.client} · ${t.tag}${t.year ? ` · ${t.year}` : ""}`} />
        ) : (
          <article className="highlight">
            <p className="kicker">{t.client} · {t.tag}{t.year ? ` · ${t.year}` : ""}</p>
            <h2 id="h-portfolio" className="h2">{t.title}</h2>
            <p className="lede pd-sum">{t.sum}</p>
            {(t.role || t.scope || t.outcome) && (
              <dl className="facts">
                {t.role && <><dt>Role</dt><dd>{t.role}</dd></>}
                {t.scope && <><dt>Scope</dt><dd>{t.scope}</dd></>}
                {t.outcome && <><dt>Outcome</dt><dd>{t.outcome}</dd></>}
              </dl>
            )}
            {t.text && <p className="body pd-text">{t.text}</p>}
            {t.extra && <p className="small">{t.extra}</p>}
            {t.video && (
              <figure className="pvideo">
                <video controls preload="none" playsInline poster={img(t.video.poster)} src={img(t.video.src)} />
                <figcaption className="small">{t.video.label}</figcaption>
              </figure>
            )}
            {t.link && <p><a className="text-btn" href={t.link.href} target="_blank" rel="noreferrer">{t.link.label}</a></p>}
            {t.nda && <p className="small">{t.nda}</p>}
            {t.shots && t.shots.length > 0 && <ShotGrid list={t.shots} title={t.title} onOpen={onOpen} />}
          </article>
        )}
        <div className="pnext">
          <button className="text-btn" onClick={() => open(null)}>← All work</button>
          <button className="text-btn" onClick={() => open(next.key)}>Next project: {next.title} →</button>
        </div>
      </section>
    );
  }

  return (
    <section aria-labelledby="h-portfolio">
      <div className="ahead"><h2 id="h-portfolio" className="atitle">Work</h2><span className="apill">{tiles.length} projects</span></div>
      <p className="adesc">Experience strategy, research &amp; AI storytelling, 2014 to now.</p>
      <Grid list={tiles} />
      <div className="ahead" id="speaking"><h3 className="atitle">Speaking</h3><span className="apill">{talks.length}</span></div>
      <p className="adesc">Panels and talks on storytelling, content and AI.</p>
      <Grid list={talks} />
      <div className="ahead" id="builds"><h3 className="atitle">Builds</h3><span className="apill">{aiTiles.length}</span></div>
      <p className="adesc">Interactive sites I designed and shipped, where I wrote every word and shaped every page.</p>
      <Grid list={aiTiles} />
      {nda.length > 0 && (
        <div className="pnda">
          <p className="ptile-tag">Also, under NDA</p>
          <p className="body">{nda.map((x) => `${x.title} (${x.client.split(" · ")[0]})`).join(" · ")}. <a href={`mailto:${profile.email}?subject=${encodeURIComponent("Work under NDA")}`}>{nda.length > 1 ? "Ask me about any of these" : "Ask me about it"}</a>.</p>
        </div>
      )}
    </section>
  );
}

/* ---------------- Spaces & installations ---------------- */
export function Spaces({ onOpen }: { onOpen: Open }) {
  const shots: Shot[] = spaces.filter((p) => p.src).map((p) => ({ src: p.src, alt: p.alt, title: `${p.title} · ${p.year}`, caption: p.text }));
  return (
    <section aria-labelledby="h-spaces">
      <div className="ahead"><h2 id="h-spaces" className="atitle">Spaces &amp; installations</h2><span className="apill">{spaces.length} projects</span></div>
      <p className="adesc">Rooms, storefronts and things you can squeeze: physical work, mostly in and around Seattle.</p>
      <ul className="agrid">
        {spaces.map((p, i) => (
          <li key={p.src}>
            {p.src ? (
              <button className="atile" onClick={() => onOpen(shots, shots.findIndex((x) => x.src === p.src))} aria-label={`Open ${p.title}`}>
                <span className="atile-art"><img src={img(p.src)} alt={p.alt} loading="lazy" /></span>
                <span className="atile-cap"><span className="atile-title">{p.title}</span><span className="atile-year">{p.year}</span></span>
                <span className="atile-client">{p.where}</span>
              </button>
            ) : (
              <div className="atile">
                <span className="atile-art is-type tone-paper"><span className="atile-note">{p.text}</span></span>
                <span className="atile-cap"><span className="atile-title">{p.title}</span><span className="atile-year">{p.year}</span></span>
                <span className="atile-client">{p.where}</span>
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ---------------- Writing ---------------- */
export function Writing() {
  return (
    <section aria-labelledby="h-writing">
      <div className="ahead"><h2 id="h-writing" className="atitle">Writing</h2><span className="apill">Substack</span></div>
      <p className="adesc"><em>{writing.title}.</em> {writing.intro}</p>
      <p><a className="text-btn" href={writing.home} target="_blank" rel="noreferrer">Read on Substack ↗</a></p>
      <p className="hint">Hover or focus a post for its opening line</p>
      <ul className="posts">
        {writing.posts.map((p, i) => (
          <li key={p.slug}>
            <a className="post" href={`https://schmidtykitty.substack.com/p/${p.slug}`} target="_blank" rel="noreferrer" data-showcase={i === 0 ? "post" : undefined}>
              <span className="date">{p.date}</span>
              <span className="post-main">
                <span className="post-title">{p.title}</span>
                <span className="post-sub">{p.sub}</span>
                <span className="post-ex">{p.excerpt}</span>
              </span>
              <span className="post-go" aria-hidden="true">↗</span>
            </a>
          </li>
        ))}
      </ul>
      <p className="small">@schmidtykitty · {writing.tagline}</p>
      <div className="ahead section-gap published-h"><h3 className="atitle">Published</h3><span className="apill">{writing.published.length}</span></div>
      <ul className="published">
        {writing.published.map((w) => (
          <li key={w.title}>
            <a className="pub" href={w.href} target="_blank" rel="noreferrer">
              <img src={img(w.src)} alt="" loading="lazy" />
              <span className="pub-main">
                <span className="ptile-tag">{w.where} · {w.year}</span>
                <span className="post-title">{w.title}</span>
                <span className="small">{w.text}</span>
                <span className="text-btn">Read in ARCADE (PDF) ↗</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ---------------- Books ---------------- */
function YearChart() {
  const data = books.years;
  const [sel, setSel] = useState<number>(data.length - 1);
  const ref = useRef<SVGSVGElement>(null);
  const max = 22;
  const W = 640, H = 260, L = 46, B = 46, T = 14, Rr = 8;
  const bw = (W - L - Rr) / data.length;

  const [y, n] = data[sel];
  return (
    <figure className="chart">
      <figcaption className="chart-cap">
        <span className="chart-big">{n}</span> books shelved in <span className="chart-big">{y}</span>
      </figcaption>
      <svg ref={ref} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Bar chart of books Angela shelved on Goodreads per year, 2011 to 2026">
        {[0, 5, 10, 15, 20].map((t) => {
          const yy = H - B - (t / max) * (H - B - T);
          return (
            <g key={t}>
              <line x1={L} x2={W - Rr} y1={yy} y2={yy} className="grid" />
              <text x={L - 8} y={yy + 4} textAnchor="end" className="tick">{t}</text>
            </g>
          );
        })}
        {data.map(([yr, c], i) => {
          const h = (c / max) * (H - B - T);
          const x = L + i * bw + 3;
          return (
            <g key={yr}>
              <rect
                className={`bar ${i === sel ? "is-sel" : ""}`}
                style={{ animationDelay: `${i * 35}ms` }}
                x={x} y={H - B - h} width={bw - 6} height={h}
                tabIndex={0}
                role="button"
                aria-label={`${yr}: ${c} books`}
                onMouseEnter={() => setSel(i)}
                onFocus={() => setSel(i)}
                onClick={() => setSel(i)}
              />
              {i % 3 === 0 || i === data.length - 1 ? <text x={x + (bw - 6) / 2} y={H - B + 16} textAnchor="middle" className="tick">{yr}</text> : null}
            </g>
          );
        })}
        <text x={(W + L) / 2} y={H - 6} textAnchor="middle" className="axis">Year shelf on Goodreads</text>
        <text x={14} y={(H - B) / 2} textAnchor="middle" className="axis" transform={`rotate(-90 14 ${(H - B) / 2})`}>Books</text>
      </svg>
      <p className="hint">Tap a year</p>
    </figure>
  );
}

function BookCover() {
  const srcs = [books.current.cover, books.current.coverAlt].filter(Boolean) as string[];
  const [n, setN] = useState(0);
  if (n >= srcs.length) {
    return (
      <span className="current-cover type-cover" role="img" aria-label={`Cover of ${books.current.title} by ${books.current.author}`}>
        <span className="tc-title">{books.current.title}</span><span className="tc-author">{books.current.author}</span>
      </span>
    );
  }
  return <img className="current-cover" src={srcs[n]} alt={`Cover of ${books.current.title} by ${books.current.author}`} onError={() => setN(n + 1)} onLoad={(e) => { if ((e.currentTarget as HTMLImageElement).naturalWidth < 20) setN(n + 1); }} />;
}

export function Books() {
  return (
    <section aria-labelledby="h-books">
      <div className="ahead"><h2 id="h-books" className="atitle">Books</h2><span className="apill">Reading</span></div>
      <p className="adesc">What I’m reading now.</p>
      <div className="current has-cover">
        <BookCover />
        <div>
          <span className="small">Currently reading</span>
          <p className="current-title">{books.current.title}</p>
          <p className="body">by {books.current.author}</p>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Ballet ---------------- */
export function Ballet({ onOpen }: { onOpen: Open }) {
  const film: Shot & { isVideo: true } = { src: `https://i.ytimg.com/vi/${ballet.video.id}/hqdefault.jpg`, alt: `${ballet.video.title}, ${ballet.video.credit}`, title: ballet.video.title, caption: ballet.video.credit, youtube: ballet.video.id, isVideo: true };
  const stage: (Shot & { isVideo?: boolean })[] = [film, ...ballet.photos.map((p) => ({ src: p.src, alt: p.alt, title: "Angela Schmidt", caption: p.caption }))];
  const shots: Shot[] = [{ src: ballet.portrait.src, alt: ballet.portrait.alt, title: "Angela Schmidt" }, ...stage];
  return (
    <section aria-labelledby="h-ballet">
      <div className="profile">
        <figure className="profile-photo">
          <button className="piece-btn" onClick={() => onOpen(shots, 0)} aria-label="Open the portrait">
            <img src={img(ballet.portrait.src)} alt={ballet.portrait.alt} width={1000} height={1500} />
          </button>
        </figure>
        <div className="profile-main">
          <div className="profile-head">
            <div>
              <h2 id="h-ballet" className="profile-name">Angela Schmidt</h2>
              <p className="profile-role">Dancer · Actor</p>
            </div>
            <a className="profile-contact" href={`mailto:${profile.email}?subject=${encodeURIComponent("Performance")}`}>✉ Contact Angela</a>
          </div>
          <h3 className="profile-label">Biography</h3>
          <p className="profile-bio">{ballet.intro} {ballet.short}</p>
          <dl className="profile-grid">
            {ballet.details.filter((d) => d.value).map((d) => (
              <div key={d.label}><dt>{d.label}</dt><dd>{d.value}</dd></div>
            ))}
          </dl>
        </div>
      </div>

      {ballet.credits.length > 0 && (
        <>
          <div className="ahead profile-after"><h3 className="atitle">Credits</h3></div>
          <dl className="credits-list">
            {ballet.credits.map((c) => (
              <div key={c.group}>
                <dt>{c.group}</dt>
                <dd>{c.items.map((it, i) => (
                  <span key={typeof it === "string" ? it : it.text}>{i > 0 && <span className="sep" aria-hidden="true"> · </span>}{typeof it === "string" ? it : <>{it.text} <a className="credit-link" href={it.link.href} target="_blank" rel="noreferrer">{it.link.label} ↗</a></>}</span>
                ))}</dd>
              </div>
            ))}
          </dl>
        </>
      )}

      <div className="ahead section-gap"><h3 className="atitle">On stage and screen</h3><span className="apill">{ballet.photos.length} photos · 1 video</span></div>
      <ul className="agrid">
        {stage.map((p, i) => (
          <li key={p.src}>
            <button className="atile" onClick={() => onOpen(shots, i + 1)} aria-label={p.isVideo ? `Play ${p.title} music video` : `Open ${p.alt}`}>
              <span className={`atile-art ${p.isVideo ? "is-video" : ""}`}>
                <img src={img(p.src)} alt={p.alt} loading="lazy" decoding="async" onError={(e) => { e.currentTarget.style.visibility = "hidden"; }} />
                {p.isVideo && <span className="atile-play" aria-hidden="true">▶</span>}
              </span>
              {p.isVideo ? <span className="atile-client">{p.title} · {p.caption}</span> : p.caption && <span className="atile-client">{p.caption}</span>}
            </button>
          </li>
        ))}
      </ul>

      {ballet.links.length > 0 && (
        <>
          <h3 className="h3">Past dancing</h3>
          <ul className="posts">
            {ballet.links.map((l) => (
              <li key={l.url}>
                <a className="post" href={l.url} target="_blank" rel="noreferrer">
                  <span className="date" />
                  <span className="post-main"><span className="post-title">{l.title}</span></span>
                  <span className="post-go" aria-hidden="true">↗</span>
                </a>
              </li>
            ))}
          </ul>
        </>
      )}

    </section>
  );
}

/* ---------------- Side projects ---------------- */
export function Side({ onOpen }: { onOpen: Open }) {
  const shots: Shot[] = studio.pieces.map((p) => ({ src: p.src, alt: p.alt, title: `${p.title} · ${p.kind}`, caption: p.text }));
  return (
    <section aria-labelledby="h-side">
      <p className="kicker">Side Quests</p>
      <nav className="quest-nav" aria-label="Side quests">
        {([["h-side", "Poets of Gesture"], ["h-spaces", "Spaces & installations"], ["h-books", "Books"], ["h-writing", "Writing"]] as const).map(([id, label], i) => (
          <span key={id}>
            {i > 0 && <span aria-hidden="true"> · </span>}
            <button className="text-btn" onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })}>{label}</button>
          </span>
        ))}
      </nav>
      <div className="ahead"><h2 id="h-side" className="atitle">{studio.name}</h2><span className="apill">{studio.pieces.length} pieces</span></div>
      <p className="adesc">{studio.intro}</p>
      <p className="adesc muted-line">{studio.motto} · <a href={studio.instagram} target="_blank" rel="noreferrer">@poetsofgesture ↗</a></p>
      <ul className="agrid">
        {studio.pieces.map((p, i) => {
          const m = p.kind.match(/^(.*),\s*(\d{4})$/);
          return (
            <li key={p.src}>
              <button className="atile" onClick={() => onOpen(shots, i)} aria-label={`Open ${p.title}`}>
                <span className="atile-art"><img src={img(p.src)} alt={p.alt} loading="lazy" /></span>
                <span className="atile-cap"><span className="atile-title">{p.title}</span><span className="atile-year">{m ? m[2] : ""}</span></span>
                <span className="atile-client">{m ? m[1] : p.kind}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* ---------------- Lightbox ---------------- */
export function Lightbox({ list, index, onClose, onIndex }: { list: Shot[]; index: number; onClose: () => void; onIndex: (i: number) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const shot = list[index];
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onIndex((index + 1) % list.length);
      if (e.key === "ArrowLeft") onIndex((index - 1 + list.length) % list.length);
    };
    window.addEventListener("keydown", onKey);
    ref.current?.querySelector<HTMLButtonElement>(".lb-close")?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [index, list.length, onClose, onIndex]);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!imgRef.current) return;
    gsap.fromTo(imgRef.current, { scale: 0.94, autoAlpha: 0, filter: "grayscale(1)" }, { scale: 1, autoAlpha: 1, filter: "grayscale(0)", duration: 0.6, ease: "power3.out" });
  }, [index]);
  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={shot.title ?? shot.alt} ref={ref} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <button className="mini lb-close" onClick={onClose}>Close</button>
      <figure className="lb-fig">
        {shot.youtube ? (
          <div className="lb-video"><iframe src={`https://www.youtube-nocookie.com/embed/${shot.youtube}?autoplay=1`} title={`${shot.title ?? "Video"}`} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen /></div>
        ) : (
          <img ref={imgRef} src={img(shot.src)} alt={shot.alt} />
        )}
        <figcaption>
          {shot.title && <p className="lb-title">{shot.title}</p>}
          {shot.caption && <p className="body">{shot.caption}</p>}
          {shot.youtube && <p className="small"><a href={`https://www.youtube.com/watch?v=${shot.youtube}`} target="_blank" rel="noreferrer">Watch on YouTube ↗</a></p>}
          {list.length > 1 && (
            <p className="lb-nav">
              <button className="mini" onClick={() => onIndex((index - 1 + list.length) % list.length)}>← Prev</button>
              <span className="small">{index + 1} / {list.length}</span>
              <button className="mini" onClick={() => onIndex((index + 1) % list.length)}>Next →</button>
            </p>
          )}
        </figcaption>
      </figure>
    </div>
  );
}
