// Flat file names so a GitHub web upload (which drops folders) still works.
export const flat = (p: string) => (p.startsWith("doll-") ? p.replace("/", "-") : p.split("/").pop()!);
export const img = (p: string) => (/^https?:/.test(p) ? p : `${import.meta.env.BASE_URL}${flat(p)}`);

/**
 * The sections the string cycles through, in pull order.
 * To add one later: add an entry here (id, label, line), give it a pose in
 * Puppet.tsx POSES and a reaction in CAT, and its content in sections.tsx.
 */
export const SECTIONS = [
  { id: "hello", label: "About", line: "I do experience strategy, research and AI storytelling." },
  { id: "portfolio", label: "Work", line: "Case studies from Microsoft, Nordstrom, Sonder, the Gates Foundation and more." },
  { id: "ballet", label: "Performance", line: "Reformed bunhead that finds the most joy in movement and performing." },
  { id: "side", label: "Side Quests", line: "Poets of Gesture · Books on Goodreads · Writing on Substack" },
  { id: "contact", label: "Contact", line: "Email, LinkedIn and Substack" },
] as const;

/** Ballet: drawn from her own site and studio; add past dancing links to `links` */
export const ballet = {
  line: "Ballet taught me the rest: hard things should look effortless.",
  belief: "A body in space knows things a spreadsheet never will.",
  portrait: { src: "work/dance-pointe.jpg", alt: "Black and white portrait: Angela seated on a wooden floor hugging one leg raised straight up en pointe, cheek resting on it" },
  barre: "These are phrases I’ve told myself many a time at the barre, or in new pointe shoes, catching that slippery piece of Marley. There’s always that one spot…",
  pieces: [
    { src: "work/pog-first.jpg", title: "First", kind: "Ceramic, 2023", alt: "Photographed legs standing in first position inside two sculpted black ceramic shoes, titled First", text: "From Positions: the five foundational positions of ballet rendered as sultry lacquered candlestick boots. Legs a flame for days." },
    { src: "work/pog-napkins.jpg", title: "Napkin Series", kind: "Embroidery, 2022", alt: "Black cotton napkins embroidered in white thread with outlined dancers in arabesque and attitude, on acid green", text: "“Release ya wiggle,” as Beyoncé would say. Four cotton napkins embroidered with some weirdos feeling themselves, and contributing to the no-more-paper-towels revolution. Get it." },
  ],
  reading: [
    { title: "Lingering Longer On: Meredith Monk: Education of the Girlchild (1972)", sub: "The pioneer of interdisciplinary performance.", slug: "lingering-longer-on-meredith-monk" },
    { title: "Lingering Longer On: Waltz of the Shadows: Gold Diggers (1933)", sub: "A film with synchronized movements to bewitch the eyes.", slug: "lingering-longer-on-waltz-of-the" },
  ],
  links: [] as { title: string; url: string }[],
  /** her dance CV, in her words */
  intro: "Reformed bunhead that finds the most joy in movement and performing.",
  acting: "I've recently started acting, training at Freehold Theatre Acting School.",
  /** casting-profile details; empty values stay hidden until filled in */
  details: [
    { label: "Pronouns", value: "She/Her" },
    { label: "Height", value: "5′5″" },
    { label: "Casting age range", value: "Late 20s to late 30s" },
    { label: "Hair", value: "Dark brown" },
    { label: "Eye color", value: "Blue" },
    { label: "Dance styles", value: "Ballet, jazz, contemporary, burlesque" },
  ] as { label: string; value: string }[],
  short: "Trained in classical ballet from age 13, I’ve danced with ballet companies and dance collectives from the East Coast to Seattle, and in music videos, brand campaigns and movement-based art projects. I’ve recently started acting, too. The full list is below.",
  bio: "Angela began dance at the age of 13 at Michigan Classical Ballet Company. She attended summer intensives at the Boston Ballet, Kirov Academy in Washington D.C., Burklyn Ballet Theatre, and Ballet Austin. She has performed with the Albano Ballet Company, Jersey City Ballet, and appeared in Valentina Kozlova's International Ballet Competition, Concord Dance Collective, Julie Tobiason's Ballet Bird, Jerboa Dance, Verlaine and McCann productions, Seattle Dance Theatre, The Guild Collective, Synergy.newyorkcity, Kat Wildish's NYC Showcase, as well as appearing in music videos, brand campaigns, and movement-based art projects.",
  credits: [
    { group: "Appeared / Performed in", items: ["Albano Ballet Company", "Jersey City Ballet", "Dance This!, performing choreography by José Limón", "Valentina Kozlova's International Ballet Competition", "Concord Dance Collective", "Julie Tobiason's Ballet Bird", "Jerboa Dance", "Verlaine and McCann productions", "Seattle Dance Theatre", "The Guild Collective", "Synergy.newyorkcity", "Kat Wildish's NYC Showcase"] },
    { group: "Exhibited in", items: ["OUTCRY by Whitney Bradshaw, Photographic Center Northwest, Seattle: portraits from a group scream session"] },
  ] as { group: string; items: (string | { text: string; link: { label: string; href: string } })[] }[],
  /** her own stage and rehearsal photos */
  photos: [
    { src: "perf-body.jpg", alt: "Black and white photo: Angela in a black leotard and knee-high boots, arms spread wide in a tilted dance pose" },
    { src: "work/angela-portrait.jpg", alt: "Angela Schmidt mid high kick in a black pleated, fringed dress and boots" },
    { src: "work/dance-spin.jpg", alt: "Four dancers spinning on stage in violet and red dresses against a violet cyclorama, skirts flaring" },
    { src: "work/dance-spotlight.jpg", alt: "A dancer in a geometric-patterned unitard in a deep side arch, one arm reaching up, inside a single warm spotlight on a black stage" },
    { src: "work/dance-candelabra.jpg", alt: "Two dancers in gold lamé costumes and candelabra headdresses in a partnered leg extension before a black mandala backdrop" },
    { src: "dance-red-cloth.jpg", alt: "Angela en pointe in a pale blue dress, arms outstretched and lifted on a sweep of red fabric before stained-glass windows" },
    { src: "dance-feathers.jpg", alt: "Dancers in white gowns with large feather fans in arabesques on a violet-lit stage" },
    { src: "work/dance-shoulderstand.jpg", alt: "Black and white photo: Angela laughing upside down in a shoulder stand, one bare foot pointed at the ceiling, the other leg bent, arms flat on the floor" },
    { src: "outcry.jpg", alt: "OUTCRY wall of twelve screaming portraits on the Photographic Center Northwest building; Angela is bottom right", caption: "OUTCRY by Whitney Bradshaw, Photographic Center Northwest" },
  ] as { src: string; alt: string; caption?: string }[],
  video: { id: "Nm1y4Urr6YE", title: "Youryoungbody, “OD”", credit: "Music video, dir. Úna Blue" },
};

