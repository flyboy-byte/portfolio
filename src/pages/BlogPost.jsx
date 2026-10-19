import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { formatDate, getMeta, loadBody } from "../blog/posts";
import { renderMarkdown } from "../blog/markdown";
import { styles } from "../styles";
import BlogLayout from "./BlogLayout";

const BlogPost = () => {
  const { slug } = useParams();
  const meta = getMeta(slug);
  const [html, setHtml] = useState(null);

  useEffect(() => {
    let live = true;
    setHtml(null);
    if (meta) loadBody(slug).then((b) => live && b != null && setHtml(renderMarkdown(b)));
    return () => { live = false; };
  }, [slug, meta]);

  if (!meta) {
    return (
      <BlogLayout title="Not found">
        <h1 className={styles.sectionHeadText}>Not found.</h1>
        <p className="mt-4 text-secondary">That post doesn't exist. <Link className="text-[#915EFF] hover:underline" to="/blog">Back to the blog</Link></p>
      </BlogLayout>
    );
  }

  return (
    <BlogLayout title={meta.title} description={meta.summary}>
      <Link to="/blog" className="text-secondary hover:text-white text-[15px]">← All posts</Link>
      <article className="mt-8">
        <div className="flex items-center gap-3 text-[13px] text-secondary">
          <time dateTime={meta.date}>{formatDate(meta.date)}</time><span>·</span><span>{meta.minutes} min read</span>
          {meta.draft && <span className="text-yellow-400 font-semibold">DRAFT — not published</span>}
        </div>
        <h1 className="mt-3 text-white font-black text-[32px] sm:text-[44px] leading-tight">{meta.title}</h1>
        {meta.summary && <p className="mt-4 text-secondary text-[18px] leading-[30px]">{meta.summary}</p>}
        <div className="blog-prose mt-10" dangerouslySetInnerHTML={{ __html: html ?? "" }} />
        {html === null && <p className="mt-10 text-secondary">Loading…</p>}
      </article>
    </BlogLayout>
  );
};

export default BlogPost;
