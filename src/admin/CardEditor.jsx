import { useState } from "react";
import { hex6 } from "./caseSchema";
import { slug } from "../lib/utils";

/** Comma-separated tags. Keeps its own text so a trailing comma survives typing. */
function TagsField({ value, onChange }) {
  const [raw, setRaw] = useState((value || []).join(", "));
  return (
    <input
      type="text"
      value={raw}
      placeholder="Brand identity, Logo design"
      onChange={(e) => {
        setRaw(e.target.value);
        onChange(e.target.value.split(",").map((x) => x.trim()).filter(Boolean));
      }}
    />
  );
}

/** The "Project card" tab: everything shown on the home and projects pages. */
export default function CardEditor({ project: p, categories, onField, onColor, onToggleCat, onAddCat, onUpload }) {
  const [newCat, setNewCat] = useState("");
  const text = (key, placeholder) => (
    <input type="text" value={p[key] || ""} placeholder={placeholder} onChange={(e) => onField(key, e.target.value)} />
  );
  const addCat = () => {
    if (!slug(newCat)) return;
    onAddCat(newCat.trim());
    setNewCat("");
  };

  return (
    <div className="card adm-fields">
      <div className="adm-row">
        <label className="f">Client or project name {text("client", "Acme Interiors")}</label>
        <label className="f">Industry {text("industry", "Interiors")}</label>
      </div>
      <label className="f">Title <em>One line that says what you did</em> {text("title", "Rebranding an interiors studio from logo to launch")}</label>
      <label className="f">
        Summary
        <textarea value={p.summary || ""} placeholder="One or two sentences on your role and what you delivered." onChange={(e) => onField("summary", e.target.value)} />
      </label>
      <div className="adm-row">
        <label className="f">Headline result <em>Bold part, optional</em> {text("metricBold", "Full identity system")}</label>
        <label className="f">Supporting detail <em>Optional</em> {text("metricText", "logo, website visuals and campaigns")}</label>
      </div>
      <div className="adm-row">
        <label className="f">Page name <em>Used in the case study link</em> {text("id", "acme-interiors")}</label>
        <label className="f">Year {text("year", "2026")}</label>
      </div>
      <div className="adm-row">
        <label className="f">
          Tags <em>Comma separated</em>
          <TagsField value={p.tags} onChange={(v) => onField("tags", v)} />
        </label>
      </div>

      <div>
        <div className="hint" style={{ marginBottom: 8 }}>Categories (used by the filter chips)</div>
        <div className="adm-checks">
          {categories.map((c) => (
            <label className="adm-check" key={c.id}>
              <input type="checkbox" checked={(p.cats || []).includes(c.id)} onChange={() => onToggleCat(c.id)} /> {c.label}
            </label>
          ))}
        </div>
        <div className="adm-add">
          <input
            type="text"
            value={newCat}
            placeholder="New category, e.g. Motion"
            onChange={(e) => setNewCat(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addCat();
              }
            }}
          />
          <button className="pill" type="button" onClick={addCat}>Add</button>
        </div>
      </div>

      <div className="adm-row">
        <label className="f">
          Custom link <em>Optional. Overrides the case study page.</em> {text("url", "https://...")}
        </label>
        <div>
          <label className="f">Cover image path <em>Leave empty for the gradient cover</em> {text("image", "images/acme.jpg")}</label>
          <div className="adm-img" style={{ marginTop: 8 }}>
            <label className="pill" style={{ cursor: "pointer", fontSize: 12, padding: "7px 12px" }}>
              Upload image
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files[0];
                  e.target.value = "";
                  const url = await onUpload(file);
                  if (url) onField("image", url);
                }}
              />
            </label>
            <span className="hint">Uploads need the GitHub details above.</span>
          </div>
        </div>
      </div>

      <div>
        <div className="hint" style={{ marginBottom: 8 }}>Gradient cover colours</div>
        <div className="adm-colors">
          {[["a", "Light"], ["b", "Accent"], ["base", "Base"]].map(([k, label]) => (
            <label key={k}>{label} <input type="color" value={hex6((p.colors || {})[k])} onChange={(e) => onColor(k, e.target.value)} /></label>
          ))}
        </div>
      </div>

      <label className="adm-check" style={{ justifySelf: "start" }}>
        <input type="checkbox" checked={!!p.featured} onChange={(e) => onField("featured", e.target.checked)} /> Show on the home page (Selected work)
      </label>
    </div>
  );
}
