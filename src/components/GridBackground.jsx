import { useEffect, useRef } from "react";
import { cx } from "../lib/utils";
import { useReducedMotion } from "../hooks/useReducedMotion";

/** Faint grid texture. Squares near the cursor light up while it moves over the parent section. */
export default function GridBackground({ bottom = false, glow = false }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const grid = ref.current;
    const host = grid && grid.parentElement;
    if (!glow || reduced || !host) return undefined;
    const move = (e) => {
      const r = grid.getBoundingClientRect();
      grid.style.setProperty("--mx", `${e.clientX - r.left}px`);
      grid.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    const leave = () => grid.style.setProperty("--my", "-400px");
    host.addEventListener("pointermove", move);
    host.addEventListener("pointerleave", leave);
    return () => {
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerleave", leave);
    };
  }, [glow, reduced]);

  return <div ref={ref} className={cx("grid-bg", bottom && "bottom")} aria-hidden="true" />;
}
