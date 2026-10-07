import { useEffect, useRef, useState } from "react";
import Accordion from "../components/Accordion";
import GridBackground from "../components/GridBackground";
import Highlight from "../components/Highlight";
import Icon from "../components/Icon";
import Line from "../components/Line";
import Reveal, { stagger } from "../components/Reveal";
import SocialButtons from "../components/SocialButtons";
import Tools from "../components/Tools";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { cx } from "../lib/utils";

const STORY = [
  "I came to brand design through engineering, and I still design the way an engineer thinks: in systems that hold up everywhere they are used.",
  "I studied computer science engineering at Sri Ramakrishna Engineering College in Coimbatore, from 2020 to 2024. It taught me to break a problem into parts and see how they fit together.",
  "I joined Cartrabbit in March 2024 as a web designer and developer. Over two years I also worked as a content strategist and motion designer on products including Retainful, Flycart, Yuko and Shopbrew.",
  "In April 2026 I joined Acme Interiors as Creative & Graphic Designer, where I lead the rebrand: logo and identity, website redesign visuals, and social and campaign creatives.",
  "Add a paragraph about what you care about and what kind of work you want next.",
];

const EXPERIENCE = [
  {
    when: "April 2026 \u2013 Present",
    role: "Creative & Graphic Designer",
    org: "Acme Interiors",
    text: "Leading the brand rebrand, logo and identity work, website redesign visuals, and social and campaign creatives.",
    tags: ["Brand identity", "Web visuals", "Campaigns"],
  },
  {
    when: "March 2024 \u2013 March 2026",
    role: "Web Designer & Developer, Content Strategist & Motion Designer",
    org: "Cartrabbit",
    text: "Designed and built for Cartrabbit products including Retainful, Flycart, Yuko and Shopbrew, alongside content strategy and motion work.",
    tags: ["Web design", "Front-end build", "Motion", "Content"],
  },
  {
    when: "2020 \u2013 2024",
    role: "B.E. Computer Science Engineering",
    org: "Sri Ramakrishna Engineering College, Coimbatore",
    text: "Where I learned to think in systems before touching any detail.",
    tags: [],
  },
];

const SKILLS = [
  { icon: "spark", title: "Brand identity", text: "Logos and identity systems that work from a favicon to a campaign." },
  { icon: "link", title: "Web design & development", text: "Websites designed and built by the same person, so the details survive." },
  { icon: "star", title: "UI/UX design", text: "Clear interfaces and flows for products and sites." },
  { icon: "play", title: "Motion & content", text: "Motion design and content strategy that give a brand a voice and movement." },
];

const FAQ = [
  { q: "What kind of projects do you take on?", a: "Brand identity, websites and campaign visuals, ideally as one connected piece of work. Add anything you prefer to avoid." },
  { q: "How do we start?", a: "Send a short note about the project and the timeline. I reply with questions and a proposed scope." },
  { q: "What do I receive at the end?", a: "Final design files and brand guidelines that your team can use without me. Add details of what you deliver." },
];

/** Portrait card that tilts slightly toward the cursor. */
function Portrait() {
  const card = useRef(null);
  const reduced = useReducedMotion();
  const canHover = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(hover: hover)").matches;
  const enabled = !reduced && canHover;

  const move = (e) => {
    if (!enabled || !card.current) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.current.style.setProperty("--ry", `${(x * 10).toFixed(1)}deg`);
    card.current.style.setProperty("--rx", `${(-y * 10).toFixed(1)}deg`);
  };
  const leave = () => {
    if (!card.current) return;
    card.current.style.setProperty("--rx", "0deg");
    card.current.style.setProperty("--ry", "0deg");
  };

  return (
    <div className="portrait-wrap" onPointerMove={move} onPointerLeave={leave}>
      <div className="portrait" ref={card}>
        {/* Your photo: <img src="images/vignesh.jpg" alt="Portrait of Vignesh Balakumar" /> */}
        <span className="initial">V</span>
        <span className="note">Add your photo</span>
      </div>
      <span className="float-chip c1">Brand identity</span>
      <span className="float-chip c2">Web design</span>
      <span className="float-chip c3">Motion</span>
    </div>
  );
}

