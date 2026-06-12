# agents.md — Logan Night Portfolio

> This file is the source of truth for any AI continuing work on this project.
> Read it fully before touching any file.

---

## Live Site
**https://logannightingale.com**
GitHub repo: **https://github.com/flyboy-byte/portfolio**

---

## Stack
| Layer | Library | Version |
|-------|---------|---------|
| UI | React | 18.2 |
| Build | Vite | 4.3 |
| 3D | Three.js + @react-three/fiber + @react-three/drei | ^0.153 / ^8 / ^9 |
| Animation | Framer Motion | ^10 |
| Styling | Tailwind CSS | ^3.3 |
| Tilt effect | react-tilt | ^1.0.2 |
| Contact form | @emailjs/browser | ^3.11 |
| Routing | react-router-dom | ^6.13 |

---

## Deployment Pipeline
1. Push to `main` triggers GitHub Actions workflow (`.github/workflows/deploy.yml`)
2. Workflow runs: `cp index.src.html index.html && npm run build`
   - `index.src.html` is the clean Vite HTML entry kept in source control
   - `index.html` at the repo root is **generated at build time** and should not be edited directly
3. `dist/` output is uploaded via `actions/upload-pages-artifact` and deployed via `actions/deploy-pages`
4. Custom domain served from `public/CNAME` which contains `logannightingale.com`

**Critical rules:**
- `vite.config.js` must have `base: "/"` — NOT `"/portfolio/"`. The old GitHub Pages subpath is gone.
- `public/CNAME` must stay. Without it, every Actions deploy wipes the custom domain setting.
- The workflow file lives in `.github/workflows/`. The GitHub token used in this Replit environment has `contents` scope but **NOT `workflow` scope** — you cannot push changes to workflow files via the API. Tell the user to edit the workflow directly in the GitHub UI if it needs changing.

---

## How Changes Are Made (Replit Environment)
This project is edited by calling the **GitHub Contents API** via the `ReplitConnectors` SDK. There is no local clone. All reads and writes go through the API.

Pattern for every file edit:
```js
const { ReplitConnectors } = require('@replit/connectors-sdk');
const c = new ReplitConnectors();
const b64 = s => Buffer.from(s, 'utf-8').toString('base64');
const decode = s => Buffer.from(s.replace(/\n/g, ''), 'base64').toString('utf-8');

// Always fetch current SHA before writing
c.proxy('github', '/repos/flyboy-byte/portfolio/contents/PATH', { method: 'GET' })
  .then(r => r.json())
  .then(d => {
    let content = decode(d.content);
    // ... modify content ...
    return c.proxy('github', '/repos/flyboy-byte/portfolio/contents/PATH', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'commit message', content: b64(content), sha: d.sha }),
    });
  })
  .then(r => r.json())
  .then(d => console.log(d.commit?.sha?.slice(0, 8)));
```

**SHA conflict rule:** When writing two different files at the same time in parallel, each has its own SHA so they won't conflict with each other. But if a parallel push lands and changes the tree before your second push, that second push fails with "expected SHA X but got Y". The fix: re-fetch the failing file's current SHA and retry. Always push different files in parallel when safe; push the same file sequentially.

**Scripts must run from `/home/runner/workspace`**, not from `/tmp`, because `@replit/connectors-sdk` is installed there.

---

## Design System

### Colors (Tailwind config / CSS variables)
| Token | Value | Usage |
|-------|-------|-------|
| `bg-primary` | `#050816` | Page background |
| `bg-tertiary` | `#151030` | Cards, panels |
| `text-secondary` | `#aaa6c3` | Subtext, muted labels |
| Accent purple | `#915EFF` | Headings, tags, borders, hover fills |
| `black-gradient` | CSS class | Mobile menu background |
| `violet-gradient` | CSS class | Hero vertical line |

### Shared style strings (src/styles.js)
```js
styles.paddingX   // "sm:px-16 px-6"
styles.paddingY   // "sm:py-16 py-6"
styles.padding    // "sm:px-16 px-6 sm:py-16 py-10"
styles.heroHeadText    // large responsive font for hero h1
styles.heroSubText     // responsive font for hero subtitle
styles.sectionHeadText // "text-white font-black md:text-[60px] sm:text-[50px] xs:text-[40px] text-[30px]"
styles.sectionSubText  // "sm:text-[18px] text-[14px] text-secondary uppercase tracking-wider"
```

---

## Animation System (Framer Motion)

### SectionWrapper HOC (src/hoc/SectionWrapper.jsx)
Wraps every top-level section. Provides:
- `motion.section` with `staggerContainer()` variant
- `initial="hidden"` `whileInView="show"` `viewport={{ once: true, amount: 0.25 }}`
- Padding, max-width centering, `relative z-0`
- A `<span id={idName}>` anchor for navbar hash links

