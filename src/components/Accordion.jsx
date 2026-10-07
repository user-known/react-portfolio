import { useId, useState } from "react";
import Icon from "./Icon";
import { cx } from "../lib/utils";

/** FAQ list. One item is open at a time; click the open one to close it. */
export default function Accordion({ items, defaultOpen = null }) {
  const [open, setOpen] = useState(defaultOpen);
  const uid = useId();
  return (
    <div className="faq">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div className="faq-item" key={item.q}>
            <button
              className="faq-q"
              type="button"
              id={`${uid}-q${i}`}
              aria-expanded={isOpen}
              aria-controls={`${uid}-a${i}`}
              onClick={() => setOpen(isOpen ? null : i)}
            >
              {item.q}
              <span className="tg"><Icon name="plus" /></span>
            </button>
            <div className={cx("faq-a", isOpen && "open")} id={`${uid}-a${i}`} role="region" aria-labelledby={`${uid}-q${i}`}>
              <div><p>{item.a}</p></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
