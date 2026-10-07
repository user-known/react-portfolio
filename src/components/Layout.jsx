import { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Nav from "./Nav";
import Footer from "./Footer";

/** Shared frame: nav, page, footer. Also handles scroll position when you navigate. */
export default function Layout() {
  const { pathname, state, key } = useLocation();
  const lastPath = useRef(null);

  // New page: start at the top (unless a section was asked for).
  useEffect(() => {
    if (lastPath.current !== pathname && !(state && state.scrollTo)) {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
    lastPath.current = pathname;
  }, [pathname, state]);

  // Links like "Work" and "FAQ" ask the home page to scroll to a section.
  useEffect(() => {
    const id = state && state.scrollTo;
    if (!id) return undefined;
    if (id === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return undefined;
    }
    const frame = requestAnimationFrame(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    return () => cancelAnimationFrame(frame);
  }, [key, state]);

  return (
    <>
      <Nav />
      <Outlet />
      <Footer />
    </>
  );
}
