import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "./useReducedMotion";

/**
 * Returns [ref, seen]. `seen` flips to true the first time the element scrolls into view.
 * With reduced motion (or no IntersectionObserver) it is true straight away.
 */
export function useInView({ threshold = 0.18, rootMargin = "0px 0px -6% 0px" } = {}) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const unsupported = typeof IntersectionObserver === "undefined";
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    if (seen || reduced || unsupported) return undefined;
    const el = ref.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [seen, reduced, unsupported, threshold, rootMargin]);

  return [ref, seen || reduced || unsupported];
}