/** Ma: when the page is left still, one of these drifts into the empty space */
export const MA_LINES = [
  "A body in space knows things a spreadsheet never will.",
  "Movement will save us all.",
  "Architecture in Motion.",
  "When the costume matches the set.",
  "Ballet taught me the rest: hard things should look effortless.",
  "Grain over gloss.",
  "The best ideas live at the edge of disciplines.",
  "Dancing till the end.",
];

/** the short About, shown on the first screen and at the top of About (draft: Angela can rewrite) */
export const tagline = "Part investigator, part storyteller.";
export const landingLine = "Part investigator, part storyteller. Endlessly curious.";
export const bio = "I do experience strategy, research and AI storytelling: I find out what people actually need, then turn it into products and stories they love.";
export const bioThesis = "Trained as a ballerina, an architect, a strategist and a storyteller. Each one taught me the same thing by a different name: structure. I come to every brief with a feel for system and rhythm, an architect’s way of organizing chaos, and a dancer’s attention to the sensory details — pace, scale, word choice — that make a product, a page or a pitch land.";
export const bioLead = "I’ve managed 2–3 researchers and strategists in past roles, and today I lead 3–4 agency teams at a time across a $2.5M+ global program.";

export const profile = {
  name: "Angela Schmidt",
  role: "Experience strategy, research & AI storytelling",
  email: "aschmidty.kitty@gmail.com",
  linkedin: "https://www.linkedin.com/in/angelamschmidt/",
  substack: "https://substack.com/@schmidtykitty",
};

export const about = {
  title: "Part investigator, part storyteller",
  text: "I live in the messy bit between understanding something and making something from it, where strategy and design work as one discipline, not two. That's how I shape products, experiences and content, and the stories that make them land with people. Ballet taught me the rest: hard things should look effortless.",
  beliefs: [
    "The best ideas live at the edge of disciplines.",
    "A body in space knows things a spreadsheet never will.",
    "The most enduring brands run on poetic logic: rigorous, felt, and impossible to copy.",
  ],
  // the path, from the years and clients of her own work list (fields of work, not job titles)
  path: [
    { year: "2024–present", what: "Experience strategy and AI storytelling", where: "Microsoft" },
    { year: "2023–24", what: "Strategy Director, product and launch strategy", where: "VML" },
    { year: "2021–22", what: "Design Research Manager, guest experience", where: "Sonder" },
    { year: "2020–21", what: "Lead Design Researcher, education", where: "Gates Foundation" },
    { year: "2019", what: "CX Researcher, Product & Physical Retail", where: "Amazon Go Grocery" },
    { year: "2017–19", what: "Senior Design Strategist, innovation", where: "Nordstrom" },
    { year: "2017", what: "Content strategy", where: "AKQA, for IWC and Montblanc" },
    { year: "2014", what: "UX design and information architecture", where: "Razorfish" },
    { year: "2014", what: "Environmental design", where: "Pentagram, for Jazz at Lincoln Center" },
    { year: "2007–11", what: "Bachelor of Science in architecture", where: "University of Michigan" },
  ],
  howIWork: [
    { phase: "Immersion", lede: "Understand where things stand, where they’re going and how we’ll work together.", items: ["Mission and vision alignment workshop", "Current experience audit: product, content, program", "Stakeholder sessions", "Brand guidelines review"] },
    { phase: "Research & analysis", lede: "Get to know the people and the landscape well enough to see the opportunities.", items: ["Market research", "Industry benchmarks and competitive analysis", "Interviews and diary studies", "Personas and experience journeys", "Data and analytics insights"] },
    { phase: "Strategic solutions", lede: "Define and visualize the experience, and tell a story people feel.", items: ["Brand guidelines", "Program recommendations", "Content development", "Creative direction", "Communication framework", "Feedback mechanisms"] },
  ],
  boards: [
    { year: "2025–26", what: "Board member", where: "On the Boards" },
    { year: "2020–23", what: "Board member", where: "ARCADE" },
  ],
  clients: ["Microsoft", "Meta", "Amazon", "Gates Foundation", "Acura", "IWC", "Montblanc", "Nordstrom", "Sonder", "Divi"],
  contactTitle: "Let's talk about what you're launching",
  contactText: "If you're making something new and want people to love it, write to me.",
  note: "Some work is summarized to respect confidentiality.",
};

