import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import Cover from "../components/Cover";
import GridBackground from "../components/GridBackground";
import Icon from "../components/Icon";
import Line from "../components/Line";
import ProjectLink, { hasTarget } from "../components/ProjectLink";
import ReadLabel from "../components/ReadLabel";
import Reveal, { stagger } from "../components/Reveal";
import Diamond from "../components/case/Diamond";
import { Framed, Paras, Shot } from "../components/case/helpers";
import ProgressBar from "../components/case/ProgressBar";
import Rail from "../components/case/Rail";
import Slider from "../components/case/Slider";
import Stat from "../components/case/Stat";
import Viewer from "../components/case/Viewer";
import { useProjects } from "../context/ProjectsContext";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { arr, idOf, safeUrl, text } from "../lib/utils";

const ICONS = ["check", "users", "star", "spark"];

function NotFound() {
  return (
    <header className="case-hero">
      <GridBackground />
      <div className="wrap">
        <Link className="back" to="/projects"><Icon name="left" />All work</Link>
        <h1 style={{ marginTop: 26 }}>Project not found</h1>
        <p className="sub">That case study does not exist yet. Check the link, or go back to all projects.</p>
      </div>
    </header>
  );
}

/**
 * Builds the list of sections from the project's case data.
 * A section with nothing in it is left out, from the page and from the side menu.
 */
