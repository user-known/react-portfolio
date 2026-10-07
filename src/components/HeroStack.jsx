import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Icon from "./Icon";
import { useFeatured } from "../context/ProjectsContext";
import { col, cx } from "../lib/utils";

const FALLBACK = [
  { ico: "linear-gradient(135deg,#E9C46A,#8A4B25)", ini: "V", meta: "Portfolio", title: "Add your first project" },
];

/** Stacked card in the hero that cycles through the featured projects. Each dot fills as a timer. */
export default function HeroStack() {
  const featured = useFeatured();
  const items = useMemo(() => {
    const list = featured.slice(0, 5).map((p) => {
      const c = p.colors || {};
      return {
        ico: `linear-gradient(135deg,${col(c.a, "#E9C46A")},${col(c.b, "#8A4B25")})`,
        ini: String(p.client || p.title || "V").charAt(0).toUpperCase(),
        meta: [p.client, p.industry].filter(Boolean).join(" \u2022 "),
        title: p.title || p.client,
      };
    });
    return list.length ? list : FALLBACK;
  }, [featured]);

  const [idx, setIdx] = useState(0);
  const [tick, setTick] = useState(0); // restarts the dot's fill animation
  const [swap, setSwap] = useState(false);
  const timer = useRef(null);
  const n = items.length;
  const current = items[Math.min(idx, n - 1)];

  const show = useCallback(
    (i) => {
      clearTimeout(timer.current);
      setSwap(true);
      timer.current = setTimeout(() => {
        setIdx(((i % n) + n) % n);
        setTick((t) => t + 1);
        setSwap(false);
      }, 180);
    },
    [n]
  );
  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <div className="stack" aria-label="Featured work">
      <Link className={cx("stack-card", swap && "swap")} to="/" state={{ scrollTo: "work" }}>
        <span className="stack-ico" style={{ background: current.ico }}>{current.ini}</span>
        <span className="stack-txt">
          <span className="stack-meta">{current.meta}</span>
          <br />
          <span className="stack-title">{current.title}</span>
        </span>
        {n > 1 && (
          <button
            className="stack-next"
            type="button"
            aria-label="Next project"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              show(idx + 1);
            }}
          >
            <Icon name="right" />
          </button>
        )}
      </Link>
      {n > 1 && (
        <div className="dots">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Show project ${i + 1}`}
              aria-current={i === idx ? "true" : undefined}
              onClick={() => show(i)}
            >
              {i === idx && <span key={tick} className="fill" onAnimationEnd={() => show(idx + 1)} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
