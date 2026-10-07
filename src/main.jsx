import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";
import { ProjectsProvider } from "./context/ProjectsContext";
import "./styles/index.css";

// HashRouter keeps routes in the URL hash (#/about), so the site works on GitHub Pages without server rewrites.
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ProjectsProvider>
        <App />
      </ProjectsProvider>
    </HashRouter>
  </StrictMode>
);