/** Vertical timeline whose line fills in as you scroll, switching each dot on in turn. */
function Timeline({ items }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const [state, setState] = useState({ p: reduced ? 1 : 0, on: items.map(() => reduced) });

  useEffect(() => {
    if (reduced) {
      setState({ p: 1, on: items.map(() => true) });
      return undefined;
    }
    let ticking = false;
    const update = () => {
      ticking = false;
      const el = ref.current;
      if (!el) return;
      const line = window.innerHeight * 0.65;
      const r = el.getBoundingClientRect();
      const p = Math.max(0, Math.min(1, (line - r.top) / (r.height || 1)));
      const on = Array.prototype.map.call(el.children, (c) => c.getBoundingClientRect().top < line);
      setState({ p, on });
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reduced, items]);

  return (
    <div className="timeline" ref={ref} style={{ "--p": state.p.toFixed(3) }}>
      {items.map((it, i) => (
        <Reveal className={cx("tl-item", state.on[i] && "on")} key={it.org}>
          <small>{it.when}</small>
          <h3>{it.role}</h3>
          <div className="org">{it.org}</div>
          <p>{it.text}</p>
          {it.tags.length > 0 && <div className="tags">{it.tags.map((t) => <span key={t}>{t}</span>)}</div>}
        </Reveal>
      ))}
    </div>
  );
}

export default function About() {
  useDocumentTitle("About · Vignesh Balakumar", "Vignesh Balakumar is a visual and brand designer in India working across brand identity, web design and motion.");

  return (
    <>
      <header className="case-hero about-hero">
        <GridBackground glow />
        <div className="wrap">
          <div className="hero-load">
            <span className="chip"><b>About</b> &nbsp;&bull;&nbsp; India</span>
            <h1>
              <Line delay="0.15s">I design brands and</Line>
              <Line delay="0.3s">build the <Highlight>websites they live on</Highlight></Line>
            </h1>
            <p className="lede">
              I'm Vignesh, a visual and brand designer. I started in computer science, moved into web design and
              development, and now lead brand identity work.
            </p>
            <div className="btn-row"><SocialButtons /></div>
          </div>
          <Portrait />
        </div>
      </header>

      <main>
        <div className="wrap">
          <Reveal as="dl" className="facts-bar">
            <div><dt>Based in</dt><dd>India</dd></div>
            <div><dt>Currently</dt><dd>Acme Interiors</dd></div>
            <div><dt>Focus</dt><dd>Brand identity, UI/UX, web</dd></div>
            <div><dt>Studio</dt><dd>BrandIT Studio</dd></div>
          </Reveal>

          <section className="split" id="story">
            <Reveal as="h2">Story</Reveal>
            <div className="body prose">
              {STORY.map((p, i) => (
                <Reveal as="p" key={p} delay={stagger(i, 0.1)}>{p}</Reveal>
              ))}
            </div>
          </section>

          <section className="split" id="experience">
            <Reveal as="h2">Experience</Reveal>
            <div className="body"><Timeline items={EXPERIENCE} /></div>
          </section>

          <section className="split" id="skills">
            <Reveal as="h2">What I do</Reveal>
            <div className="body">
              <div className="outcomes" style={{ marginBottom: 0 }}>
                {SKILLS.map((s, i) => (
                  <Reveal className="card outcome" key={s.title} delay={stagger(i, 0.09)}>
                    <span className="ico"><Icon name={s.icon} /></span>
                    <h4>{s.title}</h4>
                    <p>{s.text}</p>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          <section className="split" id="tools">
            <Reveal as="h2">Tools</Reveal>
            <div className="body"><Tools heading={false} /></div>
          </section>

          <section className="split" id="working-together">
            <Reveal as="h2">Working together</Reveal>
            <div className="body">
              <Reveal><Accordion items={FAQ} defaultOpen={0} /></Reveal>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
