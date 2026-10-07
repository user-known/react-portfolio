/** One line of a headline that slides up from behind a mask. */
export default function Line({ delay = "0s", children }) {
  return (
    <span className="ln">
      <span style={{ "--d": delay }}>{children}</span>
    </span>
  );
}
