import { useEffect, useState } from "react";
import { cx } from "../../lib/utils";

/** Side menu with a dash per section. The current section's dash grows and shows its name. */
export default function Rail({ sections }) {
  const [current, setCurrent] = useState(sections[0] ? sections[0].id : null);

  useEffect(() => {
    let ticking = false;
    const update = () => {
      ticking = false;
      const line = window.innerHeight * 0.35;
      let cur = sections[0] ? sections[0].id : null;
      sections.forEach((s) => {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= line) cur = s.id;
      });
      setCurrent(cur);
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [sections]);

  const jump = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <aside className="rail" aria-label="On this page">
      <ul>
        {sections.map((s) => (
          <li key={s.id}>
            <a href={`#${s.id}`} className={cx(current === s.id && "on")} onClick={(e) => jump(e, s.id)}>
              <i /><span>{s.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