Usage: `export default SectionWrapper(MyComponent, "anchor-id");`

### Motion variants (src/utils/motion.js)
```js
textVariant(delay?)           // slide down + fade in — use on section headings
fadeIn(direction, type, delay, duration)  // directional fade — "up"|"down"|"left"|"right"
zoomIn(delay, duration)       // scale up from 0
slideIn(direction, type, delay, duration) // slide from edge
staggerContainer(staggerChildren?, delayChildren?) // parent that staggers children
```

Child components use `variants={fadeIn(...)}` — the parent `staggerContainer` on the section propagates animation context down through non-motion components automatically.

---

## File Structure

```
portfolio/
├── index.src.html          # Vite HTML entry — edit this, NOT index.html
├── vite.config.js          # base: "/" — do not change to /portfolio/
├── package.json
├── agents.md               # This file
├── public/
│   ├── CNAME               # "logannightingale.com" — do not remove
│   ├── Resume.pdf          # Served at logannightingale.com/Resume.pdf
│   └── papers/             # Hosted whitepapers
│       ├── ai-apis-report.pdf
│       ├── ham-radio-math.pdf
│       ├── t1d-field-guide.pdf
│       ├── qualcomm-kernel.html
│       ├── arch-dell-latitude.html
│       └── hp-p1005-arch.html
└── src/
    ├── App.jsx             # Root — section render order
    ├── main.jsx            # ReactDOM.createRoot entry
    ├── styles.js           # Shared Tailwind class strings
    ├── index.css           # Global CSS + custom gradient classes
    ├── assets/
    │   └── index.js        # All exports: icons (Iconify URLs), images (GitHub OG URLs), SVG data URIs
    ├── constants/
    │   └── index.js        # ALL site content — see Content System section below
    ├── components/
    │   ├── index.js        # Barrel export for all components
    │   ├── Navbar.jsx      # Fixed top nav
    │   ├── Hero.jsx        # Full-screen hero section
    │   ├── About.jsx       # Bio service cards
    │   ├── Experience.jsx  # Vertical timeline
    │   ├── Tech.jsx        # Tech stack display — 3D balls (desktop) / flat icons (mobile)
    │   ├── Papers.jsx      # Whitepapers section
    │   ├── Works.jsx       # Project cards
    │   ├── Contact.jsx     # EmailJS contact form
    │   ├── Loader.jsx      # 3D canvas loading fallback
    │   └── canvas/
    │       ├── Ball.jsx    # Single 3D tech icon ball
    │       ├── Computers.jsx # Hero 3D computer model
    │       └── Stars.jsx   # Background particle field
    ├── hoc/
    │   ├── SectionWrapper.jsx
    │   └── index.js
    └── utils/
        └── motion.js       # Framer Motion variant factories
```

---

## Content System (src/constants/index.js)

This is the only file that needs editing for most content changes. It imports images/icons from `../assets`.

### Section render order in App.jsx
```
Navbar → Hero → About → Experience → Tech → Papers → Works → Contact
```

### navLinks
Controls navbar hash links (not Resume/GitHub buttons — those are hardcoded in Navbar.jsx).
```js
{ id: "about", title: "About" },
{ id: "work", title: "Credentials" },
{ id: "contact", title: "Contact" },
```

### services (About section cards)
```js
{ title: "Automotive Diagnostics", icon: carWrench },
```

### technologies (Tech section balls/icons)
```js
{ name: "Linux", icon: linux },
```
Icon must be exported from `src/assets/index.js` as an Iconify SVG URL:
```js
export const myIcon = "https://api.iconify.design/devicon:python.svg";
// With color override:
export const myIcon = "https://api.iconify.design/mdi:radio-tower.svg?color=white";
```
Ball.jsx canvas-rasterizes the SVG URL to a WebGL texture — Iconify CDN URLs work, external SVGs may have CORS issues.

### experiences (Experience/timeline section)
```js
{
  title: "Job Title",
  company_name: "Company Name",
  icon: gmLogo,        // imported from assets
  iconBg: "#0a1628",   // background color behind icon
  date: "2022 – Present",
  points: ["bullet one.", "bullet two."],
},
```

### projects (Works section)
```js
{
  name: "repo-name",          // display name on card
  description: "Short desc.", // shown under title
  tags: [
    { name: "Python", color: "blue-text-gradient" },
    { name: "Arch Linux", color: "green-text-gradient" },
    { name: "CLI", color: "pink-text-gradient" },
  ],
  image: myProjectVar,        // imported from assets (GitHub OG URL or other)
  source_code_link: "https://github.com/flyboy-byte/repo-name",
},
```
Tag colors: `blue-text-gradient` | `green-text-gradient` | `pink-text-gradient`

Project images use GitHub's OpenGraph CDN — no upload needed:
```js
export const myProject = "https://opengraph.githubassets.com/1/flyboy-byte/repo-name";
```

