import { useEffect, useState } from "react";
import { cx, text } from "../../lib/utils";
import { useInView } from "../../hooks/useInView";
import { useReducedMotion } from "../../hooks/useReducedMotion";

/** One research number. Numeric values count up when the row scrolls into view. */
export default function Stat({ value, suffix, label }) {
  const [ref, seen] = useInView();
  const reduced = useReducedMotion();
  const raw = text(value);
  const sfx = text(suffix);
  const target = /^[0-9.]+$/.test(raw) ? parseFloat(raw) : null;
  const [shown, setShown] = useState(target === null || reduced ? target : 0);

  useEffect(() => {
    if (target === null || reduced) return undefined;
    if (!seen) return undefined;
    let frame;
    let t0 = null;
    const step = (t) => {
      if (t0 === null) t0 = t;
      const p = Math.min((t - t0) / 1500, 1);
      setShown(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [seen, target, reduced]);

  return (
    <div ref={ref} className={cx("stat", seen && "in")}>
      <b>{target === null ? raw : shown}{sfx}</b>
      <p>{label}</p>
    </div>
  );
}
