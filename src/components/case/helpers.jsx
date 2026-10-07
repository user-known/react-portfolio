import Reveal from "../Reveal";
import { assetUrl, col, text } from "../../lib/utils";

/** Fallback colour pairs for image frames that have no picture yet. */
export const PLACEHOLDERS = [
  ["#EFE3C8", "#D9BE8A"],
  ["#E4E8DD", "#B9C4A9"],
  ["#E6E3EE", "#C4BEDB"],
  ["#F1DDD4", "#DDA894"],
  ["#DCE6EE", "#A9C0D4"],
];

/** Text split on blank lines into paragraphs (a single line break stays a line break). */
export function Paras({ text: value }) {
  const parts = text(value).split(/\n{2,}/).map((s) => s.trim()).filter(Boolean);
  return parts.map((part, i) => (
    <Reveal as="p" key={i}>
      {part.split("\n").map((line, j, all) => (
        <span key={j}>
          {line}
          {j < all.length - 1 && <br />}
        </span>
      ))}
    </Reveal>
  ));
}

/** A picture in a card, with an optional caption. Renders nothing when there is no image. */
export function Shot({ src, caption }) {
  const url = assetUrl(src);
  if (!url) return null;
  return (
    <Reveal as="figure">
      <div className="card">
        <img className="shot" src={url} alt={caption || ""} loading="lazy" />
      </div>
      {text(caption) && <figcaption>{caption}</figcaption>}
    </Reveal>
  );
}

/** Image frame: the picture if there is one, otherwise a soft gradient with a label. */
export function Framed({ src, a, b, ar, label }) {
  const url = assetUrl(src);
  const style = { "--a": col(a, "#E8EBF4"), "--b": col(b, "#D3DBEE") };
  if (ar) style["--ar"] = ar;
  return (
    <div className="ph" style={style}>
      {url ? <img src={url} alt={label || ""} loading="lazy" /> : label || ""}
    </div>
  );
}
