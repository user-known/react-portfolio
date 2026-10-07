import { Link } from "react-router-dom";
import { useProjects } from "../context/ProjectsContext";
import { targetFor } from "../lib/utils";

/**
 * Wraps content in a link to the project's case study page (or its custom link).
 * A project with neither renders a plain element, so the card is not clickable.
 */
export default function ProjectLink({ project, className, fallback: Fallback = "div", children, ...rest }) {
  const { isPreview } = useProjects();
  const target = targetFor(project, isPreview);
  if (!target) return <Fallback className={className} {...rest}>{children}</Fallback>;
  if (target.to) return <Link to={target.to} className={className} {...rest}>{children}</Link>;
  const external = /^(https?:)?\/\//i.test(target.href);
  return (
    <a href={target.href} className={className} {...(external ? { target: "_blank", rel: "noopener" } : {})} {...rest}>
      {children}
    </a>
  );
}

export const hasTarget = (project, preview) => !!targetFor(project, preview);