export type Highlight = {
  client: string;
  title: string;
  summary: string;
  role: string;
  scope: string;
  outcome: string;
  story: { heading?: string; paras: string[] }[];
  slides: { src: string; alt: string }[];
  link?: { label: string; href: string };
};

export const highlights: Highlight[] = [
  {
    client: "Microsoft · Human-centered design research",
    title: "The Exceptional Hub Experience",
    summary:
      "Strong sessions, weak relays. An inside-out study of the people, processes and places behind 39 Innovation Hubs, and a plan to make every visit exceptional.",
    role: "Wrote the brief, led the research, owned the strategy",
    scope: "39 Hubs across the Americas, EMEA and Asia, within the $2.5M+ global program I manage",
    outcome: "5 of 18 recommendations funded within two quarters of delivery",
    story: [
      {
        heading: "About",
        paras: [
          "The Innovation Hub is Microsoft's global network of 39 customer engagement centers, where executive customer teams come for business envisioning, solution envisioning, architecture design and rapid prototyping, and work hands-on with Microsoft experts on their AI and cloud transformation. I set out to define what an exceptional Hub experience should be, measure where today's falls short, and build the plan to close the gap. I wrote the brief, led the research and steered the strategy from kickoff to final delivery, with an external design research team supporting execution.",
        ],
      },
      {
        heading: "Context",
        paras: [
          "At the Hub, the experience is the product. A customer's day runs from the invitation through arrival, welcome, the working session, a shared meal and discovery, to follow-up, and every one of those moments either builds their confidence in Microsoft or quietly chips away at it. I framed the customer as a guest and the Hub as host, and judged each moment on three things: are their needs anticipated, is the effort we ask of them worth it, and does their view of Microsoft grow as the day unfolds.",
          "39 global Hubs, each with its own unique layout. 10–20 decision makers per session, from C-suite to architects. 3+ visits per customer journey, each booked about 6 weeks ahead.",
        ],
      },
      {
        heading: "What happened",
        paras: [
          "I designed this as an inside-out study of the host side: the people, processes and places Microsoft controls. Site Directors and Solution Engineers sit in customer sessions week after week, so they became our expert witnesses. We walked every customer touchpoint on site ourselves, then tested what we saw at two Hubs against the whole network. Validating the findings directly with customers is the natural next phase.",
          "The study mapped a customer’s whole day as a journey, from the invitation weeks ahead through arrival, welcome, the working session, meals and discovery spaces, to follow-up, with how long each stage lasts. The map showed where the experience thins out: before and after the session, where scheduling and next steps depend on one person’s bandwidth and no one clearly owns the hand-off.",
          "25 in-depth interviews, from Solution Engineers to global leaders. 2 site walkthroughs, in Amsterdam and Chicago. 2 global surveys: 11 Site Directors and 29 Solution Engineers responded. A competitive review of how hyperscalers, AI labs and consultancies host their customers.",
        ],
      },
      {
        heading: "Results",
        paras: [
          "The finding held in every region: the sessions in the room are strong, but the experience around them doesn't keep pace. The work produced a reusable framework for designing, measuring and funding the Hub experience everywhere, and a prioritized plan to fix it.",
          "91% of Site Directors trust a good session to produce next steps, yet unclear ownership causes 47% of stalls. 83% of Solution Engineers act as trusted advisors, but 69% say their KPIs miss long-term customer impact. Physical space is the top investment priority, at 40% of Solution Engineer responses. 18 recommendations sequenced on a Now, Next, Later roadmap. 5 of 18 recommendations funded within two quarters of delivery.",
        ],
      },
    ],
    slides: [
      { src: "work/cx-01.jpg", alt: "People, process and place: the three forces that shape customer experience" },
      { src: "work/cx-04.jpg", alt: "Journey map: a customer’s day at the Innovation Hub, from invitation to follow-up" },
      { src: "work/cx-02.jpg", alt: "The framework: customer impact through people, process and place" },
      { src: "work/cx-03.jpg", alt: "Research at a glance: 25 interviews, 2 site walkthroughs, 2 global surveys, 39 locations" },
      { src: "work/cx-05.jpg", alt: "Survey finding: strong sessions, weak relays" },
      { src: "work/cx-06.jpg", alt: "Amsterdam site walkthrough: photos and floor plan" },
      { src: "work/cx-07.jpg", alt: "How each recommendation is built" },
      { src: "work/cx-08.jpg", alt: "Roadmap, scale and investment criteria" },
      { src: "work/cx-09.jpg", alt: "Decision matrix sorting recommendations by cost and customer impact" },
      { src: "work/cx-10.jpg", alt: "Suggested Now, Next, Later roadmap" },
    ],
  },
  {
    client: "Microsoft · AI product, 0→1",
    title: "Becoming Frontier",
    summary:
      "A 60-second walk-up quiz that tells a customer where they stand with AI, and gives the Hub team a sharper first conversation.",
    role: "Concept, question and stage design, copy; directed the build partner",
    scope: "All 39 Innovation Hubs and a 50+ city tour",
    outcome: "Adopted by every Hub; Solution Engineers use the results to scope customer engagements",
    story: [
      {
        paras: [
          "Microsoft's AI Readiness Framework places customers in five stages by how far along they are with AI, and readiness means more than technology: it takes strategy, culture, governance and organizational alignment to scale AI responsibly. That's a lot to bring into a first meeting. I turned it into Becoming Frontier, a 60-second walk-up experience that works as both a conversation starter and a diagnostic.",
          "Visitors answer five questions, each with four answers that climb a ladder of operational maturity. Instead of a score, they get a readiness stage, practical topics to discuss with the Hub team, and a QR code to more resources, which shifts the moment from assessment to conversation. I defined the stages, questions and core copy and directed the vendor team that built it. Anonymous tracking of completion, stage distribution and drop-off now guides each iteration. It runs in all 39 Innovation Hubs and is touring 50+ cities through 2027.",
        ],
      },
    ],
    slides: [
      { src: "work/frontier-1-start.jpg", alt: "Start screen: Becoming Frontier starts here, a 60-second progress check" },
      { src: "work/frontier-2-question.jpg", alt: "Opening question asking what brings the visitor to the Innovation Hub" },
      { src: "work/frontier-3-results.jpg", alt: "Results screen placing the organization at the Scaling stage, with discussion topics and a QR code" },
      { src: "work/frontier-4-nvidia-station.jpg", alt: "Rendering of the quiz station beside a Microsoft and NVIDIA demo in a Hub" },
      { src: "work/frontier-5-kiosk.jpg", alt: "Concept rendering of the walk-up kiosk with four physical answer buttons" },
    ],
    link: { label: "Watch the overview ↗", href: "https://vimeo.com/greenroominc/becomingfrontierquiz" },
  },
];

