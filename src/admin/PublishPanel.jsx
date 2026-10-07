import { useState } from "react";

const KEY = "pfGh";

export function loadGithubSettings() {
  try {
    const g = JSON.parse(localStorage.getItem(KEY) || "null") || {};
    return { owner: g.owner || "", repo: g.repo || "", branch: g.branch || "main", token: g.token || "", remember: !!g.token };
  } catch (e) {
    return { owner: "", repo: "", branch: "main", token: "", remember: false };
  }
}

export function saveGithubSettings(s) {
  try {
    const keep = { owner: s.owner, repo: s.repo, branch: s.branch };
    if (s.remember) keep.token = s.token;
    localStorage.setItem(KEY, JSON.stringify(keep));
  } catch (e) {
    /* storage unavailable */
  }
}

/** Collapsible form for the GitHub details used by Publish and image uploads. */
export default function PublishPanel({ settings, onChange, open, onToggle, busy, onPublish }) {
  const set = (k) => (e) => onChange({ ...settings, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value });
  return (
    <details className="card pad adm-pub" open={open} onToggle={(e) => onToggle(e.currentTarget.open)}>
      <summary>Publish straight to GitHub (optional)</summary>
      <p>
        Without this, download the file and replace <code>src/data/projects.json</code> in your repository. With it, the
        button below commits the file for you, and the deploy workflow rebuilds the site. Create a fine-grained token at
        GitHub &rarr; Settings &rarr; Developer settings, limited to this one repository with{" "}
        <strong>Contents: Read and write</strong>. The token goes only to api.github.com and is not saved unless you tick the box.
      </p>
      <div className="adm-row" style={{ marginBottom: 12 }}>
        <label className="f">Owner <input type="text" value={settings.owner} onChange={set("owner")} placeholder="your-username" autoComplete="off" /></label>
        <label className="f">Repository <input type="text" value={settings.repo} onChange={set("repo")} placeholder="portfolio" autoComplete="off" /></label>
      </div>
      <div className="adm-row" style={{ marginBottom: 12 }}>
        <label className="f">Branch <input type="text" value={settings.branch} onChange={set("branch")} autoComplete="off" /></label>
        <label className="f">Token <input type="password" value={settings.token} onChange={set("token")} autoComplete="off" placeholder="github_pat_..." /></label>
      </div>
      <label className="adm-check" style={{ marginBottom: 12 }}>
        <input type="checkbox" checked={settings.remember} onChange={set("remember")} /> Remember the token on this device
      </label>
      <br />
      <button className="pill dark" type="button" disabled={busy} onClick={onPublish}>Publish to GitHub</button>
    </details>
  );
}
