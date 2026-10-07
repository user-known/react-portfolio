import { useState } from "react";
import Icon from "../Icon";
import Reveal from "../Reveal";
import { Framed, PLACEHOLDERS } from "./helpers";
import { cx, text } from "../../lib/utils";
import { useInView } from "../../hooks/useInView";

/** Tabbed image slideshow. It starts cycling once it is on screen and can be paused. */
export default function Viewer({ items }) {
  const [idx, setIdx] = useState(0);
  const [tick, setTick] = useState(0); // restarts the tab's progress line
  const [paused, setPaused] = useState(false);
  const [ref, started] = useInView({ threshold: 0.4 });
  const n = items.length;

  const go = (i) => {
    setIdx(((i % n) + n) % n);
    setTick((t) => t + 1);
  };

  return (
    <Reveal className={cx("viewer", paused && "paused", !started && "wait")} style={{ marginTop: 16 }}>
      <div className="card" ref={ref}>
        <div className="viewer-stage">
          <div className="ph sizer" />
          {items.map((g, i) => {
            const d = PLACEHOLDERS[i % PLACEHOLDERS.length];
            return (
              <div className={cx("panel", i === idx && "on")} key={i}>
                <Framed src={g.image} a={g.a || d[0]} b={g.b || d[1]} label={g.label} />
              </div>
            );
          })}
        </div>
      </div>
      <div className="viewer-bar">
        <button
          className="pause"
          type="button"
          aria-label={paused ? "Play slideshow" : "Pause slideshow"}
          onClick={() => setPaused((p) => !p)}
        >
          <Icon name={paused ? "play" : "pause"} />
        </button>
        <div role="tablist" style={{ display: "flex", gap: 8 }}>
          {items.map((g, i) => (
            <button
              className="tab"
              role="tab"
              type="button"
              key={i}
              aria-selected={i === idx}
              tabIndex={i === idx ? 0 : -1}
              onClick={() => go(i)}
            >
              {text(g.label) || `Image ${i + 1}`}
              {i === idx && <span key={tick} className="fill" onAnimationEnd={() => go(idx + 1)} />}
            </button>
          ))}
        </div>
      </div>
      <p className="viewer-cap">{text(items[idx].caption)}</p>
    </Reveal>
  );
}
