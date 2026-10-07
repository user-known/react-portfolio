import Cover from "./Cover";
import ProjectLink, { hasTarget } from "./ProjectLink";
import ReadLabel from "./ReadLabel";
import { useProjects } from "../context/ProjectsContext";
import { metaLine } from "../lib/utils";

/** Card used on the projects page and in the admin preview. Wrap it in <article className="proj">. */
export default function ProjectCard({ project: p, index }) {
  const { isPreview } = useProjects();
  return (
    <ProjectLink project={p} className="proj-in">
      <Cover project={p} index={index} />
      <div className="meta">{metaLine(p)}</div>
      <h3>{p.title || p.client}</h3>
      {p.summary && <p className="desc">{p.summary}</p>}
      <div className="tags">{(p.tags || []).filter(Boolean).map((t) => <span key={t}>{t}</span>)}</div>
      {hasTarget(p, isPreview) && <ReadLabel />}
    </ProjectLink>
  );
}
