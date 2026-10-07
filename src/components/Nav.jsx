import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Icon from "./Icon";
import { EMAIL, cx } from "../lib/utils";
import { useScrollY } from "../hooks/useScrollY";
import { useTheme } from "../hooks/useTheme";

const LINKS = [
  { key: "work", label: "Work", to: "/", state: { scrollTo: "work" } },
  { key: "about", label: "About", to: "/about" },
  { key: "faq", label: "FAQ", to: "/", state: { scrollTo: "faq" }, optional: true },
];

/** Which link is current: by route, or by scroll position on the home page. */
function useActiveKey(pathname, scrollY) {
  const [spy, setSpy] = useState(null);
  useEffect(() => {
    if (pathname !== "/") return;
    const line = window.innerHeight * 0.4;
    let cur = null;
    ["work", "faq"].forEach((id) => {
      const el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top <= line) cur = id;
    });
    setSpy(cur);
  }, [pathname, scrollY]);
  if (pathname === "/about") return "about";
  if (pathname.startsWith("/projects")) return "work";
  if (pathname === "/") return spy;
  return null;
}

/**
 * Floating pill that grows into a full-width bar once the page is scrolled.
 * A sliding indicator follows the hovered or current link.
 */
export default function Nav() {
  const { pathname } = useLocation();
  const y = useScrollY();
  const active = useActiveKey(pathname, y);
  const [theme, toggleTheme] = useTheme();

  const navRef = useRef(null);
  const themeRef = useRef(null);
  const items = useRef({});
  const [hover, setHover] = useState(null);
  const [measure, setMeasure] = useState(0);
  const [ind, setInd] = useState({ x: 0, w: 0, show: false, snap: false });

  // Re-measure after fonts load and on resize.
  useEffect(() => {
    const bump = () => setMeasure((m) => m + 1);
    window.addEventListener("resize", bump);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(bump);
    return () => window.removeEventListener("resize", bump);
  }, []);

  // The pill's natural width, so the width can animate to 100% and back.
  useLayoutEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    let w = 12 + 8 + 4 * (nav.children.length - 1) + 1;
    Array.prototype.forEach.call(nav.children, (k) => {
      w += k.getBoundingClientRect().width;
    });
    nav.style.setProperty("--nav-w", `${Math.ceil(w)}px`);
  }, [measure]);

  const target = hover || active;
  useLayoutEffect(() => {
    const el = target && items.current[target];
    if (!el) {
      setInd((s) => ({ ...s, show: false }));
      return;
    }
    setInd((s) => ({ x: el.offsetLeft, w: el.offsetWidth, show: true, snap: !s.show }));
  }, [target, measure]);

  return (
    <nav ref={navRef} className={cx("nav", y > 8 && "scrolled", y > 80 && "full")} aria-label="Primary">
      <Link className="avatar" to="/" state={{ scrollTo: "top" }} aria-label="Home">V</Link>
      <div className="links" onMouseLeave={() => setHover(null)}>
        <i
          className="indicator"
          aria-hidden="true"
          style={{
            opacity: ind.show ? 1 : 0,
            width: ind.w,
            transform: `translateX(${ind.x}px)`,
            transition: ind.snap ? "none" : undefined,
          }}
        />
        {LINKS.map((l) => (
          <Link
            key={l.key}
            ref={(el) => {
              items.current[l.key] = el;
            }}
            className={cx("link", l.optional && "opt", active === l.key && "active")}
            to={l.to}
            state={l.state}
            onMouseEnter={() => setHover(l.key)}
            onFocus={() => setHover(l.key)}
            onBlur={() => setHover(null)}
          >
            {l.label}
          </Link>
        ))}
      </div>
      <a className="pill-dark" href={`mailto:${EMAIL}`}>
        <Icon name="mail" />Email
      </a>
      <button
        ref={themeRef}
        className="icon-btn"
        type="button"
        aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        onClick={() => toggleTheme(themeRef.current)}
      >
        <Icon name={theme === "dark" ? "sun" : "moon"} />
      </button>
    </nav>
  );
}