export type Work = { no: number; title: string; client: string; years: string; kind: "highlight" | "Read" | "Watch" | "On request"; text?: string; extra?: string; cover?: string; group?: "research" | "ai" | "nda" | "show"; sum?: string };

export const works: Work[] = [
  { no: 1, title: "The Exceptional Hub Experience", client: "Microsoft · Human-Centered Design Research", years: "2026", kind: "highlight", cover: "work/cx-01.jpg" },
  { no: 2, title: "Becoming Frontier", client: "Microsoft · AI product, 0→1", years: "2025–26", kind: "highlight", cover: "work/frontier-5-kiosk.jpg" },
  {
    no: 3, title: "Sovereignty & Digital Resilience Studios", client: "Microsoft · Strategy for adopting cloud and AI with control", years: "2025–26", group: "ai", sum: "One framework for adopting cloud and AI with control, plus 20 videos localized for global markets", kind: "Watch",
    text: "Governments and regulated industries want cloud and AI, but only if they keep control of their data. I took a dense mix of policy and technology and turned it into one framework that sales, engineers and executives read the same way, then a baseline so every studio opens with the same experience, wherever it is. That included 20 Sovereign Cloud videos, localized for markets around the world.",
    extra: "Sovereign Cloud · German Sovereign Cloud · Japanese",
  },
  {
    no: 4, title: "NVIDIA Omniverse", client: "Microsoft × NVIDIA · Explaining digital twins", years: "2025", group: "ai", sum: "Digital-twin explainers for kiosks in all 39 Hubs, used in 500+ customer engagements", kind: "Watch",
    text: "NVIDIA wanted a place in Microsoft's global Innovation Hub network, and its digital-twin technology is hard to explain to anyone who isn't an engineer. I turned it into a series of explainers for interactive kiosks in all 39 Hubs, built with NVIDIA's team from the first requirements to their brand review and timed for their biggest events. The series has been used in more than 500 customer engagements.",
    extra: "Omniverse explainer · 1 of 4",
  },
  { no: 5, title: "Microsoft at 50", client: "Microsoft · Global anniversary campaign", years: "2025", group: "show", sum: "A kit of anniversary assets for campus and every Innovation Hub engagement", text: "For Microsoft’s 50th anniversary, I produced a kit of assets for campus and the Innovation Hub program so customer engagements that year could carry the celebration: presentation templates personalized for each customer and engagement, and a set of stickers drawn from the anniversary’s pixel-art identity, from Clippy to the Start button.", kind: "Read" },
  { no: 6, title: "Flexible Design System", client: "Microsoft · Modular product system for global demos", years: "2025", group: "show", sum: "A modular furniture system any Innovation Hub can configure and still feel like one network", text: "The 39 Innovation Hubs each have their own layout, so I led a shared furniture system that any Hub can configure. With the design studio BUMP, we defined four core units that share one assembly and set of materials: a demo node with a display, a signage node for branding and messaging, a high-desk productivity node for working sessions, and a flexible connector node. Secondary units, like a low pedestal for hardware and a larger workshop table, grow the system without breaking its design language. I was the client lead; BUMP led the design.", kind: "Read" },
  {
    no: 7, title: "Responsible Innovation Dimensions", client: "Meta · Ethics framework for product teams", years: "2021", group: "research", sum: "Research frameworks and workshops that tied everyday product decisions to responsible-innovation principles", kind: "Read",
    text: "Meta's Responsible Innovation team wanted product teams to connect everyday roadmap decisions to its responsible-innovation principles, not treat them as a poster on the wall. I developed the research frameworks and workshop materials that helped teams do that, grounded in how people come to trust, question and adopt emerging technology. The work turned abstract principles into practical prompts that product and developer teams could use in their own planning.",
  },
  { no: 8, title: "Amazon Go Grocery", client: "Amazon · Store design elements", years: "2019", group: "show", sum: "Physical store design elements for Amazon’s checkout-free stores", text: "Under NDA, so the details are shared on request.", kind: "On request" },
  {
    no: 9, title: "Balance the Equation", client: "Gates Foundation · Grand Challenge launch", years: "2020–21", group: "research", sum: "National research and the launch story for the Foundation’s first U.S. education Grand Challenge", kind: "Read",
    text: "Algebra 1 is where many students’ math pathways split, and for Black, Latino, English Learner and low-income students the course too often works as a gatekeeper rather than a gateway. The Gates Foundation’s first U.S. education Grand Challenge set out to change that for students in grades 7 to 9. I started with a landscape immersion into the academic literature, then worked with an external agency to screen and recruit 21 priority students from eight states and 25+ students and educators in total across 10 states. We designed personalized activity booklets for the pre-interview work, where students and teachers uploaded memes, TikToks and drawings that opened each 60- to 90-minute Zoom interview, and I synthesized every session into a postcard that captured key themes and direct quotes. I then ran a two-day virtual ideation workshop with 54 subject-matter experts in 9 breakout groups, which produced 600+ digital stickies; 76% of participants rated the workshop ‘very good’ or ‘excellent.’ I did the synthesis in Miro, convened the advisory council, drafted the development document and wrote the launch materials: the RFP, FAQs, pre-application survey, glossary, suggested reading and the pre-launch information session. The Challenge drew 416 applications from 26 countries. It funded 15 planning grants of $100K, then 11 pilots of up to $1M in schools where priority students are at least half the population.",
  },
  {
    no: 10, title: "Guest experience strategy", client: "Sonder · Research across app and on-site stays", years: "2021–22", group: "research", sum: "Research across the app and on-site stays that shaped a pilot with $2M+ in net profit", kind: "Read",
    text: "Sonder’s stays run largely through its app, so the guest experience lives across a phone screen and a physical space. As Design Research Manager I managed two researchers and owned the research plan across the guest journey. In February 2022 I ran a nationwide survey of recent and upcoming guests on which services and amenities they actually want: comfort and convenience ranked first, then food and grocery, then health and wellness, and most guests preferred to serve themselves through the app over asking staff. That research, with in-app and on-site usability testing, shaped two new guest services, parking and breakfast; I partnered with Design on their interface and copy, and the domestic pilot generated more than $2M in net profit. A second round narrowed the list: a concept-validation test on Maze asked 30 travelers, most of them new to Sonder, to rank 14 possible services, and breakfast and snacks came out on top, followed by bringing a pet, easy parking and grocery delivery. The same test checked five brand-education screens. People came away seeing Sonder as app-driven, well designed and a step above Airbnb, but still unsure whether it was a hotel or a rental, which became the biggest opportunity. We then mapped every service touchpoint from awareness to feedback, to set up prototype testing of the services inside the app.",
  },
  {
    no: 11, title: "Usability scorecard", client: "Divi · Direct-to-consumer hair care, with surefoot", years: "2022", group: "research", kind: "Read",
    sum: "A usability scorecard that showed new customers couldn’t tell what Divi sold, and ranked what to fix first",
    text: "Divi, an influencer-founded scalp-care brand, wanted to know how its site came across to people who had never bought from it, to guide design, copy, testing and personalization. Working with the conversion agency surefoot, we ran ten 30-minute moderated interviews with people unfamiliar with Divi, seven on mobile and three on desktop. Each person worked through the homepage, navigation, product pages, cart and loyalty program and rated every task from 1 (easy) to 4 (difficult), which gave each page an average and total pain score so we could prioritize. The biggest finding came first: on the homepage, people couldn’t say what Divi sold or whether there was more than one product. Other pain clustered around a mobile ‘how to’ block that was illegible on small screens, no immediate clarity on function and use, skepticism about review credibility, and insufficient information on payment and delivery before checkout. Site usability was good; Divi’s brand strategy and education had the most room to grow. We plotted eleven opportunities by business value and complexity, so the team could start with the easy wins: clearer product positioning on the homepage, better navigation taxonomy, subscription as the default, and up-front shipping and delivery information.",
  },
  {
    no: 12, title: "Beauty Haven at Nordstrom", client: "Nordstrom · Beauty services destination", years: "2018–19", group: "research", sum: "A new beauty services destination, built from a year of research into how Millennials spend on experiences", kind: "Read",
    text: "Nordstrom’s beauty services were disjointed across stores, mostly tucked into flagship and high-profile locations, and either underperforming or trending down year on year. Meanwhile the ‘experience economy’ had taken off: experience spend was more than twice product spend, and the Millennial customer was driving it. The hypothesis was simple: there was an opportunity to modernize and scale beauty services in Nordstrom’s own stores. I led the research in two parts. Part one combined 1:1 interviews with ten ‘Self-Care Moderns’ in Los Angeles, 10–12 dscout diary studies, cultural visits and a retail landscape tour of the top beauty service destinations. Part two tested the concept in four stores. The research set the frame: ‘The internet can’t do this. But Nordstrom can — with 119 stores and 11.4 million sq ft of self-care space.’ Beauty Haven, the concept we built from it, was a one-stop services destination: a nail bar, brow bar, blow-out bar, trending service station, a health food and drinks counter and a shareable moment, all served by a new Beauty Services Concierge role. We prototyped it in Los Angeles, Newport Beach, Seattle and Oakbrook, then on the New York flagship beauty floor as a 7,500 sq ft experience with a Fragrance Finder. Customer intercepts, employee interviews, NPS and iPad surveys backed the pilot: customers described it as ‘more intimate,’ ‘welcoming’ and ‘more in line with the brand,’ and employees said the new environment set them up to be more successful. The in-store pilots lifted the average Beauty transaction by $15 and Home category sales by 9%, then scaled across 112 stores.",
  },
  { no: 13, title: "The Journal & Summit launch", client: "IWC and Montblanc at AKQA · Content strategy", years: "2017", group: "show", sum: "Content strategy for IWC’s The Journal and the launch of Montblanc’s Summit smartwatch", text: "Under NDA, so the details are shared on request.", kind: "On request" },
  { no: 14, title: "Jazz at Lincoln Center", client: "Jazz at Lincoln Center · With Pentagram", years: "2014", group: "show", sum: "Environmental graphics for the interior redesign of Jazz at Lincoln Center", text: "Environmental graphics, with Pentagram, for the interior redesign of the cultural institution dedicated to jazz performance, archives and educational programming.", kind: "Read" },
  {
    no: 15, title: "Acura’s first EV", client: "Acura · At VML", years: "2023–24", group: "show", kind: "Read",
    sum: "Research and launch strategy that made an unfamiliar purchase easy to understand",
    text: "At VML, I led research-informed strategy for Acura’s first electric vehicle, for buyers facing a new and unfamiliar purchase. The research and analysis phase combined EV market research, external and on-site search, a year of site analytics, three personas with full customer journeys (the first-time buyer, the switcher and the Acura aficionado), a comparative content review of Hyundai, Chevrolet and Kia, and benchmarks for every stage from homepage to ownership. It surfaced three challenges: the online buying journey was fragmented, new business models had left people unsure what to expect, and customers wanted more control online but still wanted hands-on moments like a test drive. People searched for “EV,” not “BEV,” and “hybrid” was the top search on acura.com, so we recommended plain-language headlines and a path from hybrids into EVs. Charging cost and timing were the questions people couldn’t answer, so we proposed an EV ownership page with dedicated home-charging and public-charging pages, clear messaging that you can buy 100% online, personalization for returning visitors and an order-status tray for the wait after purchase. That work shaped the website and product pages; the launch drove 2,500+ early-interest signups and lifted engagement 2–6%.",
  },
];

