import React from "react";
import { Link } from "react-router-dom";
import { allPosts, formatDate } from "../blog/posts";
import { styles } from "../styles";
import BlogLayout from "./BlogLayout";

const Tags = ({ tags }) => (
  <ul className="flex flex-wrap gap-2 list-none">
    {tags.map((t) => (
      <li key={t} className="text-[12px] text-[#915EFF] border border-[#915EFF]/40 rounded-full px-2.5 py-0.5">{t}</li>
    ))}
  </ul>
);

const BlogIndex = () => (
  <BlogLayout title="Blog" description="Write-ups of Logan Night's projects: what was built, what failed, what shipped.">
    <p className={styles.sectionSubText}>Write-ups</p>
    <h1 className={styles.sectionHeadText}>Blog.</h1>
    <p className="mt-4 text-secondary text-[17px] leading-[30px]">
      What I built, what didn't work, and what shipped. <a className="text-[#915EFF] hover:underline" href="/rss.xml">RSS</a>
    </p>

    {allPosts.length === 0 ? (
      <p className="mt-16 text-secondary">Nothing here yet.</p>
    ) : (
      <ul className="mt-12 flex flex-col gap-6 list-none">
        {allPosts.map((p) => (
          <li key={p.slug}>
            <Link to={`/blog/${p.slug}`}
              className="block bg-tertiary rounded-2xl p-6 border border-transparent hover:border-[#915EFF]/60 transition-colors">
              <div className="flex items-center gap-3 text-[13px] text-secondary">
                <time dateTime={p.date}>{formatDate(p.date)}</time><span>·</span><span>{p.minutes} min read</span>
                {p.draft && <span className="text-yellow-400 font-semibold">DRAFT</span>}
              </div>
              <h2 className="mt-2 text-white font-bold text-[22px]">{p.title}</h2>
              {p.summary && <p className="mt-2 text-secondary text-[15px] leading-[26px]">{p.summary}</p>}
              {p.tags.length > 0 && <div className="mt-4"><Tags tags={p.tags} /></div>}
            </Link>
          </li>
        ))}
      </ul>
    )}
  </BlogLayout>
);

export default BlogIndex;