function buildSections(c) {
  const sections = [];
  const q = c.quote || {};
  const gallery = arr(c.gallery).filter((g) => g && (text(g.image) || text(g.label)));
  if (text(q.text) || gallery.length) {
    sections.push({
      id: "overview", label: "Overview", className: "sec",
      body: (
        <>
          <Reveal as="h2">Overview</Reveal>
          {text(q.text) && (
            <Reveal className="card quote-card">
              <span className="q">{"\u201C"}</span>
              <p>{q.text}{text(q.by) && <small>{q.by}</small>}</p>
            </Reveal>
          )}
          {gallery.length === 1 && (
            <Reveal as="figure" style={{ marginTop: 16 }}>
              <div className="card"><Framed src={gallery[0].image} a={gallery[0].a} b={gallery[0].b} label={gallery[0].label} /></div>
              {text(gallery[0].caption) && <figcaption>{gallery[0].caption}</figcaption>}
            </Reveal>
          )}
          {gallery.length > 1 && <Viewer items={gallery} />}
        </>
      ),
    });
  }

  const brief = c.brief || {};
  if (text(brief.lead) || text(brief.text)) {
    sections.push({
      id: "brief", label: "The brief", className: "sec prose",
      body: (
        <>
          {text(brief.lead) && <Reveal as="p" className="lead">{brief.lead}</Reveal>}
          <Paras text={brief.text} />
        </>
      ),
    });
  }

  const process = c.process || {};
  const phases = arr(process.phases).map(text).filter(Boolean);
  if (phases.length >= 4) {
    sections.push({
      id: "process", label: "Process", className: "sec prose",
      body: (
        <>
          <Reveal as="h2">Process</Reveal>
          <Paras text={process.intro} />
          <Reveal className="card pad">
            <Diamond phases={phases.slice(0, 4)} />
            {text(process.caption) && <p className="cap" style={{ margin: "6px 0 0" }}>{process.caption}</p>}
          </Reveal>
        </>
      ),
    });
  }

  const challenge = c.challenge || {};
  if (text(challenge.text) || text(challenge.image)) {
    sections.push({
      id: "challenge", label: "The challenge", className: "sec prose",
      body: (
        <>
          <Reveal as="h2">The challenge</Reveal>
          <Paras text={challenge.text} />
          <Shot src={challenge.image} caption={challenge.caption} />
        </>
      ),
    });
  }

  const stats = arr(c.stats).filter((s) => s && text(s.value));
  const questions = arr(c.questions).map(text).filter(Boolean);
  if (stats.length || questions.length) {
    sections.push({
      id: "research", label: "Research", className: "sec",
      body: (
        <>
          <Reveal as="h2">Research</Reveal>
          {stats.length > 0 && (
            <Reveal className="card pad">
              {stats.map((s, i) => <Stat key={i} value={s.value} suffix={s.suffix} label={s.label} />)}
            </Reveal>
          )}
          {questions.length > 0 && (
            <>
              <Reveal as="h3" style={{ marginTop: 36 }}>Questions we asked</Reveal>
              <Reveal className="card qs">
                <ol>
                  {questions.map((x, i) => (
                    <Reveal as="li" key={i} delay={stagger(i, 0.08)}><em>{i + 1}</em>{x}</Reveal>
                  ))}
                </ol>
              </Reveal>
            </>
          )}
        </>
      ),
    });
  }

  const insights = arr(c.insights).filter((x) => x && (text(x.title) || text(x.quote)));
  if (insights.length) {
    sections.push({
      id: "insights", label: "Insights", className: "sec",
      body: (
        <>
          <Reveal as="h2">Insights</Reveal>
          <div className="insights">
            {insights.map((x, i) => (
              <Reveal className="card insight" key={i} delay={stagger(i, 0.1)}>
                <small>Insight {i + 1}</small>
                <h4>{x.title}</h4>
                {text(x.quote) && <blockquote><span className="q">{"\u201C"}</span>{x.quote}</blockquote>}
              </Reveal>
            ))}
          </div>
        </>
      ),
    });
  }

  const identity = c.identity || {};
  const extras = arr(c.identityExtras).filter((x) => x && text(x.image));
  if (text(identity.text) || text(identity.image) || extras.length) {
    sections.push({
      id: "identity", label: "Identity", className: "sec prose",
      body: (
        <>
          <Reveal as="h2">Identity</Reveal>
          <Paras text={identity.text} />
          <Shot src={identity.image} caption={identity.caption} />
          {extras.length > 0 && (
            <div className="grid2">
              {extras.map((x, i) => <Shot key={i} src={x.image} caption={x.caption} />)}
            </div>
          )}
        </>
      ),
    });
  }

  const website = c.website || {};
  const slides = arr(c.slides).filter((x) => x && text(x.image));
  if (text(website.intro) || slides.length) {
    sections.push({
      id: "website", label: "Website", className: "sec prose",
      body: (
        <>
          <Reveal as="h2">Website visuals</Reveal>
          <Paras text={website.intro} />
          {slides.length === 1 && <Shot src={slides[0].image} caption={slides[0].caption} />}
          {slides.length > 1 && <Slider slides={slides} label="Website visuals" />}
        </>
      ),
    });
  }

  const campaign = c.campaign || {};
  const posts = arr(c.posts).filter((x) => x && text(x.image));
  if (text(campaign.intro) || posts.length) {
    sections.push({
      id: "campaign", label: "Campaign", className: "sec prose",
      body: (
        <>
          <Reveal as="h2">Social and campaign creatives</Reveal>
          <Paras text={campaign.intro} />
          {posts.length > 0 && (
            <div className="grid3">
              {posts.map((x, i) => (
                <Reveal as="figure" key={i} delay={stagger(i, 0.1)}>
                  <div className="card"><Framed src={x.image} ar="4/5" /></div>
                </Reveal>
              ))}
            </div>
          )}
          {text(campaign.caption) && <Reveal as="p" className="cap">{campaign.caption}</Reveal>}
        </>
      ),
    });
  }

  const outcomes = arr(c.outcomes).filter((x) => x && (text(x.title) || text(x.text)));
  const closing = c.closing || {};
  const cta = safeUrl(closing.ctaUrl);
  if (outcomes.length || text(closing.text) || cta) {
    sections.push({
      id: "outcomes", label: "Outcomes", className: "sec prose",
      body: (
        <>
          <Reveal as="h2">Outcomes &amp; takeaways</Reveal>
          {outcomes.length > 0 && (
            <div className="outcomes">
              {outcomes.map((x, i) => (
                <Reveal className="card outcome" key={i} delay={stagger(i, 0.09)}>
                  <span className="ico"><Icon name={ICONS.includes(x.icon) ? x.icon : "check"} /></span>
                  <h4>{x.title}</h4>
                  <p>{x.text}</p>
                </Reveal>
              ))}
            </div>
          )}
          <Paras text={closing.text} />
          {cta && (
            <Reveal as="p">
              <a className="btn-dark" href={cta} target="_blank" rel="noopener">
                {text(closing.ctaLabel) || "Visit the live site"} <Icon name="ext" />
              </a>
            </Reveal>
          )}
        </>
      ),
    });
  }
  return sections;
}

