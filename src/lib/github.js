// Commits files to the repository through the GitHub contents API.
// The token is only ever sent to api.github.com.

const API = "https://api.github.com";

async function errorText(res) {
  let message = "";
  try {
    message = (await res.json()).message;
  } catch (e) {
    /* no body */
  }
  if (res.status === 401) return "GitHub rejected the token (401). Check it is correct and has not expired.";
  if (res.status === 403) return "GitHub refused the request (403). The token needs Contents: Read and write on this repository.";
  if (res.status === 404) return "Repository or branch not found (404). Check the owner, repository and branch.";
  return `GitHub error ${res.status}${message ? `: ${message}` : ""}`;
}

export const toBase64 = (str) => btoa(unescape(encodeURIComponent(str)));

/** Create or update one file. `content` must already be base64. */
export async function putFile({ owner, repo, branch, token }, path, content, message) {
  const url = `${API}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/${path
    .split("/")
    .map(encodeURIComponent)
    .join("/")}`;
  const headers = {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${token}`,
    "X-GitHub-Api-Version": "2022-11-28",
  };
  let sha;
  const existing = await fetch(`${url}?ref=${encodeURIComponent(branch)}`, { headers });
  if (existing.status === 200) sha = (await existing.json()).sha;
  else if (existing.status !== 404) throw new Error(await errorText(existing));

  const body = { message, content, branch };
  if (sha) body.sha = sha;
  const res = await fetch(url, {
    method: "PUT",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await errorText(res));
}

export function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
