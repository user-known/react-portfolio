import { useCallback, useState } from "react";
import { flushSync } from "react-dom";

const readTheme = () =>
  document.documentElement.getAttribute("data-theme") ||
  (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

function apply(theme) {
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", theme === "dark" ? "#121211" : "#FBFBF9");
}

/** Light/dark theme. The switch spreads out from the button where the browser supports view transitions. */
export function useTheme() {
  const [theme, setTheme] = useState(readTheme);

  const toggle = useCallback(
    (button) => {
      const next = theme === "dark" ? "light" : "dark";
      try {
        localStorage.setItem("theme", next);
      } catch (e) {
        /* storage unavailable */
      }
      const commit = () => {
        apply(next);
        setTheme(next);
      };
      const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!document.startViewTransition || reduce || !button) {
        commit();
        return;
      }
      const r = button.getBoundingClientRect();
      const x = r.left + r.width / 2;
      const y = r.top + r.height / 2;
      const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      const root = document.documentElement;
      root.classList.add("theming");
      const transition = document.startViewTransition(() => flushSync(commit));
      transition.ready
        .then(() =>
          root.animate(
            { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
            { duration: 650, easing: "cubic-bezier(.6,0,.2,1)", pseudoElement: "::view-transition-new(root)" }
          )
        )
        .catch(() => {});
      const done = () => root.classList.remove("theming");
      transition.finished.then(done, done);
    },
    [theme]
  );

  return [theme, toggle];
}
