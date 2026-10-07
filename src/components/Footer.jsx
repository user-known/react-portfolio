import Icon from "./Icon";
import GridBackground from "./GridBackground";
import Highlight from "./Highlight";
import Reveal from "./Reveal";
import SocialButtons from "./SocialButtons";
import { useLocalTime } from "../hooks/useLocalTime";

export default function Footer() {
  const time = useLocalTime();
  return (
    <footer>
      <GridBackground bottom />
      <div className="wrap">
        <Reveal as="h2">
          Let's build a <Highlight>brand</Highlight> worth remembering.
        </Reveal>
        <Reveal className="btn-row" delay="0.1s">
          <SocialButtons emailLabel="Copy email" />
        </Reveal>
        <Reveal className="foot-meta" delay="0.2s">
          <button className="pill" type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <Icon name="up" />Back to top
          </button>
          <span className="where">
            <span className="dot" />
            India &bull; <span>{time || "--"}</span>
          </span>
          <span>&copy; Vignesh Balakumar, {new Date().getFullYear()}</span>
        </Reveal>
      </div>
    </footer>
  );
}
