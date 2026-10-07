import Icon from "./Icon";

/** "Read case study" with an arrow that nudges right on hover (styled by the parent card). */
export default function ReadLabel({ as: Tag = "span", ...rest }) {
  return (
    <Tag className="read" {...rest}>
      Read case study <Icon name="right" />
    </Tag>
  );
}
