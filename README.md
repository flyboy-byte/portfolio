# Logan Night — Portfolio

Personal portfolio website for Logan Night (`flyboy-byte`), showcasing expertise in automotive diagnostics, embedded systems, Linux, and amateur radio.

> [!NOTE]
> **Status**: Live at [logannightingale.com](https://logannightingale.com)

---

## 🤖 AI / Vibe Coding Context

See [agents.md](./agents.md) for the full AI handoff guide — deployment pipeline, design system, content system, and component gotchas.

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
  - All external 3D/icon assets via CDN.

---

## 🚀 Tech Stack

- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS + Framer Motion
- **3D Engine**: Three.js (@react-three/fiber + @react-three/drei)
- **Icons**: Iconify (dynamic SVG loading via CDN)
- **Contact**: EmailJS (`logan07night@gmail.com`)

## 🛠️ Key Features

- **3D Hero**: Interactive desktop PC model with typewriter skill cycling.
- **Maker-Centric**: GM ASEP, ASE A4/A5/A6, Extra Class ham radio.
- **Project Cards**: `foss-radar` and `drag-tree` with GitHub OpenGraph previews.
- **Tech Stack Balls**: Linux, Git, Arduino, Python, TypeScript, React, Three.js, Bash.
- **Contact Form**: Live EmailJS integration.

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

---
*Built with React, Three.js, and Framer Motion.*
