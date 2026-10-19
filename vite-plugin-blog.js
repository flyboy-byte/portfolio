import fs from "node:fs";
import path from "node:path";
import { parseFrontmatter, toMeta } from "./src/blog/frontmatter.js";

// Blog build support:
//  - `virtual:blog-index`: post metadata (no bodies); drafts included only in dev.
//  - build: emits rss.xml and a 404.html copy of index.html (GitHub Pages SPA fallback,
//    so /blog/<slug> works on a direct hit or refresh).
const VIRTUAL = "virtual:blog-index";
const RESOLVED = "\0" + VIRTUAL;
const SITE = "https://logannightingale.com";

export default function blogPlugin() {
  const postsDir = path.resolve("src/posts");
  let isBuild = false;
  let outDir = "dist";

  const readPosts = () => {
    if (!fs.existsSync(postsDir)) return [];
    return fs.readdirSync(postsDir).filter((f) => f.endsWith(".md"))
      .map((f) => toMeta(f, fs.readFileSync(path.join(postsDir, f), "utf8")))
      .filter((p) => !(isBuild && p.draft))
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  };

  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  return {
    name: "blog",
    configResolved(c) { isBuild = c.command === "build"; outDir = c.build.outDir; },
    enforce: "pre",
    resolveId(id) { if (id === VIRTUAL) return RESOLVED; },
    load(id) {
      // Production never ships a draft: blank its body so the chunk holds no text.
      if (isBuild && /[\\/]src[\\/]posts[\\/][^\\/]+\.md\?raw$/.test(id)) {
        const file = id.replace(/\?raw$/, "");
        if (parseFrontmatter(fs.readFileSync(file, "utf8")).data.draft === true) return "export default ''";
        return;
      }
      if (id !== RESOLVED) return;
      if (fs.existsSync(postsDir)) this.addWatchFile(postsDir);
      return `export default ${JSON.stringify(readPosts())};`;
    },
    handleHotUpdate({ file, server }) {
      if (file.startsWith(postsDir) && file.endsWith(".md")) {
        const mod = server.moduleGraph.getModuleById(RESOLVED);
        if (mod) server.moduleGraph.invalidateModule(mod);
        server.ws.send({ type: "full-reload" });
      }
    },
    closeBundle() {
      // GitHub Pages serves 404.html for unknown paths; the SPA shell handles /blog/<slug>.
      const index = path.resolve(outDir, "index.html");
      if (fs.existsSync(index)) fs.copyFileSync(index, path.resolve(outDir, "404.html"));
    },
    generateBundle() {
      const posts = readPosts();
      const items = posts.map((p) => `    <item>
      <title>${esc(p.title)}</title>
      <link>${SITE}/blog/${p.slug}</link>
      <guid>${SITE}/blog/${p.slug}</guid>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <description>${esc(p.summary)}</description>
    </item>`).join("\n");
      this.emitFile({ type: "asset", fileName: "rss.xml", source: `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Logan Night — Blog</title>
    <link>${SITE}/blog</link>
    <description>Write-ups of projects: what was built, what failed, what shipped.</description>
${items}
  </channel>
</rss>
` });
    },
  };
}