/** Built with AI: things she designed and shipped, with AI writing the code */
export type Built = { sum: string; title: string; where: string; year: string; text: string; shots?: { src: string; alt: string }[]; link?: { label: string; href: string }; onRequest?: boolean };
export const built: Built[] = [
  {
    sum: "A trip planner a first-time visitor can reshape, with one-tap calendar adds", title: "Joe’s Seattle Jaunt", where: "Personal · 2026", year: "2026",
    text: "A trip planner for someone visiting a city for the first time. Instead of a static list, it’s a six-day route he can reshape: every stop adds to his calendar in one tap, and each day has a box where he can suggest his own idea, which texts me or lands on the calendar. I designed the experience and wrote every word; Claude wrote the code.",
    shots: [
      { src: "built-joe-1.jpg", alt: "Joe’s Seattle Jaunt cover in acid yellow with day tabs from Tuesday to Sunday" },
      { src: "built-joe-2.jpg", alt: "Day cards with timed stops, Add to Calendar buttons and a box for Joe’s own idea" },
    ],
    link: { label: "Visit the site ↗", href: "https://schmidtykitty.github.io/JoesJaunt/" },
  },
  {
    sum: "An interactive year-end recap of the Innovation Hub, told as superlatives", title: "The FY26 Hub Yearbook", where: "Microsoft · 2026", year: "2026",
    text: "A year-end recap people actually wanted to read. Instead of a deck of metrics, I turned the Innovation Hub’s year into an interactive yearbook: each program gets a superlative, like “Most Likely To Come Back Bigger,” with tap-to-reveal numbers, trend charts and highlights from launches across the network. I shaped the concept, structure and every line of copy; Copilot wrote the code.",
    shots: [
      { src: "built-yearbook-1.jpg", alt: "Cover of The FY26 Hub Yearbook: a quirky look at the program’s superlatives" },
      { src: "built-yearbook-2.jpg", alt: "A superlative page with tap-to-reveal figures, numbers blurred" },
      { src: "built-yearbook-3.jpg", alt: "“Most Likely To Need An Actual Fire Extinguisher”: an illustrated kiosk with a This is fine bubble" },
    ],
    onRequest: true,
  },
  {
    sum: "A portfolio you can play with: pull the string, dress the doll, pet the cat", title: "This site", where: "Personal · 2026", year: "2026",
    text: "A portfolio you can play with: a jointed paper doll of me that you pull through each section, dress from the wardrobe, and Demon the cat to pet. I designed the concept, the poses and the writing, and built it with AI coding tools, then put it live on GitHub Pages.",
  },
];

