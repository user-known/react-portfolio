import { Link } from "react-router-dom";
import GridBackground from "../components/GridBackground";
import Icon from "../components/Icon";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

export default function NotFound() {
  useDocumentTitle("Page not found \u00B7 Vignesh Balakumar");
  return (
    <header className="case-hero">
      <GridBackground />
      <div className="wrap">
        <h1>Page not found</h1>
        <p className="sub">That page does not exist. Head back to the home page.</p>
        <Link className="back" to="/"><Icon name="left" />Home</Link>
      </div>
    </header>
  );
}
