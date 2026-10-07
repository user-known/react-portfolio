import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import CardEditor from "../admin/CardEditor";
import CaseEditor from "../admin/CaseEditor";
import PublishPanel, { loadGithubSettings, saveGithubSettings } from "../admin/PublishPanel";
import { blankProject, ensureCase, newItem, setPath, SCHEMA } from "../admin/caseSchema";
import GridBackground from "../components/GridBackground";
import Highlight from "../components/Highlight";
import Icon from "../components/Icon";
import Line from "../components/Line";
import ProjectCard from "../components/ProjectCard";
import published from "../data/projects.json";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { clearDraft, readDraft, writeDraft } from "../lib/draft";
import { putFile, readFileAsBase64, toBase64 } from "../lib/github";
import { coverBg, cx, idOf, slug } from "../lib/utils";

const clone = (o) => JSON.parse(JSON.stringify(o));

/** Starting point: the admin draft saved in this browser, or the published data. */
function loadDoc() {
  const draft = readDraft();
  const source = draft || published;
  const doc = { cats: clone(source.categories || []), projects: clone(source.projects || []) };
  if (!doc.projects.length) doc.projects.push(blankProject());
  doc.projects.forEach(ensureCase);
  return { doc, hasDraft: !!draft };
}

/** Give every project a unique page name before saving. */
function finalize(doc) {
  const seen = {};
  doc.projects.forEach((p) => {
    const base = slug(p.id || p.client || p.title) || "project";
    let id = base;
    let n = 2;
    while (seen[id]) id = `${base}-${n++}`;
    seen[id] = 1;
    p.id = id;
    p.tags = p.tags || [];
    p.cats = p.cats || [];
    ensureCase(p);
  });
  return doc;
}

const fileText = (doc) =>
  JSON.stringify({ categories: doc.cats, projects: finalize(clone(doc)).projects }, null, 2) + "\n";