export const writing = {
  title: "My private orgy of joie de vivre",
  tagline: "My private orgy of joie de vivre. Dancing till the end.",
  intro: "Notes on ingenuity worth staring at, usually for longer than is polite.",
  home: "https://schmidtykitty.substack.com/",
  published: [
    { title: "Balance the Equation: A Grand Challenge for Algebra 1", where: "Gates Foundation · Grand Challenges", year: "2021", src: "cover-gates.jpg", href: "https://gcgh.grandchallenges.org/challenge/balance-equation-grand-challenge-algebra-1", kicker: "Challenge brief",
      text: "The Foundation’s first U.S. education Grand Challenge, aimed at closing the Algebra 1 gap for Black, Latino, English Learner and low-income students. I led the national research behind it, facilitated the executive workshops that set the five focus areas and wrote the launch materials.",
    },
    { title: "Socially Disdanced", where: "ARCADE 39.1: Refraction", year: "2022", src: "writing-socially-disdanced.jpg", href: "https://www.usmodernist.org/ARC/ARC-2022-winter.pdf", kicker: "Essay",
      text: "Our pandemic-era proximity made certainty feel dangerous. What dance offers is a different way of being with one another.",
    },
  ],
  posts: [
    { date: "Jun 2", title: "Lingering Longer On: BV Doshi", sub: "Architecture in Motion.", slug: "lingering-longer-on-bv-doshi", excerpt: "Balkrishna Doshi’s (BV Doshi) architecture breathes with movement, much like the human body. Across a career spanning nearly seven decades, he designed over a hundred buildings that responded to their environment, embracing local materials, social change, and sustainability." },
    { date: "May 31", title: "Lingering Longer On: Martha Friedman: Tenterhooks (2022)", sub: "When the costume matches the set.", slug: "lingering-longer-on-martha-friedman", excerpt: "Images: Screen grabs from Jessica Silverman’s website video." },
    { date: "May 29", title: "Lingering Longer On: Ron Arad's Seats and Sofas", sub: "High degree of 'questionable sit-ability' amounts to high degree of joy.", slug: "lingering-longer-on-ron-arads-seats", excerpt: "A fellow ex-architect, Ron Arad—an Israeli-born designer—stands out for his adventurous approach to furniture, which is altogether sculptural, experimental, and technologically innovative." },
    { date: "May 27", title: "Lingering Longer On: Meredith Monk: Education of the Girlchild (1972)", sub: "The pioneer of interdisciplinary performance.", slug: "lingering-longer-on-meredith-monk", excerpt: "Meredith Monk, an American composer known for her interdisciplinary and avant-garde work, created a solo performance in 1972 titled Education of the Girlchild." },
    { date: "May 25", title: "Lingering Longer On: Paul Chan: Breathers (2023)", sub: "", slug: "lingering-longer-on-paul-chan-breathers", excerpt: "Sculpting with air instead of marble or stone, Chan creates boundary-blurring art that fuses sculpture, movement, and performance." },
    { date: "May 24", title: "Lingering Longer On: Vito Acconci: Face of the Earth (1988)", sub: "", slug: "lingering-longer-on-vito-acconci", excerpt: "Subtle but profound, Vito Acconci’s Face of the Earth (1988) redefined public art by embedding human presence directly into the landscape." },
    { date: "May 23", title: "Lingering Longer On: Nancy Spero, The Figure", sub: "A cast of characters across media.", slug: "lingering-longer-on-nancy-spero-the", excerpt: "Nancy Spero, an American visual artist, rooted her work deeply in the human figure, often using it as a tool for political and feminist expression." },
    { date: "May 22", title: "Curious.", sub: "A collection of one-off inspiration that caught my attention.", slug: "curious", excerpt: "Image 1: Daido Moriyama, Artificial Underwater Flower, 1990 -printed later (Artsy)" },
    { date: "May 21", title: "Lingering Longer On: Waltz of the Shadows: Gold Diggers (1933)", sub: "A film with synchronized movements to bewitch the eyes.", slug: "lingering-longer-on-waltz-of-the", excerpt: "Featuring actors Ruby Keeler and Dick Powell, along with a backup ensemble of dancers, the dreamy and ethereal number from choreographer Busby Berkeley (42nd Street) in the 1933 film Gold Diggers was a hypnotic sequence rooted in precise formations." },
    { date: "May 14", title: "The Maybe in the Miso", sub: "My Rejected Modern Love Essay.", slug: "the-maybe-in-the-miso", excerpt: "“Please make my miso soup every morning,” I’d just learned, is how a Japanese man proposes—not with a ring, but with a routine." },
  ],
};