export default function CaseStudy() {
  const { id } = useParams();
  const { projects, isPreview } = useProjects();
  const at = projects.findIndex((p) => idOf(p) === id);
  const p = at > -1 ? projects[at] : null;
  const c = (p && p.case) || {};
  const title = p ? p.title || p.client : "Project not found";

  useDocumentTitle(`${title} \u00B7 Vignesh Balakumar`, p ? text(c.sub) || text(p.summary) || title : undefined);
  const sections = useMemo(() => (p ? buildSections(c) : []), [p, c]);

  if (!p) return <NotFound />;

  const live = safeUrl(c.liveUrl);
  const facts = [["Year", p.year], ["Industry", p.industry], ["Role", c.role]].filter((f) => text(f[1]));

  let next = null;
  let nextAt = -1;
  for (let k = 1; k < projects.length; k++) {
    const candidate = projects[(at + k) % projects.length];
    if (hasTarget(candidate, isPreview)) {
      next = candidate;
      nextAt = projects.indexOf(candidate);
      break;
    }
  }
  const sub = text(c.sub) || text(p.summary);

  return (
    <>
      <ProgressBar />
      {isPreview && <div className="preview-banner">Preview of your unpublished draft</div>}
      <header className="case-hero">
        <GridBackground glow />
        <div className="wrap">
          <Link className="back hero-in" to={isPreview ? "/projects?preview=1" : "/projects"}>
            <Icon name="left" />All work
          </Link>
          <p className="meta hero-in" style={{ animationDelay: "0.08s" }}>
            {[p.client, p.industry].filter(Boolean).join(" \u00B7 ")}
          </p>
          <h1><Line delay="0.12s">{title}</Line></h1>
          {sub && <p className="sub hero-in" style={{ animationDelay: "0.45s" }}>{sub}</p>}
          {text(c.badge) && (
            <span className="badge hero-in" style={{ animationDelay: "0.55s" }}>
              <Icon name="shield" />{c.badge}
            </span>
          )}
          {(facts.length > 0 || live) && (
            <Reveal as="dl" className="facts-bar" delay="0.2s">
              {facts.map(([label, value]) => (
                <div key={label}><dt>{label}</dt><dd>{text(value)}</dd></div>
              ))}
              {live && (
                <div>
                  <dt>Live site</dt>
                  <dd>
                    <a href={live} target="_blank" rel="noopener">
                      {text(c.liveLabel) || "Visit site"} <Icon name="ext" />
                    </a>
                  </dd>
                </div>
              )}
            </Reveal>
          )}
          <Cover project={p} index={at} reveal delay="0.15s" className="hero-cover" />
        </div>
      </header>

      <main>
        {sections.length > 0 && (
          <div className="wrap doc">
            <Rail sections={sections} />
            <article className="content">
              {sections.map((s) => (
                <section key={s.id} id={s.id} className={s.className}>{s.body}</section>
              ))}
            </article>
          </div>
        )}
        {next && (
          <div className="wrap">
            <Reveal as="div">
              <ProjectLink project={next} className="next">
                <div>
                  <div className="meta">Next case study</div>
                  <h3>{next.title || next.client}</h3>
                  <p>{next.summary || ""}</p>
                  <ReadLabel />
                </div>
                <Cover project={next} index={nextAt} />
              </ProjectLink>
            </Reveal>
          </div>
        )}
      </main>
    </>
  );
}
