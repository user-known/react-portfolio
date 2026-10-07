import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../App";
import { ProjectsProvider } from "../context/ProjectsContext";

/** Renders the whole app at a route, the way main.jsx does (with a memory router instead of the hash). */
export function renderAt(path) {
  return render(
    <MemoryRouter initialEntries={[path]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ProjectsProvider>
        <App />
      </ProjectsProvider>
    </MemoryRouter>
  );
}