export default function Admin() {
  useDocumentTitle("Projects admin \u00B7 Vignesh Balakumar");

  const [{ doc, hasDraft }, setState] = useState(loadDoc);
  const [sel, setSel] = useState(0);
  const [tab, setTab] = useState("card");
  const [msg, setMsg] = useState({ text: "", kind: "" });
  const [gh, setGh] = useState(loadGithubSettings);
  const [pubOpen, setPubOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const importRef = useRef(null);

  const project = doc.projects[Math.min(sel, doc.projects.length - 1)];
  const at = doc.projects.indexOf(project);
  const say = (text, kind = "") => setMsg({ text, kind });

  // Keep out of search results while the admin is open.
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);

  // Every edit is saved as a draft in this browser.
  useEffect(() => {
    if (hasDraft) writeDraft(doc.cats, doc.projects);
  }, [doc, hasDraft]);

  /** Apply a change to a copy of the document and mark it as an unpublished draft. */
  const edit = (fn) =>
    setState((s) => {
      const next = clone(s.doc);
      fn(next);
      return { doc: next, hasDraft: true };
    });
  const editProject = (fn) => edit((d) => fn(d.projects[at], d));

  /* ----- card fields ----- */
  const onField = (key, value) => editProject((p) => { p[key] = value; });
  const onColor = (key, value) => editProject((p) => { p.colors = { ...(p.colors || {}), [key]: value }; });
  const onToggleCat = (id) =>
    editProject((p) => {
      const cats = p.cats || [];
      p.cats = cats.includes(id) ? cats.filter((c) => c !== id) : [...cats, id];
    });
  const onAddCat = (label) =>
    editProject((p, d) => {
      const id = slug(label);
      if (!d.cats.some((c) => c.id === id)) d.cats.push({ id, label });
      p.cats = p.cats || [];
      if (!p.cats.includes(id)) p.cats.push(id);
    });

  /* ----- case study fields ----- */
  const onCaseSet = (path, value) => editProject((p) => setPath(p.case, path, value));
  const onCaseList = (section, action, i) =>
    editProject((p) => {
      const list = (p.case[section.key] = p.case[section.key] || []);
      if (action === "add") list.push(newItem(section, list.length));
      else if (action === "del") list.splice(i, 1);
      else if (action === "up" && i > 0) [list[i - 1], list[i]] = [list[i], list[i - 1]];
      else if (action === "down" && i < list.length - 1) [list[i + 1], list[i]] = [list[i], list[i + 1]];
    });

  /* ----- project list ----- */
  const addProject = () => {
    edit((d) => d.projects.push(blankProject()));
    setSel(doc.projects.length);
    setTab("card");
  };
  const duplicate = () => {
    edit((d) => {
      const copy = clone(d.projects[at]);
      copy.id = "";
      copy.title = `${copy.title || "Untitled"} (copy)`;
      d.projects.splice(at + 1, 0, copy);
    });
    setSel(at + 1);
  };
  const remove = () => {
    if (!window.confirm("Delete this project? You can still discard the draft to get it back.")) return;
    edit((d) => {
      d.projects.splice(at, 1);
      if (!d.projects.length) d.projects.push(blankProject());
    });
    setSel(Math.max(0, at - 1));
  };
  const move = (dir) => {
    const j = at + dir;
    if (j < 0 || j >= doc.projects.length) return;
    edit((d) => {
      [d.projects[at], d.projects[j]] = [d.projects[j], d.projects[at]];
    });
    setSel(j);
  };

  /* ----- file actions ----- */
  const download = () => {
    const blob = new Blob([fileText(doc)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "projects.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    say("Downloaded. Replace src/data/projects.json in your repository with this file.", "ok");
  };
  const copy = () => {
    if (!navigator.clipboard || !navigator.clipboard.writeText) return say("Couldn't copy. Use Download file instead.", "err");
    navigator.clipboard.writeText(fileText(doc)).then(
      () => say("Copied the file contents.", "ok"),
      () => say("Couldn't copy. Use Download file instead.", "err")
    );
  };
  const importFile = (e) => {
    const file = e.target.files[0];
    e.target.value = "";
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result));
        const projects = data.projects;
        const cats = data.categories || data.cats;
        if (!Array.isArray(projects) || !Array.isArray(cats)) throw new Error("format");
        const next = { cats, projects: projects.length ? projects : [blankProject()] };
        next.projects.forEach(ensureCase);
        setState({ doc: next, hasDraft: true });
        setSel(0);
        say(`Imported ${projects.length} projects.`, "ok");
      } catch (err) {
        say("Couldn't read that file. Use a projects.json downloaded from this page.", "err");
      }
    };
    reader.readAsText(file);
  };
  const discard = () => {
    if (!window.confirm("Discard your unpublished changes and go back to what the site has?")) return;
    clearDraft();
    const fresh = { cats: clone(published.categories || []), projects: clone(published.projects || []) };
    fresh.projects.forEach(ensureCase);
    setState({ doc: fresh, hasDraft: false });
    setSel(0);
    say("Draft discarded.", "ok");
  };
  const preview = () => {
    const finalDoc = finalize(clone(doc));
    writeDraft(finalDoc.cats, finalDoc.projects);
    setState({ doc: finalDoc, hasDraft: true });
    const base = window.location.href.split("#")[0];
    window.open(`${base}#/projects/${encodeURIComponent(finalDoc.projects[at].id)}?preview=1`, "_blank");
    say("Opened the preview in a new tab. It shows your unpublished draft.", "ok");
  };

  /* ----- GitHub ----- */
  const credentials = () => {
    saveGithubSettings(gh);
    if (!gh.owner.trim() || !gh.repo.trim() || !gh.token.trim()) {
      setPubOpen(true);
      say("Fill in the owner, repository and token under \u201CPublish straight to GitHub\u201D first.", "err");
      return null;
    }
    return { owner: gh.owner.trim(), repo: gh.repo.trim(), branch: gh.branch.trim() || "main", token: gh.token.trim() };
  };
  const publish = async () => {
    const c = credentials();
    if (!c) return;
    setBusy(true);
    say("Publishing\u2026");
    try {
      await putFile(c, "src/data/projects.json", toBase64(fileText(doc)), "Update projects via admin");
      clearDraft();
      setState((s) => ({ doc: finalize(clone(s.doc)), hasDraft: false }));
      say("Published. The deploy workflow rebuilds the site, which usually takes a minute or two.", "ok");
    } catch (err) {
      say(err.message || "Publishing failed.", "err");
    }
    setBusy(false);
  };
  /** Uploads an image to public/images and returns the path to store (images/name.jpg). */
  const uploadImage = async (file) => {
    if (!file) return null;
    if (!/^image\//.test(file.type)) {
      say("Choose an image file.", "err");
      return null;
    }
    const c = credentials();
    if (!c) return null;
    const name = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-");
    say(`Uploading ${name}\u2026`);
    try {
      await putFile(c, `public/images/${name}`, await readFileAsBase64(file), `Add image ${name}`);
      say(
        `Uploaded to images/${name}${file.size > 1500000 ? ". It is large, so consider compressing it." : "."} Publish the file too so the site uses it.`,
        "ok"
      );
      return `images/${name}`;
    } catch (err) {
      say(err.message || "Upload failed.", "err");
      return null;
    }
  };

  const stop = (e) => {
    if (e.target.closest("a")) e.preventDefault();
  };

  return (
    <>
      <header className="case-hero adm-hero">
        <GridBackground glow />
        <div className="wrap">
          <Link className="back hero-in" to="/"><Icon name="left" />Back to site</Link>
          <h1 style={{ marginTop: 26 }}><Line delay="0.1s">Projects <Highlight>admin</Highlight></Line></h1>
          <p className="sub hero-in" style={{ animationDelay: "0.35s" }}>
            Add and edit projects here. The home, projects and case study pages all read one file,{" "}
            <code>src/data/projects.json</code>, so a change here updates all of them.
          </p>

          <div className="adm-bar hero-in" style={{ animationDelay: "0.45s" }}>
            <span className="chip">
              <span className="dot" />
              <span>{hasDraft ? "Unpublished changes (saved in this browser)" : "Matches the site"}</span>
            </span>
            <button className="pill dark" type="button" onClick={download}><Icon name="up" />Download file</button>
            <button className="pill" type="button" onClick={copy}><Icon name="copy" />Copy file</button>
            <button className="pill" type="button" onClick={() => importRef.current && importRef.current.click()}>Import file</button>
            <input ref={importRef} type="file" accept=".json,application/json" hidden onChange={importFile} aria-label="Import projects file" />
            {hasDraft && <button className="pill" type="button" onClick={discard}>Discard draft</button>}
          </div>
          <p className={cx("adm-msg", msg.kind)} role="status" aria-live="polite">{msg.text}</p>

          <PublishPanel
            settings={gh}
            onChange={setGh}
            open={pubOpen}
            onToggle={setPubOpen}
            busy={busy}
            onPublish={publish}
          />
        </div>
      </header>

      <main>
        <div className="wrap adm">
          <aside className="card adm-list" aria-label="Projects">
            <div className="adm-list-head">
              <b>Projects</b>
              <button className="pill dark" type="button" onClick={addProject} style={{ padding: "6px 12px", fontSize: 12 }}>
                <Icon name="plus" />New
              </button>
            </div>
            <ul>
              {doc.projects.map((p, i) => (
                <li key={i}>
                  <button type="button" className={cx("adm-item", i === at && "on")} onClick={() => setSel(i)}>
                    <span className="adm-thumb" style={{ background: coverBg(p, i) }} />
                    <span className="adm-item-t">
                      <span>{p.title || p.client || "Untitled"}</span>
                      <small>{p.client || ""}</small>
                    </span>
                    {p.featured && <span className="adm-star" title="On the home page">{"\u2605"}</span>}
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          <section className="adm-editor" aria-label="Edit project">
            <div className="adm-prev">
              <p className="hint" style={{ marginBottom: 10 }}>Preview (how the card looks on the projects page)</p>
              <div className="proj-grid" onClick={stop}>
                <article className="proj"><ProjectCard project={project} index={at} /></article>
              </div>
            </div>

            <div className="adm-tabs" role="group" aria-label="Editor sections">
              <button className="fchip" type="button" aria-pressed={tab === "card"} onClick={() => setTab("card")}>Project card</button>
              <button className="fchip" type="button" aria-pressed={tab === "case"} onClick={() => setTab("case")}>Case study page</button>
            </div>

            {tab === "card" ? (
              <>
                <CardEditor
                  key={at}
                  project={project}
                  categories={doc.cats}
                  onField={onField}
                  onColor={onColor}
                  onToggleCat={onToggleCat}
                  onAddCat={onAddCat}
                  onUpload={uploadImage}
                />
                <div className="adm-actions">
                  <button className="pill" type="button" onClick={() => move(-1)}><Icon name="up" />Move up</button>
                  <button className="pill" type="button" onClick={() => move(1)}><Icon name="down" />Move down</button>
                  <button className="pill" type="button" onClick={duplicate}><Icon name="copy" />Duplicate</button>
                  <button className="pill danger" type="button" onClick={remove}>Delete</button>
                </div>
              </>
            ) : (
              <div className="card adm-fields adm-case">
                <div className="adm-case-top">
                  <label className="adm-check">
                    <input
                      type="checkbox"
                      checked={!!project.case.enabled}
                      onChange={(e) => onCaseSet("enabled", e.target.checked)}
                    />{" "}
                    Show a case study page for this project
                  </label>
                  <button className="pill" type="button" onClick={preview}><Icon name="ext" />Preview page</button>
                </div>
                <p className="adm-note">
                  The page is built from the sections below. A section with nothing in it is left out, so fill in only
                  what you need. Images use a path such as <code>images/acme-logo.jpg</code>, or upload with GitHub
                  connected. The title, client, industry and year come from the Project card tab.
                </p>
                <CaseEditor key={at} project={project} onSet={onCaseSet} onList={onCaseList} onUpload={uploadImage} />
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}

export { SCHEMA, idOf };
