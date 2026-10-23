# Portfolio: current state

Status: live and healthy (2026-10-23). Last deployed commit `6b75e59` (CI green). Read this first, then the doc for whatever you touch: `docs/3D_PLAN.md` (hero scene), `docs/BLOG_PLAN.md` and `docs/BLOG.md` (blog), `docs/ARCHITECTURE.md`, `agents.md` (content and design system). Where docs conflict with this file, the topic doc wins; update the pointer here.

## What is live (all verified deployed)
- 2026-10-18: ASE A2 added; PC and planet glTFs self-hosted in `public/models/`; optimized `pc-mobile.glb` for phones; mobile hero polish.
- 2026-10-19: blog scaffold, invisible (no posts published, no nav link). See `docs/BLOG_PLAN.md`.
- 2026-10-23 polish pass:
  - `6d7c577` icons and project card art self-hosted (`public/icons/`, `public/projects/`). Iconify and GitHub OpenGraph CDNs return HTTP 429 and had left images broken.
  - `1ecd2f5` amber accent `#ffb340` (`text-accent` / `bg-accent`), JetBrains Mono section labels, Poppins + JetBrains Mono self-hosted via @fontsource. The page makes no third-party requests on load (EmailJS only on form submit).
  - `aec2988` Ball, Earth and Stars canvases pause while off-screen (`src/utils/useInView.js`).
  - `11e7fe4` favicon, apple-touch icon, 1200x630 `og-image.png`, OG/Twitter/canonical tags in `index.src.html`.
  - `276005b` monitor screen: the template's VS Code screenshot replaced with a dense agent-style terminal showing a real session. Source and renderer: `tools/monitor-screen/`. Max anisotropy on the screen material.
  - `9b083b0` hero animation and lighting in `Computers.jsx`: screen glow (`GLOW_INTENSITY` 0.9), RGB fan hue cycle (shader), spotlight sweep, cursor blink (`public/models/screen-nocursor.webp`). All skipped under `prefers-reduced-motion`, paused off-screen.
  - `6b75e59` left speaker removed (3 mesh refs stripped from `desktop_pc/scene.gltf`); `SolderStation.jsx` adds a soldering station (ESP32-style board in a PCB holder, iron in a coil stand, glowing tip, faint smoke) built from primitives. Rebuilt the same day at real scale after Logan said it looked bad: station with LED readout, helping hands with a populated board, iron in a helix coil stand with brass wool, solder spool, cable; layout constants at the top of the file; dev preview at `tools/station-preview/`.

## Verified vs not
- Logan checked the live site on his phone (Brave, Android) and the Slack/Discord share preview: both "pretty damn solid" (2026-10-23). That was before the solder station went live.
- Everything else was verified only in headless Chrome with software rendering (desktop 1440x900, phone 390x844 at 3x). Real-device frame rate and battery with the continuous animation are unmeasured.
- Not confirmed in a browser on the live domain: `/blog` rendering (curl shows the expected Pages 404 fallback).

## Open threads (all optional, independent)
- **Awaiting Logan's feedback on the rebuilt solder station** (2026-10-23): possible tweaks are board contents (generic ESP32 style; he may want it to match a real build), layout, smoke strength. The old phone-clipping issue is gone (everything at z <= 80 cm).
- Typing animation on the monitor (needs several screen frames; GPU memory is the concern), mouse-parallax camera drift.
- Lighter Linux icon (`public/icons/linux.svg` is 195 KB because of an embedded Tux).
- Mobile pixel-ratio cap is 1.5 (`dpr={[1, 1.5]}` in `Computers.jsx`); 2 would sharpen the phone view at a GPU/battery cost. Logan has not asked for it.
- Tech section (8 identical balls), Contact form styling.
- Blog: content, prerendering (note canonical/OG caveat in `docs/BLOG_PLAN.md`), project cards linking to write-ups.

## Do not re-raise
- Touching `public/Resume.pdf` (Logan updates it himself). Assuming GitHub repo or Pages settings (confirm, do not infer).
- Publishing any blog post now ("no blog yet"), and publishing the AI-written draft unedited.
- On-site credit for the CC-BY 3D models (README Credits only; the README says the screen texture is modified and the left speaker removed).
- Resend (staying on EmailJS), Draco, resizing the mobile PC, a CAD+terminal split screen (offered as an option only; Logan chose the full-screen agent terminal).
- Logan's screen taste: partly readable but super sharp beats big and readable. He does not use VS Code.

## Gotchas
- `index.html` is tracked in git; CI regenerates it from `index.src.html` (`cp index.src.html index.html && npm run build`). Edit `index.src.html`.
- `desktop_pc/scene.gltf` has CRLF line endings: edit with `open(p, newline="")` or the diff explodes. Screen texture `Material.074_30_baseColor.png` is stored vertically flipped (`tools/monitor-screen/render.sh` handles it).
- Rebuild `pc-mobile.glb` after any change to the desktop model or screen: commands in `docs/3D_PLAN.md`. The two speakers were merged into one mesh in the phone GLB, so edit the source, not the GLB.
- zsh does not word-split variables (write commands in full). Never `pkill -f` a pattern in your own command line (use `kill $(lsof -ti:PORT)`). `sleep` is blocked in the Bash tool; use `until` loops.
- Headless screenshots: `google-chrome-stable --headless=new` (no chromium binary); WebGL needs `--use-gl=swiftshader --enable-unsafe-swiftshader`; scrolling needs puppeteer-core (installed in the session scratchpad only, `npm i puppeteer-core@22`). Chrome headless does not scroll to `#anchors`.
- Do not hammer `api.iconify.design` or `opengraph.githubassets.com` while testing (rate limits are per IP); icons come from npm `@iconify-json/*` packages instead.
- The icon sets sit on a light ball: avoid white icon fills (the Three.js icon was invisible until recolored).
