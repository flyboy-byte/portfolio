# Logan Night — Portfolio

Personal portfolio website for Logan Night (`flyboy-byte`), showcasing expertise in automotive diagnostics, embedded systems, Linux, and amateur radio.

> [!NOTE]
> **Status**: Live at [flyboy-byte.github.io/portfolio](https://flyboy-byte.github.io/portfolio)

---

## 🤖 AI / Vibe Coding Context

- **Goal**: High-end 3D interactive portfolio highlighting maker skills.
- **Key Files**:
  - `src/constants/index.js`: Content source of truth.
  - `src/assets/index.js`: Icon/asset CDN URLs.
  - `src/components/canvas/`: Three.js logic.
- **Current State**:
  - All content adapted for Logan's profile.
  - EmailJS fully configured (`service_vsyd175` / `template_31v002c`).
  - `Resume.pdf` uploaded to `public/` (served at `/portfolio/Resume.pdf`).
  - GitHub Pages serves from `main` branch root.
  - All external assets via CDN.

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

This repo uses GitHub Pages with the `main` branch root as the source.

**Important**: The `main` root must contain the **built output**, not raw source.

### Option 1 — GitHub Actions (Recommended)

1. Add this workflow to `.github/workflows/pages.yml`:

```yaml
name: Build and Deploy
on:
  push:
    branches: [main]
permissions:
  contents: write
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
      - name: Deploy to main root
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          # Remove old build files
          git remove --cached -r -f assets index.html 2>/dev/null || true
          # Copy new build from dist/
          cp -r dist/* .
          # Stage everything
          git add -A
          git commit -m "deploy: build output" || exit 0
          git push origin main
```

2. Go to **Settings → Actions → General → Workflow permissions → Read and write permissions → Save**.
3. Next push auto-builds and deploys.

### Option 2 — Manual Build

```bash
npm run build
cp -r dist/* .
git add -A
git commit -m "deploy: manual build"
git push origin main
```

> **Tip**: Switching to `main /docs` is cleaner — keeps build artifacts out of root. Change in **Settings → Pages → Source → /docs folder**.

## 📝 Status

- [x] React + Vite with `base: "/portfolio/"`
- [x] Logan's content throughout
- [x] EmailJS live
- [x] Resume.pdf uploaded
- [x] GitHub Pages configured
- [ ] Build output committed to `main` root (do once, then Actions handles it)

## 📜 Credits

- **Base Template**: [lohitkolluri/Portfolio-Website](https://github.com/lohitkolluri/Portfolio-Website)

---
*Built with React, Three.js, and Framer Motion.*
