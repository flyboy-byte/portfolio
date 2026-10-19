# Blog — structure and how to write a post

Status: scaffolded (2026-10-19). One draft post exists; nothing is published yet, so the live site shows no Blog link.

## How it works

- Posts are markdown files in `src/posts/<slug>.md`. The filename is the URL: `/blog/<slug>`.
- Frontmatter (flat `key: value`, between `---` fences):

  ```
  ---
  title: Post title
  date: 2026-10-19
  summary: One or two sentences, used on the index card, page meta description, and RSS.
  tags: [three.js, performance]
  project: portfolio
  draft: true
  ---
  ```
- `draft: true` posts show in `npm run dev` (marked DRAFT) and are excluded from production: not in the index, not in RSS, and their body is blanked from the JS bundle. Delete the line (or set `false`) to publish.
- The **Blog nav link appears only when at least one published post exists.**
- Code fences are highlighted with highlight.js: bash/sh, c/cpp, javascript/jsx, json, python, rust, xml/html, yaml. Add a language in `src/blog/markdown.js`.
- Raw HTML in markdown is trusted (posts are committed by the owner). Never render user-supplied markdown here.

## Files

| File | Role |
| --- | --- |
| `vite-plugin-blog.js` | `virtual:blog-index` (post metadata, no bodies), RSS at `/rss.xml`, `404.html` copy of `index.html`, draft blanking |
| `src/blog/frontmatter.js` | Frontmatter parser and metadata (shared by plugin and browser) |
| `src/blog/posts.js` | Index, lazy body loader, date formatting |
| `src/blog/markdown.js` | marked + highlight.js renderer |
| `src/pages/Home.jsx` | The original single page, moved out of `App.jsx` |
| `src/pages/BlogIndex.jsx`, `BlogPost.jsx`, `BlogLayout.jsx` | Blog pages; lazy-loaded so the home page bundle is unaffected |
| `.blog-prose` in `src/index.css` | Post typography and code colors |

## Routing and GitHub Pages

Client-side routing via the existing `BrowserRouter`. Direct hits or refreshes on `/blog/<slug>` are served by `404.html` (a copy of the SPA shell, emitted at build). This is build config only; it does not depend on any repo setting. Confirm on the live site after the first publish, since I have not checked how Pages is configured.

## Known limits / possible follow-ups

- **No prerendering.** Pages render in the browser, so link-preview bots (Slack, Discord, X) and some crawlers see only the generic site title/description, and direct hits return HTTP 404 with the page body. Fix if it matters: a build-time prerender step that writes `dist/blog/<slug>/index.html` with per-post meta tags.
- No per-post Open Graph image, sitemap, or tag pages.
- First draft: `src/posts/self-hosting-the-3d-hero.md`, written by Claude from `docs/3D_PLAN.md`. Rewrite in your own voice before publishing. Posts should be edited by the author; do not publish AI drafts unchecked.
