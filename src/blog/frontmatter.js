// Pure helpers shared by the Vite plugin (Node) and the blog pages (browser).
// Frontmatter is a flat `key: value` block between `---` fences. Lists use [a, b].

const parseValue = (raw) => {
  const v = raw.trim();
  if (v === "true") return true;
  if (v === "false") return false;
  if (v.startsWith("[") && v.endsWith("]")) {
    return v.slice(1, -1).split(",").map((s) => s.trim().replace(/^["']|["']$/g, "")).filter(Boolean);
  }
  return v.replace(/^["']|["']$/g, "");
};

export const parseFrontmatter = (source) => {
  const m = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { data: {}, body: source };
  const data = {};
  for (const line of m[1].split(/\r?\n/)) {
    const i = line.indexOf(":");
    if (i > 0 && !line.trim().startsWith("#")) data[line.slice(0, i).trim()] = parseValue(line.slice(i + 1));
  }
  return { data, body: m[2] };
};

export const readingMinutes = (body) => Math.max(1, Math.round(body.split(/\s+/).filter(Boolean).length / 220));

export const slugFromFile = (file) => file.replace(/^.*[\\/]/, "").replace(/\.md$/, "");

// Metadata only (no body), so the index stays small however many posts exist.
export const toMeta = (file, source) => {
  const { data, body } = parseFrontmatter(source);
  return {
    slug: slugFromFile(file),
    title: data.title || slugFromFile(file),
    date: data.date || "",
    summary: data.summary || "",
    tags: Array.isArray(data.tags) ? data.tags : [],
    project: data.project || "",
    draft: data.draft === true,
    minutes: readingMinutes(body),
  };
};