export const books = {
  profile: "https://www.goodreads.com/schmidty_kitty",
  current: { title: "Exhalation", author: "Ted Chiang", cover: "https://covers.openlibrary.org/b/id/8793546-L.jpg?default=false", coverAlt: "https://covers.openlibrary.org/b/isbn/9781101947883-L.jpg?default=false", href: "https://openlibrary.org/works/OL20149336W" },
  stats: [
    { n: "617", label: "books on Goodreads" },
    { n: "207", label: "read" },
    { n: "409", label: "to-read" },
    { n: "4.08", label: "average of 85 ratings" },
  ],
  favourites: [
    { title: "Here Is New York", author: "E.B. White", href: "https://www.goodreads.com/book/show/10814.Here_Is_New_York" },
    { title: "Revenge of the Lawn / The Abortion / So the Wind Won't Blow i...", author: "Richard Brautigan", href: "https://www.goodreads.com/book/show/12569.Revenge_of_the_Lawn_The_Abortion_So_the_Wind_Won_t_Blow_it_All_Away" },
    { title: "A Clockwork Orange", author: "Anthony Burgess", href: "https://www.goodreads.com/book/show/227463.A_Clockwork_Orange" },
    { title: "Invisible Cities", author: "Italo Calvino", href: "https://www.goodreads.com/book/show/9809.Invisible_Cities" },
    { title: "London Fields", author: "Martin Amis", href: "https://www.goodreads.com/book/show/18830.London_Fields" },
    { title: "Close to the Knives", author: "David Wojnarowicz", href: "https://www.goodreads.com/book/show/89213.Close_to_the_Knives" },
    { title: "Zen and the Art of Motorcycle Maintenance", author: "Robert M. Pirsig", href: "https://www.goodreads.com/book/show/629.Zen_and_the_Art_of_Motorcycle_Maintenance" },
    { title: "The Places That Scare You", author: "Pema Chödrön", href: "https://www.goodreads.com/book/show/136977.The_Places_That_Scare_You" },
    { title: "White Noise", author: "Don DeLillo", href: "https://www.goodreads.com/book/show/11762.White_Noise" },
    { title: "Kicked A Building Lately?", author: "Ada Louise Huxtable", href: "https://www.goodreads.com/book/show/587000.Kicked_A_Building_Lately_" },
    { title: "The Art of Travel", author: "Alain de Botton", href: "https://www.goodreads.com/book/show/23422.The_Art_of_Travel" },
  ],
  years: [
    [2011, 13], [2012, 13], [2013, 16], [2014, 13], [2015, 11], [2016, 14], [2017, 20], [2018, 11],
    [2019, 12], [2020, 10], [2021, 11], [2022, 13], [2023, 11], [2024, 18], [2025, 17], [2026, 10],
  ] as [number, number][],
};

