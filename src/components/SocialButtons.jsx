import Icon from "./Icon";
import CopyEmailButton from "./CopyEmailButton";
import { LINKS } from "../lib/utils";

/** Email, LinkedIn and Behance pills used in the home hero, the about hero and the footer. */
export default function SocialButtons({ emailLabel }) {
  return (
    <>
      <CopyEmailButton label={emailLabel} />
      <a className="pill" href={LINKS.linkedin}>
        <Icon name="in" />LinkedIn
      </a>
    </>
  );
}
