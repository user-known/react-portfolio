import { useEffect, useRef, useState } from "react";
import { assetUrl, coverBg, cx } from "../lib/utils";
import { useInView } from "../hooks/useInView";
import { useReducedMotion } from "../hooks/useReducedMotion";

/**
 * Project cover: the project's image over a gradient, with the name set on top.
 * It wipes in on scroll (`reveal`) and drifts slightly while the page scrolls.
 */
export default function Cover({ project, index = 0, reveal = false, delay, className }) {
  const [inViewRef, seen] = useInView({ threshold: 0.12 });
  const localRef = useRef(null);
  const reduced = useReducedMotion();
  const [broken, setBroken] = useState(false);
  const image = assetUrl(project.image);

  useEffect(() => {
    const el = localRef.current;
    if (reduced || !el) return undefined;
    let ticking = false;
    const update = () => {
      ticking = false;
      const r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      const p = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
      el.style.setProperty("--py", `${(p * -20).toFixed(1)}px`);
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [reduced]);

  const style = { "--bg-cover": coverBg(project, index) };
  if (delay) style["--d"] = delay;

  return (
    <div
      ref={inViewRef}
      className="cover-wrap"
    >
      <div
        ref={localRef}
        className={cx("cover", className, reveal && seen && "in")}
        style={style}
        {...(reveal ? { "data-reveal": "" } : {})}
      >
        {image && !broken && (
          <img src={image} alt={`${project.client || project.title} cover`} loading="lazy" onError={() => setBroken(true)} />
        )}
        <span className="mark">{project.client || project.title}</span>
      </div>
    </div>
  );
}
