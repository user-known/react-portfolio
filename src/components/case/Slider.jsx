import { useRef, useState } from "react";
import Icon from "../Icon";
import Reveal from "../Reveal";
import { Framed } from "./helpers";
import { text } from "../../lib/utils";

const pad = (n) => (n < 10 ? "0" : "") + n;

/** Swipeable slider with previous/next buttons, a counter and a progress line. */
export default function Slider({ slides, label = "Slides" }) {
  const [i, setI] = useState(0);
  const startX = useRef(null);
  const n = slides.length;
  const go = (next) => setI(Math.max(0, Math.min(n - 1, next)));

  return (
    <Reveal className="slider">
      <div
        className="slider-view"
        tabIndex={0}
        aria-label={label}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") go(i - 1);
          if (e.key === "ArrowRight") go(i + 1);
        }}
        onPointerDown={(e) => {
          startX.current = e.clientX;
        }}
        onPointerUp={(e) => {
          if (startX.current === null) return;
          const dx = e.clientX - startX.current;
          startX.current = null;
          if (Math.abs(dx) > 50) go(i + (dx < 0 ? 1 : -1));
        }}
      >
        <div className="slider-track" style={{ transform: `translateX(${-i * 100}%)` }}>
          {slides.map((s, k) => (
            <figure className="slide" key={k}>
              <div className="card"><Framed src={s.image} label={s.caption} /></div>
              {text(s.caption) && <figcaption>{s.caption}</figcaption>}
            </figure>
          ))}
        </div>
      </div>
      <div className="slider-ctl">
        <button className="prev" type="button" aria-label="Previous" disabled={i === 0} onClick={() => go(i - 1)}>
          <Icon name="left" />
        </button>
        <button className="next-btn primary" type="button" aria-label="Next" disabled={i === n - 1} onClick={() => go(i + 1)}>
          <Icon name="right" />
        </button>
        <span className="count">{pad(i + 1)} / {pad(n)}</span>
        <span className="bar"><i style={{ width: `${((i + 1) / n) * 100}%` }} /></span>
      </div>
    </Reveal>
  );
}
