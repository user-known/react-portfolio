// Describes every field the admin shows for a project's case study page.
// The case study page (pages/CaseStudy.jsx) reads the same data, so the two stay in step:
// a section with nothing filled in is simply left out of the page.

export const PLACEHOLDER_COLORS = [
  ["#EFE3C8", "#D9BE8A"],
  ["#E4E8DD", "#B9C4A9"],
  ["#E6E3EE", "#C4BEDB"],
  ["#F1DDD4", "#DDA894"],
  ["#DCE6EE", "#A9C0D4"],
];

const IMG = { k: "image", l: "Image", t: "image" };

/**
 * type "object": a group of fields stored under `key` ("" means the case root).
 * type "list":   a repeatable group of fields stored as an array under `key`.
 * type "lines":  an array of strings, one per line of a textarea.
 */
export const SCHEMA = [
  { key: "", type: "object", title: "Header", open: true, fields: [
    { k: "role", l: "Your role", ph: "Creative & Graphic Designer" },
    { k: "sub", l: "One-line summary", t: "textarea", ph: "What you did, in a sentence. Falls back to the card summary." },
    { k: "badge", l: "Result or quote badge", h: "Optional", ph: "A one-line result or client quote" },
    { k: "liveLabel", l: "Live site label", h: "Optional", ph: "acme.com" },
    { k: "liveUrl", l: "Live site link", h: "Optional", ph: "https://..." },
  ] },
  { key: "quote", type: "object", title: "Overview: quote", fields: [
    { k: "text", l: "Quote", t: "textarea" },
    { k: "by", l: "Who said it", ph: "Client name, role" },
  ] },
  { key: "gallery", type: "list", title: "Overview: image tabs", item: "Tab",
    note: "One image shows as a plain picture. Two or more become a tabbed slideshow.", fields: [
    { k: "label", l: "Tab label", ph: "Logo" },
    { k: "caption", l: "Caption", ph: "What this shows" },
    IMG,
    { k: "a", l: "Fallback colour (light)", t: "color", def: "#E8EBF4" },
    { k: "b", l: "Fallback colour (dark)", t: "color", def: "#D3DBEE" },
  ] },
  { key: "brief", type: "object", title: "The brief", fields: [
    { k: "lead", l: "The brief in one sentence", ph: "The brief: ..." },
    { k: "text", l: "More detail", t: "textarea", h: "Blank line = new paragraph" },
  ] },
  { key: "process", type: "object", title: "Process diagram", fields: [
    { k: "intro", l: "Intro", t: "textarea" },
    { k: "phases", l: "Four phases, one per line", t: "lines", h: "Leave empty to hide the diagram", ph: "Discover\nDefine\nDevelop\nDeliver" },
    { k: "caption", l: "Caption" },
  ] },
  { key: "challenge", type: "object", title: "The challenge", fields: [
    { k: "text", l: "The challenge", t: "textarea" },
    IMG,
    { k: "caption", l: "Image caption" },
  ] },
  { key: "stats", type: "list", title: "Research: numbers", item: "Number",
    note: "Numbers count up when scrolled into view.", fields: [
    { k: "value", l: "Number", ph: "12" },
    { k: "suffix", l: "Suffix", ph: "% or x", h: "Optional" },
    { k: "label", l: "What it means", t: "textarea" },
  ] },
  { key: "questions", type: "lines", title: "Research: questions", l: "One question per line" },
  { key: "insights", type: "list", title: "Insights", item: "Insight", fields: [
    { k: "title", l: "Insight" },
    { k: "quote", l: "Supporting quote or note", t: "textarea" },
  ] },
  { key: "identity", type: "object", title: "Identity", fields: [
    { k: "text", l: "Text", t: "textarea" },
    IMG,
    { k: "caption", l: "Image caption" },
  ] },
  { key: "identityExtras", type: "list", title: "Identity: extra images", item: "Image",
    note: "Shown side by side under the main image.", fields: [IMG, { k: "caption", l: "Caption" }] },
  { key: "website", type: "object", title: "Website visuals: intro", fields: [{ k: "intro", l: "Intro", t: "textarea" }] },
  { key: "slides", type: "list", title: "Website visuals: slides", item: "Slide",
    note: "One image shows as a plain picture. Two or more become a slider.", fields: [IMG, { k: "caption", l: "Caption" }] },
  { key: "campaign", type: "object", title: "Campaign: intro and caption", fields: [
    { k: "intro", l: "Intro", t: "textarea" },
    { k: "caption", l: "Caption under the images" },
  ] },
  { key: "posts", type: "list", title: "Campaign: images", item: "Image", fields: [IMG] },
  { key: "outcomes", type: "list", title: "Outcomes: cards", item: "Card", fields: [
    { k: "icon", l: "Icon", t: "select", opts: [["check", "Check"], ["users", "People"], ["star", "Star"], ["spark", "Spark"]] },
    { k: "title", l: "Title" },
    { k: "text", l: "Text", t: "textarea" },
  ] },
  { key: "closing", type: "object", title: "Outcomes: closing", fields: [
    { k: "text", l: "Closing paragraphs", t: "textarea", h: "Blank line = new paragraph" },
    { k: "ctaLabel", l: "Button label", ph: "Visit the live site" },
    { k: "ctaUrl", l: "Button link", ph: "https://..." },
  ] },
];

