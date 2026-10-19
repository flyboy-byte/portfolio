import posts from "virtual:blog-index";
import { parseFrontmatter } from "./frontmatter";

// Bodies are separate lazy chunks, one per post; the index above is metadata only.
const bodies = import.meta.glob("../posts/*.md", { as: "raw" });

export const allPosts = posts;
export const hasPosts = posts.length > 0;
export const getMeta = (slug) => posts.find((p) => p.slug === slug);

export const loadBody = async (slug) => {
  const load = bodies[`../posts/${slug}.md`];
  if (!load) return null;
  return parseFrontmatter(await load()).body;
};

export const formatDate = (iso) =>
  iso ? new Date(iso + "T00:00:00").toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "";
