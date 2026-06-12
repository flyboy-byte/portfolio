# agents.md — Logan Night Portfolio

## Project Overview
Single-page React portfolio for Logan Night, deployed to **https://logannightingale.com** via GitHub Actions → GitHub Pages. Custom domain is pinned by `public/CNAME`.

## Stack
- **React 18** + **Vite 4** — build tool, base: `"/"`
- **Three.js** + **@react-three/fiber** + **@react-three/drei** — 3D hero computer, tech icon balls
- **Framer Motion** — section/card animations
- **Tailwind CSS** — utility styling
- **react-tilt** v1 — tilt effect on project cards
- **EmailJS** — contact form (service_vsyd175 / template_31v002c)

## Deployment
- Workflow: `.github/workflows/deploy.yml` (edited in GitHub UI — token lacks workflow scope)
- Build step: `cp index.src.html index.html && npm run build`
- `index.src.html` is the clean Vite entry; `index.html` at root is git-ignored and generated at build time
- Output: `dist/` → `actions/upload-pages-artifact` → `actions/deploy-pages`
- **Never put `base: "/portfolio/"` in vite.config.js** — custom domain means base must be `"/"`
- `public/CNAME` contains `logannightingale.com` — required so Actions deploys don't wipe the custom domain

## File Structure
```
src/
  App.jsx              # Root — imports and orders all sections
  main.jsx             # ReactDOM entry
  styles.js            # Shared Tailwind class strings
  assets/index.js      # All icon/image exports (Iconify SVG URLs + GitHub OG URLs)
  constants/index.js   # All site content — navLinks, services, technologies, experiences, projects, papers
  components/
    Navbar.jsx         # Fixed top nav — links, Resume button, GitHub button
    Hero.jsx           # Full-screen hero — typewriter + 3D computer (hidden on mobile)
    About.jsx          # Bio cards
    Experience.jsx     # Vertical timeline (GM ASEP, ASE, Ham Radio)
    Tech.jsx           # 3D icon balls (desktop) / flat icons (mobile ≤768px)
    Papers.jsx         # Whitepapers section — cards linking to hosted PDFs/HTML
    Works.jsx          # Project cards — clickable via <a> wrapper (NOT onClick on Tilt)
    Contact.jsx        # EmailJS contact form + StarsCanvas background
    canvas/
      Ball.jsx         # Single 3D tech icon ball — drag+spring, canvas SVG rasterizer
      Computers.jsx    # 3D hero computer model
      Stars.jsx        # Background particle field
  hoc/
    SectionWrapper.jsx # Wraps sections in motion.section with stagger animation + z-0
  utils/motion.js      # Framer Motion variant helpers (fadeIn, textVariant, staggerContainer)
public/
  Resume.pdf           # Served at logannightingale.com/Resume.pdf
  CNAME                # logannightingale.com — do not remove
  papers/              # Hosted whitepapers (PDF + HTML)
    ai-apis-report.pdf
    ham-radio-math.pdf
    t1d-field-guide.pdf
    qualcomm-kernel.html
    arch-dell-latitude.html
    hp-p1005-arch.html
```

## Content System (constants/index.js)
All site content lives here. Import path: `../assets` for images/icons.

### Adding a project card (Works section)
```js
// 1. Add image export to src/assets/index.js
export const myProject = "https://opengraph.githubassets.com/1/flyboy-byte/repo-name";

// 2. Add to import at top of constants/index.js
import { ..., myProject } from "../assets";

// 3. Append to projects array
{
  name: "repo-name",
  description: "Short description.",
  tags: [{ name: "Python", color: "blue-text-gradient" }, ...],
  image: myProject,
  source_code_link: "https://github.com/flyboy-byte/repo-name",
},
```
Tag colors: `blue-text-gradient` | `green-text-gradient` | `pink-text-gradient`

### Adding a whitepaper (Papers section)
```js
// 1. Push file to public/papers/ (PDF or HTML)
// 2. Append to papers array in constants/index.js
{
  title: "Title of Paper",
  description: "One-sentence description.",
  tags: ["Tag1", "Tag2"],
  link: "https://logannightingale.com/papers/filename.pdf",
},
```

## Adding a New Page
The app is a **single-page scroll layout** — there is no router-based multi-page setup despite BrowserRouter being present (it's used only for hash links). To add a new visible section:

1. **Create the component**: `src/components/MySection.jsx`
   - Wrap with `SectionWrapper(MySection, "my-section-id")` for consistent animation + scroll anchor
2. **Export it**: add to `src/components/index.js`
3. **Add to App.jsx**: drop `<MySection />` in the render order between existing sections
4. **Add a nav link** (optional): add `{ id: "my-section-id", title: "My Section" }` to `navLinks` in constants

To add a genuinely **separate route/page** (e.g. `/projects`):
1. Add a `<Route path="/projects" element={<ProjectsPage />} />` inside `<Routes>` in App.jsx (wrap existing content in `<Route path="/" />` first)
2. Vite + React Router will handle client-side routing — no server config needed since GitHub Pages SPA fallback is not enabled by default. Add a `public/404.html` that redirects to `index.html` to handle direct URL hits.

## Key Gotchas
- **react-tilt onClick**: v1 does not forward `onClick`. Use an `<a>` wrapper around `<Tilt>` instead.
- **Ball.jsx SVG→WebGL**: tech icons are Iconify SVG URLs rasterized to canvas before upload to WebGL texture. Adding a new tech icon = add export to `assets/index.js` (Iconify URL) and entry to `technologies` array in constants.
- **Mobile breakpoint**: Tech balls hidden at ≤768px, replaced with flat icon grid. Handled in `Tech.jsx` via `useState`/`useEffect` window resize listener.
- **GitHub Actions token**: has `contents` scope but NOT `workflow` scope — cannot push to `.github/workflows/` via API. Edit the workflow file directly in the GitHub UI.
- **Sequential GitHub API writes**: fetching two files and pushing both simultaneously causes SHA conflicts. Always fetch → modify → push sequentially when writing to the same file, or accept one retry for different files.
- **Paper URLs after custom domain**: use `https://logannightingale.com/papers/...` not the old `flyboy-byte.github.io/portfolio/papers/...` path.
