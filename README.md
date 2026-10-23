# Logan Night — Portfolio

Personal portfolio website for Logan Night (`flyboy-byte`), showcasing expertise in automotive diagnostics, embedded systems, Linux, and amateur radio.

> [!NOTE]
> **Status**: Live at [logannightingale.com](https://logannightingale.com)

---

## 🤖 AI / Vibe Coding Context

See [docs/STATE.md](./docs/STATE.md) for current state and open threads, and [agents.md](./agents.md) for the full AI handoff guide — deployment pipeline, design system, content system, and component gotchas.

- **Goal**: High-end 3D interactive portfolio highlighting maker skills.
- **Key Files**:
  - `src/constants/index.js`: Content source of truth.
  - `src/assets/index.js`: Icon/asset CDN URLs.
  - `src/components/canvas/`: Three.js logic.
- **Current State**:
  - All content adapted for Logan's profile.
  - EmailJS fully configured (`service_vsyd175` / `template_31v002c`).
  - Resume served at `/Resume.pdf`.
  - Custom domain `logannightingale.com` via `public/CNAME`, served through GitHub Pages.
  - Icons, project card art and 3D models are self-hosted (no runtime CDN).

---

## 🚀 Tech Stack

- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS + Framer Motion
- **3D Engine**: Three.js (@react-three/fiber + @react-three/drei)
- **Icons**: self-hosted SVGs in `public/icons/` (from `@iconify-json` sets)
- **Contact**: EmailJS (`logan07night@gmail.com`)

## 🛠️ Key Features

- **3D Hero**: Interactive desktop PC model with typewriter skill cycling. Self-hosted in `public/models/`; phones get an optimized GLB (see [docs/3D_PLAN.md](./docs/3D_PLAN.md)).
- **Maker-Centric**: GM ASEP, ASE A1/A2/A3/A4/A5/A6/A7/A9, Extra Class ham radio.
- **Project Cards**: crosslight, drag-tree, disc-tracker, portfolio, riscv-pico, moomoo-trader with self-hosted card art in `public/projects/`.
- **Tech Stack Balls**: Linux, Git, Arduino, Python, TypeScript, React, Three.js, Bash.
- **Contact Form**: Live EmailJS integration.
- **Blog**: Markdown posts in `src/posts/` with drafts, RSS and syntax highlighting; see [docs/BLOG.md](./docs/BLOG.md).

## 📦 Project Structure

See [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) for component hierarchy.

## 🛠️ Local Development

```bash
git clone https://github.com/flyboy-byte/portfolio.git
cd portfolio
npm install
npm run dev
```

## 🌐 Deploy

Deployment is fully automated via GitHub Actions — no manual build/commit steps.

1. Push to `main`.
2. The `.github/workflows/deploy.yml` workflow runs `cp index.src.html index.html && npm run build`, then uploads `dist/` as a Pages artifact and deploys it via `actions/deploy-pages`.
3. **Pages settings**: Source is set to **GitHub Actions** (Settings → Pages). Custom domain `logannightingale.com` is configured there and backed by `public/CNAME` in this repo — removing that file will drop the custom domain on the next deploy.

No build output is ever committed to `main`; the repo only contains source.

## 📝 Status

- [x] React + Vite with `base: "/"`
- [x] Logan's content throughout
- [x] EmailJS live
- [x] Resume.pdf uploaded
- [x] GitHub Pages configured (Actions source, custom domain, HTTPS enforced)

## 📜 Credits

- **Base Template**: [lohitkolluri/Portfolio-Website](https://github.com/lohitkolluri/Portfolio-Website)
- **3D models (CC-BY-4.0, Sketchfab)**: ["Gaming Desktop PC"](https://sketchfab.com/3d-models/gaming-desktop-pc-d1d8282c9916438091f11aeb28787b66) by [Yolala1232](https://sketchfab.com/Yolala1232); ["Stylized planet"](https://sketchfab.com/3d-models/stylized-planet-789725db86f547fc9163b00f302c3e70) by [cmzw](https://sketchfab.com/cmzw). Modified: the monitor screen texture is replaced, the left speaker is removed, and the mobile PC is an optimized derivative.

---
*Built with React, Three.js, and Framer Motion.*
