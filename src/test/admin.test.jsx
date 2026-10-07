import { fireEvent, screen, waitFor, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import data from "../data/projects.json";
import { renderAt } from "./helpers";

const draft = () => JSON.parse(localStorage.getItem("pfDraft") || "null");

describe("Admin", () => {
  it("lists the published projects", () => {
    renderAt("/admin");
    const list = screen.getByRole("complementary", { name: /projects/i });
    expect(within(list).getAllByRole("listitem")).toHaveLength(data.projects.length);
    expect(screen.getByText("Matches the site")).toBeTruthy();
  });

  it("adds a project, edits it and saves a draft in the browser", async () => {
    renderAt("/admin");
    fireEvent.click(screen.getByRole("button", { name: /new/i }));
    const client = screen.getByLabelText(/client or project name/i);
    fireEvent.change(client, { target: { value: "Test Client" } });
    fireEvent.change(screen.getByLabelText(/^title/i), { target: { value: "A test project" } });
    expect(screen.getByText(/unpublished changes/i)).toBeTruthy();
    await waitFor(() => expect(draft().projects).toHaveLength(data.projects.length + 1));
    const added = draft().projects.at(-1);
    expect(added.client).toBe("Test Client");
    expect(added.title).toBe("A test project");
    // the card preview follows the edit
    expect(document.querySelector(".adm-prev h3").textContent).toBe("A test project");
  });

  it("turns on a case study page and edits its fields and lists", async () => {
    renderAt("/admin");
    fireEvent.click(screen.getByRole("button", { name: /new/i }));
    fireEvent.click(screen.getByRole("button", { name: /case study page/i }));
    fireEvent.click(screen.getByLabelText(/show a case study page/i));
    fireEvent.change(screen.getByLabelText(/your role/i), { target: { value: "Lead designer" } });
    // open the insights group and add two insights
    const insights = screen.getByText(/^Insights/, { selector: "summary span" }).closest("details");
    fireEvent.click(within(insights).getByRole("button", { name: /add insight/i }));
    fireEvent.click(within(insights).getByRole("button", { name: /add insight/i }));
    fireEvent.change(within(insights).getAllByLabelText(/^insight/i)[0], { target: { value: "People skim" } });
    await waitFor(() => expect(draft().projects.at(-1).case.enabled).toBe(true));
    const c = draft().projects.at(-1).case;
    expect(c.role).toBe("Lead designer");
    expect(c.insights).toHaveLength(2);
    expect(c.insights[0].title).toBe("People skim");
    // removing one
    fireEvent.click(within(insights).getAllByRole("button", { name: /remove/i })[1]);
    await waitFor(() => expect(draft().projects.at(-1).case.insights).toHaveLength(1));
  });

  it("deletes a project and discards the draft to get it back", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);
    renderAt("/admin");
    fireEvent.click(screen.getByRole("button", { name: /^delete$/i }));
    const list = screen.getByRole("complementary", { name: /projects/i });
    expect(within(list).getAllByRole("listitem")).toHaveLength(data.projects.length - 1);
    await waitFor(() => expect(draft().projects).toHaveLength(data.projects.length - 1));
    fireEvent.click(screen.getByRole("button", { name: /discard draft/i }));
    expect(within(list).getAllByRole("listitem")).toHaveLength(data.projects.length);
    expect(localStorage.getItem("pfDraft")).toBeNull();
  });

  it("previews a draft on the case study page", async () => {
    // a draft with one extra project, as the admin would leave it
    const projects = JSON.parse(JSON.stringify(data.projects));
    projects.push({ id: "draft-only", client: "Draft Co", title: "Only in the draft", year: "2026", tags: [], cats: [], colors: {}, featured: false, case: { enabled: true, sub: "Draft sub line" } });
    localStorage.setItem("pfDraft", JSON.stringify({ cats: data.categories, projects }));
    renderAt("/projects/draft-only?preview=1");
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Only in the draft");
    expect(screen.getByText(/preview of your unpublished draft/i)).toBeTruthy();
    expect(screen.getByText("Draft sub line")).toBeTruthy();
  });

  it("without ?preview the draft is ignored", () => {
    localStorage.setItem("pfDraft", JSON.stringify({ cats: [], projects: [{ id: "draft-only", client: "Draft Co", title: "Only in the draft", case: { enabled: true } }] }));
    renderAt("/projects/draft-only");
    expect(screen.getByText(/project not found/i)).toBeTruthy();
  });

  it("exports JSON that the site can read back", () => {
    let text = "";
    const original = Blob;
    vi.stubGlobal("Blob", class extends original { constructor(parts, opts) { super(parts, opts); text = parts.join(""); } });
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
    URL.createObjectURL = vi.fn(() => "blob:x");
    URL.revokeObjectURL = vi.fn();
    renderAt("/admin");
    fireEvent.click(screen.getByRole("button", { name: /download file/i }));
    const out = JSON.parse(text);
    expect(out.projects).toHaveLength(data.projects.length);
    expect(out.categories).toEqual(data.categories);
    expect(out.projects[0].case.process.phases).toEqual(data.projects[0].case.process.phases);
  });
});
