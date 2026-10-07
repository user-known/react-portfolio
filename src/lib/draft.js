// The admin keeps unpublished edits in the browser. Case study previews read the same draft.
export const DRAFT_KEY = "pfDraft";

export function readDraft() {
  try {
    const d = JSON.parse(localStorage.getItem(DRAFT_KEY) || "null");
    if (d && Array.isArray(d.projects)) {
      return { categories: Array.isArray(d.cats) ? d.cats : [], projects: d.projects };
    }
  } catch (e) {
    /* ignore */
  }
  return null;
}

export function writeDraft(categories, projects) {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ cats: categories, projects }));
  } catch (e) {
    /* storage unavailable */
  }
}

export function clearDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch (e) {
    /* ignore */
  }
}
