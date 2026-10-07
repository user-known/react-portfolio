import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import GridBackground from "../components/GridBackground";
import Highlight from "../components/Highlight";
import Icon from "../components/Icon";
import Line from "../components/Line";
import ProjectCard from "../components/ProjectCard";
import Reveal, { stagger } from "../components/Reveal";
import { useProjects } from "../context/ProjectsContext";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { cx, idOf } from "../lib/utils";

const matches = (p, filter) => filter === "all" || (p.cats || []).includes(filter);

export default function Projects() {
  useDocumentTitle("All projects · Vignesh Balakumar", "Brand identity, web and campaign projects by Vignesh Balakumar.");
  const { projects, categories } = useProjects();

  const chips = useMemo(() => {
    const used = new Set();
    projects.forEach((p) => (p.cats || []).forEach((c) => used.add(c)));
    return [{ id: "all", label: "All" }, ...categories.filter((c) => used.has(c.id))];
  }, [projects, categories]);

  // `filter` is what you clicked. Cards that no longer match fade out first, then
  // `shown` catches up and removes them from the layout.
  const [filter, setFilter] = useState("all");
  const [shown, setShown] = useState("all");
  useEffect(() => {
    if (filter === shown) return undefined;
    const t = setTimeout(() => setShown(filter), 230);
    return () => clearTimeout(t);
  }, [filter, shown]);

  const count = projects.filter((p) => matches(p, filter)).length;

  return (
    <>
      <header className="case-hero">
        <GridBackground glow />
        <div className="wrap">
          <Link className="back hero-in" to="/" state={{ scrollTo: "work" }}>
            <Icon name="left" />Home
          </Link>
          <h1 style={{ marginTop: 26 }}>
            <Line delay="0.12s">All <Highlight>projects</Highlight></Line>
          </h1>
          <p className="sub hero-in" style={{ animationDelay: "0.4s" }}>
            Brand identity, web and campaign work. Filter by type, or open a project to read the case study.
          </p>
          <div className="proj-head hero-in" style={{ animationDelay: "0.5s" }}>
            {chips.length > 2 && (
              <div className="filters" role="group" aria-label="Filter projects">
                {chips.map((c) => (
                  <button key={c.id} className="fchip" type="button" aria-pressed={filter === c.id} onClick={() => setFilter(c.id)}>
                    {c.label}
                  </button>
                ))}
              </div>
            )}
            <span className="proj-count" aria-live="polite">{count === 1 ? "1 project" : `${count} projects`}</span>
          </div>
        </div>
      </header>

      <main>
        <div className="wrap">
          <div className="proj-grid">
            {projects.map(
              (p, i) =>
                matches(p, shown) && (
                  <Reveal as="article" key={idOf(p)} className={cx("proj", !matches(p, filter) && "out")} delay={stagger(i, 0.08)}>
                    <ProjectCard project={p} index={i} />
                  </Reveal>
                )
            )}
          </div>
          {count === 0 && <p className="proj-empty show">No projects in this category yet.</p>}
        </div>
      </main>
    </>
  );
}
