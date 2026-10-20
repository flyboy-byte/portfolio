# Blog — follow-up plan

Status: scaffold shipped and live, no blog content published (2026-10-19). Logan decided: no blog yet, pick this up another time. Nothing below is in progress. Options are independent; pick any, in any order. Structure and how to write a post: `docs/BLOG.md`.

## Where it stands

- Scaffold is deployed (commit `90d421d`, CI green). `/rss.xml` serves; `/blog` and `/blog/<slug>` return HTTP 404 from the Pages `404.html` fallback and are meant to render client-side. **Not yet confirmed in a browser on the live domain.**
- One draft only: `src/posts/self-hosting-the-3d-hero.md` (`draft: true`), written by Claude from `docs/3D_PLAN.md`. Hidden in production; no Blog nav link appears until a post is published.
- Nothing links to `/blog`, so visitors cannot find it.

## Do not re-raise

- Publishing anything now: Logan wants no blog yet.
- Publishing an AI draft unedited: posts must be rewritten in Logan's voice and every claim checked before `draft: true` is removed.

## Before the first publish (checklist)

1. Open `https://logannightingale.com/blog` in a browser and confirm the fallback renders (do not assume Pages behavior).
2. Rewrite the draft (or write a new post) in Logan's voice; verify numbers against `docs/3D_PLAN.md`.
3. Remove `draft: true`, push. The Blog nav link appears automatically.

## Options

### A. Content (the real value)
Posts built from material that already exists: the attempt logs and dead ends in `drag-tree/PLAN.md`, the strategy graveyard in `moomoo/docs/`, `crosslight`, `riscv-pico`, `disc-tracker`. Shape: problem, decision, dead end, result. Start with 2 or 3 strong posts, not one per repo; a thin blog looks worse than none. Claude can draft from docs and git history; Logan edits.

### B. Prerender for SEO and link previews
Pages render client-side, so Slack/Discord/X previews and some crawlers see only the generic site title. Fix: build-time step in `vite-plugin-blog.js` writing `dist/blog/<slug>/index.html` with per-post title, description and Open Graph tags (this also fixes the HTTP 404 on direct hits). Worth doing before sharing links publicly.

### C. Discoverability
Link project cards in `Works.jsx` to their write-up (uses the `project:` frontmatter field already parsed), a "Writing" section on the home page, a sitemap, per-post share images.

### D. Reading experience
Tag filter pages, table of contents for long posts, prev/next links, more highlight.js languages (`src/blog/markdown.js`), copy button on code blocks.

## Attempt log

| Attempt | Result |
| --- | --- |
| Markdown files + Vite plugin (virtual index, RSS, 404 copy) | Works; built and screenshotted in headless Chrome |
| `generateBundle` emitting `404.html` from the bundle | Not emitted (index.html not in bundle yet); moved to `closeBundle` copy, works |
| Draft body shipping in a lazy chunk | Leaked text into a prod chunk; plugin now blanks draft `?raw` loads in production builds |
