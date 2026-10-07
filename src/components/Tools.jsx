import Reveal, { stagger } from "./Reveal";

const TOOLS = [
  { code: "Fg", name: "Figma", color: "#F24E1E" },
  { code: "Wf", name: "Webflow", color: "#146EF5" },
  { code: "Ps", name: "Photoshop", color: "#31A8FF" },
  { code: "Ai", name: "Illustrator", color: "#FF9A00" },
  { code: "Ae", name: "After Effects", color: "#9999FF" },
  { code: "Cl", name: "Claude", color: "#D97757" },
];

export default function Tools({ heading = true }) {
  return (
    <div className="tools">
      {heading && <Reveal as="h4">Tools I use</Reveal>}
      <div className="tool-row">
        {TOOLS.map((t, i) => (
          <Reveal className="tool" key={t.name} delay={stagger(i, 0.06)}>
            <i style={{ color: t.color }}>{t.code}</i>
            {t.name}
          </Reveal>
        ))}
      </div>
    </div>
  );
}
