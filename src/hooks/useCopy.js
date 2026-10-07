import { useCallback, useRef, useState } from "react";

/** copy(text) puts text on the clipboard; `copied` is true for 1.5 seconds afterwards. */
export function useCopy() {
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);
  const copy = useCallback((value) => {
    const done = () => {
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1500);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(value).then(done, done);
    else done();
  }, []);
  return [copied, copy];
}
