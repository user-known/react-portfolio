import { cx } from "../lib/utils";
import { useInView } from "../hooks/useInView";

/** Fades its content up the first time it scrolls into view. `delay` is a CSS time such as "0.1s". */
export default function Reveal({ as: Tag = "div", delay, className, style, children, ...rest }) {
  const [ref, seen] = useInView();
  return (
    <Tag
      ref={ref}
      data-reveal=""
      className={cx(className, seen && "in")}
      style={delay ? { ...style, "--d": delay } : style}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** Delay for the nth item of a staggered group. */
export const stagger = (i, step = 0.08) => `${(i * step).toFixed(2)}s`;
