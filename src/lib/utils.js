export const cx = (...parts) => parts.filter(Boolean).join(" ");

export const slug = (s) =>
  String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

export const safeUrl = (u) => {
  const v = String(u || "").trim();
  return /^(javascript|data|vbscript):/i.test(v) ? "" : v;
};

export const col = (c, fallback) => (/^#[0-9a-f]{3,8}$/i.test(c || "") ? c : fallback);

export const text = (v) => String(v == null ? "" : v).trim();
export const arr = (v) => (Array.isArray(v) ? v : []);

/** The project's page name, used in /projects/:id */
export const idOf = (p) => p.id || slug(p.client || p.title) || "project";
export const hasCase = (p) => !!(p.case && p.case.enabled);

/** Image paths in the data are relative to the site (images/x.jpg). */
export function assetUrl(path) {
  const u = safeUrl(path);
  if (!u) return "";
  if (/^(https?:|data:|blob:|\/)/i.test(u)) return u;
  return `${import.meta.env.BASE_URL}${u}`;
}

/**
 * Where a project card should link.
 * - a custom link in the data wins (external URL),
 * - otherwise the built-in case study page when the project has one,
 * - otherwise nothing (the card is not clickable).
 */
export function targetFor(p, preview = false) {
  const u = safeUrl(p.url);
  if (u) return { href: u };
  if (hasCase(p)) return { to: `/projects/${encodeURIComponent(idOf(p))}${preview ? "?preview=1" : ""}` };
  return null;
}

const POS = [
  ["15% 15%", "90% 85%"],
  ["85% 20%", "10% 90%"],
  ["20% 20%", "90% 90%"],
  ["80% 15%", "10% 90%"],
];

/** Mesh-style gradient used for covers when a project has no image. */
export function coverBg(p, i = 0) {
  const c = p.colors || {};
  const pos = POS[i % POS.length];
  return (
    `radial-gradient(80% 90% at ${pos[0]}, ${col(c.a, "#E9C46A")} 0%, transparent 56%), ` +
    `radial-gradient(70% 80% at ${pos[1]}, ${col(c.b, "#8A4B25")} 0%, transparent 62%), ` +
    col(c.base, "#1E1A14")
  );
}

export const metaLine = (p) => [p.client, p.industry, p.year].filter(Boolean).join(" \u2022 ");

export const EMAIL = "hello@yourdomain.com"; // replace with your email
export const LINKS = { linkedin: "#", behance: "#" }; // replace with your profile links
