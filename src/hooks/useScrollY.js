import { useEffect, useState } from "react";

/** Current vertical scroll position, updated at most once per frame. */
export function useScrollY() {
  const [y, setY] = useState(() => (typeof window === "undefined" ? 0 : window.scrollY));
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        setY(window.scrollY);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return y;
}