export function defaultCase() {
  return {
    enabled: false, role: "", sub: "", badge: "", liveLabel: "", liveUrl: "",
    quote: { text: "", by: "" }, gallery: [], brief: { lead: "", text: "" },
    process: { intro: "", phases: [], caption: "" }, challenge: { text: "", image: "", caption: "" },
    stats: [], questions: [], insights: [],
    identity: { text: "", image: "", caption: "" }, identityExtras: [],
    website: { intro: "" }, slides: [], campaign: { intro: "", caption: "" }, posts: [],
    outcomes: [], closing: { text: "", ctaLabel: "", ctaUrl: "" },
  };
}

/** Fill in any missing case fields so the editor can rely on the full shape. */
function merge(def, obj) {
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) return def;
  Object.keys(def).forEach((k) => {
    const d = def[k];
    if (d && typeof d === "object" && !Array.isArray(d)) def[k] = merge(d, obj[k]);
    else if (obj[k] !== undefined) def[k] = obj[k];
  });
  return def;
}
export const ensureCase = (p) => {
  p.case = merge(defaultCase(), p.case);
  return p;
};

export const getPath = (o, path) => path.split(".").reduce((a, k) => (a == null ? a : a[k]), o);

export function setPath(o, path, value) {
  const keys = path.split(".");
  const last = keys.pop();
  const target = keys.reduce((a, k) => {
    if (a[k] == null) a[k] = /^\d+$/.test(k) ? [] : {};
    return a[k];
  }, o);
  target[last] = value;
}

export function newItem(section, n) {
  const o = {};
  section.fields.forEach((f) => {
    o[f.k] = f.t === "select" ? f.opts[0][0] : "";
  });
  if (section.key === "gallery") {
    const d = PLACEHOLDER_COLORS[n % PLACEHOLDER_COLORS.length];
    o.a = d[0];
    o.b = d[1];
  }
  return o;
}

export function blankProject() {
  return {
    id: "", client: "", title: "New project", industry: "", year: String(new Date().getFullYear()),
    metricBold: "", metricText: "", summary: "", tags: [], cats: [],
    colors: { a: "#E9C46A", b: "#8A4B25", base: "#1E1A14" },
    image: "", url: "", featured: false, case: defaultCase(),
  };
}

export const hex6 = (c) => {
  const v = String(c || "");
  if (/^#[0-9a-f]{6}$/i.test(v)) return v;
  if (/^#[0-9a-f]{3}$/i.test(v)) return `#${v[1]}${v[1]}${v[2]}${v[2]}${v[3]}${v[3]}`;
  return "#000000";
};
