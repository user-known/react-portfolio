import { cx } from "../lib/utils";
import { useInView } from "../hooks/useInView";

/** The soft chip behind a key word. It draws in left to right when it scrolls into view. */
export default function Highlight({ children }) {
  const [ref, seen] = useInView();
  return (
    <span ref={ref} className={cx("hl", seen && "in")}>
      {children}
    </span>
  );
}
