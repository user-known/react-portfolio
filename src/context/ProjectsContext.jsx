import { createContext, useContext, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import published from "../data/projects.json";
import { readDraft } from "../lib/draft";

const ProjectsContext = createContext(null);

/**
 * Provides the project list to every page.
 * It is the published data in src/data/projects.json, or the admin's unpublished draft
 * when the URL has ?preview=1 (used by the admin's "Preview page" button).
 */
export function ProjectsProvider({ children }) {
  const [params] = useSearchParams();
  const wantsPreview = params.get("preview") === "1";

  const value = useMemo(() => {
    const draft = wantsPreview ? readDraft() : null;
    const source = draft || published;
    return {
      categories: source.categories || [],
      projects: (source.projects || []).filter((p) => p && (p.title || p.client)),
      isPreview: !!draft,
    };
  }, [wantsPreview]);

  return <ProjectsContext.Provider value={value}>{children}</ProjectsContext.Provider>;
}

export function useProjects() {
  const ctx = useContext(ProjectsContext);
  if (!ctx) throw new Error("useProjects must be used inside <ProjectsProvider>");
  return ctx;
}

/** Projects shown in "Selected work": the featured ones, or the first four if none are flagged. */
export function useFeatured() {
  const { projects } = useProjects();
  return useMemo(() => {
    const featured = projects.filter((p) => p.featured);
    return featured.length ? featured : projects.slice(0, 4);
  }, [projects]);
}
