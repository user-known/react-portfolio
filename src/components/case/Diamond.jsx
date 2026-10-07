import { cx } from "../../lib/utils";
import { useInView } from "../../hooks/useInView";

/** Double Diamond process diagram. The outlines draw themselves when it scrolls into view. */
export default function Diamond({ phases }) {
  const [ref, seen] = useInView();
  const [a, b, c, d] = phases;
  return (
    <svg
      ref={ref}
      className={cx("diamond", seen && "in")}
      viewBox="0 0 640 220"
      role="img"
      aria-label={`Process diagram: ${phases.join(", ")}`}
    >
      <path className="draw" pathLength="1" d="M20 110 L170 20 L320 110 L170 200 Z" />
      <path className="draw" pathLength="1" d="M320 110 L470 20 L620 110 L470 200 Z" />
      <line className="dash" x1="170" y1="22" x2="170" y2="198" />
      <line className="dash" x1="470" y1="22" x2="470" y2="198" />
      <circle cx="20" cy="110" r="4" fill="var(--card)" />
      <circle cx="320" cy="110" r="4" fill="var(--card)" />
      <circle cx="620" cy="110" r="4" fill="var(--card)" />
      <text className="small" x="170" y="12">The problem</text>
      <text className="small" x="470" y="12">The solution</text>
      <text x="98" y="114">{a}</text>
      <text x="244" y="114">{b}</text>
      <text x="398" y="114">{c}</text>
      <text x="544" y="114">{d}</text>
    </svg>
  );
}
