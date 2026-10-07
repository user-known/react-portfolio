import { useState } from "react";
import { Link } from "react-router-dom";
import Accordion from "../components/Accordion";
import GridBackground from "../components/GridBackground";
import HeroStack from "../components/HeroStack";
import Highlight from "../components/Highlight";
import Icon from "../components/Icon";
import Line from "../components/Line";
import ProjectRow from "../components/ProjectRow";
import Reveal, { stagger } from "../components/Reveal";
import SocialButtons from "../components/SocialButtons";
import Tools from "../components/Tools";
import { useFeatured, useProjects } from "../context/ProjectsContext";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { idOf } from "../lib/utils";

const BULLETS = [
  "A computer science degree taught me to think in systems, so every identity I make is built to work across every place it will appear.",
  "At Cartrabbit I spent two years across web design, development, content and motion for products like Retainful, Flycart, Yuko and Shopbrew.",
  "Now at Acme Interiors I lead the rebrand: logo and identity, website visuals and social and campaign creatives.",
  "I like the work most when the idea, the visuals and the build all agree, so the brand feels the same everywhere it shows up.",
];

const FAQ = [
  { q: "What guides your approach to design?", a: "Start with the business and the audience, then build a simple system that can be applied everywhere. Clarity first, then craft." },
  { q: "What kinds of projects excite you most right now?", a: "Brand identities that continue into a website and campaign work, where one team owns the whole visual story." },
  { q: "How do you work with clients and teams?", a: "I share work early and often, explain the reasoning behind each decision, and hand over files and guidelines that other people can pick up and use without me." },
];

export default function Home() {
  useDocumentTitle("Vignesh Balakumar · Visual & Brand Designer");
  const { projects } = useProjects();
  const featured = useFeatured();
  const [expanded, setExpanded] = useState(true);
  const bullets = expanded ? BULLETS : BULLETS.slice(0, 2);

  return (
    <>
      <header className="hero" id="top">
        <GridBackground glow />
        <div className="wrap">
          <div className="hero-load">
            <span className="chip"><b>Vignesh Balakumar</b> &nbsp;&bull;&nbsp; India</span>
            <h1>
              <Line delay="0.15s">Hi, I'm Vignesh!</Line>
              <Line delay="0.3s">I'm a <Highlight>visual &amp; brand designer</Highlight></Line>
            </h1>
            <p className="lede">I craft brands and visuals that are clear, consistent and built to last.</p>
            <div className="path" aria-label="Career path">
              <span>Cartrabbit</span><span className="arrow">&rarr;</span>
              <span>Acme Interiors</span><span className="arrow">&rarr;</span>
              <span className="status"><span className="dot" />BrandIT Studio</span>
            </div>
            <div className="btn-row"><SocialButtons /></div>
          </div>
          <HeroStack />
        </div>
      </header>

      <main>
        <section id="work">
          <div className="wrap">
            <Reveal as="h2">Selected work</Reveal>
            <div className="work-list">
              {featured.map((p) => (
                <ProjectRow key={idOf(p)} project={p} index={projects.indexOf(p)} />
              ))}
            </div>
            <Reveal className="more-work">
              <Link className="pill dark" to="/projects">
                View more projects <Icon name="right" />
              </Link>
            </Reveal>
          </div>
        </section>

        <section id="about">
          <div className="wrap">
            <div className="about">
              <Reveal>
                <h2>About</h2>
                <dl className="facts">
                  <div><dt>Based in</dt><dd>India</dd></div>
                  <div><dt>Focus</dt><dd>Brand identity, web design</dd></div>
                  <div><dt>Disciplines</dt><dd>Branding, UI/UX, motion</dd></div>
                </dl>
              </Reveal>
              <div>
                <Reveal as="h3" delay="0.08s">
                  I came to brand design through engineering and <Highlight>web development</Highlight>
                </Reveal>
                <ul className="bullets">
                  {bullets.map((b, i) => (
                    <Reveal as="li" key={b} delay={stagger(i, 0.09)}>{b}</Reveal>
                  ))}
                </ul>
                <div className="about-actions">
                  <button className="toggle" type="button" aria-expanded={expanded} onClick={() => setExpanded((v) => !v)}>
                    <span>{expanded ? "Show less" : "Show more"}</span>
                    <Icon name="down" />
                  </button>
                  <Link className="read" to="/about">
                    More about me <Icon name="right" />
                  </Link>
                </div>
              </div>
            </div>
            <Tools />
          </div>
        </section>

        <section id="faq">
          <div className="wrap">
            <Reveal as="h2">Frequently asked</Reveal>
            <Reveal delay="0.1s">
              <Accordion items={FAQ} defaultOpen={2} />
            </Reveal>
          </div>
        </section>
      </main>
    </>
  );
}
