import { useState } from "react";
import { SCHEMA, getPath, hex6, newItem } from "./caseSchema";

/** A textarea holding an array of strings, one per line. It keeps its own text so blank lines survive typing. */
function LinesField({ value, onChange, placeholder }) {
  const [raw, setRaw] = useState(() => (Array.isArray(value) ? value.join("\n") : ""));
  return (
    <textarea
      value={raw}
      placeholder={placeholder}
      onChange={(e) => {
        setRaw(e.target.value);
        onChange(e.target.value.split("\n").map((x) => x.trim()).filter(Boolean));
      }}
    />
  );
}

function Field({ f, value, onChange, onUpload }) {
  let input;
  if (f.t === "textarea") {
    input = <textarea value={value || ""} placeholder={f.ph} onChange={(e) => onChange(e.target.value)} />;
  } else if (f.t === "lines") {
    input = <LinesField value={value} placeholder={f.ph} onChange={onChange} />;
  } else if (f.t === "select") {
    input = (
      <select value={value || f.opts[0][0]} onChange={(e) => onChange(e.target.value)}>
        {f.opts.map(([v, label]) => <option key={v} value={v}>{label}</option>)}
      </select>
    );
  } else if (f.t === "color") {
    input = <input type="color" value={hex6(value || f.def)} onChange={(e) => onChange(e.target.value)} />;
  } else {
    input = <input type="text" value={value || ""} placeholder={f.t === "image" ? "images/example.jpg" : f.ph} onChange={(e) => onChange(e.target.value)} />;
  }
  return (
    <div>
      <label className="f">
        <span>{f.l}{f.h && <em> {f.h}</em>}</span>
        {input}
      </label>
      {f.t === "image" && (
        <div className="adm-img" style={{ marginTop: 6 }}>
          <label className="pill" style={{ cursor: "pointer", fontSize: 12, padding: "6px 11px" }}>
            Upload image
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files[0];
                e.target.value = "";
                const url = await onUpload(file);
                if (url) onChange(url);
              }}
            />
          </label>
        </div>
      )}
    </div>
  );
}

function Section({ s, c, open, onToggle, onSet, onList, onUpload }) {
  const data = s.key ? getPath(c, s.key) : null;
  const count = s.type === "list" || s.type === "lines" ? (data || []).length : null;
  return (
    <details className="adm-sec" open={open} onToggle={(e) => onToggle(e.currentTarget.open)}>
      <summary>
        <span>{s.title}{count !== null && <span className="cnt">({count})</span>}</span>
      </summary>
      <div className="adm-sec-body">
        {s.note && <p className="adm-note">{s.note}</p>}

        {s.type === "object" &&
          s.fields.map((f) => {
            const path = s.key ? `${s.key}.${f.k}` : f.k;
            return <Field key={path} f={f} value={getPath(c, path)} onChange={(v) => onSet(path, v)} onUpload={onUpload} />;
          })}

        {s.type === "lines" && (
          <Field f={{ l: s.l, t: "lines" }} value={data} onChange={(v) => onSet(s.key, v)} onUpload={onUpload} />
        )}

        {s.type === "list" && (
          <>
            {(data || []).map((item, i) => (
              <div className="adm-box" key={i}>
                <div className="adm-box-h">
                  <span>{s.item} {i + 1}</span>
                  <span>
                    <button type="button" className="mini" aria-label={`Move ${s.item} ${i + 1} up`} onClick={() => onList(s, "up", i)}>{"\u2191"}</button>
                    <button type="button" className="mini" aria-label={`Move ${s.item} ${i + 1} down`} onClick={() => onList(s, "down", i)}>{"\u2193"}</button>
                    <button type="button" className="mini danger" onClick={() => onList(s, "del", i)}>Remove</button>
                  </span>
                </div>
                {s.fields.map((f) => (
                  <Field key={f.k} f={f} value={item[f.k]} onChange={(v) => onSet(`${s.key}.${i}.${f.k}`, v)} onUpload={onUpload} />
                ))}
              </div>
            ))}
            <button
              type="button"
              className="mini"
              style={{ justifySelf: "start", padding: "7px 12px", fontSize: 12, margin: 0 }}
              onClick={() => onList(s, "add")}
            >
              + Add {s.item.toLowerCase()}
            </button>
          </>
        )}
      </div>
    </details>
  );
}

/** The "Case study page" tab of the admin: one collapsible group per section of the page. */
export default function CaseEditor({ project, onSet, onList, onUpload }) {
  const [open, setOpen] = useState({ "": true });
  return (
    <div style={{ display: "grid", gap: 10 }}>
      {SCHEMA.map((s) => (
        <Section
          key={s.key || "header"}
          s={s}
          c={project.case}
          open={!!open[s.key]}
          onToggle={(v) => setOpen((o) => ({ ...o, [s.key]: v }))}
          onSet={onSet}
          onList={onList}
          onUpload={onUpload}
        />
      ))}
    </div>
  );
}

export { newItem };
