import { fireEvent, screen, waitFor, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import data from "../data/projects.json";
import { renderAt } from "./helpers";

const featured = data.projects.filter((p) => p.featured);
const projectCount = (count) => `${count} ${count === 1 ? "project" : "projects"}`;

describe("Home", () => {
  it("shows the featured projects and a link to all projects", () => {
    renderAt("/");
    expect(screen.getByRole("heading", { level: 1 }).textContent).toMatch(/Vignesh/);
    featured.forEach((p) => {
      expect(screen.getAllByText(p.client).length).toBeGreaterThan(0);
    });
    const more = screen.getByRole("link", { name: /view more projects/i });
    expect(more.getAttribute("href")).toBe("/projects");
  });

  it("only links projects that have a case study page", () => {
    renderAt("/");
    const withCase = data.projects.filter((p) => p.case && p.case.enabled);
    expect(screen.getAllByText(/read case study/i)).toHaveLength(withCase.length);
  });

  it("opens one FAQ answer at a time", () => {
    renderAt("/");
    const first = screen.getByRole("button", { name: /what guides your approach/i });
    const last = screen.getByRole("button", { name: /how do you work with clients/i });
    expect(last.getAttribute("aria-expanded")).toBe("true");
    fireEvent.click(first);
    expect(first.getAttribute("aria-expanded")).toBe("true");
    expect(last.getAttribute("aria-expanded")).toBe("false");
  });

  it("collapses the About bullets", () => {
    renderAt("/");
    const toggle = screen.getByRole("button", { name: /show less/i });
    fireEvent.click(toggle);
    expect(screen.getByRole("button", { name: /show more/i })).toBeTruthy();
  });
});

describe("Projects", () => {
  it("lists every project and filters by category", async () => {
    renderAt("/projects");
    expect(screen.getByText(projectCount(data.projects.length))).toBeTruthy();
    const campaigns = data.projects.filter((p) => (p.cats || []).includes("campaign"));
    fireEvent.click(screen.getByRole("button", { name: "Campaign" }));
    expect(screen.getByText(projectCount(campaigns.length))).toBeTruthy();
    // cards that no longer match are removed after their fade-out
    await waitFor(() => expect(document.querySelectorAll(".proj")).toHaveLength(campaigns.length), { timeout: 1500 });
    fireEvent.click(screen.getByRole("button", { name: "All" }));
    await waitFor(() => expect(document.querySelectorAll(".proj")).toHaveLength(data.projects.length), { timeout: 1500 });
  });
});

describe("Case study", () => {
  const acme = data.projects.find((p) => p.id === "acme-interiors");

  it("builds the page from the project's data and leaves empty sections out", () => {
    renderAt("/projects/acme-interiors");
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(acme.title);
    const ids = [...document.querySelectorAll("main .sec")].map((s) => s.id);
    expect(ids).toEqual(expect.arrayContaining(["brief", "process", "challenge", "research", "outcomes"]));
    expect(ids).not.toContain("insights"); // Acme has no insights filled in
    const railLabels = [...document.querySelectorAll(".rail a span")].map((s) => s.textContent);
    expect(railLabels.length).toBe(ids.length);
  });

  it("draws the process diagram with the four phases", () => {
    renderAt("/projects/acme-interiors");
    const svg = document.querySelector("svg.diamond");
    expect(svg).toBeTruthy();
    acme.case.process.phases.forEach((ph) => expect(within(svg).getByText(ph)).toBeTruthy());
  });

  it("shows a friendly message for an unknown project", () => {
    renderAt("/projects/does-not-exist");
    expect(screen.getByText(/project not found/i)).toBeTruthy();
  });
});

describe("About", () => {
  it("renders the story, timeline and skills", () => {
    renderAt("/about");
    expect(screen.getByText(/Sri Ramakrishna Engineering College, Coimbatore/)).toBeTruthy();
    expect(document.querySelectorAll(".tl-item")).toHaveLength(3);
    expect(screen.getByText("Brand identity", { selector: "h4" })).toBeTruthy();
  });
});

describe("Navigation", () => {
  it("highlights the current page in the nav", () => {
    renderAt("/about");
    const nav = screen.getByRole("navigation", { name: /primary/i });
    expect(within(nav).getByRole("link", { name: "About" }).className).toMatch(/active/);
    expect(within(nav).getByRole("link", { name: "Work" }).className).not.toMatch(/active/);
  });

  it("toggles dark mode", () => {
    renderAt("/");
    const before = document.documentElement.getAttribute("data-theme");
    fireEvent.click(screen.getByRole("button", { name: /switch to (dark|light) mode/i }));
    expect(document.documentElement.getAttribute("data-theme")).not.toBe(before);
    expect(localStorage.getItem("theme")).toBe(document.documentElement.getAttribute("data-theme"));
  });
});
