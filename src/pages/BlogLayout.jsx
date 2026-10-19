import React, { useEffect } from "react";
import { Navbar } from "../components";
import { styles } from "../styles";

// Shared shell for blog pages: fixed navbar offset, page title/description, scroll reset.
const BlogLayout = ({ title, description, children }) => {
  useEffect(() => {
    const prev = document.title;
    document.title = title ? `${title} • Logan Night` : "Blog • Logan Night";
    const meta = document.querySelector('meta[name="description"]');
    const prevDesc = meta?.getAttribute("content");
    if (meta && description) meta.setAttribute("content", description);
    window.scrollTo(0, 0);
    return () => { document.title = prev; if (meta && prevDesc) meta.setAttribute("content", prevDesc); };
  }, [title, description]);

  return (
    <div className="relative z-0 bg-primary min-h-screen">
      <Navbar />
      <main className={`${styles.paddingX} max-w-3xl mx-auto pt-28 pb-24`}>{children}</main>
    </div>
  );
};

export default BlogLayout;