/** Spaces, installations and events: physical work outside the main portfolio */
export const spaces = [
  { src: "space-browne-farms.jpg", title: "Browne Family Farms", where: "Walla Walla, WA", year: "2024", alt: "Browne Family Farms moodboard: plaid textiles, a wishbone chair, a trestle table and a floor plan", text: "An extension of the brand’s philosophy: a Walla Walla property that inspires Pacific Northwest living through casual food, games, experiential events and locally sourced goods. I owned the drafting layout, material and furniture sourcing, and brand cohesion throughout." },
  { src: "space-seattle-restored.jpg", title: "Seattle Restored", where: "Seattle’s Office of Economic Development", year: "2022", alt: "A glowing white sphere inside a ring of light behind a storefront window at night", text: "An installation for Seattle Restored, a city program that activates empty storefronts to revive neighborhoods with creativity." },
  { src: "space-dantes-disco.jpg", title: "Dante’s Disco Inferno", where: "Museum of Museums (MoM)", year: "2022", alt: "A cat paw rising from a mound of red pompoms under a Dante’s Disco sign", text: "A free-standing sculpture for the group exhibition “Viva la Cat Tower,” inspired by the work of Frank Crow, at Seattle’s Museum of Museums." },
  { src: "space-arcade.jpg", title: "ARCADE Magazine events", where: "ARCADE, Seattle", year: "2021–22", alt: "A visitor collaging at a table under ARCADE’s Design Your World banner", text: "Fundraising galas, design festivals and issue release parties that kept the magazine part of Seattle’s wider arts scene." },
  { src: "space-polyphonic-forest.jpg", title: "Polyphonic Forest", where: "Seattle Design Festival", year: "2021", alt: "A toddler and a woman playing with large white inflatable forms outdoors", text: "An interactive sound installation of inflatables. Sensor-enabled and squeeze-activated, each form emitted its own sound, with the duration and pressure of a squeeze changing the pitch." },
  { src: "space-parallax-love.jpg", title: "Parallax Love", where: "Amazon, The Spheres", year: "2021", alt: "A grid of pink and white hanging tubes in the snow in front of Amazon’s Spheres", text: "A Valentine’s Day anamorphic installation at Amazon’s Spheres that activated the space for the holiday weekend." },
  { src: "space-bungalow.jpg", title: "Bungalow de Biodiversidad", where: "Oaxaca, Mexico, with RAW", year: "2015", alt: "A timber and corrugated-metal hut on stilts on a dry hillside at sunset", text: "With Real Architecture Workshop (RAW) and the San Pablo Etla community: a stand-alone research refuge with expansive, framed views of the mountains above and the valley below." },
];
export const spacesAlso: { title: string; year: string; text: string }[] = [];

export const studio = {
  name: "Poets of Gesture",
  intro:
    "My studio for the weird, the wonderful and the woah: human forms in motion, where light, gesture and space collide with synchronicity and absurdity. Not just to create, but to unsettle.",
  motto: "Grain over gloss · Movement will save us all",
  instagram: "https://www.instagram.com/poetsofgesture/",
  pieces: [
    { src: "work/pog-brush-with-death.jpg", title: "Brush with Death", kind: "Print, 2021", alt: "Black and white print of a toothpaste tube squeezed out on a pavement, captioned Brush With Death", text: "Drawing inspiration from John Baldessari, because I love a wisecrack and wordplay. How this relates to dance? Not super linear, and maybe it doesn’t have to be. These are phrases I’ve told myself many a time at the barre, or in new pointe shoes, catching that slippery piece of Marley. There’s always that one spot…" },
    { src: "work/tshirt.jpg", title: "Meditation Is Preparation for Death", kind: "Tee, 2020", alt: "Black Poets of Gesture T-shirt printed with a pale, smeared dancer figure and handwritten text", text: "Rehearsal can be the death of you. Movement will save us all. Brand identity and merch for Poets of Gesture." },
    { src: "work/pog-napkins.jpg", title: "Napkin Series", kind: "Embroidery, 2022", alt: "Black cotton napkins embroidered in white thread with outlined dancers in arabesque and attitude, on acid green", text: "“Release ya wiggle,” as Beyoncé would say. Four cotton napkins embroidered with some weirdos feeling themselves, and contributing to the no-more-paper-towels revolution. Get it." },
    { src: "work/pog-collage-tea.jpg", title: "Geisha & Diver", kind: "Collage, 2024", alt: "Paper collage: a smiling woman in a kimono serving tea beside a diver arcing over an orange sea and a sprig of greens", text: "From the Twisted Collage Book. Collage lets my mind rearrange reality: What can be? Why not? What if I…?" },
    { src: "work/pog-first.jpg", title: "First", kind: "Ceramic, 2023", alt: "Photographed legs standing in first position inside two sculpted black ceramic shoes, titled First", text: "From Positions: the five foundational positions of ballet rendered as sultry lacquered candlestick boots. Legs a flame for days." },
    { src: "work/pog-tote.jpg", title: "Death Rehearsal", kind: "Tote, 2020", alt: "Canvas tote printed with layered hands and the words Death Rehearsal in acid green", text: "Movement will save us all." },
  ],
};

/** songs from Angela's liked songs, grouped by the genre the disco ball plays. spotify = the track id from its share link */
export type Track = { genre: "disco" | "funk" | "soul" | "deephouse" | "techno" | "motown"; title: string; artist: string; spotify?: string };
export const music: { playlistUrl: string; tracks: Track[] } = {
  playlistUrl: "",
  tracks: [],
};
