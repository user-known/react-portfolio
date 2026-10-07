import Reveal, { stagger } from "./Reveal";

const TOOLS = [
  { code: "Fg", name: "Figma", color: "#F24E1E" },
  { code: "Ps", name: "Photoshop", color: "#31A8FF" },
  { code: "Lr", name: "Lightroom", color: "#31A8FF" },
  { code: "Af", name: "Affinity", color: "#7E4DD2" },
  { code: "Ae", name: "After Effects", color: "#9999FF" },
  { code: "DR", name: "DaVinci Resolve", color: "#E68435" },
  { code: "Pr", name: "Premiere Pro", color: "#9999FF" },
  { code: "Cc", name: "CapCut", color: "#A1A1AA" },
  { code: "W", name: "WordPress", color: "#21759B" },
  { code: "El", name: "Elementor", color: "#92003B" },
  { code: "Fr", name: "Framer", color: "#0055FF" },
  { code: "Wf", name: "Webflow", color: "#146EF5" },
  { code: "</>", name: "HTML, CSS, JS", color: "#E34F26" },
  { code: "Bl", name: "Blender", color: "#F5792A" },
  { code: "Un", name: "Unity", color: "#A1A1AA" },
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
