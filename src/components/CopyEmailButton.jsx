import Icon from "./Icon";
import { EMAIL } from "../lib/utils";
import { useCopy } from "../hooks/useCopy";

/** Dark pill that copies the email address. `label` replaces the address (for example "Copy email"). */
export default function CopyEmailButton({ label }) {
  const [copied, copy] = useCopy();
  return (
    <button className="pill dark" type="button" onClick={() => copy(EMAIL)}>
      <Icon name="copy" />
      <span>{copied ? "Copied" : label || EMAIL}</span>
    </button>
  );
}
