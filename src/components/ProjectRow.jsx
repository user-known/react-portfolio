import Cover from "./Cover";
import Reveal, { stagger } from "./Reveal";
import ProjectLink, { hasTarget } from "./ProjectLink";
import ReadLabel from "./ReadLabel";
import { useProjects } from "../context/ProjectsContext";
import { metaLine } from "../lib/utils";

/** One row of "Selected work": cover on the left, details on the right. */
export default function ProjectRow({ project: p, index }) {
  const { isPreview } = useProjects();
  const step = 0.07;
  let n = 0;
  const next = () => stagger(n++, step);

  return (
    <article className="case">
      <Cover project={p} index={index} reveal />
      <div>
        <Reveal className="meta" delay={next()}>{metaLine(p)}</Reveal>
        <Reveal as="h3" delay={next()}>{p.title || p.client}</Reveal>
        {(p.metricBold || p.metricText) && (
          <Reveal as="p" className="metric" delay={next()}>
            {p.metricBold && <strong>{p.metricBold}</strong>}
            {p.metricText ? `${p.metricBold ? " " : ""}${p.metricText}` : ""}
          </Reveal>
        )}
        {p.summary && <Reveal as="p" className="desc" delay={next()}>{p.summary}</Reveal>}
        <Reveal className="tags" delay={next()}>
          {(p.tags || []).filter(Boolean).map((t) => <span key={t}>{t}</span>)}
        </Reveal>
        {hasTarget(p, isPreview) && (
          <Reveal delay={next()}>
            <ProjectLink project={p} className="read-link"><ReadLabel /></ProjectLink>
          </Reveal>
        )}
      </div>
    </article>
  );
}