### papers (Papers/Whitepapers section)
```js
{
  title: "Paper Title",
  description: "One or two sentence description.",
  tags: ["Tag1", "Tag2", "Tag3"],
  link: "https://logannightingale.com/papers/filename.pdf",
},
```
Steps to add a new paper:
1. Push the file (PDF or HTML) to `public/papers/filename.ext`
2. Append the entry to the `papers` array in `constants/index.js`
3. Use `logannightingale.com/papers/` as the base URL (not the old `flyboy-byte.github.io/portfolio/papers/`)

---

## Component Notes and Gotchas

### Navbar.jsx
- Desktop: logo | nav hash links | Resume button | GitHub button
- Mobile: logo | hamburger → dropdown with hash links + Resume link (GitHub not in dropdown)
- Resume and GitHub buttons are **hardcoded** in the JSX, not driven by constants
- Resume links to `/Resume.pdf` (served from `public/`)
- GitHub links to `https://github.com/flyboy-byte`

### Hero.jsx
- 3D computer canvas (`ComputersCanvas`) is hidden on mobile via CSS — no JS detection needed there
- Typewriter strings are hardcoded in Hero.jsx, not in constants

### Tech.jsx
- Uses `useState` + `useEffect` window resize listener to detect `window.innerWidth <= 768`
- Desktop (>768px): renders `BallCanvas` for each technology (3D interactive balls)
- Mobile (≤768px): renders flat `<img>` tags from Iconify URLs — no WebGL on mobile

### Ball.jsx (canvas/Ball.jsx)
- Fully rewritten — no OrbitControls
- Drag rotates the mesh; pointer-up springs back to [0,0,0] via `useFrame` lerp
- SVG→WebGL: fetches the Iconify URL, draws to an offscreen `<canvas>`, uses that as a Three.js texture
- Camera at `[0, 0, 20]` fov 25 so the icon face (Z+) faces camera directly
- **CORS note**: only Iconify CDN URLs are guaranteed CORS-safe for canvas rasterization

### Works.jsx (project cards)
- **react-tilt v1 does NOT forward `onClick`** — clicking the Tilt does nothing if you put onClick on it
- Fix is in place: each card is wrapped in `<a href={source_code_link} target="_blank" rel="noopener noreferrer">`
- Do not move onClick back to the `<Tilt>` component

### Papers.jsx
- Cards use `onClick={() => window.open(link, "_blank")}` — this is fine because PaperCard is a plain `div`, not react-tilt
- Layout: full-width stacked cards (not a grid), each with title, description, tags, and an external link icon

### Contact.jsx
- EmailJS credentials: service `service_vsyd175`, template `template_31v002c`, public key `zIP85NMwB3QCVNrho`
- Earth canvas (`EarthCanvas`) renders behind the form

### SectionWrapper HOC
- Returns a named function called `StarWrapper`, not `SectionWrapper` internally — irrelevant but noted
- `z-0` on the section — keep this; some canvas elements need z-index management

---

## Adding a New Section (Step-by-Step)

1. **Create the component**: `src/components/MySection.jsx`
```jsx
import React from "react";
import { motion } from "framer-motion";
import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";

const MySection = () => (
  <>
    <motion.div variants={textVariant()}>
      <p className={styles.sectionSubText}>Subtitle</p>
      <h2 className={styles.sectionHeadText}>Heading</h2>
    </motion.div>
    {/* content */}
  </>
);

export default SectionWrapper(MySection, "my-section");
```

2. **Export it** — add to `src/components/index.js`:
```js
import MySection from "./MySection";
export { ..., MySection };
```

3. **Add to App.jsx** — import and place in render order:
```jsx
import { ..., MySection } from "./components";
// inside the return:
<MySection />
```

4. **Nav link** (optional) — add to `navLinks` in `constants/index.js`:
```js
{ id: "my-section", title: "My Section" },
```

---

## Static File Serving Rules
- Only files inside `public/` are served by the deployed site (Vite copies `public/` → `dist/` at build time)
- Files at the **repo root** are NOT served — they are invisible to the live site
- Correct URL pattern: `logannightingale.com/filename.ext` for `public/filename.ext`
- Papers are at `logannightingale.com/papers/filename.ext` for `public/papers/filename.ext`

---

## Known Issues / Things NOT to Change
- Do not add `onClick` to `<Tilt>` — use an `<a>` wrapper instead (react-tilt v1 drops it silently)
- Do not change `vite.config.js` base back to `"/portfolio/"`
- Do not remove `public/CNAME`
- Do not edit `index.html` directly — edit `index.src.html`; the workflow overwrites `index.html` at build time
- Ball.jsx SVG rasterization only works reliably with Iconify CDN URLs — other external SVGs may hit CORS
